export default function TrustStrip() {
  const items = [
    ["Solid Wood", "Sheesham & Teak"],
    ["Handcrafted", "By Artisans"],
    ["Made in India", "Rajasthan"],
    ["Custom Orders", "On Request"],
  ];
  return (
    <div className="bg-walnut text-[#EFE3CC]">
      <div className="max-w-7xl mx-auto px-5 py-4 flex flex-wrap justify-center gap-x-12 gap-y-2 text-sm font-semibold">
        {items.map(([b, l]) => (
          <span key={l} className="tracking-wide">
            <b className="text-gold font-extrabold">{b}</b> <span className="opacity-80">{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
