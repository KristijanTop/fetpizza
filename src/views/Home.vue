<template>
  <div class="home">
    <div class="home__landing">
      <div class="home__landing__columnleft">
        <h1>Welcome to</h1>
        <img src="@/assets/pizza-logo.svg" width="500" />
        <h2>Place your order</h2>
        <a href="#orderSection"><button>NOW</button></a>
      </div>
      <div class="home__landing__columnright">
        <img src="@/assets/Pizza.svg" height="450" />
      </div>
    </div>

    <div class="home__order" id="orderSection">
      <div class="home__order__form">
        <h1>Choose a pizza</h1>
        <select id="order" name="order" v-model="pizza.name">
          <option value="Margherita">Margherita</option>
          <option value="Pepperoni">Pepperoni</option>
          <option value="Funghi">Funghi</option>
          <option value="Vegeteriana">Vegeteriana</option>
          <option value="Tuna">Tuna</option>
          <option value="Frutti di mare">Frutti di mare</option>
          <option value="Quatro stagioni">Quatro stagioni</option>
          <option value="Mexican">Mexican</option>
          <option value="Chicken">Chicken</option>
          <option value="Hawaian">Hawaiian</option>
        </select>
        <p>Size</p>
        <select id="size" name="size" v-model="pizza.size">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <p>Price: {{ calculatePrice }}$</p>
        <button class="primary-btn" @click="addToOrder()">Add to order</button>
      </div>
      <div class="home__order__myorder">
        <h1>My Order</h1>
        <div class="home__order__myorder__products">
          <p v-for="(product, index) in order" :key="index">
            {{ order[index].name }}, {{ order[index].size }},
            {{ order[index].price }}$
            <i class="bi bi-trash" @click="removeProduct(index)"></i>
          </p>
        </div>
        <div class="home__order__myorder__total">
          <p>Total: {{ calculateTotal }}$</p>
        </div>
      </div>
      <div class="home__order__delivery">
        <h1>Delivery information</h1>
        <p>Adress</p>
        <input placeholder="Enter your adress" v-model="adress" />
        <p>Phone number</p>
        <input placeholder="Enter your phone number" v-model="phoneNumber" />
        <button
          class="primary-btn"
          @click="
            finishOrder();
            openModal();
          "
        >
          Finish
        </button>
      </div>
    </div>

    <transition name="modal">
      <div class="modal" v-if="modalVisible">
        <div class="modal__container">
          <h2>{{ msg }}</h2>
          <button class="primary-btn" @click="closeModal()">Close</button>
        </div>
      </div>
    </transition>

    <div class="home__feedback">
      <div class="home__feedback__form">
        <h1>Leave feedback</h1>
        <p>Name</p>
        <input placeholder="Enter your name" v-model="name" />
        <p>Feedback</p>
        <textarea placeholder="Enter your feedback" v-model="feedback" />
        <div class="home__feedback__form__footer">
          <button class="primary-btn" @click="leaveFeedback()">Done</button>
          <p>{{ fMsg }}</p>
        </div>
      </div>
      <div class="home__feedback__posts">
        <div
          class="home__feedback__posts__post"
          v-for="(post, index) in feedbackPosts"
          :key="index"
        >
          <h2>{{ feedbackPosts[index].name }}</h2>
          <p id="time">{{ feedbackPosts[index].time }}</p>
          <p>{{ feedbackPosts[index].feedback }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { db, collection, addDoc, getDocs, orderBy, query } from "@/firebase";

export default {
  name: "Home",
  data() {
    return {
      pizza: {
        name: "Margherita",
        size: "small",
      },
      store,
      order: [],
      adress: null,
      phoneNumber: null,
      modalVisible: false,
      msg: "",
      name: null,
      feedback: null,
      fMsg: "",
      feedbackPosts: [],
    };
  },

  computed: {
    k() {
      let k;
      if (this.pizza.size == "small") {
        k = 1;
        return k;
      }
      if (this.pizza.size == "medium") {
        k = 1.5;
        return k;
      }
      if (this.pizza.size == "large") {
        k = 2;
        return k;
      }
    },

    calculatePrice() {
      let price;
      if (this.pizza.name == "Margherita") {
        price = this.store.margherita * this.k;
        return price;
      }
      if (this.pizza.name == "Pepperoni") {
        price = this.store.pepperoni * this.k;
        return price;
      }
      if (this.pizza.name == "Funghi") {
        price = this.store.funghi * this.k;
        return price;
      }
      if (this.pizza.name == "Vegeteriana") {
        price = this.store.vegeteriana * this.k;
        return price;
      }
      if (this.pizza.name == "Tuna") {
        price = this.store.tuna * this.k;
        return price;
      }
      if (this.pizza.name == "Frutti di mare") {
        price = this.store.frutti_di_mare * this.k;
        return price;
      }
      if (this.pizza.name == "Quatro stagioni") {
        price = this.store.quatro_stagioni * this.k;
        return price;
      }
      if (this.pizza.name == "Mexican") {
        price = this.store.mexican * this.k;
        return price;
      }
      if (this.pizza.name == "Chicken") {
        price = this.store.chicken * this.k;
        return price;
      }
      if (this.pizza.name == "Hawaian") {
        price = this.store.hawaiian * this.k;
        return price;
      }
    },

    calculateTotal() {
      let total = 0;
      for (let i = 0; i < this.order.length; i++) {
        total += this.order[i].price;
      }
      return total;
    },
  },

  methods: {
    addToOrder() {
      this.order.push({
        name: this.pizza.name,
        size: this.pizza.size,
        price: this.calculatePrice,
      });
    },

    removeProduct(index) {
      this.order.splice(index, 1);
    },

    async finishOrder() {
      if (
        this.order.length === 0 ||
        this.adress == null ||
        this.phoneNumber == null
      ) {
        this.msg = "Please fill your order corectly!";
      } else {
        try {
          const now = new Date();
          const time =
            now.getDate() +
            "/" +
            (now.getMonth() + 1) +
            "/" +
            now.getFullYear() +
            " " +
            now.getHours() +
            ":" +
            now.getMinutes();
          const docRef = await addDoc(collection(db, "orders"), {
            pizza: this.order,
            adress: this.adress,
            phoneNumber: this.phoneNumber,
            price: this.calculateTotal,
            time: time,
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
        this.msg = "Thank you for your order!";
        this.order = [];
        this.adress = null;
        this.phoneNumber = null;
      }
    },

    openModal() {
      this.modalVisible = true;
    },

    closeModal() {
      this.modalVisible = false;
    },

    async leaveFeedback() {
      if (this.name == null || this.feedback == null) {
        this.fMsg = "Please fill out data before leaving feedback!";
      } else {
        try {
          const now = new Date();
          const time =
            now.getDate() +
            "/" +
            (now.getMonth() + 1) +
            "/" +
            now.getFullYear() +
            " " +
            now.getHours() +
            ":" +
            now.getMinutes();
          const docRef = await addDoc(collection(db, "feedback"), {
            name: this.name,
            feedback: this.feedback,
            time: time,
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
        this.fMsg = "Thank you for your feedback!";
        this.name = null;
        this.feedback = null;
        this.getFeedback();
      }
    },

    async getFeedback() {
      const q = query(collection(db, "feedback"), orderBy("time", "desc"));
      const querySnapshot = await getDocs(q);
      this.feedbackPosts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        this.feedbackPosts.push({
          id: doc.id,
          name: data.name,
          feedback: data.feedback,
          time: data.time,
        });
        console.log(this.feedbackPosts);
      });
    },
  },

  mounted() {
    this.getFeedback();
  },
};
</script>

<style lang="scss">
@import "@/_shared.scss";

.home {
  &__landing {
    display: flex;
    justify-content: space-around;
    background-color: color(background-color);
    width: 100%;
    height: 100vh;

    &__columnleft {
      line-height: 2;
      margin: auto 0px;
      text-align: center;

      h1 {
        font-size: 4em;
      }

      h2 {
        font-size: 3em;
      }

      button {
        margin-top: 30px;
        padding: 15px 35px;
        background-color: #fff;
        outline: none;
        border: none;
        border-radius: 20px;
        font-size: 25px;
        font-family: "Rationale";
        font-weight: 600;
        cursor: pointer;
        transition: 0.5s ease;
      }
      button:hover {
        transform: scale(1.1);
      }
    }
    &__columnright {
      margin: auto 0px;
    }
  }

  &__order {
    padding: 150px 0px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 50px;

    &__form {
      padding: 30px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      border-radius: 7px;
      width: 90%;
      max-width: 400px;

      input,
      select {
        padding: 12px;
        margin-top: 5px;
        margin-bottom: 15px;
        width: 100%;
        border: none;
        border-radius: 10px;
        background: #f2f2f2;
      }
      p {
        font-size: 22px;
      }
      h1 {
        margin-bottom: 15px;
      }

      .primary-btn {
        left: 50%;
        margin-left: -65px;
      }
    }

    &__myorder {
      padding: 30px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      border-radius: 7px;
      width: 90%;
      max-width: 400px;

      &__products {
        height: 200px;
        overflow: auto;
        border-bottom: 1px solid color(text-color);
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      p {
        font-size: 20px;
      }

      &__total {
        padding-top: 17px;
        text-align: right;
      }
    }

    &__delivery {
      padding: 30px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      border-radius: 7px;
      width: 90%;
      max-width: 400px;

      input {
        padding: 12px;
        margin-top: 5px;
        margin-bottom: 15px;
        width: 100%;
        border: none;
        border-radius: 10px;
        background: #f2f2f2;
      }

      p {
        font-size: 22px;
      }
      h1 {
        margin-bottom: 15px;
      }

      .primary-btn {
        left: 50%;
        margin-left: -44px;
      }
    }
  }

  &__feedback {
    padding: 50px;
    background: color(text-color);
    color: #fff;
    display: flex;
    gap: 50px;

    &__form {
      width: 100%;
      max-width: 250px;

      h1 {
        margin-bottom: 20px;
      }

      input {
        padding: 12px;
        margin-top: 5px;
        margin-bottom: 15px;
        border: none;
        border-radius: 10px;
        background: #f2f2f2;
        width: 100%;
      }
      textarea {
        resize: none;
        padding: 12px;
        margin-top: 5px;
        border: none;
        border-radius: 10px;
        background: #f2f2f2;
        font-family: Arial, Helvetica, sans-serif;
        width: 100%;
        display: block;
      }

      &__footer {
        display: flex;

        p {
          margin-top: 20px;
          margin-left: 20px;
        }
      }
    }

    &__posts {
      width: 50%;
      max-height: 282px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-right: 20px;
      margin: 0px auto;

      #time {
        font-size: 16px;
        margin-top: 5px;
        margin-bottom: 10px;
      }

      p {
        font-size: 18px;
      }
    }
  }

  .bi-trash {
    color: #adadad;
    margin-left: 5px;
    cursor: pointer;
  }

  .bi-trash:hover {
    color: color(background-color);
  }

  @media only screen and (max-width: 1114px) {
    .home__landing__columnright {
      display: none;
    }
  }

  @media only screen and (max-width: 535px) {
    .home__landing__columnleft {
      img {
        width: 90vw;
      }
      h1 {
        font-size: 12vw;
      }
      h2 {
        font-size: 9vw;
      }
    }
  }

   @media only screen and (max-width: 670px) {
    .home__feedback {
      flex-direction: column;

      &__posts {
        width: 100%;
      }
    }
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
    transition: all 0.5s ease;
  }

  .modal-enter-active .modal__container {
    animation: bounce-in 0.5s;
  }

  .modal-leave-active .modal__container {
    animation: bounce-in 0.5s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.25);
    }
    100% {
      transform: scale(1);
    }
  }

  .modal {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: all 0.5s ease;
  }

  .modal__container {
    position: relative;
    top: 50%;
    left: 50%;
    margin-left: -150px;
    margin-top: -80px;
    width: 90%;
    max-width: 300px;
    background: #fff;
    padding: 30px;
    border-radius: 7px;
    text-align: center;
  }
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>
