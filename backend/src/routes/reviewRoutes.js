import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { addReview, listReviews } from '../controllers/reviewController.js';
import { cacheDynamic } from '../middleware/cache.js';

const router = Router();

// Cache listReviews
router.get('/:id', cacheDynamic("reviews"), listReviews);

router.post(
  '/:id',
  authenticate,
  authorizeRoles('customer', 'organizer', 'admin'),
  addReview
);

export default router;