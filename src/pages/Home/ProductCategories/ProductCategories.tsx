import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const products = [
  { id: 1, title: 'One piece gown', image: '../../../../public/image/c1.jpg' },
  { id: 2, title: 'Smart Watch & Device', image: '../../../../public/image/c2.jpg' },
  { id: 3, title: 'Snap and Grip', image: '../../../../public/image/c3.jpg' },
  { id: 4, title: 'Ladies Winter Overcoat', image: '../../../../public/image/c4.jpg' },
  { id: 5, title: 'Attractive Stylish Shirt', image: '../../../../public/image/c2.jpg' },
  { id: 6, title: 'M19 100% Original', image: '../../../../public/image/c3.jpg' },
  { id: 7, title: 'M19 100% Original', image: '../../../../public/image/c4.jpg' },
  { id: 8, title: 'M19 100% Original', image: '../../../../public/image/c2.jpg' },
];

export default function ProductCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    const startX = e.clientX;
    const scrollLeft = scrollRef.current.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!scrollRef.current) return;
      const x = moveEvent.clientX;
      const walk = (x - startX) * 1.5; // Adjust the speed here
      scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="py-10 -ms-16 shadow mb-5">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-primary-light text-black px-4 py-1 rounded-full text-sm font-medium">
            Special Products
          </div>
          <Link to="#" className="text-red-500 text-sm font-medium flex items-center hover:underline">
            All Products
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="flex overflow-x-auto pb-4 cursor-grab"
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          style={{ scrollbarWidth: 'none' }} // For Firefox
        >
          <div className="flex gap-4">
            {products.map((product) => (
              <Link key={product.id} to="#" className="flex-none w-[160px] group border border-gray-300 rounded-lg p-2">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-600 line-clamp-2">
                  {product.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
