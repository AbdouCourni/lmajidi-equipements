export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  heroIcon: string;
  equipment: string[];
  sections: {
    title: string;
    body: string;
    items?: string[];
  }[];
  checklist: string[];
  faq: {
    question: string;
    answer: string;
  }[];
};
