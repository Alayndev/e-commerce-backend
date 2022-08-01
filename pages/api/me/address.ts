import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import methods from "micro-method-router";
import { patchUserAddressById } from "controllers/users";

// PATCH /me/address: Permite modificar un dato puntual del usuario al que pertenezca el token usado en el request. En este caso el objeto que describe la dirección.
async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  if (!req.body.address) {
    res.status(400).send({ message: "new address required" });
  }
  const user = await patchUserAddressById(userData.userId, req.body.address);

  res.send({ user });
}

const handler = methods({
  patch: patchHandler,
});

export default authMiddleware(handler);
