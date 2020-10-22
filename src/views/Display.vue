<template>
  <div class="Display" v-if='car'>
    <p>{{ car.make }} {{ car.model }}</p>
    <p>Current mileage: {{car.mileage}} miles</p>

      <ul>
        <li v-for="item in car.maintenanceItems" v-bind:key='item.title'>
          <div class="box">
            <div class="lang">
              <a v-bind:href="'https://www.google.com/maps/search/'+ item.title.replace(' ', '%20')">
                {{item.title}}
              </a>
            </div>
            <div>The last mileage when you checked {{item.name}} is: {{item.last}} miles </div>
            <div class="grid">
              <div class="logo">
                <img :src="getImgUrl(item.logo)" height="50px" width="50px">
              </div>
              <div class="bar">
                <div class="progress" v-bind:style = "{'background':item.color, 'width':item.percent+'%'}"></div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <br><br><br><br><br>
    </div>
</template>

<script>
export default {
  name: 'Display',
  computed: {
    car() {
      return this.$store.state.car;
    }
  },
  methods: {
    getImgUrl(path){
      var images = require.context('../assets/', false, /\.png$/)
      return images('./' + path + ".png")
    }


  },
  async created() {
    await this.$store.dispatch('getCar', this.$route.params.id)
  }
}
</script>

<style scoped>
body{
	font-family: sans-serif;
}

*{
	padding: 0;
	margin: 0;
	box-sizing:border-box;
}

.logo{
  grid-area: side;
  margin-top: 15px;
}

.grid{
 display: grid;
 grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: 
    "side main main main main main main main main";
}

.box{
	width: 800px;
	padding: 20px;
	margin:10px auto;
	background:#f3f3f3;
	box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.1);
}

ul li{
	list-style-type: none;
	padding:10px;
}

.lang{
	margin:5px;
	font-size: 20px;
}

.bar{
	width: 100%;
	background:#dfdfdf;
	overflow: hidden;
	padding:5px;
  margin-top:20px;
  grid-area: main;
  height:40px;
}

.progress{
	float:left;
	padding:15px;
    
}

.percent{
	float: right;
	font-weight: 600;
	height: 30px;
	line-height: 30px;
}
</style>