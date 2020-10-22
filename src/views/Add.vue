<template>
  <div class="add">
    <div v-if="step==0">
      <CarTypeInput v-on:cancel="cancel" v-on:CarTypeInputFinish="typeInputFinish"/>
    </div>
    <div v-else-if="step==1">
      <CarHistoryInput v-on:cancel="cancel" v-on:CarHistoryInputFinish="historyInputFinish"/>
      <div v-if="err">
        <p>Something went wrong. Please try again</p>
      </div>
    </div>
  </div>
</template>

<script>
import CarTypeInput from '@/components/CarTypeInput'
import CarHistoryInput from '@/components/CarHistoryInput'
export default {
  name: 'Add',
  components: {
    CarTypeInput,
    CarHistoryInput
  },
  computed: {
  },
  data() {
    return {
      step: 0,
      carInfo: {},
      err: null
    }
  },
  methods: {
    typeInputFinish(data) {
      Object.keys(data).forEach((key) => {
        this.carInfo[key] = data[key]
      })
      this.step += 1
    },
    async historyInputFinish(data) {
      Object.keys(data).forEach((key) => {
        this.carInfo[key] = data[key]
      })

      // make call to save info
      const response = await this.$store.dispatch('saveCar', this.carInfo)

      if (response != '') {
        this.err = response
        console.log('Error: ', response)
      } else {
        this.$router.push('/')
      }
    },
    cancel() {
      this.$router.push('/')
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

.add{
  margin-top: 15px;
}

button{
  width: 100px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.CarDescription {
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