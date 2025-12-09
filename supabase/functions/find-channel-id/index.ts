import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChannelIdRequest {
  url: string;
}

interface ChannelIdResult {
  channelId: string;
  channelName: string;
  channelHandle?: string;
  channelUrl: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { url }: ChannelIdRequest = await req.json();

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

    if (/^UC[\w-]{22}$/.test(cleanUrl)) {
      const channelUrl = `https://www.youtube.com/channel/${cleanUrl}`;
      const response = await fetchChannel(channelUrl);
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!cleanUrl.startsWith('http')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    const channelHandle = extractChannelHandle(cleanUrl);
    const channelId = extractChannelId(cleanUrl);
    const customName = extractCustomName(cleanUrl);
    const userName = extractUserName(cleanUrl);

    let targetUrl: string;
    if (channelId) {
      targetUrl = `https://www.youtube.com/channel/${channelId}`;
    } else if (channelHandle) {
      targetUrl = `https://www.youtube.com/@${channelHandle}`;
    } else if (customName) {
      targetUrl = `https://www.youtube.com/c/${customName}`;
    } else if (userName) {
      targetUrl = `https://www.youtube.com/user/${userName}`;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid YouTube URL" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await fetchChannel(targetUrl);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error finding channel ID:", error);
    return new Response(
      JSON.stringify({
        error: "Unable to find channel ID",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function fetchChannel(url: string): Promise<ChannelIdResult> {
  console.log('Fetching:', url);

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  if (!response.ok) {
    throw new Error(`Channel not found (${response.status})`);
  }

  const html = await response.text();

  const channelIdMatch = html.match(/"channelId":"(UC[\w-]{22})"/) || 
                         html.match(/"externalId":"(UC[\w-]{22})"/) ||
                         html.match(/property="og:url" content="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})/);
  
  if (!channelIdMatch) {
    throw new Error("Channel ID not found in page");
  }

  const channelId = channelIdMatch[1];

  const channelNameMatch = html.match(/<meta property="og:title" content="([^"]+)">/) ||
                           html.match(/"channelName":"([^"]+)"/);
  const channelName = channelNameMatch ? channelNameMatch[1] : 'YouTube Channel';

  const channelHandleMatch = html.match(/"canonicalChannelUrl":"https:\/\/www\.youtube\.com\/@([^"]+)"/);
  const channelHandle = channelHandleMatch ? channelHandleMatch[1] : undefined;

  return {
    channelId,
    channelName,
    channelHandle,
    channelUrl: `https://www.youtube.com/channel/${channelId}`,
  };
}

function extractChannelHandle(url: string): string | null {
  const pattern = /(?:youtube\.com\/@)([\w-]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

function extractChannelId(url: string): string | null {
  const pattern = /(?:youtube\.com\/channel\/)([\w-]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

function extractCustomName(url: string): string | null {
  const pattern = /(?:youtube\.com\/c\/)([\w-]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

function extractUserName(url: string): string | null {
  const pattern = /(?:youtube\.com\/user\/)([\w-]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}
