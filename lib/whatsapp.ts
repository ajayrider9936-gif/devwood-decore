/** Build a WhatsApp chat link with a pre-filled message. */
export function waLink(phone: string, message: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(productName: string, price: number): string {
  return `Hello Devwood Dekor! I am interested in "${productName}" (₹${Number(
    price
  ).toLocaleString("en-IN")}). Please share details.`;
}
