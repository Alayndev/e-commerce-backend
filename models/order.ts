import { firestore } from "lib/connections/firestore";

const collection = firestore.collection("orders");

// Min. 28 - Sería ideal tipar con este type createPreference() - data - y demás props. y methods tambien
type OrderData = {
  additionalInfo: any;
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

  static async getUserOrders(userId) {
    const orders = await collection.where("userId", "==", userId).get();

    const userOrders = [];

    orders.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());

      userOrders.push({ docId: doc.id, ...doc.data() });
    });

    return userOrders;
  }

  static async getOrder(orderId) {
    const order = await collection.doc(orderId).get();

    if (order.exists) {
      const orderData = order.data();

      return orderData;
    } else {
      const message = `This orderId does not exist: ${orderId}`;
      return { error: message };
    }
  }
}

export { Order };
