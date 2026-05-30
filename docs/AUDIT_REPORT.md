# AECCENTRIC EMS Audit Report

Generated: 2026-05-27

## Critical

- `backend/package.json` pointed `npm run seed` at `backend/src/utils/seed.js`, but that file did not exist. Added the missing deterministic enterprise seed script with AECCENTRIC users, employees, salaries, projects, tasks, attendance, payroll, leaves, meetings, notifications, messages, activity, finance, and candidates.
- `backend/src/models/Project.js`, `Task.js`, `Payroll.js`, and `Leave.js` were too narrow for the requested HRMS dataset. Extended enums and fields compatibly instead of replacing existing schemas.
- `backend/src/middleware/rbac.middleware.js` only supported array-style roles. Updated it to also support `checkRole('admin', 'hr')`, matching the requested contract while preserving current call sites.
- `frontend/src/layouts/dashboard/DashboardLayout.jsx` applied desktop sidebar margin on mobile, creating horizontal layout offset/overflow. Added viewport-aware offset behavior.

## Medium

- `backend/src/middleware/auth.middleware.js` verified JWTs but did not expose employee identity metadata. It now attaches `req.auth` and employee identifiers while keeping the existing `req.user` document for compatibility.
- `frontend/src/services/api.js` attached bearer tokens, but cross-origin refresh cookies were not sent by the shared Axios client. Enabled `withCredentials` and added a central API error event hook.
- Analytics existed under `/api/dashboard/analytics`, while the upgraded spec expects `/api/analytics/*`. Added `/api/analytics/overview`, `/api/analytics/projects`, and `/api/analytics/attendance` aliases backed by MongoDB aggregates.
- Attendance used `/check-in` and `/check-out`, while the spec expects `/clock-in` and `/clock-out`. Added compatible aliases without removing existing routes.
- Motion variants were duplicated inline. Added `frontend/src/lib/motion.js` with reusable page, container, item, sidebar, topbar, drawer, modal, hover, tap, pulse, count-up, and progress variants.

## Low

- Dashboard theme tokens were split across global CSS and dashboard CSS. Added `frontend/src/styles/tokens.css` with the requested light/dark colors, spacing, typography, layout, shadow, and status color tokens.
- Several existing files contain mojibake in decorative comments and UI microcopy from prior encoding issues. Left broad rewrites alone to avoid churn, but new files use clean ASCII.
- The production frontend bundle still warns about a large JS chunk. This is an existing route-splitting/performance opportunity and should be handled with lazy-loaded dashboard/public pages in the next pass.
- Several older frontend pages still log caught errors with `console.error`. One touched route guard was cleaned; a broader logging/toast sweep remains.
