import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, },
  provider: { type: String, required: true },
  password: { type: String },
  name: { type: String,  },
  code: { type: String }, // to sent the verification code
  isUpdated: { type: Boolean, default: false }, // from sign false and from reset pass true
  isVerified: { type: Boolean, default: false }, // if the verification code is coorect will true  it
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
