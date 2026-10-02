"use client";

import { useState } from "react";
import { waLink } from "@/lib/whatsapp";

export default function ContactForm({ whatsapp, siteName }: { whatsapp: string; siteName: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const send = () => {
    const text = `Hello ${siteName}!%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0A%0A${encodeURIComponent(message)}`;
    const url = whatsapp
      ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${text}`
      : waLink("", text);
    window.open(url, "_blank");
  };

  const inputCls = "w-full border border-line rounded-xl px-4 py-3 text-sm bg-ivory";

  return (
    <div className="bg-white border border-line rounded-2xl p-7">
      <h3 className="font-display text-xl font-bold text-walnut mb-5">Send a Message</h3>
      <div className="space-y-4">
        <input className={inputCls} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={inputCls} placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <textarea className={inputCls} rows={4} placeholder="What are you looking for?" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button
          onClick={send}
          disabled={!name.trim() || !message.trim()}
          className="w-full bg-leaf text-white font-bold py-3.5 rounded-xl disabled:opacity-40 hover:opacity-90"
        >
          💬 Send via WhatsApp
        </button>
        <p className="text-xs text-muted text-center">Opens WhatsApp with your message ready to send.</p>
      </div>
    </div>
  );
}
