import { User } from "models/user"; // Capa controllers invoca a capa Model

export async function getUserById(id: string): Promise<any> {
  const userRef = new User(id);

  await userRef.pullUser();

  return userRef.data; // (MVC Desafio Modulo) Podemos devolver una instancia o la data directamente. Mejor la data.
}
