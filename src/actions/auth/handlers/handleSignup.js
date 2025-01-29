"use server";
import { checkUserExist } from "@/actions/auth/checkUserExist";
import { saveUser } from "../saveUser";
import { sendVerificationCode } from "../sendVerificationCode";

function generateRandomNumber() {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const handleSignup = async (formData) => {
  const { name, email, password, remember, provider } = formData;

  const userExistResult = await checkUserExist({email, provider});
  // success false in user exist means user is not present in the database so turn success to false
  if (userExistResult && userExistResult.success === false) {
    const code = generateRandomNumber();
    const saveduser = await saveUser({ ...formData, code, isUpdated:false });// provider is in formData
    if (saveduser && saveduser.success) {
      const codeResponse = await sendVerificationCode({ code, email });
      if (codeResponse) {
        return codeResponse;
      }
    } else {
      return saveduser;
    }
  } else {
    // if user exist
    return { ...userExistResult, success: false, error: true };
  }
};

export { handleSignup };
