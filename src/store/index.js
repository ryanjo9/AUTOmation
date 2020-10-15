import Vue from 'vue'
import Vuex from 'vuex'

const { cars } = require('../assets/data')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    makes: [],
    models: []
  },
  mutations: {
    setMakes(state, makes) {
      state.makes = makes;
    },
    setModels(state, models) {
      state.models = models;
    },
  },
  actions: {
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
    }
  },
  modules: {
  }
})
