import User from '../models/User.js';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import redis from '../utils/redis.js';

// -----------------------------
// LEADERBOARD (cache: 60 sec)
// -----------------------------
export const leaderboard = async (req, res) => {
  try {
    const key = "stats:leaderboard";

    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const top = await User.find({
      role: { $in: ['customer', 'organizer'] },
      isBlocked: false
    })
      .sort({ points: -1 })
      .limit(10)
      .select('name points');

    const data = { leaderboard: top };

    await redis.set(key, JSON.stringify(data), { EX: 60 });
    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// RECOMMENDATIONS (User-specific cache: 60 sec)
// -----------------------------
export const recommendations = async (req, res) => {
  try {
    const key = `user:${req.user.id}:recommendations`;

    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const regs = await Registration.find({ user: req.user.id })
      .populate('event', 'category');

    const categories = [...new Set(regs.map(r => r.event?.category).filter(Boolean))];

    const filter = {
      date: { $gte: new Date() },
      status: 'approved'
    };

    if (categories.length) {
      filter.category = { $in: categories };
    }

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .limit(6);

    const data = { events };

    await redis.set(key, JSON.stringify(data), { EX: 60 });
    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// SUMMARY (cache: 30 sec)
// -----------------------------
export const summary = async (_req, res) => {
  try {
    const key = "stats:summary";

    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const [
      totalEvents,
      approvedEvents,
      upcomingEvents,
      totalRegistrations,
      totalCustomers,
      totalOrganizers
    ] = await Promise.all([
      Event.countDocuments({}),
      Event.countDocuments({ status: 'approved' }),
      Event.countDocuments({ status: 'approved', date: { $gte: new Date() } }),
      Registration.countDocuments({}),
      User.countDocuments({ role: 'customer', isBlocked: false }),
      User.countDocuments({ role: 'organizer', isBlocked: false }),
    ]);

    const data = {
      totals: {
        events: totalEvents,
        approvedEvents,
        upcomingEvents,
        registrations: totalRegistrations,
        customers: totalCustomers,
        organizers: totalOrganizers,
      },
    };

    await redis.set(key, JSON.stringify(data), { EX: 30 });
    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// TRENDING EVENTS (cache: 60 sec)
// -----------------------------
export const trending = async (_req, res) => {
  try {
    const key = "stats:trending";

    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const popularAgg = await Registration.aggregate([
      { $group: { _id: '$event', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const popularIds = popularAgg.map(p => p._id).filter(Boolean);

    const popular = await Event.find({
      _id: { $in: popularIds }
    }).lean();

    const popularityMap = new Map(popularAgg.map(p => [String(p._id), p.count]));

    const popularOrdered = popular
      .map(e => ({
        ...e,
        registrations: popularityMap.get(String(e._id)) || 0
      }))
      .sort((a, b) => b.registrations - a.registrations);

    const topRated = await Event.find({ status: 'approved' })
      .sort({ averageRating: -1 })
      .limit(6)
      .lean();

    const recent = await Event.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const data = { popular: popularOrdered, topRated, recent };

    await redis.set(key, JSON.stringify(data), { EX: 60 });
    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------
// DASHBOARD STATS (cache: 60 sec)
// -----------------------------
export const dashboardStats = async (_req, res) => {
  try {
    const key = "stats:dashboard";

    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const categories = await Event.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const upcomingByMonth = await Event.aggregate([
      { $match: { status: 'approved', date: { $gte: new Date() } } },
      {
        $project: {
          ym: { $dateToString: { format: '%Y-%m', date: '$date' } }
        }
      },
      { $group: { _id: '$ym', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 6 },
    ]);

    const data = { categories, upcomingByMonth };

    await redis.set(key, JSON.stringify(data), { EX: 60 });
    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};