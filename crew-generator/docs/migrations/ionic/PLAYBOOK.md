# Ionic React Migration Playbook (Crew Generator)

**Owner:** @battist  
**Status:** Active  
**Last updated:** <set date>  

This document defines the canonical plan for incrementally integrating **Ionic React** into our existing stack:
- React 19 + Vite + TypeScript
- Tailwind CSS + shadcn/ui + Radix
- Supabase (Postgres, Auth, Realtime)
- Vite PWA + Workbox
- React Router DOM v7
- Zod + React Hook Form
- Vitest + Testing Library

## 0) Goals & Non-Goals

**Goals**
- Stop hand-rolling mobile primitives; adopt Ionic’s **tabs**, **page shells**, **safe areas**, **native-like transitions**, **pull-to-refresh**, **infinite scroll**, **modals/sheets**, **action sheets**, **toasts**.
- Keep Tailwind/shadcn/Radix for styling and complex/dense widgets.
- Maintain PWA installability/offline via Vite PWA + Workbox.
- Improve offline UX with TanStack Query (optimistic updates + background refetch).

**Non-Goals**
- No rewrite to Vue/Quasar; no Next.js migration.
- No visual overhaul; theme should remain consistent with our design tokens.

## 1) Architecture Decisions

- **Ionic as mobile UX layer**; not replacing our design system.  
- **Router**: Prefer `IonReactRouter` + `IonRouterOutlet`. If React Router v7 peer deps don’t match, use **Path B** temporary fallback (keep BrowserRouter, adopt Ionic page shells now; swap routers later).  
- **Scroll control**: Each routed screen returns **`<IonPage><IonContent/></IonPage>`** (single scroll container). Avoid nested scroll areas.  
- **Theming**: Map our CSS custom properties to Ionic CSS variables in `src/theme/ionic-overrides.css`. Tailwind utilities remain primary for layout.  
- **Data**: TanStack Query orchestrates network/cache; Workbox handles runtime caching & offline fallback. Avoid caching Supabase realtime websockets.

## 2) Incremental Milestones

1. **Compat & install** (`@ionic/react`, `@ionic/react-router`, `ionicons`)  
2. **Bootstrap Ionic CSS + setupIonicReact**  
3. **Router shell** (Path A preferred) + wrap pages in `IonPage/IonContent`  
4. **Tabs shell** (`IonTabs/IonTabBar/IonRouterOutlet`)  
5. **Pull-to-refresh & Infinite scroll** on list screens  
6. **Modals & Action sheets** (replace custom drawers/menus where it reduces code)  
7. **Data layer polish** (TanStack Query) + Workbox tune-ups  
8. **Theming alignment** (Ionic vars ↔ design tokens)  
9. **Monitoring & budgets** (Sentry, Lighthouse CI)

## 3) Conventions

- **File placement**
  - Playbook: `docs/migrations/ionic/PLAYBOOK.md`
  - Compatibility notes: `docs/migrations/ionic/000-compat.md`
  - Router notes: `docs/migrations/ionic/001-router.md`
  - Theme overrides: `src/theme/ionic-overrides.css`
  - Tabs route: `src/routes/Tabs.tsx`
  - Pages live in `src/pages/*`

- **Styling**
  - **CSS Import Order (CRITICAL):**
    1. Ionic Core CSS (`@ionic/react/css/*`)
    2. Theme overrides (`./theme/ionic-overrides.css`)
    3. Tailwind CSS (`./index.css`)
  - Use Tailwind on Ionic components via `className`.
  - Keep shadcn/Radix for complex widgets; Ionic for mobile primitives (nav, lists, sheets, refreshers).
  - Prefer **one overlay system per screen** (Ionic overlays OR Radix) to avoid focus/gesture conflicts.
  - Design tokens automatically map to Ionic CSS variables via `ionic-overrides.css`.

- **Testing**
  - Continue Vitest + Testing Library.  
  - Use test ids on actionable Ionic components.  
  - For router behavior, test via route changes; do not assert animation specifics.

- **Accessibility**
  - Respect `prefers-reduced-motion`.  
  - Ensure tap target sizes ≥ 44×44 logical px.  
  - Provide accessible labels for action sheets and modals.

## 4) Performance & Offline

- Use Ionic’s single scroll area (`IonContent`) per screen; avoid nested scroll jitter.  
- Apply TanStack Query for cache + background refetch.  
- Workbox:
  - Cache strategy: JSON/API GETs (stale-while-revalidate), images (cache-first with max-age), **exclude** websocket/realtime.
  - Provide offline fallback route/page.

## 5) Troubleshooting (FAQ)

- **Double scrollbar or weird bounce?** Ensure only `IonContent` scrolls; remove extra `overflow` containers.  
- **Overlays not dismissing with back button?** Use Ionic overlays (Modal/ActionSheet/Popover) or wire RR back handlers; don’t mix two overlay systems.  
- **Styles look off?** Check load order: Ionic core CSS → `ionic-overrides.css` → Tailwind.  
- **Transitions missing?** Likely on Path B (BrowserRouter). See `001-router.md` for upgrade path.  
- **Type errors after install?** Verify Ionic package majors match and peer deps satisfied.

## 6) Definition of Done (per milestone)

Each milestone must:
- Build and pass tests.
- Update docs under `docs/migrations/ionic/`.
- Include a short demo recording (gif/mp4) if UX-affecting.
- Add notes to CHANGELOG with “Ionic Migration – Mx”.

Testing requirement (per milestone)
- Every milestone must include at least one new automated test (Vitest + Testing Library) that verifies the new Ionic integration works as intended.
- Visual/manual smoke checks are required but insufficient.
- Add tests in `tests/migrations/ionic/` with filenames matching the milestone (e.g., `M1-core-css.test.tsx`).

## 7) References

- Ionic React docs and component API
- React Router integration notes
- TanStack Query + Workbox best practices

> **When in doubt, follow this playbook.**