'use client'

import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronDown, Search, Star, Clock, MapPin, Package } from 'lucide-react';
import { HeartRounded, Tag01, ShoppingBag01, Award01 } from '@untitledui/icons';
import { cn } from '@/lib/utils'

// ─── Mock data ────────────────────────────────────────────────────────────────

const restaurants = [
  {
    id: 1,
    name: 'Xin Feng Kee Curry Rice - Ayer Raj...',
    rating: 4.7, reviews: '13', priceRange: '$$', cuisine: 'Chinese',
    pickupTime: 7, distance: 0.2, discount: '20% off',
  },
  {
    id: 2,
    name: 'Kebabs Faktory - Ayer Rajah Food...',
    rating: 3.9, reviews: '1K+', priceRange: '$$', cuisine: 'Fast Food',
    pickupTime: 7, distance: 0.2, discount: '20% off',
  },
  {
    id: 3,
    name: 'Ice Cream Vending Machine (Unma...',
    cuisine: 'Convenience',
    pickupTime: 7, distance: 0.4,
  },
  {
    id: 4,
    name: 'West The Food - Ayer Rajah Cresc...',
    rating: 4.0, reviews: '2', priceRange: '$$', cuisine: 'Western',
    pickupTime: 15, distance: 0.4, discount: '20% off', badge: 'Islandwide',
  },
]

// ─── Restaurant card ───────────────────────────────────────────────────────────

function RestaurantCard({ r }: { r: typeof restaurants[0] }) {
  return (
    <button className="flex gap-4 px-4 py-4 text-left w-full hover:bg-[var(--color-background-accent)] transition-colors">
      {/* Image placeholder */}
      <div className="w-24 h-24 shrink-0 rounded-[var(--radius-md)] bg-[var(--color-background-muted)] relative overflow-hidden">
        {r.badge && (
          <div className="absolute bottom-1.5 left-1.5 bg-[#00b14f] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {r.badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1 pt-0.5">
        <p className="text-sm font-semibold text-[var(--color-background-default-foreground)] leading-snug">
          {r.name}
        </p>

        {/* Rating + price + cuisine */}
        {(r.rating || r.cuisine) && (
          <div className="flex items-center gap-1 flex-wrap">
            {r.rating && (
              <>
                <Star className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                <span className="text-xs font-medium text-[var(--color-background-default-foreground)]">{r.rating}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">({r.reviews})</span>
                <span className="text-xs text-[var(--color-text-secondary)]">·</span>
                <span className="text-xs text-[var(--color-text-secondary)]">{r.priceRange}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">·</span>
              </>
            )}
            <span className="text-xs text-[var(--color-text-secondary)]">{r.cuisine}</span>
          </div>
        )}

        {/* Time + distance */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[var(--color-icon-muted)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">Pick up in {r.pickupTime} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[var(--color-icon-muted)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">{r.distance} km</span>
          </div>
        </div>

        {/* Discount badge */}
        {r.discount && (
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex items-center gap-1 border border-[var(--color-border-default)] rounded-full px-2.5 py-0.5">
              <Tag01 className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-[var(--color-background-default-foreground)] font-medium">{r.discount}</span>
            </div>
          </div>
        )}
      </div>
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PickupPage() {
  return (
    <div className="flex flex-col flex-1">

      {/* Gradient header */}
      <div style={{ background: 'linear-gradient(180deg, #4ecdc4 0%, #44b09a 100%)' }}>
        {/* Top nav */}
        <div className="flex items-center justify-between px-4 pt-3 pb-3">
          <div className="flex items-center gap-3">
            <button className="text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-white text-[10px] font-medium uppercase tracking-wide opacity-80">Pickups Near</p>
              <button className="flex items-center gap-1">
                <span className="text-white font-bold text-base">75 Ayer Rajah Cres</span>
                <ChevronDown className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <HeartRounded className="h-4 w-4 text-white" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <ShoppingBag01 className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 h-12">
            <Search className="h-5 w-5 text-[var(--color-icon-muted)] shrink-0" />
            <span className="text-sm text-[var(--color-input-placeholder)]">What are you getting?</span>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="h-40 bg-[#e8f4f0] relative flex items-center justify-center">
          <span className="text-xs text-[var(--color-text-secondary)]">Map</span>
          {/* Location dot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />
          {/* Recenter button */}
          <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
            <MapPin className="h-4 w-4 text-[var(--color-icon-default)]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 py-3">
          {[
            { label: 'Delivery', icon: <Package className="h-4 w-4" />, active: false },
            { label: 'Pickup', icon: <ShoppingBag01 className="h-4 w-4" />, active: true },
            { label: 'Dine Out Deals', icon: <Award01 className="h-4 w-4" />, active: false },
          ].map(tab => (
            <button
              key={tab.label}
              className={cn(
                'flex items-center gap-1.5 px-3 h-9 rounded-full text-sm font-medium transition-colors',
                tab.active
                  ? 'bg-[#1a2b2b] text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[var(--color-background-default)]">
        {/* Section handle */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 rounded-full bg-[var(--color-border-default)]" />
        </div>

        {/* Section title */}
        <div className="px-4 pb-2">
          <h2 className="text-xl font-bold text-[var(--color-background-default-foreground)]">Up to 20% Off Pick up</h2>
        </div>

        {/* Restaurant list */}
        <div className="divide-y divide-[var(--color-border-default)]">
          {restaurants.map(r => <RestaurantCard key={r.id} r={r} />)}
        </div>
      </div>
    </div>
  )
}
