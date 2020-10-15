<template>
  <div class="CarTypeInput">
    <h2>Tell us about your car</h2>
    <p>Select your car's year, make, model and enter its current mileage</p>
    <br/>
    <form @submit.prevent.stop="search" class="pure-form pure-form-aligned">
      <div class="group">
        <v-select class="select-style" placeholder="Year" v-model="year" :options="years" :required="!year"/>
      </div>
      <div class="group">
        <v-select @input="getModels" class="select-style" placeholder="Make" v-model="make" :options="makes" :required="!make"/>
      </div>
      <div class="group">
        <v-select class="select-style" placeholder="Model" v-model="model" :reset-on-options-change="true" :options="models" :required="!model"/>
      </div>
      <div class="group">
        <input type="text" v-model="mileage" required>
        <span class="highlight"/>
        <span class="bar"/>
        <label>Mileage</label>
      </div>
    </form>
    <button type="submit" class="btn btn-outline-warning" @click="next">Next</button> 
    <button type="submit" v-on:click="cancel" class="btn btn-outline-secondary">Cancel</button>
    <br/>
    <br/>
  </div>
</template>

<script>
import vSelect from 'vue-select'

export default {
  name: 'CarTypeInput',
  components: {
    vSelect
  },
  computed: {
    years() {
      const year = new Date().getFullYear()
      return Array.from({length: year - 1960}, (value, index) => year - index)
    },
    makes() {
      return this.$store.state.makes
    },
    models(){
      return this.$store.state.models
    }
  },
  data() {
    return {
      year: '',
      make: '',
      model: '',
      mileage: '',
      err: null,
    }
  },
  methods: {
    async getModels(make) {
      await this.$store.dispatch('getModels', make)
    },
    async cancel() {
      this.$emit('cancel')
    },
    next() {
      const data = {
        year: this.year,
        make: this.make,
        model: this.model,
        mileage: this.mileage
      }
      this.$emit('CarTypeInputFinish', data);
    }
  },
  async created() {
    this.err = await this.$store.dispatch('getMakes');
  }
}
</script>

<style scoped>
.select-style .vs_search::placeholder,
.select-style .vs_dropdown-menu,
.select-style {
  width: 300px;
}

button{
  width: 100px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.CarTypeInput {
  position: absolute;
  /* top: 40%; */
  left: 30%;
  /* margin-top: -100px; */
  margin-left: -50px;
  width: 50%;
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
  background-color: #ffffff;
}

/* form starting stylings ------------------------------- */
  .group            { 
    position:relative; 
    margin-bottom:45px; 
    width: 100%;
    left: 25%;
    margin-left: 30px;
  }
  input               {
    font-size:18px;
    padding:10px 10px 10px 5px;
    display:block;
    width:300px;
    border:none;
    border-bottom:1px solid #757575;
  }
  input:focus         { outline:none; }

  /* LABEL ======================================= */
  label                {
    color:#999; 
    font-size:18px;
    font-weight:normal;
    position:absolute;
    pointer-events:none;
    left:5px;
    top:10px;
    transition:0.2s ease all; 
    -moz-transition:0.2s ease all; 
    -webkit-transition:0.2s ease all;
  }

  /* active state */
  input:focus ~ label, input:valid ~ label        {
    top:-20px;
    font-size:14px;
    color:#5264AE;
  }

  /* BOTTOM BARS ================================= */
  .bar    { position:relative; display:block; width:300px; }
  .bar:before, .bar:after     {
    content:'';
    height:2px; 
    width:0;
    bottom:1px; 
    position:absolute;
    background:#5264AE; 
    transition:0.2s ease all; 
    -moz-transition:0.2s ease all; 
    -webkit-transition:0.2s ease all;
  }
  .bar:before {
    left:50%;
  }
  .bar:after {
    right:50%; 
  }

  /* active state */
  input:focus ~ .bar:before, input:focus ~ .bar:after {
    width:50%;
  }

  /* HIGHLIGHTER ================================== */
  .highlight {
    position:absolute;
    height:60%; 
    width:100px; 
    top:25%; 
    left:0;
    pointer-events:none;
    opacity:0.5;
  }

  /* active state */
  input:focus ~ .highlight {
    -webkit-animation:inputHighlighter 0.3s ease;
    -moz-animation:inputHighlighter 0.3s ease;
    animation:inputHighlighter 0.3s ease;
  }

  /* ANIMATIONS ================ */
  @-webkit-keyframes inputHighlighter {
      from { background:#5264AE; }
    to    { width:0; background:transparent; }
  }
  @-moz-keyframes inputHighlighter {
      from { background:#5264AE; }
    to    { width:0; background:transparent; }
  }
  @keyframes inputHighlighter {
      from { background:#5264AE; }
    to    { width:0; background:transparent; }
  }
</style>