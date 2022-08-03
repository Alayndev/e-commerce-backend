import { User } from "models/user"; 

export async function getUserById(id: string): Promise<any> {
  const userRef = new User(id);

  await userRef.pullUser();

  return userRef.data; 
}

export async function patchUserById(id: string, newData: any): Promise<any> {
  const userRef = new User(id);

  userRef.data = newData;

  await userRef.pushUser();

  return { userUpdated: true };
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
