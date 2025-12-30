# Cleanup Recommendations

> **Analysis Date:** December 30, 2025

This document lists unused files, dead code, and cleanup opportunities found during codebase analysis.

---

## 📁 Files to Delete

### 🔴 High Priority (Clearly Unused)

#### 1. Duplicate Dashboard Folder
**Path:** `src/pages/Dashboard/` (entire folder)

| File | Issue |
|------|-------|
| `src/pages/Dashboard/Dashboard.jsx` | Not imported anywhere - App.jsx uses `UserDashboard.jsx` instead |
| `src/pages/Dashboard/index.js` | Exports unused Dashboard component |

**Reason:** The app routes to `/dashboard` → `UserDashboard.jsx`, not `Dashboard/Dashboard.jsx`. Also has broken import paths (`../../../hooks/useAuth` doesn't exist).

---

#### 2. Duplicate Migration Script
**Paths:**
- `backend/migrate.js` (54 lines) - Image column migration
- `backend/scripts/migrate.js` (25 lines) - Index migration

**Recommendation:** Keep `backend/migrate.js`, delete `backend/scripts/` folder. The scripts version has broken imports (`database.connect()` doesn't exist - should be `connectToDatabase()`).

---

#### 3. Unused Storage Utilities
**Path:** `src/services/storage/` (entire folder)

| File | Size | Usage |
|------|------|-------|
| `src/services/storage/localStorage.js` | 1.1 KB | Never imported |
| `src/services/storage/sessionStorage.js` | 1.2 KB | Never imported |

**Reason:** The codebase uses `localStorage` and `sessionStorage` directly, not through these wrappers.

---

#### 4. Unused Utility Files
**Path:** `src/services/utils/`

| File | Size | Usage |
|------|------|-------|
| `constants.js` | 1.1 KB | Never imported |
| `helpers.js` | 2.0 KB | Never imported |
| `validation.js` | 1.3 KB | Never imported |

**Keep:** `formatting.js` - Used by `UserDashboard.jsx`

---

### 🟠 Medium Priority (Likely Unused UI Components)

These are **shadcn/ui** components that were installed but never integrated into the app. They only reference themselves or other UI components, not used in pages.

#### UI Components to Consider Removing

| Component | File | Size | Notes |
|-----------|------|------|-------|
| Accordion | `ui/accordion.tsx` | 2.0 KB | Not used in any page |
| Alert | `ui/alert.tsx` | 1.6 KB | Not used in any page |
| Alert Dialog | `ui/alert-dialog.tsx` | 4.4 KB | Not used in any page |
| Aspect Ratio | `ui/aspect-ratio.tsx` | 0.2 KB | Not used in any page |
| Avatar | `ui/avatar.tsx` | 1.4 KB | Not used in any page |
| Badge | `ui/badge.tsx` | 1.1 KB | Not used in any page |
| Breadcrumb | `ui/breadcrumb.tsx` | 2.8 KB | Not used in any page |
| Calendar | `ui/calendar.tsx` | 2.6 KB | Not used in any page |
| Carousel | `ui/carousel.tsx` | 6.5 KB | Not used in any page |
| Chart | `ui/chart.tsx` | 10.3 KB | Not used in any page |
| Checkbox | `ui/checkbox.tsx` | 1.1 KB | Not used in any page |
| Collapsible | `ui/collapsible.tsx` | 0.3 KB | Not used in any page |
| Command | `ui/command.tsx` | 5.0 KB | Not used in any page |
| Context Menu | `ui/context-menu.tsx` | 7.4 KB | Not used in any page |
| Drawer | `ui/drawer.tsx` | 3.0 KB | Not used in any page |
| Dropdown Menu | `ui/dropdown-menu.tsx` | 7.4 KB | Not used in any page |
| Form | `ui/form.tsx` | 4.1 KB | Not used in any page |
| Hover Card | `ui/hover-card.tsx` | 1.2 KB | Not used in any page |
| Input OTP | `ui/input-otp.tsx` | 2.2 KB | Not used in any page |
| Menubar | `ui/menubar.tsx` | 8.1 KB | Not used in any page |
| Navigation Menu | `ui/navigation-menu.tsx` | 5.2 KB | Not used in any page |
| Pagination | `ui/pagination.tsx` | 2.8 KB | Not used in any page |
| Popover | `ui/popover.tsx` | 1.3 KB | Not used in any page |
| Progress | `ui/progress.tsx` | 0.8 KB | Not used in any page |
| Radio Group | `ui/radio-group.tsx` | 1.5 KB | Not used in any page |
| Resizable | `ui/resizable.tsx` | 1.7 KB | Not used in any page |
| Scroll Area | `ui/scroll-area.tsx` | 1.7 KB | Not used in any page |
| Select | `ui/select.tsx` | 5.7 KB | Not used in any page |
| Sidebar | `ui/sidebar.tsx` | 23.5 KB | Not used in any page |
| Slider | `ui/slider.tsx` | 1.1 KB | Not used in any page |
| Switch | `ui/switch.tsx` | 1.2 KB | Not used in any page |
| Table | `ui/table.tsx` | 2.8 KB | Not used in any page |
| Tabs | `ui/tabs.tsx` | 2.0 KB | Not used in any page |
| Toast | `ui/toast.tsx` | 4.9 KB | Not used in any page |
| Toaster | `ui/toaster.tsx` | 0.8 KB | Not used in any page |
| Toggle | `ui/toggle.tsx` | 1.5 KB | Not used in any page |
| Toggle Group | `ui/toggle-group.tsx` | 1.8 KB | Not used in any page |
| use-toast | `ui/use-toast.ts` | 0.1 KB | Not used in any page |

**Total Potential Savings:** ~120 KB of unused code

> ⚠️ **Before deleting:** Run a grep search for each component name to confirm they're truly unused. Some may be imported dynamically or used in admin panel.

---

### 🟡 Low Priority (Code Quality)

#### 5. Legacy Server Wrapper
**File:** `backend/server.js` (root)

```javascript
require('./src/server');
```

**Issue:** Just a one-line wrapper that imports the real server. Could be consolidated.

---

#### 6. Unused Backend Migrations Folder
**Path:** `backend/src/migrations/`

Contains SQL migration files that may not be actively used. Review if database setup is automated or manual.

---

## 🔧 Code Issues (Not Files)

### 1. Broken Import Path
**File:** `src/pages/Dashboard/Dashboard.jsx` (line 2-3)

```javascript
import { useAuth } from '../../../hooks/useAuth';
import Loading from '../../../components/common/Loading';
```

**Issue:** The path `../../../hooks/useAuth` from `src/pages/Dashboard/` would resolve to outside `src/`. Should be `../../hooks/useAuth` or the component should use context directly.

---

### 2. Inconsistent Token Key Names
**Files:** `src/context/AuthContext.jsx` vs `src/services/api/auth.js`

```javascript
// AuthContext.jsx
localStorage.setItem('authToken', response.token);

// api/auth.js logout()
localStorage.removeItem('token');  // Wrong key!
```

**Fix:** Use consistent key name (`authToken`) everywhere.

---

## 📊 Summary

| Category | Files | Est. Size |
|----------|-------|-----------|
| **Definitely Delete** | 6 files | ~7 KB |
| **Likely Delete (UI)** | 37 files | ~120 KB |
| **Review Before Delete** | 2 folders | Variable |

### Quick Delete Commands (PowerShell)

```powershell
# Delete unused Dashboard folder
Remove-Item -Recurse -Force "src\pages\Dashboard"

# Delete unused storage utilities
Remove-Item -Recurse -Force "src\services\storage"

# Delete unused utility files
Remove-Item "src\services\utils\constants.js"
Remove-Item "src\services\utils\helpers.js"
Remove-Item "src\services\utils\validation.js"

# Delete duplicate migration script
Remove-Item -Recurse -Force "backend\scripts"
```

---

## ✅ Files That ARE Used (Don't Delete)

### Frontend
- All files in `src/pages/` (except Dashboard folder)
- All files in `src/components/home/` ✓
- All files in `src/components/common/` ✓
- All files in `src/components/product/` ✓
- All files in `src/components/admin/` ✓
- `src/context/` ✓
- `src/hooks/` ✓
- `src/services/api/` ✓
- `src/services/api.js` ✓
- `src/services/utils/formatting.js` ✓

### Backend
- All files in `backend/src/` ✓
- `backend/migrate.js` ✓ (for one-time migrations)
- `backend/package.json` ✓

### UI Components Likely Used
- `ui/button.tsx` - Likely used
- `ui/card.tsx` - Likely used
- `ui/dialog.tsx` - May be used in modals
- `ui/input.tsx` - Likely used in forms
- `ui/label.tsx` - Used by form
- `ui/separator.tsx` - May be used
- `ui/sheet.tsx` - May be used for mobile menu
- `ui/skeleton.tsx` - May be used for loading states
- `ui/sonner.tsx` - May be used for toasts
- `ui/textarea.tsx` - May be used in forms
- `ui/tooltip.tsx` - May be used
