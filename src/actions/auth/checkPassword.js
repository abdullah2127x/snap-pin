// "use server";
// import connectDB from "@/lib/db/mongodb";
// import User from "@/models/auth/User";

// const checkPassword = async ({ email, password }) => {
//   await connectDB();
//   const userExist = await User.findOne({ email });

//   if (userExist) {
//     if (userExist.password === password) {
//       return {
//         success: true,
//         error: false,
//         message: "Login successful!",
//       };
//     } else {
//       return {
//         success: false,
//         error: true,
//         message: "Invalid password!",
//       };
//     }
//   } else {
//     return {
//       success: false,
//       error: true,
//       message: "User not found!",
//     };
//   }
// };
// export { checkPassword };


"use server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/auth/User";
import argon2 from "argon2";  // Import argon2 for password hashing and verification

const checkPassword = async ({ email, password }) => {
  await connectDB();
  const userExist = await User.findOne({ email });

  if (userExist) {
    try {
      // Verify password with argon2
      const isPasswordValid = await argon2.verify(userExist.password, password);

      if (isPasswordValid) {
        return {
          success: true,
          error: false,
          message: "Login successful!",
        };
      } else {
        return {
          success: false,
          error: true,
          message: "Invalid password!",
        };
      }
    } catch (error) {
      console.error("Error verifying password:", error.message);
      return {
        success: false,
        error: true,
        message: "Error verifying password.",
      };
    }
  } else {
    return {
      success: false,
      error: true,
      message: "User not found!",
    };
  }
};

export { checkPassword };
