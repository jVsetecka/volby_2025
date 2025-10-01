<template>
  <ClientOnly>
    <div ref="el" style="width:100%;height:18rem"></div>
  </ClientOnly>
</template>
<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, nextTick, watch} from 'vue'
import * as echarts from 'echarts/core'
import {BarChart} from 'echarts/charts'
import {GridComponent, LegendComponent, TooltipComponent} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'
import type {RegionShare, Coalition} from '../../../types/election'

echarts.use([BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])
const props = defineProps<{ regions: RegionShare[]; coalitions: Coalition[] }>()
const el = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null
onMounted(async () => {
  await nextTick();
  if (!el.value) return;
  chart = echarts.init(el.value);
  render();
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  chart?.dispose()
})
watch(() => props.regions, render, {deep: true})

function resize() {
  chart?.resize()
}

function render() {
  if (!chart) return
  chart.setOption({
    grid: {left: 40, right: 20, top: 30, bottom: 40},
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
    legend: {top: 0},
    xAxis: {type: 'category', data: props.regions.map(r => r.region)},
    yAxis: {type: 'value', name: '% hlasů'},
    series: props.coalitions.map(c => ({
      name: c.name, type: 'bar', stack: 'share',
      itemStyle: {color: c.color},
      data: props.regions.map(r => r.shares[c.id])
    }))
  })
  chart.resize()
}
</script>∆