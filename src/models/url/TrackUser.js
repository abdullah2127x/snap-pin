import mongoose from "mongoose";

// Define the schema for the URL model
const trackUserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  provider: { type: String, required: true },
  urls: [
    {
      longUrl: {
        type: String,
        required: true, // Long URL is mandatory
      },
      shortUrl: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate short URLs
      },
      clickAt: [
        {
          date: { type: String },
          count: { type: Number, default: 0 },
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      lastClick: { type: Date},
    },
  ],
});

// Check if the model already exists before defining it
const TrackUser =
  mongoose.models.TrackUser || 
  mongoose.model("TrackUser", trackUserSchema);

export default TrackUser;
