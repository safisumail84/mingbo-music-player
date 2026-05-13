<template>
  <div class="min-h-full">
    <div class="mx-auto max-w-5xl px-4 py-6">
      <h1 class="text-2xl font-semibold tracking-tight">Web Music Bot</h1>
      <p class="mt-1 text-sm text-zinc-400">
        Paste a YouTube or SoundCloud link, build a queue, and stream via the backend proxy.
      </p>

      <div class="mt-6">
        <SearchBar />
      </div>

      <div class="mt-6 pb-24">
        <QueueList />
      </div>
    </div>

    <PlayerBar />
  </div>
</template>

<script setup lang="ts">
import PlayerBar from './components/PlayerBar.vue';
import QueueList from './components/QueueList.vue';
import SearchBar from './components/SearchBar.vue';
</script>

