import youtubedl from 'youtube-dl-exec';

export async function getTrackInfo(url: string) {
    try {
        const info = await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            extractAudio: true,
            noPlaylist: true, // <-- ADD THIS: Stops infinite radio mixes from hanging
        }) as any; 
        
        return {
            title: info.title,
            thumbnail: info.thumbnail,
            duration: info.duration,
            url: url, 
        };
    } catch (error) {
        console.error("Extraction error:", error);
        throw error;
    }
}