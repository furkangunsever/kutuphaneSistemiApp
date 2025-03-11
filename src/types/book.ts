export interface Book {
  _id: string;
  title: string;
  author: string;
  ISBN: string;
  publishYear: number;
  quantity: number;
  status: 'available' | 'borrowed' | 'reserved';
  imageUrl?: string; // Kitap görseli için URL
  qrCode?: string; // QR kod URL'i için opsiyonel alan
} 