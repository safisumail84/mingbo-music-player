export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // 1. CORS Headers so your UI isn't blocked
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.FRONTEND_URL || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const targetUrl = url.searchParams.get('url');

    // 2. HEALTHCHECK
    if (url.pathname === "/healthz") {
      return new Response(JSON.stringify({ ok: true, engine: "cloudflare-worker" }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    if (!targetUrl) {
      return new Response("Missing 'url' parameter", { status: 400, headers: corsHeaders });
    }

    // 3. EXTRACT METADATA & STREAM URL
    if (url.pathname === "/api/info") {
      try {
        const apiRes = await fetch("https://co.wuk.sh/api/json", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: targetUrl,
            isAudioOnly: true
          })
        });

        if (!apiRes.ok) throw new Error("Failed to extract from public API");
        const data: any = await apiRes.json();
        
        return new Response(JSON.stringify({
          title: "Track Queued", 
          url: targetUrl,
          streamUrl: data.url
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // 4. AUDIO STREAM PROXY
    if (url.pathname === "/api/stream") {
       try {
           const audioRes = await fetch(targetUrl, {
               headers: {
                   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" 
               }
           });
           
           return new Response(audioRes.body, {
               headers: {
                   ...corsHeaders,
                   "Content-Type": audioRes.headers.get("Content-Type") || "audio/mpeg",
                   "Accept-Ranges": "bytes"
               }
           });
       } catch (err) {
           return new Response("Stream failed", { status: 500, headers: corsHeaders });
       }
    }

    return new Response("Endpoint not found", { status: 404, headers: corsHeaders });
  },
};