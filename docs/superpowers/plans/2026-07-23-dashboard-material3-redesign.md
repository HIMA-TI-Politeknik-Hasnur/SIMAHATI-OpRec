# Dashboard Material 3 Redesign (v4) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the admin dashboard to match Material 3-inspired reference HTML (orange palette, Hanken Grotesk/JetBrains Mono, timeline activity, soft-glow cards, Material Symbols icons).

**Architecture:** Replace Lucide icons with Material Symbols, overhaul all dashboard components' JSX/CSS, update global Tailwind config and fonts, delete heavy AdminDashboard.css in favor of Tailwind utilities + 3 custom classes.

**Tech Stack:** React 19, TypeScript, Tailwind v4 via `@tailwindcss/vite`, Material Symbols (Google Fonts), Recharts (restyled), Hanken Grotesk + Inter + JetBrains Mono.

---

### Task 1: Foundation — Google Fonts + Tailwind Config + MaterialSymbol Component

**Files:**
- Modify: `frontend/index.html`
- Create: `frontend/src/components/ui/MaterialSymbol.tsx`
- Modify: `frontend/src/components/ui/index.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `<MaterialSymbol icon="..." />` component usable by all subsequent tasks

- [ ] **Step 1: Add Google Fonts + Tailwind config to index.html**

Add Material Symbols, Hanken Grotesk, Inter, and JetBrains Mono font links AND updated tailwind.config to `frontend/index.html`.

Replace the existing `<head>` tailwind config section. The new config uses the Material 3 color tokens, new fonts, and new radius/spacing tokens.

```diff
+ <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
+ <script>
+ tailwind.config = {
+   darkMode: 'class',
+   theme: {
+     extend: {
+       colors: {
+         primary: '#9d4300',
+         'primary-container': '#f97316',
+         'on-primary': '#ffffff',
+         'primary-fixed': '#ffdbca',
+         'primary-fixed-dim': '#ffb690',
+         'on-primary-fixed': '#341100',
+         'on-primary-fixed-variant': '#783200',
+         'inverse-primary': '#ffb690',
+         secondary: '#565e74',
+         'secondary-container': '#dae2fd',
+         'on-secondary': '#ffffff',
+         'on-secondary-container': '#5c647a',
+         'secondary-fixed': '#dae2fd',
+         'secondary-fixed-dim': '#bec6e0',
+         'on-secondary-fixed': '#131b2e',
+         'on-secondary-fixed-variant': '#3f465c',
+         tertiary: '#855316',
+         'tertiary-container': '#ca8e4c',
+         'on-tertiary': '#ffffff',
+         'on-tertiary-container': '#4c2a00',
+         'tertiary-fixed': '#ffdcbd',
+         'tertiary-fixed-dim': '#fcb973',
+         'on-tertiary-fixed': '#2c1600',
+         'on-tertiary-fixed-variant': '#683c00',
+         error: '#ba1a1a',
+         'error-container': '#ffdad6',
+         'on-error': '#ffffff',
+         'on-error-container': '#93000a',
+         surface: '#f8f9ff',
+         'surface-dim': '#cbdbf5',
+         'surface-bright': '#f8f9ff',
+         'surface-container-lowest': '#ffffff',
+         'surface-container-low': '#eff4ff',
+         'surface-container': '#e5eeff',
+         'surface-container-high': '#dce9ff',
+         'surface-container-highest': '#d3e4fe',
+         'on-surface': '#0b1c30',
+         'on-surface-variant': '#584237',
+         outline: '#8c7164',
+         'outline-variant': '#e0c0b1',
+         background: '#f8f9ff',
+         'on-background': '#0b1c30',
+         'surface-tint': '#9d4300',
+         'inverse-surface': '#213145',
+         'inverse-on-surface': '#eaf1ff',
+       },
+       borderRadius: {
+         DEFAULT: '0.125rem',
+         lg: '0.25rem',
+         xl: '0.5rem',
+         full: '0.75rem',
+       },
+       spacing: {
+         base: '4px',
+         xs: '4px',
+         sm: '8px',
+         md: '16px',
+         lg: '24px',
+         xl: '32px',
+         gutter: '16px',
+         'container-padding': '24px',
+         'sidebar-width': '260px',
+       },
+       fontFamily: {
+         'headline-lg': ['Hanken Grotesk'],
+         'headline-md': ['Hanken Grotesk'],
+         'headline-sm': ['Hanken Grotesk'],
+         'body-lg': ['Inter'],
+         'body-md': ['Inter'],
+         'body-sm': ['Inter'],
+         'label-md': ['JetBrains Mono'],
+       },
+       fontSize: {
+         'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }],
+         'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
+         'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
+         'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
+         'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
+         'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
+         'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500' }],
+       },
+     },
+   },
+ };
+ </script>
```

- [ ] **Step 2: Create MaterialSymbol component**

Create `frontend/src/components/ui/MaterialSymbol.tsx`:

```tsx
interface MaterialSymbolProps {
  icon: string;
  className?: string;
  fill?: boolean;
  weight?: number;
}

export function MaterialSymbol({ icon, className = '', fill, weight }: MaterialSymbolProps) {
  return (
    <span
      className={`material-symbols-outlined leading-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'WGRT' ${weight ?? 400}`,
      }}
    >
      {icon}
    </span>
  );
}
```

- [ ] **Step 3: Export from barrel**

Add to `frontend/src/components/ui/index.ts`:
```diff
+ export { MaterialSymbol } from './MaterialSymbol';
```

- [ ] **Step 4: Run build**

```bash
npm run build
```
Expected: zero errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/index.html frontend/src/components/ui/MaterialSymbol.tsx frontend/src/components/ui/index.ts
git commit -m "feat: add Material Symbols, Google Fonts, Tailwind v4 tokens, MaterialSymbol component"
```

---

### Task 2: SidebarItem Overhaul

**Files:**
- Modify: `frontend/src/components/ui/SidebarItem.tsx`

**Interfaces:**
- Consumes: `MaterialSymbol` component (Task 1)
- Produces: `SidebarItem` (with `icon` string prop for Material Symbol name instead of LucideIcon), `SidebarItem.Section` subcomponent

- [ ] **Step 1: Rewrite SidebarItem.tsx**

Replace the entire file. Key changes:
- `icon` prop changes from `LucideIcon` to `string` (Material Symbol name)
- Remove `emoji` prop (no longer needed — icons are consistent now)
- Active state: `bg-primary/10 border-l-4 border-primary text-primary font-bold rounded-r-lg`
- Inactive: `text-on-surface-variant hover:bg-surface-container-high rounded-lg`
- Icon size: `text-[20px]` Material Symbol
- Label: `font-label-md text-label-md`
- Keep `.Section` subcomponent with `text-[10px] text-outline uppercase tracking-wider`

```tsx
interface SidebarItemProps {
  icon?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItemSection({ label }: { label: string }) {
  return (
    <div className="mb-2">
      <span className="font-label-md text-[10px] text-outline uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function SidebarItemComponent({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-3 px-4 text-sm transition-all duration-150 ${
        active
          ? 'bg-primary/10 border-l-4 border-primary text-primary font-bold rounded-r-lg'
          : 'text-on-surface-variant hover:bg-surface-container-high rounded-lg border-l-4 border-transparent'
      }`}
    >
      {icon && <MaterialSymbol icon={icon} className="text-[20px]" />}
      <span className="font-label-md text-label-md">{label}</span>
    </button>
  );
}

export const SidebarItem = Object.assign(SidebarItemComponent, { Section: SidebarItemSection });
```

- [ ] **Step 2: Run build**

```bash
npm run build
```
Expected: zero errors (AdminDashboard will still use old props — fix in Task 6).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/SidebarItem.tsx
git commit -m "feat: overhaul SidebarItem with Material Symbols and Material 3 styling"
```

---

### Task 3: StatCard Overhaul

**Files:**
- Modify: `frontend/src/components/ui/StatCard.tsx`

**Interfaces:**
- Consumes: `MaterialSymbol` component (Task 1)
- Produces: `StatCard` with new layout (icon right, trend indicator, soft-glow)

- [ ] **Step 1: Rewrite StatCard.tsx**

Changes:
- `icon` prop from `LucideIcon` to `string` (Material Symbol name)
- `color` prop maps to: `blue`→`primary`, `green`→`primary`, `yellow`→`tertiary`, `red`→`error`
- New layout: `flex items-start justify-between` — label+value on left, icon on right
- Icon container: `w-12 h-12 rounded-lg bg-{color}/10` → `group-hover:bg-{color} group-hover:text-white`
- Trend: `<MaterialSymbol icon="trending_up" /> +100%` in `text-primary font-bold`
- Card: `bg-white p-6 rounded-xl border border-white hover:border-{color}/20 transition-all group`

```tsx
interface StatCardProps {
  icon?: string;
  title: string;
  value: number | string;
  description?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string };
}

const colorMap: Record<string, { border: string; bg: string; text: string; hoverBorder: string }> = {
  blue:    { border: 'hover:border-primary/20',     bg: 'bg-primary/10',   text: 'text-primary',   hoverBg: 'group-hover:bg-primary' },
  green:   { border: 'hover:border-primary/20',     bg: 'bg-primary/10',   text: 'text-primary',   hoverBg: 'group-hover:bg-primary' },
  yellow:  { border: 'hover:border-tertiary/20',    bg: 'bg-tertiary-fixed/40', text: 'text-tertiary', hoverBg: 'group-hover:bg-tertiary' },
  red:     { border: 'hover:border-error/20',       bg: 'bg-error-container/40', text: 'text-error', hoverBg: 'group-hover:bg-error' },
};

export function StatCard({ icon, title, value, description, color = 'blue', trend }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`bg-white p-6 rounded-xl border border-white ${c.border} transition-all group cursor-default`}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="font-label-md text-on-surface-variant">{title}</p>
          <h3 className="text-headline-lg font-bold text-on-background">{value}</h3>
          {trend ? (
            <div className="flex items-center gap-1 font-bold text-[11px]">
              <MaterialSymbol icon={trend.direction === 'up' ? 'trending_up' : trend.direction === 'down' ? 'trending_down' : 'remove'} className={`text-[14px] ${trend.direction === 'neutral' ? 'text-outline' : c.text}`} />
              <span className={trend.direction === 'neutral' ? 'text-outline' : c.text}>{trend.value}</span>
            </div>
          ) : description ? (
            <p className="text-body-sm text-outline">{description}</p>
          ) : null}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg ${c.bg} flex items-center justify-center ${c.text} ${c.hoverBg} group-hover:text-white transition-all`}>
            <MaterialSymbol icon={icon} />
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run build**

```bash
npm run build
```
Expected: zero errors (AdminDashboard old props fixed in Task 6).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/StatCard.tsx
git commit -m "feat: overhaul StatCard with Material Symbols, trend, soft-glow"
```

---

### Task 4: ActivityItem Overhaul

**Files:**
- Modify: `frontend/src/components/ui/ActivityItem.tsx`

**Interfaces:**
- Consumes: `MaterialSymbol` component (Task 1)
- Produces: `ActivityItem` with timeline line, circled icons, timestamp

- [ ] **Step 1: Rewrite ActivityItem.tsx**

Changes:
- `icon` prop from `LucideIcon` to `string` (Material Symbol name)
- `color` prop maps to icon bg color: `blue`→`bg-primary`, `green`→`bg-primary`, `yellow`→`bg-tertiary`, `red`→`bg-error`
- Layout: dot circle 24px with icon + ring, text content, timestamp
- No `isLast` prop needed (timeline line handled by parent `.timeline-line` class)

```diff
- import type { LucideIcon } from 'lucide-react';
+ import { MaterialSymbol } from './MaterialSymbol';

interface ActivityItemProps {
- icon: LucideIcon;
+ icon: string;
  title: string;
  description: string;
  time: string;
  color?: string;
- isLast?: boolean;
}

const dotColors: Record<string, string> = {
  blue: 'bg-primary',
  green: 'bg-primary',
  yellow: 'bg-tertiary',
  red: 'bg-error',
};

export function ActivityItem({ icon, title, description, time, color = 'blue' }: ActivityItemProps) {
  return (
    <div className="relative pl-10 pb-8 last:pb-0">
      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${dotColors[color] || 'bg-primary'} flex items-center justify-center text-white ring-4 ring-white z-10`}>
        <MaterialSymbol icon={icon} className="text-[14px]" />
      </div>
      <div className="space-y-0.5">
        <p className="font-bold text-body-md text-on-background">{title}</p>
        <p className="text-body-md text-on-surface-variant">{description}</p>
        <p className="text-[10px] text-outline font-label-md uppercase tracking-wider">{time}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run build**

```bash
npm run build
```
Expected: zero errors (AdminDashboard old props fixed in Task 6).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/ActivityItem.tsx
git commit -m "feat: overhaul ActivityItem with timeline dots, Material Symbols"
```

---

### Task 5: QuickActionCard Overhaul

**Files:**
- Modify: `frontend/src/components/ui/QuickActionCard.tsx`

**Interfaces:**
- Consumes: `MaterialSymbol` component (Task 1)
- Produces: `QuickActionCard` with rounded-full icon, "Buka →" arrow, soft-glow

- [ ] **Step 1: Rewrite QuickActionCard.tsx**

```diff
- import type { LucideIcon } from 'lucide-react';
+ import { MaterialSymbol } from './MaterialSymbol';

interface QuickActionCardProps {
- icon: LucideIcon;
+ icon: string;
  label: string;
  description: string;
  onClick?: () => void;
}

export function QuickActionCard({ icon, label, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white p-6 rounded-xl border border-white hover:border-primary/30 transition-all group cursor-pointer"
    >
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
          <MaterialSymbol icon={icon} />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-on-background group-hover:text-primary transition-colors">{label}</h5>
          <p className="text-body-md text-on-surface-variant mt-1">{description}</p>
          <div className="mt-3 flex items-center gap-1 text-primary font-bold font-label-md">
            <span>Buka</span>
            <MaterialSymbol icon="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Run build**

```bash
npm run build
```
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/QuickActionCard.tsx
git commit -m "feat: overhaul QuickActionCard with rounded icon, arrow CTA, soft-glow"
```

---

### Task 6: AdminDashboard Full Restructure + CSS Rewrite

**Files:**
- Modify: `frontend/src/pages/AdminDashboard.tsx`
- Modify: `frontend/src/pages/AdminDashboard.css`

**Interfaces:**
- Consumes: `MaterialSymbol` (Task 1), `SidebarItem` (Task 2), `StatCard` (Task 3), `ActivityItem` (Task 4), `QuickActionCard` (Task 5), `Skeleton` (existing, updated in Task 7)
- Produces: Fully redesigned dashboard page

- [ ] **Step 1: Rewrite AdminDashboard.css**

Replace entire file with minimal CSS:

```css
.soft-glow {
  box-shadow: 0px 1px 3px rgba(0,0,0,0.05), 0px 4px 6px rgba(0,0,0,0.02);
}

.timeline-line::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 24px;
  bottom: 0;
  width: 2px;
  background: #e2e8f0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
```

- [ ] **Step 2: Restructure AdminDashboard.tsx**

Major changes:
1. Remove all Lucide imports, replace with `MaterialSymbol`
2. Update navGroups items: `icon` becomes string (Material Symbol name), e.g. `'dashboard'`, `'admin_panel_settings'`
3. Replace sidebar header with "SIMAHATI OpRec" + "PANEL ADMIN"
4. Replace active nav styling
5. Replace topbar with search input + theme toggle + bell + avatar + Dashboard/Logout buttons
6. Replace greeting with Filter Data button
7. Update StatCard usage to new props (icon string, trend)
8. Restructure chart section with legend above
9. Update ActivityItem usage (icon string, remove isLast)
10. Update QuickActionCard usage (icon string)
11. Add footer

Key changes to imports:
```diff
- import { LayoutDashboard, Shield, UserCheck, Mail, UserPlus, Building2, Calendar, VolumeX, BarChart3, LayoutList, Settings, Users, Clock, XCircle, Star, AlertTriangle, RefreshCw, LogOut, Search, Bell, ChevronDown, Menu, PanelLeftClose, Sun, Filter } from 'lucide-react';
+ import { MaterialSymbol } from '../components/ui';
```

Key JSX structure:
```tsx
return (
  <div className="min-h-screen bg-background text-on-background flex">
    {/* Sidebar */}
    <aside className="fixed left-0 top-0 h-full w-sidebar-width bg-white border-r border-outline-variant flex flex-col z-50">
      <div className="px-6 py-8 flex flex-col gap-1">
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
          SIMAHATI OpRec
        </h1>
        <p className="font-label-md text-label-md text-outline tracking-widest uppercase">
          PANEL ADMIN
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 custom-scrollbar">
        {navGroups.map(...)}
      </nav>
      <div className="p-4 border-t border-outline-variant">
        <button onClick={...} className="w-full flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all">
          <MaterialSymbol icon="vertical_align_center" className="text-[20px]" />
          <span className="font-label-md text-label-md">Persempit</span>
        </button>
      </div>
    </aside>

    {/* Main */}
    <main className="ml-sidebar-width min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="h-16 px-gutter flex justify-between items-center bg-surface sticky top-0 z-40 border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <MaterialSymbol icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Cari menu..." />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
              <MaterialSymbol icon="light_mode" />
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative">
              <MaterialSymbol icon="notifications" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface" />
            </button>
          </div>
          <div className="h-8 w-px bg-outline-variant" />
          <div className="flex items-center gap-4">
            <button className="px-4 py-1.5 rounded-lg border-2 border-primary text-primary font-bold font-label-md hover:bg-primary/10 transition-colors">
              Dashboard
            </button>
            <button onClick={handleLogoutClick} className="px-4 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md hover:bg-surface-container-highest transition-colors">
              Logout
            </button>
            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-body-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden lg:block">
                <p className="font-label-md text-on-surface leading-none">{user?.name?.split(' ')[0] || 'Admin'}</p>
                <p className="text-[10px] text-outline mt-0.5">{getRoleLabel(user?.roles || [])}</p>
              </div>
              <MaterialSymbol icon="expand_more" className="text-outline group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Greeting */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <h2 className="font-headline-lg text-headline-lg text-on-background">
              Selamat datang, {user?.name?.split(' ')[0] || 'Admin'}
            </h2>
            <p className="text-on-surface-variant text-body-lg">Pantau proses Open Recruitment secara real-time.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-low transition-all shadow-sm">
            <MaterialSymbol icon="filter_list" className="text-[20px]" />
            <span>Filter Data</span>
          </button>
        </section>

        {/* StatCards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon="person" title="Total Pendaftar" value={stats?.total_pendaftar ?? 0} color="blue" trend={{ direction: 'up', value: '+100%' }} />
          <StatCard icon="schedule" title="Pending Verifikasi" value={stats?.pending_verifikasi ?? 0} color="yellow" trend={{ direction: 'neutral', value: 'No change' }} />
          <StatCard icon="verified_user" title="Lolos Administrasi" value={stats?.lolos_administrasi ?? 0} color="green" trend={{ direction: 'up', value: 'Valid' }} />
          <StatCard icon="cancel" title="Ditolak" value={stats?.ditolak_administrasi ?? 0} color="red" trend={{ direction: 'neutral', value: 'Cleared' }} />
        </section>

        {/* Chart + Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-white">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-headline-md text-on-background">Statistik Pendaftar</h4>
                <p className="text-body-md text-on-surface-variant">Data pendaftar periode 2027</p>
              </div>
              <select className="bg-surface-container-low border border-outline-variant rounded-lg text-label-md px-3 py-2 outline-none">
                <option>Bulanan</option>
                <option>Mingguan</option>
              </select>
            </div>

            {/* Legend above chart */}
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tertiary" />
                <span className="text-label-md text-outline">Lolos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-label-md text-outline">Interview</span>
              </div>
            </div>

            {/* Recharts (restyled) */}
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0c0b1" strokeWidth={0.5} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#8c7164" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#8c7164" axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #9d4300', fontSize: 13 }} />
                <Bar dataKey="value" fill="#9d4300" radius={[8, 8, 0, 0]} animationDuration={500} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-xl p-6 border border-white">
            <h4 className="font-headline-md text-on-background mb-6">Aktivitas Terkini</h4>
            <div className="relative timeline-line space-y-0">
              <ActivityItem icon="person_add" title="Total Pendaftar" description="1 pendaftar terdaftar baru." time="10 menit lalu" color="blue" />
              <ActivityItem icon="event" title="Interview Berjalan" description="1 dalam tahap interview akhir." time="1 jam lalu" color="yellow" />
              <ActivityItem icon="verified" title="Lolos Seleksi" description="Hasil verifikasi dokumen selesai." time="Kemarin, 14:30" color="green" />
            </div>
            <button className="w-full mt-6 py-3 rounded-lg border border-outline-variant text-label-md text-on-surface-variant hover:bg-surface-container-low transition-all">
              Lihat Semua Aktivitas
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MaterialSymbol icon="bolt" />
            </div>
            <h4 className="font-headline-md text-on-background">Quick Actions</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.filter(a => user && a.roles.includes(user.roles[0])).map(action => (
              <QuickActionCard key={action.key} icon={action.icon} label={action.label} description={action.description} onClick={() => handleSidebarClick(action.key)} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-auto px-8 py-6 border-t border-outline-variant bg-white flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-body-md text-outline">© 2027 SIMAHATI Open Recruitment System. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a className="text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Support</a>
        </div>
      </footer>
    </main>
  </div>
);
```

Also update `navGroups` to use Material Symbol string names:
```ts
const navGroups = [
  {
    label: 'Utama',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['super_admin', 'admin', 'panitia'] },
    ],
  },
  {
    label: 'Manajemen',
    items: [
      { key: 'role-management', label: 'Role Management', icon: 'admin_panel_settings', roles: ['super_admin', 'admin'] },
      { key: 'verifikasi-pendaftar', label: 'Verifikasi Pendaftar', icon: 'how_to_reg', roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'verifikasi-email', label: 'Verifikasi Email', icon: 'mail', roles: ['super_admin'] },
      { key: 'tambah-staff', label: 'Tambah Staff', icon: 'person_add', roles: ['super_admin'] },
    ],
  },
  {
    label: 'Kegiatan',
    items: [
      { key: 'divisi', label: 'Divisi', icon: 'group_work', roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'interview', label: 'Interview', icon: 'calendar_today', roles: ['super_admin', 'admin', 'panitia', 'interviewer'] },
      { key: 'pengumuman', label: 'Pengumuman', icon: 'campaign', roles: ['super_admin', 'admin', 'panitia'] },
      { key: 'penilaian', label: 'Penilaian', icon: 'star', roles: ['super_admin', 'interviewer'] },
    ],
  },
  {
    label: 'Pengaturan',
    items: [
      { key: 'benefit', label: 'Benefit', icon: 'featured_play_list', roles: ['super_admin', 'admin'] },
      { key: 'settings', label: 'Settings', icon: 'settings', roles: ['super_admin', 'admin'] },
    ],
  },
];

const quickActions = [
  { label: 'Kelola Role', key: 'role-management', icon: 'admin_panel_settings', roles: ['super_admin', 'admin'], description: 'Kelola hak akses pengguna.' },
  { label: 'Verifikasi Pendaftar', key: 'verifikasi-pendaftar', icon: 'person_search', roles: ['super_admin', 'admin', 'panitia'], description: 'Verifikasi data pendaftar baru.' },
  { label: 'Verifikasi Email', key: 'verifikasi-email', icon: 'mark_email_read', roles: ['super_admin'], description: 'Konfirmasi validasi alamat email.' },
  { label: 'Tambah Staff', key: 'tambah-staff', icon: 'person_add_alt_1', roles: ['super_admin'], description: 'Tambahkan anggota tim admin.' },
  { label: 'Atur Divisi', key: 'divisi', icon: 'account_tree', roles: ['super_admin', 'admin', 'panitia'], description: 'Kelola departemen open recruitment.' },
  { label: 'Pengaturan', key: 'settings', icon: 'settings_suggest', roles: ['super_admin', 'admin'], description: 'Konfigurasi sistem global.' },
];
```

Add back `pageTitles` and `getRoleLabel` (removed in v3) since topbar avatar needs role display:
```ts
const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  panitia: 'Panitia',
  interviewer: 'Interviewer',
};

function getRoleLabel(roles: string[]): string {
  for (const r of roles) {
    if (roleLabels[r]) return roleLabels[r];
  }
  return roles[0] || 'User';
}
```

- [ ] **Step 3: Run build**

```bash
npm run build
```
Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/AdminDashboard.tsx frontend/src/pages/AdminDashboard.css
git commit -m "feat: restructure AdminDashboard with Material 3 layout, topbar, sidebar, footer"
```

---

### Task 7: Skeleton Update

**Files:**
- Modify: `frontend/src/components/ui/Skeleton.tsx`

- [ ] **Step 1: Update Skeleton.tsx shapes**

Match new component border-radius, remove unused skeleton variants that no longer match new component shapes.

```tsx
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-surface-container-highest rounded-xl ${className}`} />;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl border border-surface-container-highest animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 bg-surface-container-highest rounded w-24" />
          <div className="h-8 bg-surface-container-highest rounded w-16" />
          <div className="h-3 bg-surface-container-highest rounded w-20" />
        </div>
        <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex-shrink-0" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-surface-container-highest animate-pulse lg:col-span-2">
      <div className="h-5 bg-surface-container-highest rounded w-48 mb-2" />
      <div className="h-3 bg-surface-container-highest rounded w-32 mb-6" />
      <div className="h-[260px] bg-surface-container-highest rounded-lg" />
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-surface-container-highest animate-pulse">
      <div className="h-5 bg-surface-container-highest rounded w-32 mb-6" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-surface-container-highest flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-surface-container-highest rounded w-32" />
              <div className="h-2 bg-surface-container-highest rounded w-48" />
              <div className="h-2 bg-surface-container-highest rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update Skeleton loading in AdminDashboard.tsx**

Update loading JSX to match new layout (sidebar skeleton, topbar skeleton, content skeleton with new card shapes).

- [ ] **Step 3: Run build**

```bash
npm run build
```
Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ui/Skeleton.tsx frontend/src/pages/AdminDashboard.tsx
git commit -m "feat: update skeleton shapes to match Material 3 redesign"
```

---

### Task 8: Verify + Push

- [ ] **Step 1: Final build**

```bash
npm run build
```

- [ ] **Step 2: Push to remote**

```bash
git push origin feat/material3-dashboard-redesign
```
