import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface MonetizationCheckRequest {
  url: string;
}

interface MonetizationResult {
  isMonetized: boolean;
  confidence: "high" | "medium" | "low";
  indicators: string[];
  channelInfo?: {
    title?: string;
    subscriberCount?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { url }: MonetizationCheckRequest = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    const videoId = extractVideoId(cleanUrl);
    const channelHandle = extractChannelHandle(cleanUrl);
    const channelId = extractChannelId(cleanUrl);

    if (!videoId && !channelHandle && !channelId) {
      return new Response(
        JSON.stringify({ error: "Invalid YouTube URL. Please provide a valid video or channel URL." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let targetUrl: string;
    if (videoId) {
      targetUrl = `https://www.youtube.com/watch?v=${videoId}`;
    } else if (channelHandle) {
      targetUrl = `https://www.youtube.com/@${channelHandle}`;
    } else {
      targetUrl = `https://www.youtube.com/channel/${channelId}`;
    }

    console.log('Fetching:', targetUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      console.error('YouTube responded with status:', response.status);
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ 
            error: "Channel or video not found",
            details: "The provided YouTube URL does not exist or is not accessible. Please check the URL and try again."
          }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`YouTube returned status ${response.status}`);
    }

    const html = await response.text();
    console.log('Received HTML length:', html.length);

    const result = analyzeMonetization(html);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error checking monetization:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to check monetization",
        details: error instanceof Error ? error.message : "Unknown error. YouTube might be blocking automated requests.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
    /(?:youtube\.com\/v\/)([\w-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function extractChannelHandle(url: string): string | null {
  const pattern = /(?:youtube\.com\/@)([\w-]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

function extractChannelId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/channel\/)([\w-]+)/,
    /(?:youtube\.com\/c\/)([\w-]+)/,
    /(?:youtube\.com\/user\/)([\w-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function analyzeMonetization(html: string): MonetizationResult {
  const indicators: string[] = [];
  let isMonetized = false;
  let confidence: "high" | "medium" | "low" = "low";

  if (html.includes('"isMonetized":true')) {
    indicators.push("Direct monetization flag detected");
    isMonetized = true;
    confidence = "high";
  }

  if (html.includes('"paidContentOverlay"')) {
    indicators.push("Paid content overlay found");
    isMonetized = true;
    confidence = "high";
  }

  if (html.includes('adSlot') || html.includes('adModule')) {
    indicators.push("Ad slots detected");
    isMonetized = true;
    if (confidence !== "high") confidence = "medium";
  }

  if (html.includes('"playerAds"')) {
    indicators.push("Player ads configuration found");
    isMonetized = true;
    confidence = "high";
  }

  if (html.includes('"adPlacements"')) {
    indicators.push("Ad placements detected");
    isMonetized = true;
    if (confidence !== "high") confidence = "medium";
  }

  if (html.includes('yt.config_.PLAYER_CONFIG')) {
    const playerConfigMatch = html.match(/"adSafetyReason":(\{[^}]+\})/);
    if (playerConfigMatch) {
      indicators.push("Ad safety configuration present");
      isMonetized = true;
      if (confidence !== "high") confidence = "medium";
    }
  }

  if (html.includes('companionAd') || html.includes('"adBreakParams"')) {
    indicators.push("Companion ads or ad breaks detected");
    isMonetized = true;
    if (confidence !== "high") confidence = "medium";
  }

  if (html.includes('"adsEngagementPanelContentRenderer"')) {
    indicators.push("Ads engagement panel detected");
    isMonetized = true;
    if (confidence !== "high") confidence = "medium";
  }

  const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
  const subscriberMatch = html.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/);

  const channelInfo: { title?: string; subscriberCount?: string } = {};
  if (titleMatch) channelInfo.title = titleMatch[1];
  if (subscriberMatch) channelInfo.subscriberCount = subscriberMatch[1];

  if (indicators.length === 0) {
    indicators.push("No monetization indicators found");
  }

  return {
    isMonetized,
    confidence,
    indicators,
    channelInfo,
  };
}
