export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: SanityImage;
}

export interface Product {
  _id: string;
  title: string;
  categoryName: string;
  categoryNumber: string;
  subtitle?: string;
  tag?: string;
  image: SanityImage;
}

export interface GalleryItem {
  _id: string;
  title?: string;
  mediaType: 'image' | 'video';
  image?: SanityImage;
  videoUrl?: string;
}
