import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Track {
    title: string;
    thumbnail: string;
    url: string;
}

export const usePlayerStore = defineStore('player', () => {
    // State
    const queue = ref<Track[]>([]);
    const currentIndex = ref(0);
    const isPlaying = ref(false);
    
    // The native HTML5 Audio element
    const audioPlayer = new Audio();

    // Getters
    const currentTrack = computed(() => queue.value[currentIndex.value]);

    // Actions
    const addTrack = async (inputUrl: string) => {
        // 1. Fetch metadata from your backend
        const response = await fetch(`http://localhost:3000/api/info?url=${inputUrl}`);
        const trackData = await response.json();
        
        // 2. Add to queue
        queue.value.push(trackData);

        // 3. If nothing is playing, start playing immediately
        if (queue.value.length === 1) {
            playTrack(0);
        }
    };

    const playTrack = (index: number) => {
        if (!queue.value[index]) return;
        
        currentIndex.value = index;
        // Point the audio source to your backend stream API
        audioPlayer.src = `http://localhost:3000/api/stream?url=${queue.value[index].url}`;
        audioPlayer.play();
        isPlaying.value = true;
    };

    const nextTrack = () => {
        if (currentIndex.value < queue.value.length - 1) {
            playTrack(currentIndex.value + 1);
        } else {
            isPlaying.value = false; // Queue finished
        }
    };

    // Auto-play next song when current finishes (The Bot Behavior)
    audioPlayer.onended = () => {
        nextTrack();
    };

    return { queue, currentTrack, isPlaying, addTrack, playTrack, nextTrack };
});