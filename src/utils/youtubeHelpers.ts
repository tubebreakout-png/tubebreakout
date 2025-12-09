export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

export const getThumbnailUrls = (videoId: string) => {
  return [
    {
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      resolution: '1280x720',
      width: 1280,
      height: 720
    },
    {
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      resolution: '640x480',
      width: 640,
      height: 480
    },
    {
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      resolution: '480x360',
      width: 480,
      height: 360
    },
    {
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      resolution: '320x180',
      width: 320,
      height: 180
    }
  ];
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const calculateRevenue = (
  views: number,
  cpm: number,
  includeSponsorship: boolean,
  sponsorshipMin: number,
  sponsorshipMax: number
) => {
  const adSenseRevenue = (views * cpm * 0.55) / 1000;
  const sponsorshipMinRev = includeSponsorship ? views * sponsorshipMin : 0;
  const sponsorshipMaxRev = includeSponsorship ? views * sponsorshipMax : 0;

  return {
    daily: adSenseRevenue,
    weekly: adSenseRevenue * 7,
    monthly: adSenseRevenue * 30,
    yearly: adSenseRevenue * 365,
    sponsorshipMin: sponsorshipMinRev,
    sponsorshipMax: sponsorshipMaxRev
  };
};
