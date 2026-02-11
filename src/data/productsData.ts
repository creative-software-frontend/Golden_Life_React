export interface ProductCategory {
  id: number;
  name: string;
  image: string;
}

export const productsData: ProductCategory[] = [
  // --- Row 1: Men's Fashion ---
  { id: 1, name: "Polo Shirt", image: "/images/cat_polo.png" },
  { id: 2, name: "Drop Shoulder", image: "/images/cat_drop.png" },
  { id: 3, name: "Basic T-Shirt", image: "/images/cat_basic.png" },
  { id: 4, name: "Long Sleeve", image: "/images/cat_long.png" },
  { id: 5, name: "Print Shirt", image: "/images/cat_print.png" },
  { id: 6, name: "Solid Shirt", image: "/images/cat_solid.png" },
  { id: 7, name: "Check Shirt", image: "/images/cat_check.png" },
  { id: 8, name: "Shirt Combo", image: "/images/cat_combo.png" },
  
  // --- Row 2: Traditional & Women ---
  { id: 9, name: "Panjabi", image: "/images/cat_panjabi.png" },
  { id: 10, name: "Kabli Set", image: "/images/cat_kabli.png" },
  { id: 11, name: "Saree", image: "/images/cat_saree.png" },
  { id: 12, name: "Three Piece", image: "/images/cat_three.png" },
  { id: 13, name: "Kurti", image: "/images/cat_kurti.png" },
  { id: 14, name: "Lehenga", image: "/images/cat_lehenga.png" },
  { id: 15, name: "Western", image: "/images/cat_western.png" },
  { id: 16, name: "Ladies T-Shirt", image: "/images/cat_ladies.png" },

  // --- Row 3: Kids & Accessories ---
  { id: 17, name: "Kids Set", image: "/images/cat_kids.png" },
  { id: 18, name: "Baby Dress", image: "/images/cat_baby.png" },
  { id: 19, name: "Burqa", image: "/images/cat_burqa.png" },
  { id: 20, name: "Hijab", image: "/images/cat_hijab.png" },
  { id: 21, name: "Watches", image: "/images/cat_watch.png" },
  { id: 22, name: "Gadgets", image: "/images/cat_gadget.png" },
  { id: 23, name: "Bag", image: "/images/cat_bag.png" },
  { id: 24, name: "Footwear", image: "/images/cat_shoe.png" },

  // --- Row 4: Home & Lifestyle ---
  { id: 25, name: "Bed Sheet", image: "/images/cat_bed.png" },
  { id: 26, name: "Curtain", image: "/images/cat_curtain.png" },
  { id: 27, name: "Prayer Mat", image: "/images/cat_prayer.png" },
  { id: 28, name: "Kitchen", image: "/images/cat_kitchen.png" },
  { id: 29, name: "Electronics", image: "/images/cat_elec.png" },
  { id: 30, name: "Gift Item", image: "/images/cat_gift.png" },
  { id: 31, name: "Cosmetics", image: "/images/cat_cosmetic.png" },
  { id: 32, name: "Organic", image: "/images/cat_organic.png" },
];