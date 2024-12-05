import { ChevronRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import useModalStore from '@/store/Store';

const products = [
  { id: 1, title: 'One piece gown', image: "../../../../public/image/categories/c2.jpg" },
  { id: 2, title: 'Smart Watch & Device', image: "../../../../public/image/categories/c1.jpg" },
  { id: 3, title: 'Snap and Grip', image: "../../../../public/image/categories/c12.png" },
  { id: 4, title: 'Ladies Winter Overcoat', image: "../../../../public/image/categories/c3.jpg" },
  { id: 5, title: 'Attractive Stylish Shirt', image: "../../../../public/image/categories/c13.png" },
  { id: 6, title: 'M19 100% Original', image: "../../../../public/image/categories/c4.jpg" },
  { id: 7, title: 'M19 100% Original', image: "../../../../public/image/categories/c15png.jpg" },
  { id: 8, title: 'M19 100% Original', image: "../../../../public/image/products/sharee3.jpg" },
];

export default function ProductCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cart, setCart] = useState<any[]>([]);
  const { toggleClicked } = useModalStore();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // const addToCart = (product: any) => {
  //   const updatedCart = [...cart, product];
  //   setCart(updatedCart);
  //   localStorage.setItem("cart", JSON.stringify(updatedCart));
  //   toggleClicked(); // Trigger to update the cart in other components
  // };
  const addToCart = (product: any) => {
    // Retrieve the current cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Add the product to the cart without checking for duplicates, allowing multiple of the same product
    storedCart.push(product);

    // Update the cart state and localStorage with the new cart
    setCart(storedCart);
    localStorage.setItem("cart", JSON.stringify(storedCart));
    toggleClicked(); // Trigger to update the cart in other components
  };


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
    <div className="py-2 shadow mb-5 bg-primary-default md:max-w-[1040px] sm:w-full w-[370px]">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-primary-light text-white px-4 py-1 rounded-full text-sm font-medium">
            Special Products
          </div>
          <Link to="/allProducts" className="text-white text-sm font-medium flex items-center hover:underline">
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
              <Link key={product.id} to="#" className="flex-none w-[140px] group border border-gray-300 rounded-lg p-2">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="mt-2 text-lg font-medium text-white line-clamp-2 text-nowrap">
                  {product.title}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    addToCart(product); // Add product to the cart
                  }}
                  className="w-full mt-2"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
