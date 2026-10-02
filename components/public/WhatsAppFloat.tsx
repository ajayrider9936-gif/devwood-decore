import { waLink } from "@/lib/whatsapp";

export default function WhatsAppFloat({ whatsapp }: { whatsapp: string }) {
  if (!whatsapp) return null;
  return (
    <a
      href={waLink(whatsapp, "Hello Devwood Dekor! I want to enquire about your furniture.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-leaf text-white flex items-center justify-center text-2xl shadow-2xl hover:scale-110 transition-transform"
    >
      💬
    </a>
  );
}
