export interface ProductCategory {
  id: number;
  name: string;
  image: string;
}

export const productsData: ProductCategory[] = [
  { id: 1, name: "Airpods", image: "/image/products/airpods.jpg" },
  { id: 2, name: "Beats", image: "/image/products/beats.jpg" },
  { id: 3, name: "Bread", image: "/image/products/bread.jpg" },
  { id: 4, name: "Egg", image: "/image/products/egg.jpg" },
  { id: 5, name: "Headphone", image: "/image/products/headphone.jpg" },
  { id: 6, name: "Honey", image: "/image/products/honey.jpg" },
  { id: 7, name: "Maggi", image: "/image/products/maggi.webp" },
  { id: 8, name: "Pulse Oximeter", image: "/image/products/pulseoximeter.jpg" },
  { id: 9, name: "Sharee 1", image: "/image/products/sharee.jpg" },
  { id: 10, name: "Sharee 2", image: "/image/products/sharee2.jpg" },
];
