export default function TrustStrip() {
  const items = [
    ["500+", "Happy Homes"],
    ["Pan-India", "Delivery"],
    ["5-Year", "Warranty"],
    ["Custom", "Orders"],
  ];
  return (
    <div className="bg-walnut text-[#EFE3CC]">
      <div className="max-w-7xl mx-auto px-5 py-4 flex flex-wrap justify-center gap-x-12 gap-y-2 text-sm font-semibold">
        {items.map(([b, l]) => (
          <span key={l}>
            <b className="text-gold">{b}</b> {l}
          </span>
        ))}
      </div>
    </div>
  );
}
