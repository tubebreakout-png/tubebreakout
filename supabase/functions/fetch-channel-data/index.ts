import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DAILY_LIMIT = 10000;
const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');

interface ChannelData {
  channelId: string;
  channelName: string;
  channelHandle: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  country: string;
  customUrl: string;
  publishedAt: string;
  isMonetized: boolean;
  tags: string[];
  category: string;
  adsEnabled: boolean;
  verificationStatus: string;
  regionalRestrictions: boolean;
  ageRestricted: boolean;
  madeForKids: boolean;
  remainingQuota?: number;
}

async function checkAndUpdateUsage(supabase: any): Promise<{ allowed: boolean; remaining: number }> {
  const today = new Date().toISOString().split('T')[0];

  const { data: usage, error: fetchError } = await supabase
    .from('api_usage_tracker')
    .select('*')
    .eq('date', today)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching usage:', fetchError);
    throw new Error('Failed to check API usage');
  }

  const currentCount = usage?.youtube_api_calls || 0;

  if (currentCount >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  if (!usage) {
    const { error: insertError } = await supabase
      .from('api_usage_tracker')
      .insert({ date: today, youtube_api_calls: 1 });

    if (insertError) {
      console.error('Error inserting usage:', insertError);
      throw new Error('Failed to update API usage');
    }
  } else {
    const { error: updateError } = await supabase
      .from('api_usage_tracker')
      .update({ youtube_api_calls: currentCount + 1 })
      .eq('date', today);

    if (updateError) {
      console.error('Error updating usage:', updateError);
      throw new Error('Failed to update API usage');
    }
  }

  return { allowed: true, remaining: DAILY_LIMIT - (currentCount + 1) };
}

async function extractChannelId(identifier: string): Promise<string | null> {
  if (identifier.match(/^UC[\w-]{22}$/)) {
    return identifier;
  }

  if (identifier.includes('youtube.com/channel/')) {
    const match = identifier.match(/channel\/(UC[\w-]{22})/);
    return match ? match[1] : null;
  }

  if (identifier.includes('youtube.com/@')) {
    const handle = identifier.split('@')[1]?.split('/')[0]?.split('?')[0];
    return `@${handle}`;
  }

  return null;
}

async function fetchChannelData(channelId: string): Promise<ChannelData> {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured');
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet,statistics,brandingSettings,status,topicDetails',
      key: YOUTUBE_API_KEY,
    });

    if (channelId.startsWith('@')) {
      params.append('forHandle', channelId.substring(1));
    } else {
      params.append('id', channelId);
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('Channel not found');
    }

    const channel = data.items[0];
    const snippet = channel.snippet;
    const statistics = channel.statistics;
    const branding = channel.brandingSettings?.channel;

    return {
      channelId: channel.id,
      channelName: snippet.title || 'Unknown Channel',
      channelHandle: snippet.customUrl || '',
      description: snippet.description || '',
      thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
      bannerUrl: branding?.bannerExternalUrl || '',
      subscriberCount: statistics.subscriberCount || '0',
      videoCount: statistics.videoCount || '0',
      viewCount: statistics.viewCount || '0',
      country: snippet.country || 'Unknown',
      customUrl: snippet.customUrl || '',
      publishedAt: snippet.publishedAt || '',
      isMonetized: false,
      tags: branding?.keywords?.split(',').map((t: string) => t.trim()) || [],
      category: snippet.description || 'Unknown',
      adsEnabled: false,
      verificationStatus: 'Unknown',
      regionalRestrictions: false,
      ageRestricted: false,
      madeForKids: channel.status?.madeForKids || false
    };
  } catch (error) {
    throw new Error(`Failed to fetch channel data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const usageCheck = await checkAndUpdateUsage(supabase);

    if (!usageCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Daily API limit reached (10,000 requests). Please try again tomorrow.',
          remainingQuota: 0
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { identifier } = await req.json();

    if (!identifier) {
      return new Response(
        JSON.stringify({ error: 'Channel identifier is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const channelId = await extractChannelId(identifier);

    if (!channelId) {
      return new Response(
        JSON.stringify({ error: 'Could not extract channel ID from the provided identifier' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const channelData = await fetchChannelData(channelId);
    channelData.remainingQuota = usageCheck.remaining;

    return new Response(
      JSON.stringify(channelData),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in fetch-channel-data function:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred while fetching channel data'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});