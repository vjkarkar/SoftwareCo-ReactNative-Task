export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  image?: string;
  discount?: string;
  validUntil?: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  image?: string;
  address?: string;
  phone?: string;
}

export interface Statistics {
  period: 'daily' | 'weekly' | 'monthly';
  data: Record<string, number>;
}

// API response types
export interface OfferItem {
  _id: string;
  title: string;
  description: string;
  discount: number;
  image: string;
  status: 'active' | 'upcoming' | 'expired';
}

export interface OffersResponse {
  data: OfferItem[];
  total: number;
  skip: number;
  limit: number;
}

export interface StoreItem {
  _id: string;
  name: string;
  category: string;
  location: { address: string; lat: number; long: number };
  image: string | null;
}

export interface StoresResponse {
  data: StoreItem[];
  total: number;
  skip: number;
  limit: number;
}

export interface StatItem {
  _id: string;
  store_id: string;
  period: string;
  percentage: number;
}

export interface StatisticsResponse {
  data: StatItem[];
  total: number;
  skip: number;
  limit: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  enabled: boolean;
  subItems?: NotificationSubItem[];
}

export interface NotificationSubItem {
  id: string;
  title: string;
  enabled: boolean;
}
