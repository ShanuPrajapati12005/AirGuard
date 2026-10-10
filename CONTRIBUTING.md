# AirGuard Contributing & Engineering Guidelines

## 1. Commit Guidelines
All commits must follow Conventional Commits format:
- \eat(scope): ...\ for new user-facing functionality
- \ix(scope): ...\ for bug resolutions
- \docs(scope): ...\ for documentation updates
- \efactor(scope): ...\ for structural improvements without feature changes
- \perf(scope): ...\ for performance and bundle optimizations

## 2. Design System Adherence
Always use MeetMind CSS variables (\ar(--bg)\, \ar(--card)\, \ar(--ink)\, \ar(--line)\, \ar(--ac)\).
Do not hardcode arbitrary hex colors like \#3b82f6\ on core UI cards.
