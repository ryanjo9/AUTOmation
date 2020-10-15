<template>
  <div class="Display">
    <div class="box">
      <ul>
        <li v-for="skill in skills" v-bind:key=skill>
          <div class="lang">{{skill.lang}}</div>
          <div class="bar">
            <div class="progress" v-bind:style = "{'background':skill.color, 'width':skill.percent+'%'}"></div>
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
//   computed: {
//     oilChange() {
//       // some calucation
//       return 90
//     },
//   },
  data() {
    return {
          skills:[
          { lang:"Oil Change",  percent:90,    	color:"#ec407a"	},
          { lang:"Transmission Fluid", 			percent:76,   color:"#f4511e"	},
          { lang:"Tire Rotation", 	percent:84,   color:"#512da8"	},
          { lang:"Air Filter",	percent:94,   color:"#f57c00"	},
          { lang:"Coolant Flush",		 	percent:93,   color:"#0288d1"	}
          ]
    }
  }
//   calculatePercent(current, interval, lastDone) {
//     const milesSince = current - lastDone
//     return milesSince / inverval * 100
//   }
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