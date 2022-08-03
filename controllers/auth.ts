import { Auth } from "models/auth";
import { User } from "models/user";

import addMinutes from "date-fns/addMinutes";
import gen from "random-seed";
import { sendEmail } from "lib/connections/sendgrid";
import { uuidv4 } from "helpers";
const seed = uuidv4();
const random = gen.create(seed);

export async function findOrCreateAuth(email: string): Promise<Auth> {
  const cleanEmail: string = email.trim().toLocaleLowerCase();

  const res = await Auth.findByEmail(cleanEmail);

  if (res) {
    console.log("auth encontrado");

    return res;
  } else {
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
  const auth = await findOrCreateAuth(email);

  // Code
  const code = random.intBetween(10000, 99999);
  auth.data.code = code;
  console.log(code, "code");

  // Expires
  const now = new Date();
  const fiveMinutesFromNow = addMinutes(now, 5);
  auth.data.expires = fiveMinutesFromNow;
  console.log(now, "now", fiveMinutesFromNow, "fiveMinutesFromNow");

  await auth.pushAuth();

  const emailSent = await sendEmail(email, code);

  return { emailSent };
}

export async function findByEmailAndCode(email: string, code: number) {
  const userFound = Auth.findByEmailAndCode(email, code);

  return userFound;
}
