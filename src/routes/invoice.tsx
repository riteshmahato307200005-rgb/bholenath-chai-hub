import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { readInvoice, type InvoiceData } from "@/lib/invoice";

export const Route = createFileRoute("/invoice")({
  component: InvoicePage,
});

function InvoicePage() {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);

  useEffect(() => {
    setInvoice(readInvoice());
  }, []);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white px-4 pb-20 pt-24">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-3xl font-heading font-bold text-chai-brown">
            Invoice not found
          </h1>
          <p className="mt-4 text-muted-foreground">
            Complete an online payment first, then your invoice will appear
            here.
          </p>
          <Button asChild className="mt-6 bg-gradient-saffron text-white">
            <Link to="/menu">Back to menu</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white px-4 pb-20 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg"
      >
        <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-saffron-dark">
              Payment invoice
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold text-chai-brown">
              Bholenath Chai Hub
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for your payment. Keep this invoice for your records.
            </p>
          </div>

          <div className="rounded-2xl bg-cream p-4 text-sm text-foreground">
            <p>
              <span className="font-semibold">Invoice ID:</span>{" "}
              {invoice.invoiceId}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Order ID:</span> {invoice.orderId}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Payment ID:</span>{" "}
              {invoice.paymentId}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(invoice.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-foreground">Customer details</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {invoice.customerName}
            </p>
            <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>
            <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
            {invoice.address ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {invoice.address}
              </p>
            ) : null}
            {invoice.notes ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Notes: {invoice.notes}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-foreground">Payment details</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Method: {invoice.paymentMethod}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Status: Paid successfully
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Total paid: Rs. {invoice.totalAmount}
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream">
              <tr>
                <th className="px-4 py-3 font-semibold text-foreground">Item</th>
                <th className="px-4 py-3 font-semibold text-foreground">Qty</th>
                <th className="px-4 py-3 font-semibold text-foreground">Price</th>
                <th className="px-4 py-3 font-semibold text-right text-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 text-muted-foreground">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Rs. {item.price}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    Rs. {item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              This invoice confirms a successful Razorpay payment.
            </p>
            <p className="mt-1 text-lg font-bold text-chai-brown">
              Grand Total: Rs. {invoice.totalAmount}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={() => window.print()}>
              Print / Save PDF
            </Button>
            <Button asChild className="bg-gradient-saffron text-white">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
