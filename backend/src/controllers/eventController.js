import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import redis from '../utils/redis.js';

// -----------------------------------------
// CREATE EVENT
// -----------------------------------------
export const createEvent = async (req, res) => {
  try {
    const posterUrl = req.file ? req.file.path : undefined;

    const event = await Event.create({
      ...req.body,
      organizer: req.user.id,
      posterUrl
    });

    // Clear cached events list
    await redis.del("events:list");

    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------
// UPDATE EVENT
// -----------------------------------------
export const updateEvent = async (req, res) => {
  try {
    const posterUrl = req.file ? req.file.path : undefined;
    const update = { ...req.body };

    if (posterUrl) update.posterUrl = posterUrl;

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user.id },
      update,
      { new: true }
    );

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Clear cached list + single event cache
    await redis.del("events:list");
    await redis.del(`event:${req.params.id}`);

    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------
// DELETE EVENT
// -----------------------------------------
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      organizer: req.user.id
    });

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Clear cache
    await redis.del("events:list");
    await redis.del(`event:${req.params.id}`);

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------
// LIST EVENTS (CACHED)
// -----------------------------------------
export const listEvents = async (req, res) => {
  try {
    const cacheKey = "events:list";

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const { q, category, status, organizer } = req.query;
    const filter = {};

    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (organizer) filter.organizer = organizer;

    const events = await Event.find(filter)
      .populate('organizer', 'name')
      .sort({ date: 1 });

    const data = { events };

    await redis.set(cacheKey, JSON.stringify(data), { EX: 60 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------
// GET SINGLE EVENT (CACHED)
// -----------------------------------------
export const getEvent = async (req, res) => {
  try {
    const cacheKey = `event:${req.params.id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name');

    if (!event) return res.status(404).json({ message: 'Not found' });

    const count = await Registration.countDocuments({
      event: event._id,
      status: { $ne: 'cancelled' }
    });

    const data = { event, registrations: count };

    await redis.set(cacheKey, JSON.stringify(data), { EX: 60 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};