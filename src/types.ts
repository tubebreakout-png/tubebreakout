export type Country = 'USA' | 'France' | 'UK' | 'Canada' | 'Germany' | 'India' | 'Brazil' | 'Australia' | 'Japan' | 'Mexico' | 'Spain' | 'Italy' | 'Netherlands' | 'Sweden' | 'Norway' | 'Switzerland';
export type Niche = 'science-tech' | 'travel' | 'autos' | 'education' | 'howto' | 'entertainment' | 'people-blogs' | 'gaming' | 'news' | 'comedy' | 'film' | 'sports' | 'pets' | 'nonprofits' | 'music';

export interface CPMData {
  [country: string]: {
    [niche: string]: number;
  };
}

export interface RevenueResult {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  sponsorshipMin: number;
  sponsorshipMax: number;
}

export interface ThumbnailSize {
  url: string;
  resolution: string;
  width: number;
  height: number;
}

export interface ChannelData {
  name: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  createdDate: string;
  category: string;
}
