import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ✅ Cart count (total qty)
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  }, [cart]);

  // ✅ Convert price to number
  const getNumericPrice = (item) => {
    // 1) normal item price
    if (typeof item.price === "number") return item.price;

    // 2) half/full item
    if (typeof item.full === "number") return item.full;
    if (typeof item.half === "number") return item.half;

    return 0;
  };

  // ✅ Add to cart (NOW saves priceNumber)
  const addToCart = (category, item, priceText) => {
    const priceNumber = getNumericPrice(item);

    setCart((prev) => {
      const exist = prev.find((x) => x.name === item.name);

      if (exist) {
        return prev.map((x) =>
          x.name === item.name ? { ...x, qty: x.qty + 1 } : x
        );
      }

      return [
        ...prev,
        {
          name: item.name,
          category,
          qty: 1,

          // ✅ already present
          priceText: priceText,

          // ✅ NEW: numeric price for totals
          price: priceNumber,
        },
      ];
    });
  };

  // ✅ Increase qty
  const increaseQty = (name) => {
    setCart((prev) =>
      prev.map((x) => (x.name === name ? { ...x, qty: x.qty + 1 } : x))
    );
  };

  // ✅ Decrease qty
  const decreaseQty = (name) => {
    setCart((prev) =>
      prev
        .map((x) => (x.name === name ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );
  };

  // ✅ Remove item
  const removeFromCart = (name) => {
    setCart((prev) => prev.filter((x) => x.name !== name));
  };

  // ✅ Clear cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
