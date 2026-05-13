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
    const isLoading = ref(false);
    
    const audioPlayer = new Audio();

    const currentTrack = computed(() => queue.value[currentIndex.value]);

    // 👇 THIS IS THE FUNCTION WE FIXED 👇
    const addTrack = async (inputUrl: string) => {
        isLoading.value = true; 
        try {
            const response = await fetch(`https://music-bot-api.koncetkje.workers.dev/api/info?url=${inputUrl}`);
            const trackData = await response.json();
            
            // ✨ THE FIX: Check if the backend sent us an error before adding!
            if (trackData.error) {
                alert("API Error: " + trackData.error);
                return; // Stop right here, do NOT add to queue
            }

            queue.value.push(trackData);

            if (queue.value.length === 1) {
                playTrack(0);
            }
        } catch (err) {
            // Catch complete network failures too
            alert("Network error: Could not reach the API.");
        } finally {
            isLoading.value = false; 
        }
    };
    // 👆 END OF FIX 👆

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