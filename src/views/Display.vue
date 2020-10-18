<template>
  <div class="Display" v-if='car'>
    <p>{{ car.make }} {{ car.model }}</p>
    <div class="box">
      <ul>
        <li v-for="item in car.maintenanceItems" v-bind:key='item.color'>
          <div class="lang">{{item.title}}</div>
          <div class="bar">
            <div class="progress" v-bind:style = "{'background':item.color, 'width':item.percent+'%'}"></div>
            <!-- <span class="percent">{{skill.percent}}%</span> -->
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Display',
  async getData() {
    // return axios.get('/data')
    return {
      make: 'Toyota',
      model: 'Camry',
      mileage: 25555
    }
  },
  computed: {
    car() {
      return this.$store.state.car;
    }
  },
  async created() {
    await this.$store.dispatch('getCar', this.$route.params.id)
    console.log('car: ', this.$store.state.car)
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

.box{
	width: 800px;
	padding: 40px;
	margin:50px auto;
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