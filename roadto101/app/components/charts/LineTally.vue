<template>
  <ClientOnly>
    <div ref="el" style="width:100%;height:18rem"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
import {ref, watch, onMounted, onBeforeUnmount, nextTick} from 'vue'
import * as echarts from 'echarts/core'
import {LineChart} from 'echarts/charts'
import {GridComponent, LegendComponent, TooltipComponent, DataZoomComponent} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'
import type {CoalitionSeries, Coalition} from '../../../types/election'

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, DataZoomComponent, CanvasRenderer])

const props = defineProps<{ series: CoalitionSeries[]; coalitions: Coalition[] }>()

const el = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

onMounted(async () => {
  await nextTick()                              // počkej, až bude mít element reálnou velikost
  if (!el.value) return
  chart = echarts.init(el.value)                // nebo echarts.init(el.value, undefined, { renderer: 'canvas' })
  render()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(() => props.series, render, {deep: true})

function handleResize() {
  chart?.resize()
}

function render() {
  if (!chart) return
  const colorMap = Object.fromEntries(props.coalitions.map(c => [c.id, c.color]))

  chart.setOption({
    grid: {left: 40, right: 20, top: 30, bottom: 50},
    tooltip: {trigger: 'axis'},
    legend: {top: 0},
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        formatter: (val: string) => new Date(val).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    },
    yAxis: {type: 'value', name: '% hlasů'},
    dataZoom: [{type: 'inside'}, {type: 'slider'}],
    series: props.series.map(s => ({
      name: props.coalitions.find(c => c.id === s.coalitionId)?.name,
      type: 'line',
      showSymbol: false,
      smooth: true,
      lineStyle: {width: 3},
      itemStyle: {color: colorMap[s.coalitionId]},
      data: s.points.map(p => [p.t, p.sharePct])
    }))
  })

  chart.resize() // jistota po prvním renderu
}
</script>