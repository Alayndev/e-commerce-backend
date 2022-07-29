import jwt from "jsonwebtoken";

export function generateToken(obj) {
  const token = jwt.sign(obj, process.env.JWT_SECRET as string);
  return token;
}

export function decodeToken(token) {
  try {
    const jsonDecoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return jsonDecoded;
  } catch (error) {
    console.error(error);
    return null;
  }
}
