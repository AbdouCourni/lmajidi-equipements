//components/ProductGrid.tsx
import ProductCard from './ProductCard';
import type { Product } from '../types/product';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
