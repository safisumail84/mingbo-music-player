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
    const isLoading = ref(false); // ✨ Added loading state
    
    const audioPlayer = new Audio();

    const currentTrack = computed(() => queue.value[currentIndex.value]);

    const addTrack = async (inputUrl: string) => {
        isLoading.value = true; // Start loading
        try {
            const response = await fetch(`https://music-bot-api.koncetkje.workers.dev/api/info?url=${inputUrl}`);
            const trackData = await response.json();
            
            queue.value.push(trackData);

            if (queue.value.length === 1) {
                playTrack(0);
            }
        } finally {
            isLoading.value = false; // Stop loading even if it errors
        }
    };

    const playTrack = (index: number) => {
        if (!queue.value[index]) return;
        
        currentIndex.value = index;
        audioPlayer.src = `https://music-bot-api.koncetkje.workers.dev/api/stream?url=${queue.value[index].url}`;
        audioPlayer.play();
        isPlaying.value = true;
    };

    const nextTrack = () => {
        if (currentIndex.value < queue.value.length - 1) {
            playTrack(currentIndex.value + 1);
        } else {
            isPlaying.value = false;
        }
    };

    // ✨ Added toggle for the Play/Pause button
    const togglePlayPause = () => {
        if (isPlaying.value) {
            audioPlayer.pause();
            isPlaying.value = false;
        } else {
            audioPlayer.play();
            isPlaying.value = true;
        }
    };

    const removeTrack = (index: number) => {
        queue.value.splice(index, 1);
    };

    audioPlayer.onended = () => {
        nextTrack();
    };

    // ✨ Make sure we export EVERYTHING the UI needs
    return { 
        queue, 
        currentIndex, 
        currentTrack, 
        isPlaying, 
        isLoading, 
        addTrack, 
        playTrack, 
        nextTrack, 
        removeTrack, 
        togglePlayPause 
    };
});