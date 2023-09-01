<template>
  <div class="box1">
    <div id="miniClicks"></div>
  </div>
</template>

<script setup>
import { createChart } from 'lightweight-charts';
const theme = useTheme()
import {computed, onMounted} from "vue";
import {useTheme} from "vuetify";

const props = defineProps({
  loading: { type: String, required: true },
  clicks: { type: Array, required: true }
})


onMounted(() => {
  if(props.clicks.length > 0){
    buildChart()
  }
})

function arrMerged(arr) {
  return arr.reduce((acc, cur, i) => {
    const item = i > 0 && acc.find((e) => e.time === cur.time)
    if (item) item.value += cur.value;
    else acc.push({ time: cur.time, value: cur.value }); // don't push cur here
    return acc.filter(e => e.time !== '')
  }, []);
}

function DP (arr) {
  let o = []
  arr.forEach((e) =>{
    let d = Date.parse(e.time)
    o.push({
      time: d / 1000,
      value: e.value
    })
  })
  return o.sort((date1, date2) => date1.time - date2.time);
}



function buildChart(){
  const miniClicksChart = document.getElementById('miniClicks')

  if(miniClicksChart){
    miniClicksChart.innerHTML = ''
  }

  const miniClicks = createChart(miniClicksChart, miniChartOptions);

  const miniClicksSeries = miniClicks.addAreaSeries({
    topColor: 'rgba(46, 147, 250, 0.4)',
    bottomColor: 'rgba(41, 98, 255, 0.1)',
    lineColor: '#2E93fA',
    lineWidth: 3,
    crossHairMarkerVisible: false,
  })

  miniClicksSeries.setData(DP(arrMerged(props.clicks)));

  miniClicks.timeScale().fitContent();
}
</script>

<style scoped>

</style>
