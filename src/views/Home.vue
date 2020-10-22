<template>
  <div class="home">

    <div v-if="user">

      <h1 style="margin-top: 50px; margin-bottom: 50px">Hello {{user.name}}</h1>
      <router-link style="color:black; display:inline-block" class="nav-link" to="/add" id="add_car">Add a Car</router-link>

      <ul>
        <li v-for="(car, index) in cars" v-bind:key='car._id' class="car_info">
          <div class = "car_info">
            <router-link :to="{ name: 'Display', params: {id: car._id} }" class="car_links">
              <div class="logo" style="display: inline-block">
                <img :src="getImgUrl('car')" height="40px" width="100px">
              </div>
              <p style="display: inline-block; margin-right: 50px">{{ car.year }} {{ car.make }} {{ car.model }}</p>
            </router-link>
            <button class="remove_car" @click="removeCar(car._id, index)">Remove</button>
          </div>
        </li>
      </ul>

    </div>
    <div v-else>
      <login />
    </div>
  </div>
</template>

<script>
import Login from '@/views/Login.vue'

export default {
  name: 'Home',
  components: {
    Login
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    cars() {
      return this.$store.state.cars;
    }
  },
  async created() {
    await this.$store.dispatch("getUser");
    await this.$store.dispatch('getCars');
  },
  methods: {
    getImgUrl(path){
      var images = require.context('../assets/', false, /\.png$/)
      return images('./' + path + ".png")
    },
    async removeCar(carId, index) {
      try {
        this.cars.splice(index, 1);
        this.error = await this.$store.dispatch("removeCar", carId);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>
.car_info {
  margin-left: auto;
  margin-right: auto;
  position: auto;
  left: 25%;
  width: 50%;
}

ul {
    list-style-type: none;
}

.logo{
  grid-area: side;
  margin-top: 15px;
  margin-right: 20px;
}
.remove_car {
  background-color: pink;
  border-radius: 13px !IMPORTANT;
}
.remove_car:hover {
  background-color: red;
  font-weight: bold;
}
#add_car {
  background-color: lightgreen;
  border: 1px solid black;
  border-radius: 20px;
}
.car_links {
  color: black !IMPORTANT;
}
.car_links:hover {
  font-weight: bold;
}
</style>
