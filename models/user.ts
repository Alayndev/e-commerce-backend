import { firestore } from "lib/connections/firestore";

const collection = firestore.collection("users");
class User {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;

  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }

  async pullUser() {
    const snapshot = await this.ref.get();

    this.data = snapshot.data();
  }

  async pushUser() {
    this.ref.update(this.data);
  }

  static async createNewUser(data) {
    const newUserSnap = await collection.add(data);
    console.log(newUserSnap, "newUserSnap user");

    const newUser = new User(newUserSnap.id);

    newUser.data = data;

    return newUser;
  }
}

export { User };
