import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { upload } from '../utils/upload.js';
import { createEvent, updateEvent, deleteEvent, listEvents, getEvent } from '../controllers/eventController.js';
import { cache, cacheDynamic } from '../middleware/cache.js';

const router = Router();

// Cached events list
router.get('/', cache("events:list"), listEvents);

// Cached single event
router.get('/:id', cacheDynamic("event"), getEvent);

router.post(
  '/',
  authenticate,
  authorizeRoles('organizer', 'admin'),
  upload.single('poster'),
  createEvent
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('organizer', 'admin'),
  upload.single('poster'),
  updateEvent
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('organizer', 'admin'),
  deleteEvent
);

export default router;