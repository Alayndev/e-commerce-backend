import { firestore } from "lib/connections/firestore";
import isAfter from "date-fns/isAfter";

const collection = firestore.collection("auth");

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

  static async findByEmail(email: string) {
    const cleanEmail: string = email.trim().toLocaleLowerCase();

    const results = await collection.where("email", "==", cleanEmail).get();

    console.log(results.docs.length, "results");

    if (results.docs.length) {
      const firstDoc = results.docs[0];

      const newAuth = new Auth(firstDoc.id);

      newAuth.data = firstDoc.data();

      return newAuth;
    } else {
      return null;
    }
  }

  static async createNewAuth(data) {
    const newUserSnap = await collection.add(data);
    console.log(newUserSnap, "newUserSnap auth");

    const newUser = new Auth(newUserSnap.id);

    newUser.data = data;

    return newUser;
  }

  static async findByEmailAndCode(email: string, code: number) {
    const cleanEmail: string = email.trim().toLocaleLowerCase();

    const result = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();

    console.log(result, "result");

    if (result.empty) {
      throw `Email or code incorrect.`;
    } else {
      const authDoc = result.docs[0];

      const newAuth = new Auth(authDoc.id);

      newAuth.data = authDoc.data();

      return newAuth;
    }
  }

  isCodeExpired() {
    const expires = this.data.expires.toDate();
    const now = new Date();

    const res = isAfter(now, expires);

    return res;
  }
}

export { Auth };
