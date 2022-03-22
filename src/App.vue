<template>
  <div id="app">
    <div id="nav">
      <router-link to="/login" v-if="!store.currentUser">admin</router-link>
      <a href="#" @click.prevent="logOut()" v-if="store.currentUser">log out</a>
    </div>
    <router-view />
  </div>
</template>

<script>
import {auth, onAuthStateChanged, signOut } from "@/firebase";
import store from "@/store";

onAuthStateChanged(auth, (user) => {
  if (user) {
    store.currentUser = user.email;
    console.log (store.currentUser)
  } else {
    store.currentUser = null,
    console.log ("No user")
  }
});

export default {
  name: "app",
  data() {
    return {
      store,
    };
  },

  methods: {
    logOut() {
      signOut(auth)
        .then(() => {
          this.$router.push({ name: "Home" });
          console.log("Signout succesfull!")
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

@font-face {
  font-family: "Rationale";
  src: local("Rationale"), url(./fonts/Rationale.ttf) format("truetype");
}

* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

#app {
  font-family: "Rationale";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: color(text-color);
}

#nav {
  padding: 30px;
  width: 100%;
  position: absolute;
  top: 0;

  a {
    font-weight: bold;
    color: #2c3e50;
    float: right;
    text-decoration: none;
    color: color(text-color);
    background-color: #fff;
    padding: 12px 25px;
    border-radius: 20px;
    transition: 0.5s ease;

    &.router-link-exact-active {
      text-decoration: underline;
    }
  }

  a:hover {
    transform: scale(1.1);
  }
}
</style>
