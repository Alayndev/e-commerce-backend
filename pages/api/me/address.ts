import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import methods from "micro-method-router";
import { patchUserAddressById } from "controllers/users";
import * as yup from "yup";
import { validateBody } from "lib/middlewares/schemasMiddlewares";

let bodySchema = yup
  .object()
  .shape({
    address: yup.object().required("address required by body"),
  })
  .noUnknown(true)
  .strict();

// PATCH /me/address: Permite modificar un dato puntual del usuario al que pertenezca el token usado en el request. En este caso el objeto que describe la dirección.
async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  const user = await patchUserAddressById(userData.userId, req.body.address);

  res.send({ user });
}

const handler = methods({
  patch: patchHandler,
});

export default validateBody(bodySchema, authMiddleware(handler));
