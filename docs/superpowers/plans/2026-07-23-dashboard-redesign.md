# Dashboard Redesign v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate admin dashboard from 8.5/10 to 9.5+/10 by fixing whitespace, hierarchy, components, and reducing orange to accent-only.

**Architecture:** Modify existing UI components in-place with new designs; restructure AdminDashboard layout to add topbar with search/notif/avatar, greeting action button, chart legend above chart, and increased section spacing. All changes are frontend-only.

**Tech Stack:** React 19 + TypeScript, Tailwind v4 (via `@tailwindcss/vite`), Lucide React, Recharts

## Global Constraints

- Blue/green/red/yellow color variants preserved in all components
- Never change: routing, API calls, data structures, state management, database, business logic, sub-pages
- Dual auth (apiFetch + sessionFetch) preserved unchanged
- Orange strictly accent-only (5%): default icons gray-500, hover orange-500, active orange-500 bg-orange-50
- Border radius: 16px (rounded-2xl) for cards, 12px (rounded-xl) for buttons, 8px (rounded-lg) for inputs
- Shadows: shadow-sm default, hover:shadow-md for interactive cards
- Section gaps: 32-40px (Tailwind mb-8 / space-y-8)
- No ALL CAPS labels except sidebar section headers
- Labels are text-sm, subtitles text-xs
- Build must pass: npm run build (zero tsc errors)

---

### Task 1: Design Tokens + CSS Updates

**Files:**
- Modify: `frontend/src/pages/AdminDashboard.css`

**Interfaces:**
- Consumes: N/A
- Produces: Updated CSS tokens for the redesign

**Changes to make:**

1. `.admin-db-layout`: keep full-width, sidebar goes to left edge
2. `.admin-db-content-area`: padding `2rem 2.5rem`
3. `.admin-db-cards`: gap `1.25rem` (20px)
4. `.admin-db-two-col`: gap `1.5rem` (24px)
5. `.admin-db-actions`: gap `1rem` (16px), grid `repeat(3, 1fr)` on desktop (3 columns instead of 6)
6. Add `.admin-db-topbar-search` class: search input style (bg-gray-100, rounded-lg, w-48)
7. Adjust `.admin-db-sidebar`: width stays 240px, remove the `.admin-db-sidebar-footer` user section styles
8. Keep all existing responsive breakpoints but ensure content-area padding reduces on mobile

---

### Task 2: SidebarItem — Emoji Support + Section Headers

**Files:**
- Modify: `frontend/src/components/ui/SidebarItem.tsx`

**Interfaces:**
- Consumes: N/A (self-contained component)
- Produces: SidebarItem with emoji support

**Current prop interface:**
```typescript
interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}
```

**New interface:**
```typescript
interface SidebarItemProps {
  icon?: LucideIcon;
  emoji?: string;
  label: string;
  active?: boolean;
  section?: boolean;  // true for section headers like "MANAJEMEN"
  onClick?: () => void;
}
```

**Step 1: Rewrite SidebarItem.tsx**

```typescript
interface SidebarItemProps {
  icon?: LucideIcon;
  emoji?: string;
  label: string;
  active?: boolean;
  section?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon: Icon, emoji, label, active, section, onClick }: SidebarItemProps) {
  if (section) {
    return (
      <div className="px-4 py-1.5">
        <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-gray-400">
          {label}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-150 ${
        active
          ? 'bg-orange-50 text-orange-600 font-medium'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {emoji ? (
        <span className="text-lg leading-none">{emoji}</span>
      ) : Icon ? (
        <Icon size={18} className={active ? 'text-orange-500' : 'text-gray-400'} />
      ) : null}
      <span>{label}</span>
    </button>
  );
}
```

**Step 2: Build check**
```bash
npm run build
```
Expected: success

**Step 3: Commit**
```bash
git add frontend/src/components/ui/SidebarItem.tsx
git commit -m "feat: add emoji and section support to SidebarItem"
```

---

### Task 3: StatCard — Raised Card Style

**Files:**
- Modify: `frontend/src/components/ui/StatCard.tsx`

**Interfaces:**
- Consumes: N/A
- Produces: StatCard with raised style (icon on top in container, title, large number, trend)

**Current interface:**
```typescript
interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  description?: string;
  trend?: { value: string; direction: 'up' | 'down' };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}
```

**Step 1: Rewrite StatCard.tsx**

Remove `description` prop. Keep `trend` but simplify display. Add `trendLabel` for "dibanding minggu lalu" text.

New structure:
```
┌──────────────────────┐
│  [icon in container] │  <- icon in w-10 h-10 rounded-xl bg-gray-100, icon gray-500
│  title               │  <- text-sm font-medium text-gray-500
│  value (3xl bold)    │
│  ↑ trend + trendLabel│  <- text-sm, trend arrow colored green/red
└──────────────────────┘
```

**Full new implementation:**

```typescript
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  trend?: { value: string; direction: 'up' | 'down' };
  trendLabel?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const colorMap: Record<string, string> = {
  blue: 'text-blue-600 bg-blue-50',
  green: 'text-green-600 bg-green-50',
  red: 'text-red-600 bg-red-50',
  yellow: 'text-yellow-600 bg-yellow-50',
  purple: 'text-purple-600 bg-purple-50',
};

export function StatCard({ icon: Icon, title, value, trend, trendLabel, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {trend && (
        <p className={`text-sm font-medium flex items-center gap-1 ${
          trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
          <span>{trend.value}</span>
          {trendLabel && <span className="text-xs text-gray-400 font-normal">{trendLabel}</span>}
        </p>
      )}
    </div>
  );
}
```

**Step 2: Build check**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add frontend/src/components/ui/StatCard.tsx
git commit -m "feat: redesign StatCard to raised card style with icon on top"
```

---

### Task 4: ActivityItem — Thicker Timeline + Date Groups + Timestamps

**Files:**
- Modify: `frontend/src/components/ui/ActivityItem.tsx`

**Interfaces:**
- Consumes: N/A
- Produces: ActivityItem with 6px dots, 2px lines, timestamp, color-coded dot

**Current interface:**
```typescript
interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  isLast?: boolean;
}
```

**Step 1: Rewrite ActivityItem.tsx**

```typescript
import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;         // "09:15"
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  isLast?: boolean;
}

const dotColors: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
};

const iconColors: Record<string, string> = {
  blue: 'text-blue-600 bg-blue-50',
  green: 'text-green-600 bg-green-50',
  red: 'text-red-600 bg-red-50',
  yellow: 'text-yellow-600 bg-yellow-50',
  purple: 'text-purple-600 bg-purple-50',
};

export function ActivityItem({ icon: Icon, title, description, time, color = 'blue', isLast }: ActivityItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-[6px] h-[6px] rounded-full mt-1.5 ${dotColors[color]}`} />
        {!isLast && <div className="w-[2px] flex-1 bg-gray-200 mt-1" />}
      </div>
      <div className={`flex items-start gap-3 flex-1 pb-4 ${isLast ? '' : ''}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[color]}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{time}</span>
          </div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Build check**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add frontend/src/components/ui/ActivityItem.tsx
git commit -m "feat: update ActivityItem with thicker timeline, timestamps, colored dots"
```

---

### Task 5: QuickActionCard — SaaS Card Style

**Files:**
- Modify: `frontend/src/components/ui/QuickActionCard.tsx`

**Interfaces:**
- Consumes: N/A
- Produces: QuickActionCard with divider + "Buka →" CTA

**Current interface:**
```typescript
interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
}
```

**Step 1: Rewrite QuickActionCard.tsx**

```typescript
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
}

export function QuickActionCard({ icon: Icon, label, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm p-5 text-left hover:shadow-md hover:-translate-y-1 hover:border-orange-500 border border-transparent transition-all duration-200 group flex flex-col"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-orange-50 transition-colors">
        <Icon size={20} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
        {label}
      </p>
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{description}</p>
      )}
      <div className="border-t border-gray-100 my-3" />
      <div className="flex items-center gap-1 text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
        <span>Buka</span>
        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
      </div>
    </button>
  );
}
```

**Step 2: Build check**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add frontend/src/components/ui/QuickActionCard.tsx
git commit -m "feat: redesign QuickActionCard to SaaS style with divider and arrow"
```

---

### Task 6: Skeleton — Update to Match New Component Shapes

**Files:**
- Modify: `frontend/src/components/ui/Skeleton.tsx`

**Interfaces:**
- Consumes: N/A
- Produces: Updated skeletons matching new StatCard, ActivityItem, QuickActionCard shapes

**Step 1: Rewrite Skeleton.tsx**

```typescript
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <Skeleton className="w-10 h-10 rounded-xl mb-3" />
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div>
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-[240px] w-full rounded-xl" />
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-5 w-36" />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-4 mb-2">
          <div className="flex flex-col items-center">
            <Skeleton className="w-[6px] h-[6px] rounded-full" />
            {i < 3 && <Skeleton className="w-[2px] h-8 mt-1" />}
          </div>
          <div className="flex-1 pb-3">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-48 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Build check**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add frontend/src/components/ui/Skeleton.tsx
git commit -m "feat: update skeletons to match new component shapes"
```

---

### Task 7: AdminDashboard — Topbar, Greeting Header, Chart Legend, Layout Restructure

**Files:**
- Modify: `frontend/src/pages/AdminDashboard.tsx`
- Modify: `frontend/src/pages/AdminDashboard.css`

**Interfaces:**
- Consumes: `SidebarItem` (emoji/section support), `StatCard` (new raised style), `ActivityItem` (new), `QuickActionCard` (new)
- Produces: Complete redesigned dashboard layout

**This is the main task. Changes:**

**A. Sidebar section** (in the main render, HTML section):
- Remove `.admin-db-sidebar-footer` (user avatar, name, logout button)
- Add collapse button at bottom of sidebar (◀, simple text)
- Add emoji to each nav item in `navGroups`
- Change nav item rendering to pass `emoji` instead of `icon`

Add emoji field to navGroups:
```typescript
const navGroups = [
  { label: 'Utama', items: [
    { emoji: '🏠', icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard', roles: ['super_admin', 'admin', 'panitia'] }
  ]},
  { label: 'Manajemen', items: [
    { emoji: '👥', icon: Shield, label: 'Role Management', key: 'role-management', roles: ['super_admin', 'admin'] },
    { emoji: '📋', icon: UserCheck, label: 'Verifikasi Pendaftar', key: 'verifikasi-pendaftar', roles: ['super_admin', 'admin'] },
    { emoji: '📧', icon: Mail, label: 'Verifikasi Email', key: 'verifikasi-email', roles: ['super_admin', 'admin'] },
    { emoji: '👤', icon: UserPlus, label: 'Tambah Staff', key: 'tambah-staff', roles: ['super_admin'] },
  ]},
  { label: 'Kegiatan', items: [
    { emoji: '🏢', icon: Building2, label: 'Divisi', key: 'divisi', roles: ['super_admin', 'admin', 'panitia'] },
    { emoji: '📅', icon: Calendar, label: 'Interview', key: 'interview', roles: ['super_admin', 'admin', 'panitia'] },
    { emoji: '📢', icon: VolumeX, label: 'Pengumuman', key: 'pengumuman', roles: ['super_admin', 'admin'] },
    { emoji: '⭐', icon: BarChart3, label: 'Penilaian', key: 'penilaian', roles: ['super_admin', 'admin'] },
  ]},
  { label: 'Pengaturan', items: [
    { emoji: '🎁', icon: LayoutList, label: 'Benefit', key: 'benefit', roles: ['super_admin', 'admin'] },
    { emoji: '⚙️', icon: Settings, label: 'Settings', key: 'settings', roles: ['super_admin', 'admin'] },
  ]},
];
```

**B. Topbar** (current `.admin-db-topbar` section):
- Change search icon to an actual search input:
```tsx
<div className="relative">
  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    placeholder="Cari..."
    className="w-48 lg:focus:w-64 transition-all bg-gray-100 rounded-lg pl-9 pr-3 py-1.5 text-sm text-gray-600 placeholder-gray-400 outline-none focus:bg-white focus:ring-1 focus:ring-gray-300"
  />
</div>
```
- Add theme toggle icon button between bell and avatar
- Avatar: show name text next to avatar circle
- Remove the breadcrumb "Dashboard / {page}" — keep just page title

**C. Greeting Header** (dashboard renderContent section):
- Add "[+ Tambah Staff]" button right-aligned in the header
- Remove orange label "Dashboard" above greeting
- Add subtitle "Pantau seluruh proses Open Recruitment secara real-time."

```tsx
<div className="mb-8">
  <div className="flex items-center justify-between mb-2">
    <h1 className="text-2xl font-semibold text-gray-900">
      Selamat datang kembali, {firstName} 👋
    </h1>
    {user?.roles?.includes('super_admin') && (
      <button
        onClick={() => handleSidebarClick('tambah-staff')}
        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
      >
        <UserPlus size={16} />
        Tambah Staff
      </button>
    )}
  </div>
  <p className="text-sm text-gray-500 max-w-xl">
    Pantau seluruh proses Open Recruitment secara real-time.
  </p>
</div>
```

**D. Chart Legend** (move above the chart):
- Add colored dots with labels at the top of the chart card
```tsx
<div className="flex items-center gap-4 mb-4">
  <div className="flex items-center gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
    <span className="text-xs text-gray-500">Lolos</span>
  </div>
  <div className="flex items-center gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
    <span className="text-xs text-gray-500">Pending</span>
  </div>
  <div className="flex items-center gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
    <span className="text-xs text-gray-500">Interview</span>
  </div>
</div>
```
- Make grid lines thinner: `<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={0.5} />`

**E. Section Spacing:**
- Wrap main dashboard sections with `mb-8` or `space-y-8`
- StatCards grid: `mb-8`
- Two-col grid: `mb-8`
- Quick Actions: heading `mb-4`, grid `gap-4`

**F. Activity section update:**
- Add date group headers ("Hari Ini", "Kemarin") before activity items
- Update time values to timestamp format ("09:15", "09:02", etc.)
- Add colored dots matching action type

**Step 1: Modify AdminDashboard.tsx**

Apply all changes A-F above. Key specifics:

- Add `emoji` field to each item in navGroups array
- Render `<SidebarItem section />` for group labels (replacing nav-group-label divs)
- Render `<SidebarItem emoji={item.emoji} />` instead of `<SidebarItem icon={item.icon} />`
- Remove sidebar footer section
- Add collapse button at bottom of sidebar
- Change search icon to input in topbar
- Add theme toggle button
- Redesign greeting header with action button
- Move chart legend above chart
- Add date group headers in activity section
- Update section spacing to mb-8

**Step 2: Build check**
```bash
npm run build
```

**Step 3: Commit**
```bash
git add frontend/src/pages/AdminDashboard.tsx frontend/src/pages/AdminDashboard.css
git commit -m "feat: restructure AdminDashboard with topbar, greeting action, legend above, improved spacing"
```
