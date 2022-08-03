import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controllers/auth";
import methods from "micro-method-router";
import * as yup from "yup";
import { validateBody } from "lib/middlewares/schemasMiddlewares";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().required("email required by body"),
  })
  .noUnknown(true)
  .strict();

// POST /auth: Recibe un body con un email. Utiliza este email para encontrar/crear un registro auth. En el caso de que tenga que crear el registro de la collection/tabla auth también crea el registro user correspondiente. Genera un código con fecha de vencimiento y le envía el código por email (usando sendgrid) al user que haya solicitado autenticarse.
async function auth(req: NextApiRequest, res: NextApiResponse) {
  const { emailSent } = await sendCode(req.body.email);

  res.status(200).json({
    emailSent,
  });
}

const handler = methods({
  post: auth,
});

export default validateBody(bodySchema, handler);
