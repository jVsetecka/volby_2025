<template>
  <div class="p-6 grid gap-8 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold">roadto101 – live přehled</h1>


    <section class="grid gap-2">
      <h2 class="text-xl font-semibold">Podíly koalic v čase</h2>
      <LineTally :series="series" :coalitions="coalitions" />
    </section>


    <section class="grid gap-2">
      <h2 class="text-xl font-semibold">Regionální rozpad (stacked bar)</h2>
      <StackedBarShare :regions="regions" :coalitions="coalitions" />
    </section>


    <section class="grid gap-2">
      <h2 class="text-xl font-semibold">Volební účast (průběžně)</h2>
      <PieTurnout :turnout-pct="turnoutNow" />
    </section>
  </div>
</template>


<script setup lang="ts">
import { COALITIONS as coalitions, TALLY_SERIES as series, REGION_BREAKDOWN as regions, TURNOUT_TIMELINE } from '../data/mock';
import LineTally from '@/components/charts/LineTally.vue';
import StackedBarShare from '@/components/charts/StackedBarShare.vue';
import PieTurnout from '@/components/charts/PieTurnout.vue';


// zvol aktuální účast jako poslední bod z timeline (mock)
const turnoutNow = TURNOUT_TIMELINE[TURNOUT_TIMELINE.length - 1].turnoutPct;
</script>


<style scoped>
.max-w-6xl{ max-width:72rem; }
</style>