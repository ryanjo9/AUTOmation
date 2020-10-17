<template>
  <div class="home">
    
    <div v-if="user">
      <h1>Hello {{user.name}}</h1>
      <a href="#" @click="logout">Logout</a>
      <img alt="Vue logo" src="../assets/logo.png">
    </div>
    <div v-else>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <router-link to="/register" class="pure-button">Register</router-link> or
    <router-link to="/login" class="pure-button">Login</router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  async created() {
    await this.$store.dispatch("getUser");
  },
  methods: {
    async logout() {
      try {
        this.error = await this.$store.dispatch("logout");
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
