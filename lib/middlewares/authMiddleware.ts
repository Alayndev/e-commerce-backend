import { decodeToken } from "lib/connections/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";

export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const token = parseBearerToken(req);
    if (!token) {
      res.status(401).json({ message: "missing token" });
    } else {
      const decodedToken = decodeToken(token);

      if (decodedToken) {
        callback(req, res, decodedToken);
      } else {
        console.error("Error authMiddleare - decodedToken invalid");
        res.status(401).json({ message: "token invalid" });
      }
    }
  };
}
