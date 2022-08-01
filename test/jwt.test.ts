import test from "ava";
import { decodeToken, generateToken } from "lib/connections/jwt";

test("JWT: testing generateToken and decodeToken", (t) => {
  const payload = { obj: true };

  const token = generateToken(payload);
  const decodedToken: any = decodeToken(token);

  delete decodedToken.iat;

  t.deepEqual(payload, decodedToken);
});
