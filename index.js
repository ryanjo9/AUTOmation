import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const { cars } = require('../assets/data')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    makes: [],
    models: [],
    cars: [],
    car: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setMakes(state, makes) {
      state.makes = makes;
    },
    setModels(state, models) {
      state.models = models;
    },
    setCars(state, cars) {
      state.cars = cars;
    },
    setCar(state, car) {
      state.car = car;
    },
  },
  actions: {
    async register(context, data) {
      try {
        let response = await axios.post("/api/users", data);
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async login(context, data) {
      try {
        let response = await axios.post("/api/users/login", data);
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async logout(context) {
      try {
        await axios.delete("/api/users");
        context.commit('setUser', null);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async getUser(context) {
      try {
        let response = await axios.get("/api/users");
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return "";
      }
    },
    async getMakes(context) {
      try {
        // const { data } = await axios.get('/api/makes');
        const data = {
          makes: Object.keys(cars)
        }
        
        context.commit('setMakes', data.makes.sort());

        return ''; // returning an empty string since my old code relied on empty strings for error handling
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    async getModels(context, make) {
      try {
        // const { data } = await axios.get('/api/models?make=${make}');
        const data = {
          models: cars[make]
        }
        context.commit('setModels', data.models.sort());

        return ''; // returning an empty string since my old code relied on empty strings for error handling
      } catch (error) {
        console.error(error);
        return error;
      }
    },
    async saveCar(context, data) {
      try {
        let response = await axios.post("/api/cars", data);
        console.log('saveCar response: ', response)
        // context.commit('setCar', response.data);
        return '';
      } catch (error) {
        return error.message;
      }
    },
    async removeCar(context, carId) {
      try {
        await axios.delete(`/api/cars/${carId}`);
        return '';
      } catch (error) {
        return error.message;
      }
    },
    async getCars(context) {
      try {
        let response = await axios.get("/api/cars");
        context.commit('setCars', response.data);
        return '';
      } catch (error) {
        return error.message;
      }
    },
    async getCar(context, carId) {
      try {
        let response = await axios.get(`/api/cars/${carId}`);
        context.commit('setCar', response.data);
        return '';
      } catch (error) {
        return error.message;
      }
    },
  },
  modules: {
  }
})
