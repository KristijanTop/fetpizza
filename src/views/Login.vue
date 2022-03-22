<template>
  <div class="login">
    <div class="login__container">
      <h2>Log in as admin</h2>
      <p>E-mail</p>
      <input placeholder="Enter your e-mail" v-model="email" />
      <p>Password</p>
      <input type="password" placeholder="Enter your password" v-model="password" />
      <button class="primary-btn" @click="signIn()">Log in</button>
    </div>
  </div>
</template>

<script>
import { auth, signInWithEmailAndPassword } from "@/firebase";

export default {
  name: "Login",
  data() {
    return {
      email: "kris.topic@gmail.com",
      password: "admin1",
    };
  },

  methods: {
    signIn() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.$router.push({ name: "Orders" });
          console.log(user);
        })
        .catch((error) => {
          console.error(error)
        });
    },
  },
};
</script>


<style lang="scss">
@import "@/_shared.scss";

.login {
  height: 100vh;

  &__container {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 7px;
    padding: 30px;

    h2 {
      text-align: center;
      margin-bottom: 20px;
    }

    p {
      font-size: 20px;
    }

    input {
      padding: 12px;
      margin-top: 5px;
      margin-bottom: 15px;
      width: 100%;
      border: none;
      border-radius: 10px;
      background: #f2f2f2;
    }

    .primary-btn {
      left: 50%;
      margin-left: -45px;
    }
  }
}
</style>
