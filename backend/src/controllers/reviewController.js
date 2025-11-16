import Review from '../models/Review.js';
import Event from '../models/Event.js';
import redis from '../utils/redis.js';

// -----------------------------------------
// ADD REVIEW
// -----------------------------------------
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const existingReview = await Review.findOne({
      user: req.user.id,
      event: req.params.id
    });

    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this event. You can only post one review per event.'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      event: req.params.id,
      rating,
      comment
    });

    // Recalculate average rating
    const agg = await Review.aggregate([
      { $match: { event: review.event } },
      { $group: { _id: '$event', avg: { $avg: '$rating' } } },
    ]);

    const avg = agg[0]?.avg || 0;

    await Event.findByIdAndUpdate(review.event, { averageRating: avg });

    // Clear cache for reviews of this event
    await redis.del(`reviews:${req.params.id}`);

    res.status(201).json({ review });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'You have already reviewed this event. You can only post one review per event.'
      });
    }
    console.error('Review creation error:', err);
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------
// LIST REVIEWS (cached)
// -----------------------------------------
export const listReviews = async (req, res) => {
  try {
    const key = `reviews:${req.params.id}`;

    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));

    const reviews = await Review.find({ event: req.params.id })
      .populate('user', 'name');

    const data = { reviews };

    await redis.set(key, JSON.stringify(data), { EX: 60 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};