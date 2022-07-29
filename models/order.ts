import { firestore } from "lib/connections/firestore";

const collection = firestore.collection("orders");

// Min. 28 - Sería ideal tipar con este type createPreference() - data - y demás props. y methods tambien
type OrderData = {
  aditionalInfo: any;
  productId: string;
  userId: string;
  status: "pending" | "paid";
};

class Order {
  ref: FirebaseFirestore.DocumentReference;

  data: any;

  id: string;

  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }

  async pullOrder() {
    const snapshot = await this.ref.get();
    this.data = snapshot.data();
  }

  async pushOrder() {
    this.ref.update(this.data);
  }

  static async createNewOrder(data) {
    const newOrderSnap = await collection.add(data);
    console.log(newOrderSnap, "newOrderSnap Order");

    const newOrder = new Order(newOrderSnap.id);

    newOrder.data = data;

    return newOrder;
  }
}

export { Order };
