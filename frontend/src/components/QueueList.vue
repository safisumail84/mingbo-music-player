<template>
  <div class="rounded-lg border border-zinc-800 bg-zinc-900/40">
    <div class="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
      <h2 class="text-sm font-semibold text-zinc-200">Queue</h2>
      <span class="text-xs text-zinc-500">{{ store.queue.length }} track(s)</span>
    </div>

    <div v-if="store.queue.length === 0" class="px-4 py-6 text-sm text-zinc-500">
      Queue is empty. Add a link above.
    </div>

    <ul v-else class="divide-y divide-zinc-800">
      <li
        v-for="(track, idx) in store.queue"
        :key="`${track.url}-${idx}`"
        class="flex items-center gap-3 px-4 py-3"
      >
        <img
          v-if="track.thumbnail"
          :src="track.thumbnail"
          alt=""
          class="h-10 w-10 rounded object-cover"
          referrerpolicy="no-referrer"
        />
        <div v-else class="h-10 w-10 rounded bg-zinc-800"></div>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm text-zinc-100">
            <span v-if="idx === store.currentIndex" class="mr-2 text-indigo-400">▶</span>
            {{ track.title }}
          </p>
          <p class="truncate text-xs text-zinc-500">{{ track.url }}</p>
        </div>

        <button
          class="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-200 hover:border-zinc-500"
          type="button"
          @click="store.playTrack(idx)"
        >
          Play
        </button>
        <button
          class="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-200 hover:border-zinc-500"
          type="button"
          @click="store.removeTrack(idx)" 
        >
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '../stores/player';

const store = usePlayerStore();
</script>