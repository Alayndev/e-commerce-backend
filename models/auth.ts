import { firestore } from "lib/connections/firestore";
import isAfter from "date-fns/isAfter";

export const collection = firestore.collection("auth");

class Auth {
  ref: FirebaseFirestore.DocumentReference;

  data: any;

  id: string;

  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }

  async pullAuth() {
    const snapshot = await this.ref.get();
    this.data = snapshot.data();
  }

  async pushAuth() {
    this.ref.update(this.data);
  }

  // Explicacion linea por linea: (min. 54 - 1hr.)
  static async findByEmail(email: string) {
    const cleanEmail: string = email.trim().toLocaleLowerCase(); // trim() : Sacamos espacios al inicio y al final - Pasamos a minusculas - Ambas medidas de seguridad

    const results = await collection.where("email", "==", cleanEmail).get(); // Buscamos entre todos los docs de esta coll un campo email con el valor cleanEmail. Es con get() que los trae de la DB

    console.log(results.docs.length, "results");

    if (results.docs.length) {
      const firstDoc = results.docs[0]; // Agarramos el 1er doc con el email por si acaso hay más de 1 en la coll

      const newAuth = new Auth(firstDoc.id); // Creamos una referencia al doc

      newAuth.data = firstDoc.data(); // Guardamos en la referencia la data traida de la DB

      return newAuth; // Devolvemos la referencia
    } else {
      return null; // Devolvemos null de NO encontrar ningun doc que coincida con tal email recibido
    }
  }

  static async createNewAuth(data) {
    const newUserSnap = await collection.add(data);
    console.log(newUserSnap, "newUserSnap auth");

    const newUser = new Auth(newUserSnap.id);

    newUser.data = data;

    return newUser;
  }

  // Metodo encargado de buscar un doc en la coll auth que tenga el email y code, lo usamos para POST /auth/token
  static async findByEmailAndCode(email: string, code: number) {
    const cleanEmail: string = email.trim().toLocaleLowerCase();

    // Doc con email y code
    const result = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();

    if (result.empty) {
      console.log("Ningun doc con ese email y code");

      return null;
    } else {
      const authDoc = result.docs[0];

      const newAuth = new Auth(authDoc.id);

      newAuth.data = authDoc.data(); // ? Trae mas de 1 doc? NO necesariamente, puede que si pero es NO es el caso, casi p imposible que un doc tenga mismo email y code. Lo que pasa es que si no hacemos esto y agarramos un doc (en este caso el de la posicion [0]) y le hacemos .data(), viene en un formato horrible e ilegible. En cambio, haciendo .data() viene como lo vemos en la DB Firestore

      return newAuth;
    }
  }

  // Expires (min. 15)
  isCodeExpired() {
    const expires = this.data.expires.toDate(); // De este modo convertimos la fecha en seconds y nanoseconds que nos devuelve Firebase/Firestore en ISO date
    const now = new Date();

    const res = isAfter(now, expires); // Is the first date after the second one? - Returns a boolean - Ejemplo 1: now: 12:30 y expires: 12:33 --> Va a devolver false xq now NO es después de expires, entonces podemos crear y devolver el token en el endpoint - Ejemplo 2: now: 12:35 y expires: 12:33 --> Va a devolver true porque now ES después de expires. Al ser true/expirar 12:33 NO generamos el token y devolvemos que el code expiró en la View/endpoint. true === codeExpired - false === codeValid

    return res;
  }
}

export { Auth };
