<template>
  <ClientOnly>
    <div class="to101-hemi">
      <div v-if="name" class="hdr">
        <span class="nm">{{ name }}</span>
        <span class="nums">{{ seats }} / {{ total }} — chybí <strong>{{ need }}</strong></span>
      </div>
      <div ref="el" class="chart"></div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, nextTick, watch, computed} from 'vue'
import * as echarts from 'echarts/core'
import {ScatterChart} from 'echarts/charts'
import {GridComponent, TooltipComponent} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'


echarts.use([ScatterChart, GridComponent, TooltipComponent, CanvasRenderer])


const props = defineProps<{
  name?: string
  color: string
  seats: number // kolik má koalice
  total?: number // default 200
  target?: number // default 101
  rows?: number[] // rozdělení do řad; výchozí pro 101: [24,22,20,18,17]
  dotSize?: number // px
}>()


const total = computed(() => props.total ?? 200)
const target = computed(() => props.target ?? 101)
const rowLayout = computed(() => props.rows ?? [36,34,32,30,28,24,16])
const clampedSeats = computed(() => Math.max(0, Math.min(props.seats, total.value)))
const need = computed(() => Math.max(0, total.value - clampedSeats.value))
watch([() => props.seats, () => props.color, total, rowLayout, target], render)

function lighten(hex: string, ratio = 0.6) {
  const m = hex.replace('#',''); const num = parseInt(m.length===3 ? m.split('').map(x=>x+x).join('') : m, 16)
  const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255
  const mix = (c:number) => Math.round(c + (255 - c) * ratio)
  return `#${[mix(r),mix(g),mix(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}`
}

function buildPositions(totalCount: number, rows: number[]) {
  const pts: { x: number; y: number; idx: number }[] = []
  const rowCount = rows.length
  const outer = 1.0
  const inner = 0.3
  for (let r = 0; r < rowCount; r++) {
    const seatsInRow = rows[r]
    const radius = inner + (outer - inner) * ((rowCount - 1 - r) / Math.max(1, rowCount - 1))
    for (let j = 0; j < seatsInRow && pts.length < totalCount; j++) {
      const t = seatsInRow === 1 ? 0.5 : j / (seatsInRow - 1) // 0..1
      const ang = Math.PI - t * Math.PI // π..0 (levá→pravá)
      const x = radius * Math.cos(ang)
      const y = radius * Math.sin(ang)
      pts.push({x, y, idx: pts.length})
    }
  }
  return pts
}


const points = computed(() => buildPositions(total.value, rowLayout.value))


const el = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null


function render() {
  if (!chart) return
  const dataPts = points.value.slice(0, total.value)
  const cap      = Math.min(target.value ?? 101, total.value)
  const acquired = Math.min(clampedSeats.value, cap)     // kolik z cap je už získáno (plná barva)
  const needed   = Math.max(0, cap - acquired)           // kolik z cap chybí (světlá barva)
  const lightCol = lighten(props.color, 0.7)   // světlejší varianta

  const data = dataPts.map((p, i) => {
    let color = '#e5e7eb'                      // default šedá
    if (i < acquired) color = props.color      // získané
    else if (i < acquired + needed) color = lightCol // chybí do 101
    return { value: [p.x, p.y], itemStyle: { color, borderColor: '#d1d5db' } }
  })

  const pad = Math.ceil((props.dotSize ?? 10) / 2) + 2

  chart.setOption({
    animation: false,
    grid: {left: pad, right: pad, top: pad, bottom: pad},
    xAxis: {show: false, min: -1.08, max: 1.08},
    yAxis: {show: false, min: 0.08, max: 1.08},
    tooltip: {show: false},
    series: [{
      type: 'scatter',
      symbol: 'circle',
      symbolSize: props.dotSize ?? 10,
      data,
      silent: true,
      clip: false,
    }]
  }, true)
  chart.resize()
}


onMounted(async () => {
  await nextTick()
  if (!el.value) return
  chart = echarts.init(el.value)
  render()
  window.addEventListener('resize', () => chart?.resize())
})


onBeforeUnmount(() => {
  chart?.dispose()
})


watch([() => props.seats, () => props.color, total, rowLayout], render)
</script>

<style scoped>
.to101-hemi {
  display: grid;
  gap: .5rem;
}

.hdr {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: .9rem;
}

.chart {
  width: 100%;
  height: 160px;
}

.nm {
  font-weight: 600;
}

.nums {
  color: #6b7280;
}
</style>
