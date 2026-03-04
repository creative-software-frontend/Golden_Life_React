"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, AlertCircle } from "lucide-react";
import useModalStore from "@/store/Store";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import CheckoutModal from "../CheckoutModal/CheckoutModal";

export default function Cart() {
  const { t } = useTranslation('global');
  const { clicked, toggleClicked, changeCheckoutModal } = useModalStore();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const loadCartData = useCallback(() => {
    const storedItems = localStorage.getItem('cart');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        setCartItems(Array.isArray(parsedItems) ? parsedItems : []);
      } catch (e) {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    loadCartData();
    window.addEventListener("cartUpdated", loadCartData);
    window.addEventListener("storage", loadCartData);
    return () => {
      window.removeEventListener("cartUpdated", loadCartData);
      window.removeEventListener("storage", loadCartData);
    };
  }, [loadCartData]);

  const updateQuantity = (id: number, delta: number) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, (Number(item.quantity) || 0) + delta) } : item
    );
    saveAndSync(updated);
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveAndSync(updated);
  };

  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  const confirmClearCart = () => {
    saveAndSync([]);
    setShowClearConfirm(false);
  };

  const saveAndSync = (newList: any[]) => {
    localStorage.setItem("cart", JSON.stringify(newList));
    setCartItems(newList);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // --- PRICING LOGIC MATCHING API RESPONSE ---
  
  // Get the actual price to charge the user
  const getActivePrice = (item: any) => {
    const offerPrice = Number(item.offer_price) || 0;
    const regularPrice = Number(item.regular_price) || 0;
    
    // If offer price exists, is valid, and is less than regular price, use it
    if (offerPrice > 0 && offerPrice < regularPrice) {
      return offerPrice;
    }
    // Fallback to regular price
    return regularPrice > 0 ? regularPrice : (Number(item.price) || 0);
  };

  // Get the original price (for crossing out)
  const getOriginalPrice = (item: any) => {
    const regularPrice = Number(item.regular_price) || 0;
    return regularPrice > 0 ? regularPrice : (Number(item.price) || 0);
  };

  // Total Quantity
  const totalItems = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  
  // Calculate Subtotal using the Active Price
  const subtotal = cartItems.reduce((acc, item) => acc + (getActivePrice(item) * (Number(item.quantity) || 0)), 0);

  // Calculate Total Savings
  const originalTotal = cartItems.reduce((acc, item) => acc + (getOriginalPrice(item) * (Number(item.quantity) || 0)), 0);
  const totalSavings = originalTotal - subtotal;

  return (
    <>
      {!clicked && (
        <button
          onClick={toggleClicked}
          className="fixed right-0 top-[45%] -translate-y-1/2 bg-white border border-gray-100 rounded-l-2xl pl-4 pr-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(92,156,114,0.15)] hover:-translate-x-1 transition-all duration-300 ease-out flex items-center gap-3 z-[50] group"
        >
          <div className="relative flex items-center justify-center p-2.5 bg-[#F0FDF4] rounded-xl text-[#5C9C72] group-hover:bg-[#5C9C72] group-hover:text-white transition-colors duration-300">
            <ShoppingBag className="h-5 w-5 stroke-[2.5px]" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 border-2 border-white text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
          <div className="text-left py-1">
            <div className="font-bold text-gray-400 text-[9px] uppercase tracking-widest mb-0.5">
              {totalItems} {t("cart.TotalItems", "Items")}
            </div>
            <div className="text-sm font-black text-gray-900 group-hover:text-[#5C9C72] transition-colors leading-none tracking-tight">
              ৳{formatBDT(subtotal)}
            </div>
          </div>
        </button>
      )}

      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-opacity duration-300 ${clicked ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleClicked}
      />

      <aside className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[1000] shadow-2xl transition-transform duration-500 ease-in-out transform ${clicked ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full font-sans relative">

          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#F0FDF4] p-2 rounded-lg text-[#5C9C72]">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">{t('cart.title', 'My Cart')}</h2>
                <p className="text-xs text-gray-500 font-medium">{totalItems} Items added</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearClick}
                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wide"
                >
                  Clear All
                </button>
              )}
              <button onClick={toggleClicked} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                
                // Determine prices for this specific item
                const activePrice = getActivePrice(item);
                const originalPrice = getOriginalPrice(item);
                const hasDiscount = activePrice < originalPrice;

                return (
                  <div key={item.id} className="flex gap-4 p-3 border border-gray-100 rounded-2xl bg-white shadow-sm hover:border-[#5C9C72]/30 transition-all group">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.product_title_english || item.name}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                          {item.product_title_english || item.name}
                        </h4>
                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0 p-1 rounded-md hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-2">
                        <div className="flex flex-col">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-0.5">Price</p>
                          <div className="flex items-center gap-1.5">
                            {/* ACTIVE PRICE */}
                            <p className="text-[#5C9C72] font-black text-base leading-none">
                              ৳{formatBDT(activePrice)}
                            </p>
                            
                            {/* ORIGINAL PRICE (If Discounted) */}
                            {hasDiscount && (
                              <p className="text-gray-400 font-bold text-xs line-through leading-none">
                                ৳{formatBDT(originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm h-8">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-[#F0FDF4] hover:text-[#5C9C72] transition-colors border-r border-gray-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-[#F0FDF4] hover:text-[#5C9C72] transition-colors border-l border-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <div className="bg-white p-8 rounded-full shadow-sm border border-gray-100">
                  <ShoppingBag size={64} strokeWidth={1} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t("cart.CartEmpty", "Your cart is empty")}</p>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.03)] space-y-5 z-20">
              
              {/* REMOVED COUPON SECTION FROM HERE */}

              <div className="flex flex-col gap-1.5">
                {/* SHOW TOTAL SAVINGS */}
                {totalSavings > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                    <span className="uppercase tracking-widest">Total Savings</span>
                    <span className="text-green-600">-৳{formatBDT(totalSavings)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-end mt-1">
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none block mb-1">Subtotal</span>
                    <p className="text-gray-400 text-[10px] font-medium leading-none">Shipping calculated at checkout</p>
                  </div>
                  <span className="text-2xl font-black text-gray-900 tracking-tight">৳{formatBDT(subtotal)}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  toggleClicked();
                  changeCheckoutModal();
                }}
                className="w-full bg-[#5C9C72] hover:bg-[#4a855d] h-14 rounded-2xl text-lg font-black uppercase shadow-lg shadow-green-100 transition-all active:scale-[0.98] text-white flex items-center justify-center gap-3"
              >
                <span>Place Order</span>
                <span className="w-px h-5 bg-white/20"></span>
                <span>৳{formatBDT(subtotal)}</span>
              </Button>
            </div>
          )}

          {showClearConfirm && (
            <div className="absolute inset-0 z-[1100] bg-white/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl border border-gray-100 text-center transform animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Clear Your Cart?</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Are you sure you want to remove all items from your cart? This action cannot be undone.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClearCart}
                    className="py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
                  >
                    Yes, Clear It
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      <CheckoutModal />
    </>
  );
}