import { useState, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Simple global cart state using a singleton pattern
let cartItems: CartItem[] = [];
let listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function addToCart(item: Omit<CartItem, "quantity">) {
  const existing = cartItems.find((i) => i.id === item.id);
  if (existing) {
    cartItems = cartItems.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
    );
  } else {
    cartItems = [...cartItems, { ...item, quantity: 1 }];
  }
  notifyListeners();
}

export function removeFromCart(id: string) {
  cartItems = cartItems.filter((i) => i.id !== id);
  notifyListeners();
}

export function updateQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }
  cartItems = cartItems.map((i) => (i.id === id ? { ...i, quantity } : i));
  notifyListeners();
}

export function getCartItems(): CartItem[] {
  return cartItems;
}

export function getCartTotal(): number {
  return cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function getCartCount(): number {
  return cartItems.reduce((sum, i) => sum + i.quantity, 0);
}

export function useCart() {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return {
    items: getCartItems(),
    total: getCartTotal(),
    count: getCartCount(),
    addToCart,
    removeFromCart,
    updateQuantity,
  };
}
