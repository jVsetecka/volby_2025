<template>
  <ClientOnly>
    <div ref="el" style="width:100%;height:16rem"></div>
  </ClientOnly>
</template>
<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, nextTick, watch} from 'vue'
import * as echarts from 'echarts/core'
import {PieChart} from 'echarts/charts'
import {LegendComponent, TooltipComponent} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'

echarts.use([PieChart, LegendComponent, TooltipComponent, CanvasRenderer])
const props = defineProps<{ turnoutPct: number }>()
const el = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null
onMounted(async () => {
  await nextTick();
  if (!el.value) return;
  chart = echarts.init(el.value);
  render();
  window.addEventListener('resize', () => chart?.resize())
})
onBeforeUnmount(() => chart?.dispose())
watch(() => props.turnoutPct, render)

function render() {
  if (!chart) return
  const turnout = Math.max(0, Math.min(100, props.turnoutPct))
  chart.setOption({
    legend: {top: 0}, tooltip: {trigger: 'item'},
    series: [{
      name: 'Účast', type: 'pie', radius: ['50%', '80%'], label: {show: true, formatter: '{b}: {d}%'},
      data: [{value: turnout, name: 'Odhlasováno'}, {value: 100 - turnout, name: 'Zbývá'}]
    }]
  })
  chart.resize()
}
</script>