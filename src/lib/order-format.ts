export function formatOrderNumber(
  orderId?: string | null,
  createdAt?: string | null
) {
  if (!orderId) return "#Pending";

  const date = createdAt ? new Date(createdAt) : new Date();
  const datePart = Number.isNaN(date.getTime())
    ? "000000"
    : [
        String(date.getFullYear()).slice(-2),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("");

  let hash = 0;
  for (let index = 0; index < orderId.length; index += 1) {
    hash = (hash * 31 + orderId.charCodeAt(index)) % 10000;
  }

  return `#${datePart}${String(hash).padStart(4, "0")}`;
}
