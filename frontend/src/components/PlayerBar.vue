<template>
  <div class="fixed inset-x-0 bottom-0 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur">
    <div class="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
      <div class="flex min-w-0 flex-1 items-center gap-3">
        <img
          v-if="store.currentTrack?.thumbnail"
          :src="store.currentTrack.thumbnail"
          alt=""
          class="h-10 w-10 rounded object-cover"
          referrerpolicy="no-referrer"
        />
        <div v-else class="h-10 w-10 rounded bg-zinc-800"></div>

        <div class="min-w-0">
          <p class="truncate text-sm text-zinc-100">
            {{ store.currentTrack?.title ?? 'Nothing playing' }}
          </p>
          <p class="truncate text-xs text-zinc-500">
            {{ store.isPlaying ? 'Playing' : store.currentTrack ? 'Paused' : 'Idle' }}
            <span v-if="store.isLoading" class="ml-2">Loading…</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-500 disabled:opacity-50"
          type="button"
          :disabled="!store.currentTrack"
          @click="store.togglePlayPause()"
        >
          {{ store.isPlaying ? 'Pause' : 'Play' }}
        </button>
        <button
          class="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-500 disabled:opacity-50"
          type="button"
          :disabled="store.queue.length === 0 || store.currentIndex >= store.queue.length - 1"
          @click="store.nextTrack()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '../stores/player';

const store = usePlayerStore();
</script>

