# Design Spec: Dashboard Material 3 Redesign (v4)

## Objective
Redesign the entire admin dashboard (AdminDashboard + all sub-components) to match the Material 3-inspired reference HTML. Target: pixel-perfect match to the provided design.

## Scope
- Full UI overhaul of: AdminDashboard.tsx, SidebarItem.tsx, StatCard.tsx, ActivityItem.tsx, QuickActionCard.tsx, Skeleton.tsx, AdminDashboard.css, index.html (fonts)
- Zero changes to: React logic, backend, API, routing, state, database, functions, data structures

## Design Tokens

### Color Palette (Material 3)
```
primary:         #9d4300    (orange gelap — active, highlights)
primary-container: #f97316 (orange terang — icon bg hover)
on-primary:      #ffffff
surface:         #f8f9ff
surface-dim:     #cbdbf5
surface-bright:  #f8f9ff
surface-container: #e5eeff
surface-container-low: #eff4ff
surface-container-high: #dce9ff
surface-container-highest: #d3e4fe
surface-container-lowest: #ffffff
on-surface:      #0b1c30
on-surface-variant: #584237
outline:         #8c7164
outline-variant: #e0c0b1
error:           #ba1a1a
error-container: #ffdad6
tertiary:        #855316
tertiary-container: #ca8e4c
background:      #f8f9ff
on-background:   #0b1c30
```

### Typography
| Token | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| headline-lg | Hanken Grotesk | 32px | 700 | 40px |
| headline-lg-mobile | Hanken Grotesk | 24px | 700 | 32px |
| headline-md | Hanken Grotesk | 24px | 600 | 32px |
| headline-sm | Hanken Grotesk | 20px | 600 | 28px |
| body-lg | Inter | 16px | 400 | 24px |
| body-md | Inter | 14px | 400 | 20px |
| body-sm | Inter | 12px | 400 | 16px |
| label-md | JetBrains Mono | 12px | 500 | 16px |

### Border Radius
- DEFAULT: 2px (0.125rem)
- lg: 4px (0.25rem)
- xl: 8px (0.5rem)
- full: 12px (0.75rem)

### Spacing
- base: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px
- gutter: 16px
- container-padding: 24px
- sidebar-width: 260px

## Material Symbols Component

Create `frontend/src/components/ui/MaterialSymbol.tsx`:
- Props: `icon: string`, `className?: string`, `fill?: boolean`, `weight?: number`
- Renders `<span class="material-symbols-outlined">` with `fontVariationSettings` style
- Font loaded via Google Fonts in `index.html`

## Component Changes

### SidebarItem.tsx
- Remove `section` prop (group labels handled by parent via static `.Section`)
- Replace Lucide icon with Material Symbol
- Overhauled JSX structure matching reference:
  - Active: `bg-primary/10 border-l-4 border-primary rounded-r-lg`
  - Inactive: `hover:bg-surface-container-high rounded-lg`
- `.Section` subcomponent: 10px uppercase label with `text-outline`

### AdminDashboard.tsx — Sidebar
- Header: "SIMAHATI OpRec" (headline-md) + "PANEL ADMIN" (label-md uppercase)
- Nav groups with Material Symbols icons
- Active item indicator: left orange border
- Collapse button at bottom with `vertical_align_center` icon

### AdminDashboard.tsx — Topbar
- Left: search input with `search` icon inside, `rounded-full bg-surface-container-low`
- Right: `light_mode` toggle, `notifications` with red dot, divider, `Dashboard` button (border-2 primary), `Logout` button, avatar circle + name + role + `expand_more`

### AdminDashboard.tsx — Greeting
- `Selamat datang, {name}` (headline-lg)
- Subtitle "Pantau proses Open Recruitment secara real-time."
- Filter Data button (outline border, `filter_list` icon)

### StatCard.tsx
- Layout: `flex items-start justify-between`
- Icon in `w-12 h-12 rounded-lg bg-{color}/10` on right side
- Title: `font-label-md text-on-surface-variant`
- Value: `headline-lg font-bold`
- Trend indicator with icon + percentage
- Hover: border changes to matching color

### Chart (in AdminDashboard.tsx)
- Keeps Recharts but restyled:
  - Legend above chart as flex row with colored dots
  - Grid: `#e0c0b1/30 strokeDasharray="3 3"`
  - Bar color: gradient primary/orange
  - Tooltip: white bg, orange border, 12px radius
  - Bar radius: [8, 8, 0, 0]

### ActivityItem.tsx
- Timeline: 2px left line via pseudo-element `.timeline-line::before`
- Each item: 24px circle with icon, `ring-4 ring-surface`
- Title bold, description body-md, timestamp 10px uppercase
- "Lihat Semua Aktivitas" button at bottom

### QuickActionCard.tsx
- Layout: `flex gap-4 items-start`
- Icon: `w-12 h-12 rounded-full bg-surface-container` with hover state
- Title + description + "Buka →" (arrow slides right on hover)
- Hover: `border-primary/30`

### Skeleton.tsx
- Update shapes to match new component layouts
- Match border-radius and color tokens

### Footer (in AdminDashboard.tsx)
- `border-t border-outline-variant bg-white`
- Copyright left, links right (Privacy, Terms, Contact)

## CSS Changes
- Delete `AdminDashboard.css`
- Replace with minimal `AdminDashboard.css` containing only:
  - `.soft-glow` (box-shadow)
  - `.timeline-line::before` (activity line)
  - `.custom-scrollbar` (thin scrollbar)
- All other styling via Tailwind utilities

## Files to Modify
1. `frontend/index.html` — add Google Fonts (Hanken Grotesk, JetBrains Mono, Material Symbols)
2. `frontend/src/components/ui/MaterialSymbol.tsx` — NEW
3. `frontend/src/components/ui/index.ts` — export MaterialSymbol
4. `frontend/src/components/ui/SidebarItem.tsx` — overhaul
5. `frontend/src/components/ui/StatCard.tsx` — overhaul
6. `frontend/src/components/ui/ActivityItem.tsx` — overhaul
7. `frontend/src/components/ui/QuickActionCard.tsx` — overhaul
8. `frontend/src/components/ui/Skeleton.tsx` — update shapes
9. `frontend/src/pages/AdminDashboard.tsx` — full restructure
10. `frontend/src/pages/AdminDashboard.css` — rewrite (minimal)
