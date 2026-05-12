import HeroBanner from '@/components/layout/HeroBanner';
import CategorySection from '@/components/product/CategorySection';
import FeaturedProducts from '@/components/product/FeaturedProducts';
import NewProducts from '@/components/product/NewProducts';
import BestProducts from '@/components/product/BestProducts';

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <CategorySection />
        <FeaturedProducts />
        <BestProducts />
        <NewProducts />
      </div>
    </div>
  );
}
