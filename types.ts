export enum DivinationType {
  TAROT = 'tarot',
  ICHING = 'iching', // 周易
  ASTROLOGY = 'astrology',
  RUNES = 'runes'
}

export interface DivinationConfig {
  id: DivinationType;
  name: string;
  description: string;
  icon: string; // URL or Lucide icon name placeholder
  color: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isStream?: boolean;
}

export interface TarotCard {
  name: string;
  orientation: 'upright' | 'reversed'; // 正位 | 逆位
  meaning: string;
}

export interface DivinationResult {
  fullText: string;
  // Optional structured data for specific visuals
  cards?: TarotCard[];
  hexagram?: string;
}
