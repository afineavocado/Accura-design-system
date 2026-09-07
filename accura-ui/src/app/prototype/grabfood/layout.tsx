export default function GrabFoodLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background-muted)] flex items-start justify-center py-8">
      <div className="w-[390px] min-h-[844px] bg-[var(--color-background-default)] overflow-hidden flex flex-col relative"
        style={{ borderRadius: 44, boxShadow: '0 0 0 8px #1c1c1e, 0 20px 60px rgba(0,0,0,0.3)' }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 shrink-0" style={{ background: 'linear-gradient(180deg, #4ecdc4 0%, #44b09a 100%)' }}>
          <span className="text-sm font-semibold text-white">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3">
              {[2,3,4,5].map(h => <div key={h} className="w-1 bg-white rounded-sm" style={{ height: h * 2.5 }} />)}
            </div>
            <div className="text-white text-xs">▲</div>
            <div className="w-6 h-3 border border-white rounded-sm relative">
              <div className="absolute inset-0.5 right-1 bg-white rounded-sm" />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
