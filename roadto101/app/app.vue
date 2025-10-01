<template>
  <div class="p-6 grid gap-8 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold">roadto101 – live přehled</h1>

    <section>
      <h2 class="text-xl font-semibold">Do 101 – polokruh</h2>
      <div class="hemi-grid">
        <CoalitionTo101
            v-for="c in coalitions"
            :key="c.id"
            :name="c.name"
            :color="c.color"
            :seats="coalitionSeats[c.id]"
        />
      </div>
    </section>


    <section class="grid gap-2">
      <h2 class="text-xl font-semibold">Podíly koalic v čase</h2>
      <LineTally :series="series" :coalitions="coalitions"/>
    </section>


    <section class="grid gap-2">
      <h2 class="text-xl font-semibold">Regionální rozpad (stacked bar)</h2>
      <StackedBarShare :regions="regions" :coalitions="coalitions"/>
    </section>


    <section class="grid gap-2">
      <h2 class="text-xl font-semibold">Volební účast (průběžně)</h2>
      <PieTurnout :turnout-pct="turnoutNow"/>
    </section>
  </div>
</template>


<script setup lang="ts">
import {
  COALITIONS as coalitions,
  TALLY_SERIES as series,
  REGION_BREAKDOWN as regions,
  TURNOUT_TIMELINE
} from '../data/mock';
import LineTally from '@/components/charts/LineTally.vue';
import StackedBarShare from '@/components/charts/StackedBarShare.vue';
import PieTurnout from '@/components/charts/PieTurnout.vue';
import type {CoalitionId} from '../types/election'
import CoalitionTo101 from "~/components/charts/CoalitionTo101.vue";

const coalitionSeats: Record<CoalitionId, number> = {
  KOALICE_A: 92,
  KOALICE_B: 87,
  KOALICE_C: 65,
}

// zvol aktuální účast jako poslední bod z timeline (mock)
const turnoutNow = TURNOUT_TIMELINE.at(-1)?.turnoutPct ?? 0;
</script>


<style scoped>
.max-w-6xl {
  max-width: 72rem;
}

.hemi-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, 1fr);
  align-items: start;
}

/* Chceš fixně 3 sloupce na větších displejích? */
@media (min-width: 256px) {
  .hemi-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
  }

;
}
</style>