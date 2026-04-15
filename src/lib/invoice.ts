export type InvoiceItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type InvoiceData = {
  invoiceId: string;
  orderId: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address?: string;
  notes?: string;
  items: InvoiceItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
};

const INVOICE_STORAGE_KEY = "bholenath-latest-invoice";

export function saveInvoice(data: InvoiceData) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(data));
}

export function readInvoice() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(INVOICE_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as InvoiceData;
  } catch (error) {
    console.error("Failed to read stored invoice:", error);
    return null;
  }
}
