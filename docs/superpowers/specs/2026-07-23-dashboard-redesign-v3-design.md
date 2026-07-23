# Dashboard Redesign v3 — Premium SaaS (9.5/10 Target)

**Date:** 2026-07-23
**Target score:** 9.5/10
**Previous score:** 8.4/10 (v2)

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ SIMAHATI OpRec 2027           ⌕ Search...  🔔  🌙  👤 Super Adm │
├────────────┬────────────────────────────────────────────────────┤
│            │ ☰ Dashboard                                   [+]  │
│ 🏠 Dashboard│ Selamat datang kembali, Super Admin 👋             │
│             │ Pantau seluruh proses Open Recruitment             │
│ 👥 Role     │ secara real-time.                                  │
│ 📧 Verifikasi│                                                    │
│ 📅 Interview│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│ 🏢 Divisi   │ │Total │ │Pending│ │Lolos │ │Ditolak│              │
│ ⚙️ Settings  │ └──────┘ └──────┘ └──────┘ └──────┘              │
│             │                                                    │
│             │ ┌──────────────┐  ┌──────────────┐                │
│             │ │   Chart      │  │  Activity    │                │
│             │ └──────────────┘  └──────────────┘                │
│             │                                                    │
│             │ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐             │
│             │ │QA1│ │QA2│ │QA3│ │QA4│ │QA5│ │QA6│             │
│             │ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘             │
└─────────────┴────────────────────────────────────────────────────┘
```

### Key layout decisions
- **Sidebar (240px):** Navigation only. No user info. Logo at top, collapse button at bottom.
- **Topbar (56px):** User hub. Collapse + breadcrumb left, search + actions right.
- **Content area:** `max-w-[1440px]` centered wrapper. `px-8 py-6`.
- **Section gaps:** 32–40px (`space-y-8` / `mb-8`).
- **Border radius:** 16px (`rounded-2xl`) for all cards.
- **Shadows:** `shadow-sm` default, `hover:shadow-md` for interactive cards.

---

## 1. Sidebar

```
┌────────────────┐
│ SIMAHATI OpRec │
│ Panel Admin    │
│ ────────────── │
│                 │
│ 🏠 Dashboard    │
│ ────────────── │
│ MANAJEMEN       │
│ 👥 Role         │
│ 📧 Verifikasi   │
│ 📅 Interview    │
│ 🏢 Divisi       │
│ ────────────── │
│ PENGATURAN      │
│ ⚙️ Settings     │
│                 │
│           ◀ Collapse │
└────────────────┘
```

### States
| State | Icon | Text | Background |
|-------|------|------|------------|
| Default | gray-400 | gray-600 | transparent |
| Hover | orange-500 | orange-600 | orange-50/50 |
| Active | orange-500 | orange-600 | orange-50 |

### Structure
- Logo area: App name + "Panel Admin" subtitle, `pb-4`
- Section headers: "MANAJEMEN", "PENGATURAN" — text-xs, uppercase, letter-spacing, gray-400, `mt-6 mb-2`
- Menu items: emoji icon + label, `py-2.5 px-4`, `rounded-lg`
- No avatar, name, or logout button

---

## 2. Topbar

```
☰ Dashboard                    ⌕ Cari...     🔔   🌙   👤 Super Admin ▼
```

### Left section
- Collapse hamburger icon (☰), `ml-4`
- Breadcrumb / page title "Dashboard"

### Right section
- Search input: `⌕` prefix, `placeholder="Cari..."`, `rounded-lg`, `bg-gray-100`, `w-48`, `focus:w-64` transition
- Notification bell icon with optional badge (gray-500, hover orange)
- Theme toggle icon (sun/moon, gray-500, hover orange)
- Avatar circle (32px) + name "Super Admin" + dropdown chevron
- Dropdown: Profile, Settings, Logout

### Visual
- White background, `h-14`, `px-6`
- Subtle bottom border (`border-b border-gray-200`)
- `flex items-center justify-between`

---

## 3. Greeting Header

```
Dashboard                                                [+ Tambah Staff]
Selamat datang kembali, Super Admin 👋
Pantau seluruh proses Open Recruitment secara real-time.
```

- Breadcrumb "Dashboard" di atas (text-sm, gray-500)
- Title row: "Dashboard" heading + right-aligned `[+ Tambah Staff]` button
  - Button: `bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition`
- Greeting: `text-2xl font-semibold text-gray-900` + emoji
- Subtitle: `text-sm text-gray-500`, max-width for readability
- Spacing below: `mb-8`

---

## 4. StatCards

```
┌──────────────────────┐
│                      │
│   👥                 │
│                      │
│   Total Pendaftar    │
│   1.254              │
│   ↑ +12%             │
│                      │
└──────────────────────┘
```

### Props per card
| Prop | Value |
|------|-------|
| Icon | Emoji or Lucide (gray-500) |
| Icon container | `w-10 h-10 rounded-xl bg-gray-100` |
| Title | `text-sm font-medium text-gray-500` |
| Value | `text-3xl font-bold text-gray-900` |
| Trend | `text-sm font-medium` (green for up, red for down) |
| Trend arrow | `↑` or `↓` |

### Visual
- Card: `bg-white rounded-2xl shadow-sm p-5`
- Height: ~140px
- Grid: `grid-cols-4 gap-5`
- Hover: `hover:shadow-md transition-shadow`

---

## 5. Chart

```
┌─────────────────────────────────┐
│ Statistik Pendaftar             │
│ 30 Hari Terakhir       [Filter] │
│                                 │
│ ● Lolos    ● Pending    ● Intv  │
│                                 │
│        ▗▄▄▖                     │
│      ▟████▙▄▖                   │
│    ▗████████▚▄▖                 │
│  ▄████████████▚▄▖               │
│ █████████████████▚              │
│ ██████████████████              │
│ ───────────────────────────     │
│ 1   5   10   15   20   25   30  │
└─────────────────────────────────┘
```

### Changes from v2
- **Legend position:** Moved from below to above the chart
- **Grid:** Thinner (`strokeWidth={0.5}`, color `#e5e7eb`)
- **Gradient fill:** Linear gradient for area under bars
- **Tooltip:** Custom white card with shadow, rounded-lg
- **Filter:** Dropdown in header right corner (30/60/90 hari)
- **Colors:** Softer palette — green (lolos), yellow (pending), blue (interview)

### Data series mapping
- "Lolos" → `lolos` → green-500 (#22c55e)
- "Pending" → `pending` → yellow-500 (#eab308)
- "Interview" → `interview` → blue-500 (#3b82f6)

---

## 6. Activity Timeline

```
┌──────────────────────────────────┐
│ Aktivitas Terbaru              ⋮ │
│                                  │
│ Hari Ini                         │
│                                  │
│ ● 09:15  Andi Pratama mendaftar  │
│ │                                 │
│ ● 09:02  Siti Nurhaliza lolos    │
│ │                                 │
│ ● 08:45  Budi Santoso upload     │
│                                  │
│ Kemarin                          │
│                                  │
│ ● 16:20  Dewi Lestari interview  │
│ │                                 │
│ ● 14:00  Rudi Hermawan ditolak   │
│                                  │
└──────────────────────────────────┘
```

### Timeline visual
- Dot: 6px diameter `rounded-full`, color-coded by status
- Line: 2px solid, gray-200, connecting dots vertically
- `isLast: true` hides the connecting line below the final dot

### Date grouping
- "Hari Ini" header (today's date)
- "Kemarin" header (yesterday's date)
- Older: formatted "dd MMM" (e.g., "21 Jul")
- Each group separated by 4px extra gap

### Activity item structure
- Timestamp: `text-xs text-gray-400` (09:15)
- Actor name: `text-sm font-medium text-gray-900`
- Action: `text-sm text-gray-500`
- Colored dot matching action type (green=lolos, yellow=pending, red=ditolak, blue=mendaftar)

### Card
- `bg-white rounded-2xl shadow-sm p-5`
- Max height: ~400px with scroll

---

## 7. Quick Actions

```
┌───────────────────┐
│ 🛡️                  │
│ Kelola Role         │
│ Kelola hak akses    │
│ administrator.      │
│ ─────────────────── │
│ Buka →              │
└───────────────────┘
```

### Visual
- Icon container on top: `w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center`
- Title: `text-sm font-semibold text-gray-900`
- Description: `text-xs text-gray-500` (2 lines max)
- Divider: `border-t border-gray-100` (my-3)
- CTA: "Buka →" `text-sm font-medium text-gray-900`
- Card: `bg-white rounded-2xl shadow-sm p-5`
- Height: ~150px
- Grid: `grid-cols-3 gap-4`
- Hover: `hover:shadow-md hover:-translate-y-1 hover:border-orange-500 transition-all duration-200`

---

## 8. Design Tokens

### Colors
| Role | Usage | Value |
|------|-------|-------|
| Background | Page | `#f8fafc` |
| Surface | Cards | `#ffffff` |
| Text primary | Headings | `#111827` (gray-900) |
| Text secondary | Body | `#4b5563` (gray-600) |
| Text muted | Labels | `#9ca3af` (gray-400) |
| Border | Card/divider | `#e5e7eb` (gray-200) |
| Accent (5%) | Active/hover | `#f97316` (orange-500) |
| Accent bg | Hover bg | `#fff7ed` (orange-50) |

### Orange usage rules
- **Default icons:** gray-500 (NOT orange)
- **Hover icons:** orange-500
- **Active nav item:** orange-500 icon, orange-50 bg, orange-600 text
- **Primary buttons:** orange-500 bg, white text
- **Trend up:** green-500
- **Trend down:** red-500

### Typography
| Element | Style |
|---------|-------|
| Page title | `text-2xl font-semibold text-gray-900` |
| Card title | `text-sm font-medium text-gray-500` |
| Stat value | `text-3xl font-bold text-gray-900` |
| Body | `text-sm text-gray-600` |
| Subtitle | `text-xs text-gray-400` |
| Section header | `text-xs font-semibold uppercase tracking-wider text-gray-400` |
| No ALL CAPS except section headers | All labels use sentence case |

### Spacing
| Relationship | Value |
|-------------|-------|
| Section gap | 32–40px |
| Card padding | 20px (p-5) |
| Card gap (grid) | 20px (gap-5) |
| Content padding | `px-8 py-6` |
| StatCard height | ~140px |
| QuickAction height | ~150px |

### Border radius
| Element | Radius |
|---------|--------|
| Cards | 16px (rounded-2xl) |
| Buttons | 12px (rounded-xl) |
| Inputs | 8px (rounded-lg) |
| Icon containers | 12px (rounded-xl) |
| Avatar | full |

### Shadow
| State | Class |
|-------|-------|
| Default card | `shadow-sm` |
| Hover (interactive) | `shadow-md` |

---

## Implementation Scope

### Files to modify
| File | Changes |
|------|---------|
| `AdminDashboard.tsx` | Add topbar, restructure layout, greeting with button, legend, section spacing |
| `AdminDashboard.css` | Topbar styles, updated sidebar, spacing refinements |
| `StatCard.tsx` | Redesign to raised card style with icon on top, trend |
| `ActivityItem.tsx` | Thicker dots, date grouping, timestamp, colored dots |
| `QuickActionCard.tsx` | SaaS card style with divider and "Buka →" |
| `SidebarItem.tsx` | Emoji icons, section headers, no user info |
| `Skeleton.tsx` | Update skeletons to match new card shapes |
| `AdminDashboard.tsx` (sidebar section) | Remove user info/avatar/logout, add collapse button |

### Files NOT to change
- All API/data files
- All route/page components (sub-pages)
- Backend
- State management (Zustand stores)
- Auth logic

---

## Success Criteria

- [ ] Topbar with search, bell, theme toggle, avatar dropdown
- [ ] Sidebar navigation-only with emoji icons
- [ ] Greeting header with action button
- [ ] StatCards redesigned to raised card style
- [ ] Chart with above legend, thinner grid, gradient
- [ ] Activity with date groups, thicker timeline, timestamps
- [ ] QuickActions as SaaS cards with divider + "Buka →"
- [ ] Orange reduced to 5% accent only
- [ ] Border radius 16px throughout
- [ ] Shadows: shadow-sm / hover:shadow-md
- [ ] Section gaps 32-40px
- [ ] Font weight/hierarchy improved
- [ ] No ALL CAPS labels
- [ ] Build passes with zero errors
