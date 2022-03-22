<template>
  <div class="orders">
    <div class="orders__content">
      <h1>Orders</h1>
      <table>
        <tr>
          <th>Time</th>
          <th>Order</th>
          <th>Adress</th>
          <th>Phone number</th>
          <th>Total price</th>
        </tr>
        <tr v-for="(order, index) in orders" :key="index">
          <td>{{ orders[index].time }}</td>
          <td>
            <p v-for="(product, index) in order.order" :key="index">
              {{ order.order[index].name }}, {{ order.order[index].size }}
            </p>
          </td>
          <td>{{ orders[index].adress }}</td>
          <td>{{ orders[index].phoneNumber }}</td>
          <td>{{ orders[index].total }}$</td>
          <td style="border: none">
            <i class="bi bi-check-circle-fill" @click="markAsComplete(order)"
              ><span class="tooltiptext">Mark as complete</span></i
            >
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {
  db,
  collection,
  doc,
  getDocs,
  deleteDoc,
  orderBy,
  query
} from "@/firebase";

export default {
  name: "Orders",
  data() {
    return {
      orders: [],
    };
  },

  methods: {
    async getOrders() {
      const q = query(collection(db, "orders"), orderBy("time", "asc"));
      const querySnapshot = await getDocs(q);
      this.orders = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        this.orders.push({
          id: doc.id,
          adress: data.adress,
          phoneNumber: data.phoneNumber,
          order: data.pizza,
          total: data.price,
          time: data.time,
        });
        console.log(this.orders);
      });
    },

    async markAsComplete(order) {
      await deleteDoc(doc(db, "orders", order.id));
      this.getOrders();
    },
  },

  mounted() {
    this.getOrders();
  },
};
</script>

<style lang="scss">
@import "@/_shared.scss";

.orders {
  height: 100vh;

  &__content {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 900px;
    margin-top: 120px;

    table {
      width: 100%;
      margin-top: 50px;
      text-align: center;
      font-size: 18px;

      td,
      th {
        padding: 15px 0;
        border-bottom: 1px solid #ddd;
      }

      .bi-check-circle-fill {
        color: #adadad;
        cursor: pointer;
        position: relative;
      }

      .bi-check-circle-fill:hover {
        color: rgb(40, 148, 40);
      }

      .bi-check-circle-fill:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
      }

      .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: color(text-color);
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;
        position: absolute;
        z-index: 1;
        bottom: 100%;
        margin-bottom: 2px;
        left: 50%;
        margin-left: -60px;
        font-style: normal;
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      .tooltiptext::after {
        content: " ";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: color(text-color) transparent transparent transparent;
      }
    }
  }
}
</style>
