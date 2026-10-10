# AirGuard UI/UX Audit

## Visual Hierarchy & Styling
- **Colors**: Hard-coded Tailwind colors (`bg-slate-900`, `text-emerald-400`) instead of semantic design tokens.
- **Typography**: Uses default sans-serif font. Needs a premium font like Inter or Geist.
- **Spacing & Contrast**: Inconsistent spacing in some cards. Contrast needs verifying against WCAG AA standards.
- **Icons**: Uses emojis in places where SVG icons from Lucide should be used (e.g., `🌫️` logo).

## Component Consistency
- Lacks a unified component system (e.g., `shadcn/ui`). Buttons, cards, and badges are hand-rolled and inconsistent.
- Missing standardized hover, active, and focus states.

## States & Accessibility
- Missing proper loading skeletons; content might cause layout shift.
- Empty, error, and offline states are either absent or unpolished.
- Missing `aria-labels` on buttons, no visible focus rings for keyboard navigation.
- Needs `aria-live` regions for live sensor updates and toast notifications.

## Layout & Responsiveness
- Sidebar uses `w-64`, needs to collapse into a bottom tab bar or hamburger menu on smaller screens.
- Touch targets on mobile need to be at least 44x44px.

## Plan & Ratings
- Landing Page (6/10)
- Dashboard (6/10)
- Pollution Map (5/10)
- AI Guardian Chat (5/10)
- Best Time Planner (6/10)
- **Overall Fixes Needed**: Migrate to shadcn/ui, implement design tokens, improve typography, standardize cards/buttons, ensure accessible states, build mobile-first responsive layouts.
