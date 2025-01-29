import mongoose from "mongoose";

// Define the schema for the guest user URL model
const guestUserSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true, // Long URL is mandatory
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate short URLs
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// let GuestUser;
// if (mongoose.models.GuestUser) {
//   GuestUser = mongoose.models.GuestUser;
// } else {
//   GuestUser = mongoose.model("GuestUser", guestUserSchema);
// }
// Check if the model already exists before defining it
const GuestUser = mongoose.models.GuestUser || mongoose.model("GuestUser", guestUserSchema) ;

export default GuestUser;
