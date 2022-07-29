import { Auth, collection } from "models/auth";
import { User } from "models/user";

import addMinutes from "date-fns/addMinutes";
import gen from "random-seed";
import { sendEmail } from "lib/connections/sendgrid";
const seed = "adadasdnosahsoaudh";
const random = gen.create(seed);

export async function findOrCreateAuth(email: string): Promise<Auth> {
  const cleanEmail: string = email.trim().toLocaleLowerCase(); // trim() : Sacamos espacios al inicio y al final - Pasamos a minusculas - Ambas medidas de seguridad

  const res = await Auth.findByEmail(cleanEmail); // Metodo del Model Auth que me devuelve si encontró o no un doc con ese email en un campo email en la coll Auth. A partir de esto, lo devolvemos al encontrarlo o lo creamos al no encontrarlo

  // En ambos devuelvo una referencia para usarla en sendCode(): ( 1 hr. 10 min. )
  if (res) {
    console.log("auth encontrado");

    return res; // Si lo encontramos, lo retornamos
  } else {
    // Si NO lo encontramos, y por ende res === null, lo CREAMOS
    const newUser = await User.createNewUser({
      email: cleanEmail,
    });

    const newAuth = await Auth.createNewAuth({
      email: cleanEmail,
      userId: newUser.id,
      code: "",
      expires: new Date(),
    });

    return newAuth;
  }
}

export async function sendCode(email: string) {
  const auth = await findOrCreateAuth(email); // findOrCreateAuth() siempre me devuelve una referencia

  // ! DUDA: Al encontrarlo y devolverlo, le cambiamos/pisamos el code y expires con esta lógica de aca abajo. Eso esta bien o mal en passwordless? Bien porque es un user ya registrado intentando ingresar nuevamente

  // Code
  const code = random.intBetween(10000, 99999); // intBetween(min, max) --> Numero random entre min y max
  auth.data.code = code;
  console.log(code, "code");

  // Expires
  const now = new Date();
  const fiveMinutesFromNow = addMinutes(now, 5); // addMinutes(date, amount) - https://date-fns.org/v2.28.0/docs/addMinutes
  auth.data.expires = fiveMinutesFromNow;
  console.log(now, "now", fiveMinutesFromNow, "fiveMinutesFromNow");

  await auth.pushAuth(); // update del doc, actualizamos code y expires en Firestore

  const emailSent = await sendEmail(email, code);

  return { emailSent };
}

// Metodo encargado de buscar un doc en la coll auth que tenga el email y code, lo usamos para POST /auth/token
export async function findByEmailAndCode(email: string, code: number) {
  const cleanEmail: string = email.trim().toLocaleLowerCase();

  // Doc con email y code
  const result = await collection
    .where("email", "==", cleanEmail)
    .where("code", "==", code)
    .get();

  if (result.empty) {
    console.log("Ningun doc con ese email y code - CONTROLLER");

    return null;
  } else {
    const authDoc = result.docs[0];

    console.log(authDoc.data(), "Doc coincide con email y code - CONTROLLER");

    const newAuth = new Auth(authDoc.id);

    newAuth.data = authDoc.data(); // ? Trae mas de 1 doc? NO necesariamente, puede que si pero es NO es el caso, casi p imposible que un doc tenga mismo email y code. Lo que pasa es que si no hacemos esto y agarramos un doc (en este caso el de la posicion [0]) y le hacemos .data(), viene en un formato horrible e ilegible. En cambio, haciendo .data() viene como lo vemos en la DB Firestore

    return newAuth;
  }
}
