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

  // Metodo para crear un doc en la coll Users: (1 hr. 3 min.) El constructor esta preparado para recibir un id de un Doc, pero necesitamos crearlo primero/en este caso. Por eso este metodo
  // createNewUser() recibe un objeto que guardamos en la coll como un nuevo doc. Luego hacemos una instacia de la Clase, por lo que creamos una referencia a este doc en la Clase, teniendo los metodos y tipos propios de esta clase (push - pull - data - etc). Luego a la ref.data le seteamos lo mismo que guardamos en la DB.
  static async createNewUser(data) {
    const newUserSnap = await collection.add(data);
    console.log(newUserSnap, "newUserSnap user");

    const newUser = new User(newUserSnap.id);

    newUser.data = data;

    return newUser;
  }
}

export { User };
