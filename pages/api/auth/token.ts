import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "lib/connections/jwt";
import methods from "micro-method-router";
import { findByEmailAndCode } from "controllers/auth";
import * as yup from "yup";
import { validateBody } from "lib/middlewares/schemasMiddlewares";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required("email required by body"),
    code: yup.number().required("code required by body"),
  })
  .noUnknown(true)
  .strict();

// POST /auth/token: Recibe un email y un código y en caso de que sean correctos y que el código no esté vencido, genera un token JWT con la información mínima del user y se lo devuelve. En el caso de que haya algún error devuelve 401.
async function createToken(req: NextApiRequest, res: NextApiResponse) {
  // Encontrar al doc en coll auth
  const auth = await findByEmailAndCode(req.body.email, req.body.code); // ? Auth.findByEmailAndCode() funcionan igual, DUDA: Logica solo en controllers? Puedo exportar la coll en Auth para eso?

  if (!auth) {
    res.status(401).json({ message: "Email or code incorrect" });
  }

  // Expires: Validar que el code no esté expirado para generar el token
  const expires = auth.isCodeExpired();

  if (expires) {
    res.status(401).json({ message: "Code expired" });
  } else {
    const token = generateToken({ userId: auth.data.userId });
    res.send({ token });
  }
}

const handler = methods({
  post: createToken,
});

export default validateBody(bodySchema, handler);
