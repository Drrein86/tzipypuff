"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { NeonButton } from "@/components/ui/NeonButton";
import { ProductThumb } from "@/components/ui/ProductThumb";
import { priceClass } from "@/lib/products";

export function CartSidebar() {
  const pathname = usePathname();
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, total } = useCartStore();
  const visible = isOpen && !pathname.startsWith("/checkout");

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className="fixed top-0 left-0 z-[101] flex h-full w-full max-w-md flex-col glass-strong"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <h2 className="text-lg font-semibold">עגלת קניות</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 text-white/60 hover:text-white"
                aria-label="סגור"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <p className="py-12 text-center text-white/40">העגלה ריקה</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 rounded-xl border border-white/5 p-4"
                    >
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-[#0a0c10]">
                        <ProductThumb src={item.image} alt={item.nameHe} />
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <span className="text-sm font-medium">{item.nameHe}</span>
                        <span className={`text-sm ${priceClass}`}>₪{item.price}</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="rounded p-1 text-white/40 hover:text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="rounded p-1 text-white/40 hover:text-white"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mr-auto text-white/30 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/5 p-6">
                <div className="mb-4 flex justify-between text-sm">
                  <span className="text-white/60">סה״כ</span>
                  <span className={`text-lg ${priceClass}`}>₪{total()}</span>
                </div>
                <NeonButton className="w-full" href="/checkout" onClick={() => setCartOpen(false)}>
                  לתשלום
                </NeonButton>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
