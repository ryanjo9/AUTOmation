<template>
  <div class="CarHistoryInput">
    <h2>Now a bit about your car's history</h2>
    <p>Enter the average miles you drive this car in one year</p>
    <form @submit.prevent.stop="search" class="pure-form pure-form-aligned">
      <div class="group">
        <input type="text" v-model="milesPerYear" required>
        <span class="highlight"/>
        <span class="bar"/>
        <label>Average Miles Per Year</label>
      </div>
      <p>Enter either the last mileage each service was done (you can skip this if you don't remember)</p>
      <div class="group">
        <input type="text" v-model="oil" required>
        <span class="highlight"/>
        <span class="bar"/>
        <label>Oil Change</label>
      </div>
      <div class="group">
        <input type="text" v-model="tire" required>
        <span class="highlight"/>
        <span class="bar"/>
        <label>Tire Rotation</label>
      </div>
      <div class="group">
        <input type="text" v-model="airFilter" required>
        <span class="highlight"/>
        <span class="bar"/>
        <label>Engine Air Filter</label>
      </div>
      <div class="group">
        <input type="text" v-model="transmission" required>
        <span class="highlight"/>
        <span class="bar"/>
        <label>Transmission Flush</label>
      </div>
      <div class="group">
        <input type="text" v-model="coolant" required>
        <span class="highlight"/>
        <span class="bar"/>
        <label>Coolant Flush</label>
      </div>
    </form>
    <button type="submit" class="btn btn-outline-warning" @click="next">Submit</button>
    <button type="submit" v-on:click="cancel" class="btn btn-outline-secondary">Cancel</button>
    <!-- <br/>
    <br/>
    <br/> -->
  </div>
</template>

<script>
// import vSelect from 'vue-select'

export default {
  name: 'CarHistoryInput',
  components: {
    // vSelect
  },
  computed: {
  },
  data() {
    return {
      milesPerYear: null,
      oil: null,
      tire: null,
      airFilter: null,
      transmission: null,
      coolant: null
    }
  },
  methods: {
    async cancel() {
      this.$emit('cancel')
    },
    next() {
      const data = {
        milesPerYear: this.milesPerYear,
        oil: this.oil,
        tire: this.tire,
        airFilter: this.airFilter,
        transmission: this.transmission,
        coolant: this.coolant
      }
      this.$emit('CarHistoryInputFinish', data);
    }
  },
  async created() {
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

.CarHistoryInput {
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
  margin-bottom: 10px;
  padding-bottom: 10px;
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