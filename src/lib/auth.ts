import bcrypt from "bcrypt";

export async function verifyPassword(
  plaintextPassword: string,
  hashedPassword: string
) {
  try {
    const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Password verification failed");
  }
}
