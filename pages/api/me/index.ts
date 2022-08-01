import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authMiddleware";
import methods from "micro-method-router";
import { getUserById, patchUserById } from "controllers/users";

// GET /me: Es un endpoint seguro (o sea que verifica que el request tenga token y que sea correcto mediante un middleware) y en base al token debe devolver la información de ese user. En el caso de un token incorrecto debe devolver 401.
async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  const user = await getUserById(userData.userId); // ( MVC Desafio Modulo ) Capa View invoca capa Controllers

  res.send({ user });
}

// PATCH /me: Permite modificar algunos datos del usuario al que pertenezca el token.
async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  if (!req.body) {
    res.status(400).send({ message: "body required" });
  }
  const user = await patchUserById(userData.userId, req.body); // ( MVC Desafio Modulo ) Capa View invoca capa Controllers

  res.send({ user });
}

const handler = methods({
  get: getHandler,
  patch: patchHandler,
});

export default authMiddleware(handler);
