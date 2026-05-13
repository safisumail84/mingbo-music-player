<template>
  <div class="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
    <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="onSubmit">
      <input
        v-model="inputUrl"
        class="w-full flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-500"
        placeholder="Paste a YouTube or SoundCloud URL…"
        autocomplete="off"
        spellcheck="false"
      />
      <button
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        :disabled="store.isLoading"
      >
        {{ store.isLoading ? 'Adding…' : 'Add to Queue' }}
      </button>
    </form>

    <p v-if="store.error" class="mt-2 text-sm text-rose-400">{{ store.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePlayerStore } from '../stores/player';

const store = usePlayerStore();
const inputUrl = ref('');

async function onSubmit() {
  const url = inputUrl.value.trim();
  if (!url) return;
  await store.addTrack(url);
  inputUrl.value = '';
}
</script>

