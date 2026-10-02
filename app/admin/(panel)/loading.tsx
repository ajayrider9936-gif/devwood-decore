/**
 * Instant loading state for admin panel navigation.
 * Next.js renders this the moment a link is clicked, so the UI never
 * feels frozen while the server prepares the next page.
 */
export default function PanelLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-44 bg-[#E9DFCB] rounded-lg" />
        <div className="h-10 w-36 bg-[#E9DFCB] rounded-full" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-line rounded-2xl p-5">
            <div className="h-7 w-7 bg-[#EFE6D2] rounded-lg mb-3" />
            <div className="h-8 w-16 bg-[#EFE6D2] rounded-lg mb-2" />
            <div className="h-3 w-24 bg-[#F3ECDC] rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[#F0E8D6] last:border-0">
            <div className="h-11 w-11 bg-[#EFE6D2] rounded-lg flex-none" />
            <div className="flex-1">
              <div className="h-4 w-40 bg-[#EFE6D2] rounded mb-2" />
              <div className="h-3 w-24 bg-[#F3ECDC] rounded" />
            </div>
            <div className="h-6 w-16 bg-[#F3ECDC] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
