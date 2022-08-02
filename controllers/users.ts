import { User } from "models/user"; // Capa controllers invoca a capa Model

export async function getUserById(id: string): Promise<any> {
  const userRef = new User(id);

  await userRef.pullUser();

  return userRef.data; // (MVC Desafio Modulo) Podemos devolver una instancia o la data directamente. Mejor la data.
}

export async function patchUserById(id: string, newData: any): Promise<any> {
  const userRef = new User(id);

  userRef.data = newData;

  await userRef.pushUser();

  await userRef.pullUser();

  return userRef.data;
}

export async function patchUserAddressById(
  id: string,
  newAddress: any
): Promise<any> {
  const userRef = new User(id);

  await userRef.pullUser();

  userRef.data.address = newAddress;

  await userRef.pushUser();

  return userRef.data;
}
