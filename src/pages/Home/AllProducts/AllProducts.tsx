import { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart } from 'lucide-react';
import useModalStore from "@/store/Store";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

interface Product {
    id: number;
    name: string;
    image: string;
    weight: string;
    price: number;
    mrp: number;
    description?: string;
}
const products: Product[] = [
    {
        id: 1,
        name: "Potato",
        image: "../../../../public/image/products/maggi.webp",
        weight: "600 gm",
        price: 39,
        mrp: 45,
        description: "Regular potatoes, suitable for home cooking. Rich in carbohydrates and minerals."
    },
    {
        id: 2,
        name: "Red Potato (Cardinal)",
        image: "../../../../public/image/products/maggi.webp",
        weight: "1 kg",
        price: 50,
        mrp: 60,
        description: "Red Cardinal potatoes, suitable for home cooking. Rich in vitamins and minerals."
    },
    {
        id: 3,
        name: "Garlic (Imported)",
        image: "../../../../public/image/products/maggi.webp",
        weight: "200 gm",
        price: 30,
        mrp: 35,
        description: "Imported garlic, known for its strong flavor and health benefits."
    },
    {
        id: 4,
        name: "Onion",
        image: "../../../../public/image/products/maggi.webp",
        weight: "500 gm",
        price: 25,
        mrp: 30,
        description: "Fresh onions, a staple in many dishes. Adds flavor and aroma to meals."
    },
    {
        id: 5,
        name: "Tomato",
        image: "../../../../public/image/products/maggi.webp",
        weight: "1 kg",
        price: 40,
        mrp: 45,
        description: "Juicy tomatoes, perfect for salads, sauces, and cooking."
    },
    {
        id: 6,
        name: "Cucumber",
        image: "../../../../public/image/products/maggi.webp",
        weight: "400 gm",
        price: 15,
        mrp: 20,
        description: "Fresh cucumbers, crisp and refreshing. Ideal for salads and snacks."
    },
    {
        id: 7,
        name: "Carrot",
        image: "../../../../public/image/products/maggi.webp",
        weight: "500 gm",
        price: 30,
        mrp: 35,
        description: "Sweet, crunchy carrots, perfect for eating raw, in salads, or cooked dishes."
    },
    {
        id: 8,
        name: "Spinach",
        image: "../../../../public/image/products/maggi.webp",
        weight: "250 gm",
        price: 20,
        mrp: 25,
        description: "Fresh spinach leaves, rich in vitamins and minerals. Ideal for salads or cooking."
    },
    {
        id: 9,
        name: "Cauliflower",
        image: "../../../../public/image/products/maggi.webp",
        weight: "1 kg",
        price: 50,
        mrp: 55,
        description: "Fresh cauliflower, great for stir-fries, soups, or as a side dish."
    },
    {
        id: 10,
        name: "Bell Pepper (Red)",
        image: "../../../../public/image/products/maggi.webp",
        weight: "300 gm",
        price: 35,
        mrp: 40,
        description: "Sweet and crunchy red bell peppers, perfect for salads, grilling, or stir-fries."
    }
];


export default function AllProduct() {
    const { id } = useParams<{ id: string }>();
    const productId = Number(id);
    const { changeCheckoutModal, toggleClicked } = useModalStore();
    const { t } = useTranslation("global"); // Initialize useTranslation hook

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        products.find((product) => product.id === productId) || null
    );

    const [quantities, setQuantities] = useState<Record<number, number>>(
        Object.fromEntries(products.map((p) => [p.id, 1]))
    );

    const updateQuantity = (productId: number, delta: number) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta),
        }));
    };

    const discount = (mrp: number, price: number) => {
        return Math.round(((mrp - price) / mrp) * 100);
    };

    const addToCart = (product: Product) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = [...existingCart, { ...product, quantity: 1 }];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    return (
        <div className="container w-full md:max-w-[1040px]">
            <h1 className="text-2xl font-bold mb-6 mt-4">{t("labels.freshVegetables")}</h1> {/* Fresh Vegetables title */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-lg shadow-sm relative mb-4">
                        <button
                            className="absolute right-2 top-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                            onClick={() => console.log(t("buttons2.wishlist"))} // Add to Wishlist button text
                        >
                            <Heart className="w-5 h-5 text-red-500" />
                        </button>

                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-lg p-4"
                        />

                        <div className="p-4 ">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-sm text-gray-600">{product.weight}</p>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl font-bold">₹{product.price}</span>
                                <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                                <span className="text-sm text-red-500">
                                    {discount(product.mrp, product.price)}% {t("labels.discount")} {/* Discount text */}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    {t("buttons2.viewDetails")} {/* View Details button text */}
                                </button>
                                <button
                                    className="flex-1 px-2 py-2 text-nowrap bg-primary-default text-white rounded-md"
                                    onClick={() => {
                                        addToCart(product);
                                        toggleClicked();
                                    }}
                                >
                                    {t("buttons2.addToCart")} {/* Add to Cart button text */}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">{t(`products2.product${selectedProduct.id}.name`)}</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <img
                                    src={selectedProduct.image}
                                    alt={t(`products2.product${selectedProduct.id}.name`)}
                                    className="w-full rounded-lg"
                                />

                                <div className="space-y-4">
                                    <p className="text-lg">{selectedProduct.weight}</p>

                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">₹{selectedProduct.price}</span>
                                        <span className="text-gray-500 line-through">₹{selectedProduct.mrp}</span>
                                        <span className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">
                                            {discount(selectedProduct.mrp, selectedProduct.price)}% {t("labels.discount")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 border rounded-md p-2 w-fit">
                                        <button
                                            onClick={() => updateQuantity(selectedProduct.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center text-nowrap">
                                            {quantities[selectedProduct.id]} {t("labels.quantity")}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(selectedProduct.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="text-gray-600">{t(`products2.product${selectedProduct.id}.description`)}</p>

                                    <button
                                        onClick={changeCheckoutModal}
                                        className="w-full px-4 py-2 bg-primary-default text-white rounded-md"
                                    >
                                        {t("buttons2.addToCart")}
                                    </button>

                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">🚚</span>
                                            {t("messages.cartUpdated")}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">💰</span>
                                            {t("messages.cartUpdated")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t px-6 py-3 flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={() => setSelectedProduct(null)}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

