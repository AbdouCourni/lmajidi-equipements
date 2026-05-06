// src/components/CategoryCard.tsx
import Link from 'next/link';
import type { Route } from 'next';

// Professional SVG Icons for each category
const CategoryIcons = {
  refrigeration: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path d="M8 7h8M8 11h8M8 15h5M16 15h-1" />
      <path d="M12 19v-2" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
  cooking: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4M8 4l2 2M16 4l-2 2" />
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M9 12v4M15 12v4M4 12h16" />
    </svg>
  ),
  bakery: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 4a4 4 0 014 4c0 2-2 4-4 4s-4-2-4-4 2-4 4-4z" />
      <path d="M6 14h12" />
      <path d="M8 18h8" />
      <path d="M10 14v4M14 14v4" />
    </svg>
  ),
  preparation: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 4L8 8l-2 6 6 2 6-2-2-6-6-4z" />
      <path d="M14 10l2 2M10 10l-2 2" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  'snack-equipment': () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 8v8a3 3 0 003 3h4a3 3 0 003-3V8" />
      <path d="M5 8h14" />
      <path d="M8 5l1-2h6l1 2H8z" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
  furniture: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12h16v8H4z" />
      <path d="M6 12V8h12v4" />
      <path d="M8 8V6h8v2" />
    </svg>
  ),
};

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    count: number;
    slug: string;
    description: string;
    color: string;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = CategoryIcons[category.id as keyof typeof CategoryIcons];
  
  return (
    <Link
      href={`/categories/${category.slug}` as Route}
      className="group block bg-gray-100 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
    >
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {IconComponent && <IconComponent />}
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{category.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{category.description}</p>
      <p className="text-sm font-semibold text-blue-600">{category.count} produits</p>
    </Link>
  );
}