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
  try {
    const auth = await findByEmailAndCode(req.body.email, req.body.code);

    const expires = auth.isCodeExpired();

    if (expires) {
      res.status(401).json({ message: "Code expired" });
    } else {
      const token = generateToken({ userId: auth.data.userId });
      res.send({ token });
    }
  } catch (error) {
    res.status(400).send({ error });
  }
}

const handler = methods({
  post: createToken,
});

export default validateBody(bodySchema, handler);
