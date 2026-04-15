import { useSyncExternalStore } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

let cartItems: CartItem[] = [];
let listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot() {
  return cartItems;
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

export function getCartCount(): number {
  return cartItems.reduce((sum, i) => sum + i.quantity, 0);
}

export function clearCart() {
  cartItems = [];
  notifyListeners();
}

export function useCartSnapshot() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    total,
    count,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
}
