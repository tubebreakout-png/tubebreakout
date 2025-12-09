import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  url: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { url }: RequestBody = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch YouTube channel" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const html = await response.text();

    const channelNameMatch = html.match(/"title":"([^"]+)","description"/);
    const channelName = channelNameMatch ? channelNameMatch[1] : "";

    const subscriberMatch = html.match(/"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/);
    let subscriberCount = "0";
    if (subscriberMatch) {
      subscriberCount = subscriberMatch[1];
    }

    const viewCountMatch = html.match(/"viewCountText":\{"simpleText":"([^"]+) views"/);
    let totalViews = 0;
    if (viewCountMatch) {
      const viewsText = viewCountMatch[1].replace(/,/g, "");
      totalViews = parseInt(viewsText, 10);
    }

    const videoCountMatch = html.match(/"videosCountText":\{"runs":\[\{"text":"([^"]+)"/);
    let videoCount = 0;
    if (videoCountMatch) {
      const videosText = videoCountMatch[1].replace(/,/g, "");
      videoCount = parseInt(videosText, 10);
    }

    const joinedDateMatch = html.match(/"joinedDateText":\{"runs":\[\{"text":"Joined "\},\{"text":"([^"]+)"/);
    let joinedDate = "";
    if (joinedDateMatch) {
      joinedDate = joinedDateMatch[1];
    }

    let daysSinceJoined = 365;
    if (joinedDate) {
      const monthMap: { [key: string]: number } = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      
      const dateParts = joinedDate.match(/(\w+)\s+(\d+),\s+(\d+)/);
      if (dateParts) {
        const month = monthMap[dateParts[1]];
        const day = parseInt(dateParts[2], 10);
        const year = parseInt(dateParts[3], 10);
        
        const joinDate = new Date(year, month, day);
        const now = new Date();
        daysSinceJoined = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    const dailyViews = totalViews > 0 && daysSinceJoined > 0 ? Math.floor(totalViews / daysSinceJoined) : 0;

    const data = {
      success: true,
      channelName,
      subscriberCount,
      totalViews,
      videoCount,
      joinedDate,
      daysSinceJoined,
      dailyViews,
    };

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error fetching channel stats:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch channel statistics" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
