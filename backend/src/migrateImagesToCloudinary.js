import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import cloudinary from "./config/cloudinary.js";
import Event from "./models/Event.js";
import { env } from "./config/env.js";

// Connect to MongoDB (Atlas)
await mongoose.connect(env.mongoUri);

// IMPORTANT: uploads folder is at backend/uploads (not src/uploads)
const uploadsDir = path.join(process.cwd(), "uploads");

async function migrate() {
  const events = await Event.find({
    posterUrl: { $regex: "^/uploads/" }
  });

  console.log(`Found ${events.length} events to migrate`);

  for (const event of events) {
    const localPath = path.join(
      uploadsDir,
      path.basename(event.posterUrl)
    );

    if (!fs.existsSync(localPath)) {
      console.log(`❌ File missing: ${localPath}`);
      continue;
    }

    const result = await cloudinary.uploader.upload(localPath, {
      folder: "event-posters"
    });

    event.posterUrl = result.secure_url;
    await event.save();

    console.log(`✅ Migrated: ${event.title}`);
  }

  console.log("🎉 Image migration completed");
  process.exit(0);
}

migrate();