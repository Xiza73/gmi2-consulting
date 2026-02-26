# FRONTEND ARCHITECTURE GUIDELINES v3.0

**Role:** Senior React Architect & UI Engineer
**Stack:** React + TypeScript + Tailwind CSS + Shadcn UI + Zustand + React Query
**Pattern:** Vertical Slicing + Atomic Lite (Container/Presentational) + Adapter Pattern

---

## 1. CORE PHILOSOPHY

We prioritize **Separation of Concerns**, **Domain Integrity**, and **Composition**.

- **No Div Soup:** Strictly avoid raw `<div>` for layout. Use **Layout Primitives** (`Stack`, `Grid`, `Box`).
- **Smart vs. Dumb:** Logic (Containers) != UI (Components).
- **Domain Integrity:** The UI layer **NEVER** consumes API responses (DTOs) directly. It only consumes **Domain Models**.
- **Vertical Slicing:** Features are self-contained domains (e.g., `auth`, `projects`, `users`).
- **Co-location:** Each API endpoint owns its DTO, mapper, and React Query hook in a single subfolder.

---

## 2. DIRECTORY STRUCTURE

The project is organized by **Features** (vertical slices) and **Shared** (business-agnostic reusables), separating the "Network Layer" from the "Domain Layer".

```text
src/
 ├── shared/                # SHARED LAYER (Business Agnostic)
 │    ├── components/
 │    │    ├── ui/           # Shadcn Primitives (Button, Input, Card) - "Atoms"
 │    │    └── layout/       # Layout Primitives (Stack, Grid, Box) - "Structure"
 │    ├── hooks/             # Shared custom hooks
 │    ├── lib/               # Utility functions (cn, http-client, query-client)
 │    ├── styles/            # Global styles & CSS variables
 │    ├── types/             # Global types & enums (roles, status, etc.)
 │    ├── helpers/           # Shared pure functions (permissions, formatters)
 │    ├── interfaces/        # Shared interfaces (Route, etc.)
 │    ├── routes/            # Role-based routing (see Section 8)
 │    └── assets/            # Static assets (SVGs, images)
 │
 ├── features/               # DOMAIN LAYER (Vertical Slices)
 │    └── [feature-name]/
 │         ├── api/          # API endpoints (one subfolder per endpoint)
 │         │    └── [endpoint]/
 │         │         ├── [endpoint].dto.ts   # DTO types + mapper functions
 │         │         └── use[Action].ts      # React Query hook
 │         ├── components/   # Feature UI (Dumb, receives Domain Models via Props)
 │         ├── containers/   # Logic Hub (Connects Hooks -> UI)
 │         ├── interfaces/   # TypeScript interfaces specific to the feature
 │         ├── models/       # Domain Models (Clean interfaces for UI)
 │         ├── pages/        # Feature pages (Composition Root)
 │         ├── stores/       # Global state (Zustand stores with Models)
 │         ├── hooks/        # Custom hooks only (NOT React Query hooks)
 │         ├── helpers/      # Zod schemas and pure utility functions
 │         └── layout/       # Feature-specific layout components
 │
 └── pages/                  # ROUTING LAYER (Top-level Orchestrators)
      └── [PageName].tsx     # Composition Root (No logic, just layout)
```

### Explanation of Each Folder Inside a Feature

| Folder         | Purpose                                                                 | Example                                         |
| -------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| `api/`         | **Subfolders per endpoint.** Each contains a DTO file (types + mapper) and a React Query hook. | `api/login/login.dto.ts`, `api/login/useLogin.ts` |
| `components/`  | **Dumb/Presentational** components. Only receive props, no logic.       | `MemberCard.tsx`, `MemberAvatar.tsx`            |
| `containers/`  | **Smart** components. Connect hooks/stores to presentational components. Single responsibility: flat file. Multiple operations: folder with orchestrator + leaves (Section 4.13). | `MemberProfileContainer.tsx`, `QuotationDetailContainer/` |
| `interfaces/`  | TypeScript interfaces for props, events, and feature-specific contracts.| `MemberCardProps.ts`                            |
| `models/`      | **Domain Models** optimized for the frontend (camelCase, clean types).  | `member.model.ts`                               |
| `pages/`       | **Composition Root.** Orchestrates multiple containers, manages inter-container state (dialogs, selections). Only layer that imports containers. | `PricesPage.tsx`                            |
| `stores/`      | Zustand stores. UI state (selections, filters, modals) using **Domain Models**. | `useMemberStore.ts`                      |
| `hooks/`       | **Custom hooks only.** Feature-specific logic hooks (e.g., `useUserInfo`). React Query hooks live in `api/`. | `useUserInfo.ts` |
| `helpers/`     | **Zod schemas** and pure utility functions for the feature.             | `login.schema.ts`, `format-name.ts`            |
| `layout/`      | Layout wrappers specific to the feature (sidebars, panels, etc.).       | `MemberDashboardLayout.tsx`                     |

> **Note:** Not every feature needs all folders. Only create the folders that correspond to the feature's needs.

---

## 3. STRICT DATA FLOW RULES (THE ADAPTER PATTERN)

To prevent backend changes from breaking the UI, we use a strict data transformation flow. The DTO, mapper, and React Query hook are **co-located** in a single subfolder inside `api/`.

```
┌─────────────────────────────────┐     ┌──────────────┐     ┌──────────────┐
│       api/[endpoint]/           │────>│  Container    │────>│  Component   │
│                                 │     │  (UI Logic)  │     │  (Pure UI)   │
│  [endpoint].dto.ts              │     │              │     │              │
│    ├── DTO types (API mirror)   │     │  Consumes    │     │  Receives    │
│    └── Mapper fns (DTO→Model)   │     │  Domain Model│     │  Domain Model│
│  use[Action].ts                 │     │  via props   │     │  via props   │
│    └── React Query hook         │     │              │     │              │
│        (returns Domain Model)   │     │              │     │              │
└─────────────────────────────────┘     └──────────────┘     └──────────────┘
```

### Layer Responsibilities

1. **DTO + Mapper Layer** (`api/[endpoint]/[endpoint].dto.ts`):
   Defines types that **mirror** the backend JSON (`DTOResponse` / `DTORequest`), plus **pure mapper functions** (`toModel`, `toDTO`) that transform between DTO and Domain Model. The mapper lives in the same file as the DTO it transforms.

2. **Hook Layer** (`api/[endpoint]/use[Action].ts`):
   React Query hook that fetches/mutates data. For queries, uses `select` with the mapper to return Domain Models. For mutations, transforms via the mapper in `mutationFn`. Imports DTOs and mappers from its sibling `.dto.ts` file.

3. **Model Layer** (`models/*.model.ts`):
   Defines types **optimized for the Frontend**. Naming convention: `camelCase`, `Date` objects, clean booleans. This is the **Source of Truth** for the UI.

4. **Container Layer** (`containers/XContainer.tsx`):
   Connects hooks/stores to presentational components. Only works with **Domain Models**. Uses `mutate` with `onSuccess`/`onError` callbacks for mutations. **Containers MUST NOT import or render other containers.** Each container connects to its own API hooks and renders only presentational components. Cross-container orchestration (e.g., opening a create/edit dialog from a list) is the responsibility of the **Page** layer.

5. **Component Layer** (`components/X.tsx`):
   Pure UI. Receives **Domain Models** via props. Zero knowledge of API or state management.

6. **Page Layer** (`pages/XPage.tsx`):
   The **Composition Root**. A page adapts its structure based on complexity:
   - **Pattern A — Page absorbs Container:** Single operation (one form, one list). The page uses hooks directly and renders presentational components. No intermediate container needed.
   - **Pattern B — Page as Orchestrator:** Multiple operations (dialogs, tabs, sections). The page manages dialog states and renders leaf containers. Each line of JSX is a composable "block".
   - **Pattern C — Page + Custom Hook:** Single operation but heavy logic. Extract logic into a custom hook, keep the page as pure composition.

   **Key rule:** Pages NEVER delegate to an "orchestrator container". If a page needs orchestration, the page IS the orchestrator. Containers only exist when they represent an independent operation (a dialog with its own form + mutation, a section with its own data fetch). See Section 4.17 for examples.

---

## 4. CODE EXAMPLES & PATTERNS

### 4.1 Models vs DTOs

```typescript
// features/members/api/me/me.dto.ts — DTO + Mapper co-located
import type { Member } from "../../models/member.model";

// DTO mirrors the backend JSON contract
export interface MemberDTOResponse {
  member_id: string;
  first_name: string;
  last_name: string;
  is_active_flag: 0 | 1;
  created_at: string; // ISO date string from backend
}

export interface MemberDTORequest {
  member_id: string;
}

// Mapper: DTO → Domain Model (pure function, co-located with the DTO)
export const toMember = (dto: MemberDTOResponse): Member => ({
  id: dto.member_id,
  name: dto.first_name,
  lastName: dto.last_name,
  isActive: dto.is_active_flag === 1,
  createdAt: new Date(dto.created_at),
});

// Mapper: Domain Model → DTO (for sending data back to the API)
export const toMemberDTO = (
  model: Member,
): Partial<MemberDTOResponse> => ({
  member_id: model.id,
  first_name: model.name,
  last_name: model.lastName,
  is_active_flag: model.isActive ? 1 : 0,
});
```

```typescript
// features/members/models/member.model.ts — Domain Model (clean, frontend-optimized)
export interface Member {
  id: string;
  name: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
}
```

> **Key rule:** Mappers live **inside the DTO file**, not in a separate `helpers/*.mapper.ts`. This co-locates the transformation logic with the types it transforms.

### 4.2 API Subfolder Pattern

Each API endpoint gets its own subfolder inside `api/` containing the DTO file and the React Query hook:

```text
features/members/api/
  ├── me/
  │    ├── me.dto.ts          # MemberDTOResponse + toMember mapper
  │    └── useMe.ts           # useQuery hook
  ├── create-member/
  │    ├── create-member.dto.ts  # CreateMemberDTORequest
  │    └── useCreateMember.ts    # useMutation hook
  └── update-member/
       ├── update-member.dto.ts  # UpdateMemberDTORequest + toMemberDTO mapper
       └── useUpdateMember.ts    # useMutation hook
```

**Rules:**
- Subfolder name: `kebab-case` matching the endpoint action (e.g., `forgot-password/`, `create-member/`).
- DTO file: `[endpoint].dto.ts` — contains DTO types **and** mapper functions (if any).
- Hook file: `use[Action].ts` — contains the React Query hook.
- **Every API subfolder must have a separate `.dto.ts` file.** Even if the DTO is small (e.g., a single interface), it goes in its own file — never inline inside the hook file. The only exception is simple mutations that send no request body and receive no response body (e.g., `DELETE /resource/:id`).
- If a DTO is **shared** across multiple endpoints (e.g., `UserDTOResponse` used by both login and me), place it in the most fundamental subfolder (e.g., `me/me.dto.ts`) and import it from there.

### 4.3 React Query Hook — Query (Read)

**Strict Rule:** Hooks must be typed generically `<TQueryFnData, TError, TData>` to support the Adapter Pattern and allow external options via `Omit`.

```typescript
// features/members/api/me/useMe.ts
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { httpClient } from "@/shared/lib/http-client";

import type { Member } from "../../models/member.model";
import { toMember, type MemberDTOResponse } from "./me.dto";

// 1. The Fetcher (Returns DTO)
const getMe = async (): Promise<MemberDTOResponse> => {
  const { data } = await httpClient.get<MemberDTOResponse>("/members/me");
  return data;
};

// 2. The Hook (Returns Domain Model via select)
export function useMe(
  options?: Omit<
    UseQueryOptions<MemberDTOResponse, Error, Member>,
    "queryKey" | "queryFn" | "select"
  >,
) {
  return useQuery<MemberDTOResponse, Error, Member>({
    queryKey: ["members", "me"],
    queryFn: getMe,
    select: toMember, // <--- Adapter Pattern: DTO → Model
    ...options,
  });
}
```

### 4.4 React Query Hook — Mutation (Write)

For mutations, the mapper is applied inside `mutationFn` instead of `select`.

```typescript
// features/auth/api/login/useLogin.ts
import { useMutation } from "@tanstack/react-query";

import { httpClient } from "@/shared/lib/http-client";

import type { AuthTokens } from "../../models/auth.model";
import type { User } from "../../models/user.model";
import {
  type LoginDTORequest,
  type LoginDTOResponse,
  toLoginResult,
} from "./login.dto";

const login = async (params: LoginDTORequest): Promise<LoginDTOResponse> => {
  const { data } = await httpClient.post<LoginDTOResponse>(
    "/auth/login",
    params,
  );
  return data;
};

export function useLogin() {
  return useMutation<
    { user: User; tokens: AuthTokens },
    Error,
    LoginDTORequest
  >({
    mutationFn: async (params) => {
      const dto = await login(params);
      return toLoginResult(dto); // <--- Adapter Pattern: DTO → Model
    },
  });
}
```

### 4.5 Container — Query (Read)

```typescript
// features/members/containers/MemberProfileContainer.tsx
import { useMe } from "../api/me/useMe";
import { MemberCard } from "../components/MemberCard";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const MemberProfileContainer = () => {
  // 'member' is typed as 'Member' (Domain Model), NOT DTO
  const { data: member, isLoading } = useMe();

  if (isLoading) return <Skeleton />;
  if (!member) return null;

  return <MemberCard member={member} />;
};
```

### 4.6 Container — Mutation (Write)

**Strict Rules:**
- Mutations use `mutate` with `onSuccess`/`onError` callbacks. **NEVER** use `mutateAsync` with `try/catch`.
- Containers receive **navigation callbacks** from their parent page (e.g., `onForgotPassword`, `onRegister`) instead of using `<Link>` for intra-page navigation.
- Always use **path constants** (e.g., `AuthPath.ROOT`) for programmatic navigation. **NEVER** hardcode paths as strings.

```typescript
// features/auth/containers/LoginContainer.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthPath } from "@/shared/routes/AuthRoutes/auth-path";

import { useLogin } from "../api/login/useLogin";
import { LoginForm } from "../components/LoginForm";
import {
  type LoginForm as LoginFormType,
  loginSchema,
} from "../helpers/login.schema";
import { useAuthStore } from "../stores/useAuthStore";

interface LoginContainerProps {
  onForgotPassword: () => void;
  onRegister: () => void;
}

export const LoginContainer = ({
  onForgotPassword,
  onRegister,
}: LoginContainerProps) => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const { mutate, isPending } = useLogin();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutate(data, {
      onSuccess: ({ user, tokens }) => {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        setUser(user);
        toast.success("Sesión iniciada correctamente");
        navigate(AuthPath.ROOT, { replace: true });
      },
      onError: () => {
        toast.error("Credenciales incorrectas");
      },
    });
  });

  return (
    <LoginForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isPending}
      onForgotPassword={onForgotPassword}
      onRegister={onRegister}
    />
  );
};
```

> **Why `mutate` over `mutateAsync`?** The `mutate` + callbacks pattern avoids unhandled promise rejections and keeps success/error logic co-located with the call site. It also avoids the need for `try/catch` blocks.

> **Why navigation callbacks instead of `<Link>`?** When multiple views live on the same page (e.g., Login, Register, ForgotPassword), navigation between them is **state-based** (managed by the parent page), not route-based. Containers receive callbacks like `onRegister`, `onBackToLogin` and presentational components render `<button type="button">` instead of `<Link>`.

### 4.7 Presentational Component

```typescript
// features/members/components/MemberCard.tsx
import type { Member } from "../models/member.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Stack } from "@/shared/components/layout/Stack";
import { P, Small } from "@/shared/components/ui/typography";

interface MemberCardProps {
  member: Member;
}

export const MemberCard = ({ member }: MemberCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{member.name} {member.lastName}</CardTitle>
    </CardHeader>
    <CardContent>
      <Stack gap="sm">
        <P>Status: {member.isActive ? "Active" : "Inactive"}</P>
        <Small color="muted">ID: {member.id}</Small>
      </Stack>
    </CardContent>
  </Card>
);
```

### 4.8 Zustand Store

Stores manage **client-side global state** using Zustand. They always work with **Domain Models**, never DTOs.

```typescript
// features/members/stores/useMemberStore.ts
import { create } from "zustand";
import type { Member } from "../models/member.model";

interface MemberStore {
  // State
  selectedMember: Member | null;
  filters: { search: string; isActive: boolean | null };

  // Actions
  setSelectedMember: (member: Member | null) => void;
  setFilters: (filters: Partial<MemberStore["filters"]>) => void;
  reset: () => void;
}

const initialState = {
  selectedMember: null,
  filters: { search: "", isActive: null },
};

export const useMemberStore = create<MemberStore>((set) => ({
  ...initialState,
  setSelectedMember: (member) => set({ selectedMember: member }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  reset: () => set(initialState),
}));
```

**Derived initial state pattern:** When the store's initial state depends on external sources (like `localStorage`), derive it via a helper function. **NEVER** hardcode initial values that should be dynamic:

```typescript
// features/auth/stores/useAuthStore.ts
import { create } from "zustand";
import { AuthStatus } from "@/shared/types/status";
import type { User } from "../models/user.model";

// Derive initial status from localStorage — if there's a token, start as "idle"
// (pending validation), otherwise start as "unauthenticated"
const getInitialStatus = (): AuthStatus =>
  localStorage.getItem("accessToken")
    ? AuthStatus.Idle
    : AuthStatus.Unauthenticated;

const initialState = {
  user: null as User | null,
  status: getInitialStatus(),
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setUser: (user) => set({ user, status: AuthStatus.Authenticated }),
  setStatus: (status) => set({ status }),

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, status: AuthStatus.Unauthenticated });
  },

  reset: () => set(initialState),
}));
```

> **Why derive initial status?** Hardcoding `status: AuthStatus.Unauthenticated` breaks page refresh — when a valid token exists in `localStorage`, the store should start as `Idle` so `RootLayout` can validate it via `useMe()`.

**Store rules:**
- Stores hold **UI state** (selections, filters, modals). Server state belongs in React Query.
- Always provide a `reset()` action to clear state.
- Type the store interface explicitly — separate State from Actions for clarity.
- Name files as `use[Domain]Store.ts`.
- **Derive initial state** from external sources (e.g., `localStorage`) via helper functions, never hardcode.

### 4.9 Zod Validation Schemas

Use Zod for **form validation** and **runtime data validation**. Schemas live in the feature's `helpers/` folder.

```typescript
// features/members/helpers/member.schema.ts
import { z } from "zod/v4";

export const createMemberSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "Max 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Max 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,20}$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),
  role: z.enum(["super_admin", "admin", "user"]),
});

// Infer the type from the schema — no need for a separate interface
export type CreateMemberForm = z.infer<typeof createMemberSchema>;
```

```typescript
// features/members/helpers/update-member.schema.ts
import { z } from "zod/v4";
import { createMemberSchema } from "./member.schema";

// Reuse and extend schemas with .partial(), .pick(), .omit(), .extend()
export const updateMemberSchema = createMemberSchema.partial().extend({
  status: z.enum(["active", "disabled"]).optional(),
});

export type UpdateMemberForm = z.infer<typeof updateMemberSchema>;
```

**Zod rules:**
- Import from `zod/v4` (Zod v4 API).
- Schema files use the naming convention `[domain].schema.ts` or `[action]-[domain].schema.ts`.
- Always use `z.infer<typeof schema>` to derive the TypeScript type — avoid duplicating the interface.
- Compose schemas with `.partial()`, `.pick()`, `.omit()`, `.extend()` to avoid repetition.
- Validation messages should be user-friendly strings, not technical errors.
- Zod is for **forms and runtime validation only**. Domain Models and DTOs remain plain TypeScript interfaces.

### 4.10 Page (Composition Root)

The page is the **only** layer that imports and renders multiple containers. It manages inter-container state (dialog open/close, selected entities) and passes callbacks to containers.

**Key rule:** Containers NEVER import other containers. The page orchestrates them.

```typescript
// features/prices/pages/PricesPage.tsx — Page as Composition Root
import { useState } from "react";
import { useUserInfo } from "@/features/auth/hooks/useUserInfo";
import { CreatePriceContainer } from "../containers/CreatePriceContainer";
import { EditPriceContainer } from "../containers/EditPriceContainer";
import { HardDeletePriceContainer } from "../containers/HardDeletePriceContainer";
import { PricesListContainer } from "../containers/PricesListContainer";
import type { Price } from "../models/price.model";

export const PricesPage = () => {
  const { userPermissions } = useUserInfo();
  const isReadOnly = !userPermissions?.isAdmin();

  // Inter-container state: which dialog is open, which entity is selected
  const [createOpen, setCreateOpen] = useState(false);
  const [editPrice, setEditPrice] = useState<Price | null>(null);
  const [deletePrice, setDeletePrice] = useState<Price | null>(null);

  return (
    <>
      {/* List container: only renders components, exposes callbacks */}
      <PricesListContainer
        isReadOnly={isReadOnly}
        onCreateClick={() => setCreateOpen(true)}
        onEdit={setEditPrice}
        onHardDelete={setDeletePrice}
      />

      {/* Dialog containers: each one is independent, orchestrated by the page */}
      <CreatePriceContainer open={createOpen} onOpenChange={setCreateOpen} />

      <EditPriceContainer
        open={!!editPrice}
        onOpenChange={(open) => { if (!open) setEditPrice(null); }}
        price={editPrice}
      />

      <HardDeletePriceContainer
        open={!!deletePrice}
        onOpenChange={(open) => { if (!open) setDeletePrice(null); }}
        price={deletePrice}
      />
    </>
  );
};
```

> **Why this pattern?** Each container is self-contained (fetches its own data, handles its own mutations). The page only manages *which* container is visible and *which* entity is selected. This prevents containers from becoming "god components" that know about other containers.

### 4.11 Page Orchestrator Pattern

When a single page manages **multiple views** (e.g., Login, Register, ForgotPassword, ResetPassword all on `/login`), the page acts as an **orchestrator** using local state to determine which container to render.

**Rules:**
- Use `if` statements for conditional rendering. **No** `switch/case`, **no** `else`, **no** `if-else` chains — just sequential `if` returns.
- Define a union type for possible views (e.g., `AuthView`).
- Pass navigation callbacks (`onRegister`, `onBackToLogin`) down to containers.
- Containers **never** use `<Link>` for intra-page navigation. They call the callback, and the page updates its state.

```typescript
// features/auth/pages/LoginPage.tsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ForgotPasswordContainer } from "../containers/ForgotPasswordContainer";
import { LoginContainer } from "../containers/LoginContainer";
import { RegisterContainer } from "../containers/RegisterContainer";
import { ResetPasswordContainer } from "../containers/ResetPasswordContainer";

type AuthView = "login" | "register" | "forgot-password" | "reset-password";

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const hasToken = searchParams.has("token");

  const [view, setView] = useState<AuthView>(
    hasToken ? "reset-password" : "login"
  );

  const goToLogin = () => setView("login");

  if (view === "register") {
    return <RegisterContainer onLogin={goToLogin} />;
  }

  if (view === "forgot-password") {
    return <ForgotPasswordContainer onBackToLogin={goToLogin} />;
  }

  if (view === "reset-password") {
    return <ResetPasswordContainer onBackToLogin={goToLogin} />;
  }

  return (
    <LoginContainer
      onForgotPassword={() => setView("forgot-password")}
      onRegister={() => setView("register")}
    />
  );
};
```

> **Why `if` statements?** They provide simple early returns with no nesting. Each condition is independent and reads top-to-bottom. The default case (login) is the last return with no condition.

### 4.12 HTTP Client & Interceptors

The HTTP client (`shared/lib/http-client.ts`) uses axios with two interceptors:

1. **Request interceptor**: Injects the `Authorization` header from `localStorage`.
2. **Response interceptor**: Unwraps the backend's `{ success, message, data }` wrapper and handles 401 token refresh.

**Key pattern — Use `useAuthStore.getState().logout()` for logout in interceptors:**

When a 401 occurs and token refresh fails, call `useAuthStore.getState().logout()` instead of manually clearing localStorage + `window.location.href`. This ensures reactive state updates via Zustand, which triggers React re-renders and route guards to redirect naturally.

```typescript
// shared/lib/http-client.ts
import axios from "axios";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const API_BASE_URL = "http://localhost:3000/api";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Inject access token into every request
httpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Unwrap { success, message, data } -> data + handle 401 refresh
httpClient.interceptors.response.use(
  (response) => {
    if (response.data && "success" in response.data && "data" in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        useAuthStore.getState().logout(); // No-op if not logged in
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );
        const tokens = data.data;
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return httpClient(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
```

> **Why `useAuthStore.getState().logout()` instead of `window.location.href`?** Direct URL changes bypass React's rendering cycle. Using the store triggers reactive re-renders — route guards detect the auth status change and redirect naturally. It's also a no-op when the user isn't logged in (e.g., failed login attempts), preventing unwanted page reloads.

### 4.13 Orchestrator Container Pattern

When a detail view requires **multiple independent operations** (edit, delete, change stage, send email, etc.), the container becomes a **folder** with an orchestrator and leaf containers. This avoids "god containers" that handle too many concerns.

**When to use:** A container needs to manage 3+ dialogs/operations, each with its own form and mutation.

```text
containers/
  SimpleContainer.tsx              # Single responsibility → flat file
  QuotationDetailContainer/        # Multiple operations → folder
    index.ts                       # Re-exports only the orchestrator
    QuotationDetailContainer.tsx   # Orchestrator: fetches data, manages dialog states, renders leaves
    EditQuotationContainer.tsx     # Leaf: edit form + mutation
    DeleteQuotationContainer.tsx   # Leaf: confirm dialog + mutation
    ChangeStageContainer.tsx       # Leaf: stage change form + mutation
    AddItemsContainer.tsx          # Leaf: items selection form + mutation
```

**Orchestrator responsibilities:**
- Fetches the main entity data (`useGetQuotation`)
- Manages dialog open/close states (`editOpen`, `deleteOpen`, etc.)
- Renders the presentational layout (header, tabs, content)
- Renders leaf containers with their dialog state props

**Leaf container responsibilities:**
- Owns its form (`useForm` + zodResolver)
- Owns its mutation (`useMutation`)
- Receives `open`, `onOpenChange`, and entity data as props
- Handles `onSuccess`/`onError` independently

```typescript
// Orchestrator: QuotationDetailContainer.tsx
export const QuotationDetailContainer = () => {
  const { id } = useParams<{ id: string }>();
  const { data: quotation, isLoading } = useGetQuotation(id!);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) return <Loader />;
  if (!quotation) return null;

  return (
    <>
      <QuotationHeader
        quotation={quotation}
        actions={
          <Stack direction="row" gap="sm">
            <Button onClick={() => setEditOpen(true)}>Editar</Button>
            <Button onClick={() => setDeleteOpen(true)}>Eliminar</Button>
          </Stack>
        }
      />

      {/* Leaf containers: each owns its form + mutation */}
      <EditQuotationContainer
        open={editOpen}
        onOpenChange={setEditOpen}
        quotation={quotation}
      />
      <DeleteQuotationContainer
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        quotationId={quotation.id}
      />
    </>
  );
};
```

**Rules:**
- `index.ts` only re-exports the orchestrator. Leaf containers are internal implementation details.
- Leaf containers **never import** other leaf containers.
- The orchestrator **never** owns forms or mutations directly — it delegates to leaves.
- If a container has only 1-2 operations, keep it as a flat file (no folder needed).

### 4.14 Responsive Table → Cards Pattern

Data tables should use a **desktop table + mobile cards** approach. On desktop (`md:` and above), render a proper `<Table>`. On mobile, render individual `<Card>` components with labeled fields.

```tsx
// Desktop: table (hidden on mobile)
<Box className="hidden md:block">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Código</TableHead>
        <TableHead>Nombre</TableHead>
        <TableHead className="text-right">Precio</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.code}</TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Box>

// Mobile: cards (hidden on desktop)
<Stack gap="sm" className="md:hidden">
  {items.map((item) => (
    <Card key={item.id}>
      <CardContent className="p-3">
        <Stack gap="sm">
          <Stack direction="row" gap="lg" className="flex-wrap">
            <Stack gap="none">
              <Small color="muted">Código</Small>
              <P className="text-sm font-semibold">{item.code}</P>
            </Stack>
            <Stack gap="none" className="flex-1 min-w-0">
              <Small color="muted">Nombre</Small>
              <P className="text-sm font-medium">{item.name}</P>
            </Stack>
          </Stack>
          <Separator />
          <Stack direction="row" gap="lg">
            <Stack gap="none">
              <Small color="muted">Precio</Small>
              <P className="text-sm font-semibold">{formatCurrency(item.price)}</P>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  ))}
</Stack>
```

**Rules:**
- Use `hidden md:block` for the table, `md:hidden` for cards.
- **Always show labels** on mobile cards (`Small color="muted"` above the value). Data without labels is hard to interpret on small screens.
- Group related fields in horizontal `Stack direction="row"` rows. Use `Separator` between logical groups.
- Use `flex-wrap` on rows to handle long text gracefully.

### 4.15 Cross-Feature Data Access (No Cross-Imports)

Features must **never** import from other features. When a feature needs data from another feature's API (e.g., quotations needs a list of templates), create a **local hook** inside the consuming feature that calls the endpoint directly.

```typescript
// features/quotations/api/get-templates-for-selection/useGetTemplatesForSelection.ts
// This hook calls GET /templates but lives inside the quotations feature
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/shared/lib/http-client';

interface TemplateOption {
  id: string;
  name: string;
}

interface TemplateOptionDTO {
  id: string;
  name: string;
}

const getTemplates = async (): Promise<TemplateOptionDTO[]> => {
  const { data } = await httpClient.get<TemplateOptionDTO[]>('/templates');
  return data;
};

const toTemplateOption = (dto: TemplateOptionDTO): TemplateOption => ({
  id: dto.id,
  name: dto.name,
});

export function useGetTemplatesForSelection() {
  return useQuery({
    queryKey: ['templates-for-selection'],
    queryFn: getTemplates,
    select: (data) => data.map(toTemplateOption),
  });
}
```

**Why not share the hook from `features/templates/`?** Cross-feature imports create coupling. If `templates/` changes its internal DTO or model structure, it shouldn't break `quotations/`. Each feature owns its own adapter for the data it consumes.

**Rules:**
- The local hook only maps the **fields it needs** (not the full model from the source feature).
- Use a distinct `queryKey` to avoid cache collisions with the source feature's hooks.
- The DTO/mapper can be minimal — only define what the consuming feature actually uses.

### 4.16 Loading & Error States Without Unmounting Layout

When a container fetches data and shows loading/error states, **render them inside the content area** instead of early-returning. This preserves the page header, navigation, and other layout elements.

```typescript
// BAD: Early return unmounts the entire layout
export const QuotationDetailContainer = () => {
  const { data, isLoading, isError } = useGetQuotation(id);

  if (isLoading) return <Loader2 className="animate-spin" />;  // Header disappears!
  if (isError) return <P>Error loading data</P>;                // Header disappears!

  return (
    <Stack gap="lg">
      <QuotationHeader quotation={data} />
      <QuotationContent quotation={data} />
    </Stack>
  );
};

// GOOD: Loading/error inside the content area, header stays
export const QuotationDetailContainer = () => {
  const { data, isLoading, isError } = useGetQuotation(id);

  return (
    <Stack gap="lg">
      {/* Header with back button always visible */}
      <Stack direction="row" gap="sm" align="center">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <H3>Detalle Cotización</H3>
      </Stack>

      {/* Content area: loading/error render here */}
      {isLoading && (
        <Box className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Box>
      )}

      {isError && (
        <P color="muted" className="text-center py-12">
          Error al cargar los datos
        </P>
      )}

      {data && (
        <>
          <QuotationHeader quotation={data} />
          <QuotationContent quotation={data} />
        </>
      )}
    </Stack>
  );
};
```

**When to apply this pattern:**
- Detail views with a back button or navigation header.
- Pages with filters or search bars above the data.
- Any view where the user needs context about *where they are* while data loads.

**When early returns are OK:**
- Simple containers where the entire component is the loading state (no surrounding layout).
- Pages that haven't rendered any UI yet (first-time full-page load).

### 4.17 Page Complexity Patterns

Pages adapt their structure based on complexity. **Never create a page that is just a thin wrapper around a single container.** The page should either absorb the container's logic or orchestrate multiple containers.

#### Decision Table

| Complexity | Pattern | Separate Container? | Example |
|---|---|---|---|
| Single simple operation | **A — Page absorbs** | No | Create form, simple list |
| Single operation, heavy logic | **C — Page + Hook** | No (hook yes) | Complex form with many memos |
| Multiple operations | **B — Page orchestrates** | Yes (leaf containers) | Detail view with dialogs |

#### Pattern A — Page Absorbs Container

When the page has a single purpose (one form, one list), the page uses hooks directly. No intermediate container.

```typescript
// features/quotations/pages/QuotationCreatePage.tsx
export const QuotationCreatePage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateQuotation();
  const { data: templates } = useGetTemplatesForSelection();
  const form = useForm<CreateQuotationFormValues>({ ... });

  const onSubmit = form.handleSubmit((data) => {
    mutate(payload, {
      onSuccess: () => navigate(basePath),
      onError: (error) => toast.error(getApiErrorMessage(error, "Error")),
    });
  });

  return (
    <Stack gap="lg">
      <H4>Nueva Cotización</H4>
      <CreateQuotationForm form={form} onSubmit={onSubmit} isLoading={isPending} />
    </Stack>
  );
};
```

#### Pattern B — Page as Orchestrator

When the page manages multiple independent operations (dialogs, tabs), it orchestrates leaf containers. The JSX reads as composable blocks.

```typescript
// features/quotations/pages/QuotationDetailPage.tsx
export const QuotationDetailPage = () => {
  const { data: quotation, isLoading } = useGetQuotation(id);

  // Dialog states — this is the page's orchestration job
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sendEmailOpen, setSendEmailOpen] = useState(false);

  if (isLoading) return <P color="muted">Cargando...</P>;
  if (!quotation) return <P color="muted">Error</P>;

  return (
    <Stack gap="lg">
      <QuotationHeader
        quotation={quotation}
        actions={<QuotationActions onEdit={() => setEditOpen(true)} onDelete={...} />}
      />

      <Tabs defaultValue="items">
        <TabsContent value="items"><QuotationItemsTab ... /></TabsContent>
        <TabsContent value="financials"><QuotationFinancialsTab ... /></TabsContent>
      </Tabs>

      {/* Leaf containers: each one is an independent operation */}
      <EditQuotationContainer open={editOpen} onOpenChange={setEditOpen} quotation={quotation} />
      <DeleteQuotationContainer open={deleteOpen} onOpenChange={setDeleteOpen} ... />
      <SendEmailContainer open={sendEmailOpen} onOpenChange={setSendEmailOpen} ... />
    </Stack>
  );
};
```

> **Key insight:** The JSX should read like building blocks. If you blur the prop values, the structure should still make sense:
> ```
> <Stack>
>   <Header ... />
>   <Tabs ...>
>     <TabContent ... />
>     <TabContent ... />
>   </Tabs>
>   <EditDialog ... />
>   <DeleteDialog ... />
>   <SendEmailDialog ... />
> </Stack>
> ```

#### Pattern C — Page + Custom Hook

When the page has a single purpose but the logic is heavy (many useMemo, complex handlers), extract the logic into a custom hook.

```typescript
// features/quotations/hooks/useCreateQuotation.ts — all the logic
export const useCreateQuotation = () => {
  const form = useForm<CreateQuotationFormValues>({ ... });
  // ... heavy logic, memos, handlers
  return { form, onSubmit, isPending, templates, prices };
};

// features/quotations/pages/QuotationCreatePage.tsx — pure composition
export const QuotationCreatePage = () => {
  const { form, onSubmit, isPending, templates } = useCreateQuotation();

  return (
    <Stack gap="lg">
      <H4>Nueva Cotización</H4>
      <CreateQuotationForm form={form} onSubmit={onSubmit} isLoading={isPending} />
    </Stack>
  );
};
```

#### Anti-pattern: Thin Wrapper Page

**Never** create a page that only wraps a container:

```typescript
// BAD — the page has no reason to exist as a separate layer
export const QuotationCreatePage = () => {
  return <CreateQuotationContainer />;
};
```

If you find yourself writing this, either absorb the container (Pattern A) or question whether the container should exist at all.

### 4.18 Extracción de lógica con Custom Hooks

When a page or container accumulates too much logic (multiple `useMemo`, `useEffect`, handlers, derived state), extract it into a custom hook in `hooks/`.

#### When to extract

| Signal | Action |
|---|---|
| 5+ `useMemo`/`useEffect` in a single file | Extract to hook |
| File exceeds ~200 lines of logic (excluding JSX) | Extract to hook |
| Logic is reused across pages/containers | Extract to shared hook |
| Single `useState` + one handler | Keep inline — don't over-extract |

#### Pattern

```typescript
// hooks/useCreateQuotationForm.ts — ALL business logic
export const useCreateQuotationForm = () => {
  const form = useForm<CreateQuotationFormValues>({ ... });
  const { mutate, isPending } = useCreateQuotation();

  // Derived state, memos, handlers...
  const availablePrices = useMemo(() => { ... }, [deps]);
  const handleTemplateChange = (id: string) => { ... };
  const onSubmit = form.handleSubmit((data) => { mutate(payload, { ... }); });

  return { form, onSubmit, isPending, availablePrices, handleTemplateChange };
};

// pages/QuotationCreatePage.tsx — pure composition
export const QuotationCreatePage = () => {
  const { form, onSubmit, isPending, ... } = useCreateQuotationForm();
  return (
    <Stack gap="lg">
      <H4>Nueva Cotización</H4>
      <CreateQuotationForm form={form} onSubmit={onSubmit} isPending={isPending} />
    </Stack>
  );
};
```

#### When NOT to use a custom hook

- **`useReducer` is not a substitute for `useMemo` chains.** When state is managed by `react-hook-form`, derived data (`availablePrices`, `selectedItems`, `clientSideTotalIncome`) are computed values — not state transitions. `useReducer` adds complexity without benefit in this case. Use `useMemo` for derived data, `useReducer` only for genuine state machines with multiple actions.
- **Don't extract a hook for 1-2 lines of logic.** A single `useState` + handler is fine inline.

#### React 19 note — useMemo / useCallback

This project uses **React 19** with `@vitejs/plugin-react` (standard Babel transform). The **React Compiler** is NOT enabled. Therefore:

- `useMemo` and `useCallback` remain the standard tools for memoization. Use them when a computation is expensive or when referential stability matters (e.g., dependencies of other hooks, props to `React.memo` components).
- When React Compiler is enabled in the future, it will auto-memoize most expressions, making manual `useMemo`/`useCallback` largely unnecessary. At that point, these guidelines should be revisited.
- React 19 introduced new hooks (`useActionState`, `useFormStatus`, `useOptimistic`) designed for **native HTML `<form>` actions**. Since this project uses `react-hook-form` for all form management, these hooks are **not applicable**. Do not mix them with `react-hook-form`.

### 4.19 Componentes presentacionales: tamaño máximo y extracción

Presentational components should be **small and composable**. When a component's JSX grows too large, extract sections into sub-components.

#### One component per file

Each `.tsx` file should export **exactly one component**. Internal helper components (e.g., a `SectionCard` inside `ContractFinancialsTab.tsx`) must be extracted into their own file when they exceed ~20 lines of JSX. Small inline render helpers (< 20 lines, no props interface) may stay as `const` inside the file.

#### Size limits

| Metric | Threshold | Action |
|---|---|---|
| JSX lines | > ~200 lines | Extract sections into sub-components |
| Props | > 10 props | Consider grouping via a hook or splitting the component |
| Nested Card/Section blocks | 3+ distinct visual blocks | Each block is a candidate for extraction |
| Internal sub-components | > ~20 JSX lines | Extract to own file in same folder |

#### Extraction strategy

1. **Identify visual blocks.** Each `<Card>` or logical section in the JSX is a candidate.
2. **Create sub-components** in the same folder. Name them after the section they represent (e.g., `ClientInfoCard`, `TemplateSelectionCard`, `ItemsSelectionCard`).
3. **Props flow down.** The parent passes only what each sub-component needs. Sub-components are purely presentational — no hooks, no business logic.
4. **The parent becomes pure composition:**

```tsx
// components/create-form/CreateQuotationForm.tsx — ~100 lines
export const CreateQuotationForm = ({ form, onSubmit, ... }: CreateQuotationFormProps) => (
  <form onSubmit={onSubmit}>
    <Stack gap="lg">
      <ClientInfoCard form={form} />
      <TemplateSelectionCard ... />
      <ItemsSelectionCard ... />
      <DeductionsCard form={form} clientSideTotalIncome={clientSideTotalIncome} />
      <Stack direction="row" gap="sm" justify="end">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isPending}>Crear</Button>
      </Stack>
    </Stack>
  </form>
);
```

#### Shared pattern components

When the same visual pattern appears across multiple features, extract to `shared/`:

| Pattern | Component | Location |
|---|---|---|
| Integer-only number input | `QuantityInput` | `shared/components/ui/QuantityInput.tsx` |
| Flex label/value pair | `FinancialRow` | Feature-specific (promote to shared if reused) |

#### What makes a component presentational

A presentational component must have **zero business logic**:
- No `toast.error`, no `useMemo` with business rules, no API calls.
- Only `register`, `Controller`, layout, and props forwarding.
- If a component has `useMemo` computing derived business data or shows `toast` messages, it's a container disguised as a component — refactor it.

### 4.20 Organización de carpeta components/ con subcarpetas semánticas

Organize `components/` into semantic subfolders grouped by **consumer** (the page or container that uses them). This improves navigability and makes it obvious which components belong to which view.

#### When to organize

| Signal | Action |
|---|---|
| Components serve clearly different views (detail vs list) | Group by consumer view |
| > 8 files in `components/` | Strongly consider subfolders |
| A single flat folder mixes list, detail, and form components | Always split |

#### Grouping rules

1. **Group by consumer.** Each subfolder maps to the page or container that uses those components.
2. **Name subfolders in `kebab-case`** after the operation or view (e.g., `create-form/`, `detail/`, `edit-template/`, `list/`).
3. **Shared components stay standalone.** If a component is used by 2+ subfolders, keep it at the root of `components/` (e.g., `StageBadge.tsx` used by both `detail/` and `list/`).
4. **Two nesting levels maximum.** `components/detail/ContractHeader.tsx` (level 1) and `components/detail/payments/ContractPaymentsTab.tsx` (level 2) are fine. Never go to `components/detail/payments/history/PaymentRow.tsx` (level 3).
5. **Sub-group when a consumer subfolder has many files.** When a consumer subfolder (e.g., `detail/`) accumulates **> 10 files**, group the tab/section components and their sub-components into semantic sub-folders named in `kebab-case` after the section they represent (e.g., `payments/`, `assignees/`, `items/`). Files that don't belong to any specific group (e.g., the header, standalone dialogs) stay at the consumer subfolder root.

#### When to sub-group within a consumer folder

| Signal | Action |
|---|---|
| > 10 files in a consumer subfolder | Sub-group by section/tab |
| A tab component has 2+ extracted sub-components | Move the tab + its sub-components into a sub-folder |
| A component is only used by one tab | It goes in that tab's sub-folder |
| A component is used by multiple tabs or is standalone | It stays at the consumer subfolder root |

#### Example structure (flat — few files)

```
components/
  create-form/                  # → QuotationCreatePage
    CreateQuotationForm.tsx
    ClientInfoCard.tsx
    TemplateSelectionCard.tsx
    ItemsSelectionCard.tsx
    DeductionsCard.tsx
    SelectedItemsTable.tsx
    SelectedItemsCards.tsx
    ItemPickerDialog.tsx
  list/                         # → QuotationsListContainer
    QuotationsTable.tsx
    QuotationsFilterBar.tsx
  StageBadge.tsx                # shared across detail/ and list/
```

#### Example structure (sub-grouped — many files)

When a consumer folder grows beyond ~10 files, group tab components with their sub-components:

```
components/
  ContractStageBadge.tsx          # shared across detail/ and list/
  detail/                         # → ContractDetailPage
    ContractHeader.tsx            # stays at root (no sub-group)
    FinancialOverviewGrid.tsx     # stays at root (used by header)
    ContractHistoryTab.tsx        # stays at root (no sub-components)
    ContractStageChangeDropdown.tsx
    QuotationSnapshotDialog.tsx
    items/                        # tab + its sub-components
      ContractItemsTab.tsx
      SectionItemsList.tsx
    financials/
      ContractFinancialsTab.tsx
      FinancialSummaryCard.tsx
      SectionFinancialCard.tsx
    payments/
      ContractPaymentsTab.tsx
      PaymentSummaryCard.tsx
      PaymentHistoryList.tsx
    assignees/
      ContractAssigneesTab.tsx
      SectionAssigneeRow.tsx
      ExpenseAssigneesTable.tsx
      AssigneeCostCard.tsx
      UnassignedItemsCard.tsx
  list/
    ContractsTable.tsx
    ContractFilters.tsx
```

#### Import path updates

When moving files into subfolders, update relative imports:
- **Inside consumer subfolders (level 1):** `../models/` becomes `../../models/`, `../api/` becomes `../../api/`.
- **Inside sub-group folders (level 2):** `../../models/` becomes `../../../models/`.
- **Cross-subfolder references:** `./StageBadge` becomes `../StageBadge`.
- **External consumers (pages/containers):** Add the subfolder path (e.g., `../components/detail/payments/ContractPaymentsTab`).

### 4.21 Shared State Components (Loading, Error, Empty, NotFound)

Use the **shared state components** from `@/shared/components/ui/` for all loading, error, empty, and not-found states. **Never** create inline `<P>` patterns for these states.

#### Available components

| Component | Location | Default message | Usage |
|---|---|---|---|
| `PageLoading` | `@/shared/components/ui/PageLoading` | "Cargando..." | Data is being fetched |
| `PageError` | `@/shared/components/ui/PageError` | "Ha ocurrido un error." | API error occurred |
| `PageEmpty` | `@/shared/components/ui/PageEmpty` | "Sin resultados." | List/table has zero items |
| `PageNotFound` | `@/shared/components/ui/PageNotFound` | (required) | Entity not found (404) |

#### Usage examples

```tsx
// In a container (loading + error)
{isLoading ? (
  <PageLoading message="Cargando contratos..." />
) : isError ? (
  <PageError message="Error al cargar los contratos." />
) : (
  <ContractsTable contracts={data} />
)}

// In a presentational component (empty state)
if (items.length === 0) {
  return <PageEmpty message="No se encontraron items." />;
}

// In a page (404 detection)
if (isNotFound) {
  return <PageNotFound message="El contrato no existe." onBack={() => navigate(basePath)} />;
}
```

#### Rules

- **Always use these components** instead of writing inline `<P color="muted" className="py-12 text-center">` patterns.
- **Always pass a custom `message`** that describes the specific context (e.g., "Cargando historial..." not just "Cargando...").
- **`PageNotFound` requires `onBack`** — always provide a navigation callback.
- **When creating new features**, use these components from the start. Never re-implement loading/error/empty states with raw typography.

---

## 5. LAYOUT & TYPOGRAPHY PRIMITIVES SPEC

Always favor semantic components over raw HTML tags. **Never use raw `<div>`, `<p>`, `<span>`, or `<h1>`–`<h6>` in feature code.**

### 5.1 Layout Primitives

Replace raw `<div>` with these:

| Primitive | Replaces | Description | Key Props | CSS Basis |
|-----------|----------|-------------|-----------|-----------|
| `Stack` | `<div>` with flex | Flex container for stacking | `gap`, `direction`, `align`, `justify`, `wrap` | Flexbox |
| `Grid` | `<div>` with grid | Grid container for layouts | `cols`, `gap` | CSS Grid |
| `Box` | `<div>` generic | Polymorphic semantic wrapper | `className`, `as` | Block/Flex |

### 5.2 Typography Primitives

Replace raw `<p>`, `<span>`, `<h1>`–`<h6>` with these (from `@/shared/components/ui/typography`):

| Primitive | Replaces | Key Props | Fixed Size |
|-----------|----------|-----------|------------|
| `H1`–`H6` | `<h1>`–`<h6>` | `color` | Each has its own fixed responsive size |
| `P` | `<p>` | `color` | `text-sm lg:text-base` |
| `Small` | `<small>` | `color` | `text-xs lg:text-sm` + `font-medium` |
| `Span` | `<span>` | `weight`, `color` | Inherits from parent |
| `Blockquote` | `<blockquote>` | `color` | `text-sm lg:text-base` |

Each component = one fixed typographic level. **No `size` prop.** If you need a different size in an exceptional case, use `className`.

#### Responsive strategy

All typography primitives use **subtle responsive sizing** with a single step up at `lg` (1024px). Each component has ONE fixed size — no size props needed.

- **`P`, `Small`, `Blockquote`** — one step smaller on mobile, full size on `lg+`. Example: `P` is `text-sm` (14px) on mobile, `lg:text-base` (16px) on desktop.
- **`Span`** — inherits text size from its parent element. Only controls `weight` and `color`.
- **`H1`–`H6`** — one step smaller on mobile, full size on `md+`. Example: `H4` is `text-lg` on mobile, `md:text-xl` on desktop.

| Component | Mobile | lg+ (1024px) | Extra |
|-----------|--------|--------------|-------|
| **P** | `text-sm` | `text-base` | `leading-relaxed` |
| **Small** | `text-xs` | `text-sm` | `font-medium leading-none` |
| **Span** | inherits | inherits | — |
| **Blockquote** | `text-sm` | `text-base` | `italic border-l-4` |

#### When to use P vs Small

| Content type | Component | Example |
|---|---|---|
| Body text, paragraphs, messages | `P` | Descriptions, error messages, loading states |
| Labels, annotations, compact data | `Small` | Financial card rows, table labels, metadata |
| Inline emphasis within P or Small | `Span` | `<Small>Tel: <Span weight="medium">123</Span></Small>` |

#### Color handling

Color is **not global** — it's set per usage via the `color` prop. Available values: `default` (`text-foreground`), `muted` (`text-muted-foreground`), `primary` (`text-primary`), `inherit` (default — inherits from parent).

When nesting typography components, use `color` explicitly to override inheritance:

```tsx
// The Span needs color="default" to stay dark inside a muted parent
<Small color="muted">
  <Span weight="medium" color="default">Label:</Span>{' '}
  value text inherits muted from Small
</Small>
```

> **Why wrappers instead of raw tags?** Centralizing defaults means you can change the base `font-size`, `line-height`, or responsive breakpoints for all paragraphs in the entire app by editing one file (`typography.tsx`). The same applies to `Span`, `Small`, and headings.

> **When to use Tailwind overrides:** If you need a one-off style (e.g., `uppercase tracking-wide`), pass it via `className`. Prefer the built-in `color` and `weight` props over raw Tailwind classes for common patterns.

### 5.3 Usage Examples

```tsx
// Layout primitives
<Stack gap="md" direction="col">
  <H2>Title</H2>
  <P>Description</P>
</Stack>

<Stack gap="sm" direction="row" align="center">
  <Avatar />
  <P>{name}</P>
</Stack>

<Grid cols={3} gap="lg">
  <Card />
  <Card />
  <Card />
</Grid>

<Box className="p-4 bg-white rounded-lg">
  <Content />
</Box>

// Typography primitives
<H4>Client Name</H4>
<P color="muted">Description text</P>
<Small color="muted">
  <Span weight="medium" color="default">Label:</Span> value
</Small>
```

---

## 6. NAMING CONVENTIONS

| Element           | Convention         | Example                                       |
| ----------------- | ------------------ | --------------------------------------------- |
| Feature folder    | `kebab-case`       | `user-management/`                            |
| API subfolder     | `kebab-case`       | `api/forgot-password/`, `api/login/`          |
| DTO file          | `kebab-case.ts`    | `login.dto.ts`, `forgot-password.dto.ts`      |
| Hook file (RQ)    | `camelCase.ts`     | `useLogin.ts`, `useForgotPassword.ts`         |
| Hook file (custom)| `camelCase.ts`     | `useUserInfo.ts`                              |
| Component file    | `PascalCase.tsx`   | `MemberCard.tsx`                              |
| Container file    | `PascalCase.tsx`   | `MemberProfileContainer.tsx`                  |
| Model file        | `kebab-case.ts`    | `member.model.ts`                             |
| Store file        | `camelCase.ts`     | `useMemberStore.ts`                           |
| Helper file       | `kebab-case.ts`    | `format-member-name.ts`                       |
| Schema file       | `kebab-case.ts`    | `login.schema.ts`, `member.schema.ts`         |
| Interface/Type    | `PascalCase`       | `Member`, `LoginDTOResponse`                  |
| Mapper function   | `camelCase`        | `toMember`, `toLoginResult`                   |
| Constant          | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_BASE_URL`                 |

> **Note:** React Query hooks live in `api/[endpoint]/`, custom hooks live in `hooks/`. Mappers live inside their respective `.dto.ts` files, not in separate files.

---

## 7. RULES & ANTI-PATTERNS

### DO

- Use Layout Primitives (`Stack`, `Grid`, `Box`) instead of raw `<div>`. Use Typography Primitives (`P`, `Span`, `Small`, `H1`–`H6`) instead of raw `<p>`, `<span>`, `<h1>`–`<h6>` (Section 5).
- **Set `color` explicitly** on nested typography components when the parent's color should not be inherited (e.g., `<Span color="default">` inside a `<Small color="muted">`).
- Transform every DTO into a Domain Model before the UI consumes it.
- Keep components **dumb** and containers **smart**.
- Use React Query's `select` for query data transformation.
- Type hooks generically to support the Adapter Pattern.
- Create folders inside a feature only when needed.
- Use Zustand for **client-side UI state** (selections, filters, modals). Server data belongs in React Query.
- Use Zod schemas for form validation. Derive form types with `z.infer` — don't duplicate interfaces.
- **Co-locate** DTOs, mappers, and React Query hooks inside `api/[endpoint]/` subfolders.
- **Always create a separate `.dto.ts` file** for each API endpoint — even for simple DTOs. Never define DTO interfaces inline inside hook files.
- **Place mappers inside the DTO file** (`[endpoint].dto.ts`), not in separate mapper files.
- Use `mutate` with `onSuccess`/`onError` callbacks for mutations in containers.
- Keep `hooks/` folder for **custom hooks only** (e.g., `useUserInfo`, `useDebounce`).
- **Always use path constants** (e.g., `AuthPath.ROOT`, `UserPath.OVERVIEW`) for navigation. Never hardcode paths as strings.
- Use `if` statements with early returns for conditional rendering. No `else`, no `if-else`, no `switch/case`.
- Use `useAuthStore.getState().logout()` in interceptors and non-React contexts. Never use `window.location.href` for auth redirects.
- Derive Zustand initial state from external sources (e.g., `localStorage`) via helper functions.
- Pass **navigation callbacks** from pages to containers for intra-page navigation. Use `<button type="button">` in components, not `<Link>`.
- Use the `AuthStatus` const object for auth state comparisons (e.g., `AuthStatus.Authenticated`), not raw strings.
- **Promote containers to folders** when they manage 3+ dialogs/operations. Use the Orchestrator Container Pattern (Section 4.13).
- **Use the Responsive Table → Cards pattern** for data tables (Section 4.14). Always include labels on mobile cards.
- **Create local hooks** when a feature needs data from another feature's API. Never import across features (Section 4.15).
- **Render loading/error inside the content area**, not as early returns, when the view has headers or navigation that should persist (Section 4.16).
- **Extract logic into custom hooks** when a page/container exceeds ~200 lines of logic or has 5+ `useMemo`/`useEffect` (Section 4.18).
- **Keep presentational components under ~200 lines of JSX.** Extract visual blocks into sub-components (Section 4.19).
- **Organize `components/` into semantic subfolders** when the folder exceeds ~8 files. Sub-group within consumer folders when they exceed ~10 files (Section 4.20).
- **Use shared state components** (`PageLoading`, `PageError`, `PageEmpty`, `PageNotFound`) for all loading, error, empty, and not-found states. Never write inline `<P>` patterns for these (Section 4.21).

### DON'T

- **NEVER** pass DTOs directly to components.
- **NEVER** use raw `<div>` for layout purposes (use `Stack`, `Grid`, `Box`).
- **NEVER** use raw `<p>`, `<span>`, or `<h1>`–`<h6>` tags. Use `P`, `Span`, `Small`, `H1`–`H6` from `@/shared/components/ui/typography` (Section 5).
- **NEVER** put business logic inside presentational components.
- **NEVER** call API endpoints directly from components or containers.
- **NEVER** use `any` type. Always provide proper TypeScript types.
- **NEVER** mix feature concerns. Each feature is an isolated domain.
- **NEVER** import from one feature into another. Use `shared/` for cross-feature needs.
- **NEVER** use `mutateAsync` + `try/catch` in containers. Use `mutate` + callbacks instead.
- **NEVER** create standalone mapper files (`helpers/*.mapper.ts`). Mappers belong in the DTO file.
- **NEVER** define DTO interfaces inline inside hook files. DTOs always go in their own `[endpoint].dto.ts` file, regardless of size.
- **NEVER** place React Query hooks in the `hooks/` folder. They belong in `api/[endpoint]/`.
- **NEVER** hardcode paths as strings (`"/login"`, `"/admin"`). Always use path constants from `*-path.ts`.
- **NEVER** use `switch/case` or `if-else` chains. Prefer `if` with early returns or object lookup tables.
- **NEVER** use `window.location.href` for auth redirects. Use store actions + route guards for reactive navigation.
- **NEVER** use `<Link>` for intra-page view switching. Use callbacks + `<button type="button">` instead.
- **NEVER** hardcode Zustand initial state that depends on runtime values. Derive via helper functions.
- **NEVER** use early returns for loading/error states when it would unmount headers, navigation, or layout elements the user needs for context.
- **NEVER** show data without labels on mobile cards. Each value must have a `Small color="muted"` label above it.
- **NEVER** import hooks or models from one feature into another. Create a local hook in the consuming feature instead.
- **NEVER** put business logic (`useMemo` with business rules, `toast.error`, API calls) in presentational components. If it has logic, it's a container — refactor it (Section 4.19).
- **NEVER** use `useReducer` as a substitute for `useMemo` chains when state is managed by `react-hook-form`. Derived data is not state transitions (Section 4.18).
- **NEVER** use React 19 form hooks (`useActionState`, `useFormStatus`, `useOptimistic`) with `react-hook-form`. They are designed for native HTML form actions only (Section 4.18).
- **NEVER** nest component subfolders deeper than two levels. `components/detail/payments/PaymentSummaryCard.tsx` (level 2) is fine; `components/detail/payments/history/PaymentRow.tsx` (level 3) is too deep (Section 4.20).
- **NEVER** write inline `<P color="muted" className="py-12 text-center">` for loading, error, or empty states. Use the shared state components (`PageLoading`, `PageError`, `PageEmpty`, `PageNotFound`) instead (Section 4.21).

---

## 8. ROUTING PATTERN (Role-Based Route Groups)

Routes live in `src/shared/routes/` and follow a **role-based grouping** pattern. Each role (User, Admin, Guest, etc.) gets its own folder with 4 files, plus a central router that assembles everything.

### 8.1 Directory Structure

```text
src/shared/
  ├── interfaces/
  │    └── router.ts            # Shared Route interface
  └── routes/
       ├── router.tsx           # Main router (createBrowserRouter)
       ├── RootLayout.tsx       # Auth initialization (token check, useMe, set store)
       ├── LayoutWrapper.tsx    # Wraps element with its assigned layout
       └── [RoleName]Routes/    # One folder per role/group
            ├── role-path.ts    # Path constants (as const)
            ├── Role.tsx        # Guard component (auth + permissions + Outlet)
            ├── RoleRoot.tsx    # Default redirect for the group
            └── RoleRoutes.tsx  # Route definitions object
```

### 8.2 RootLayout (Auth Initialization)

The `RootLayout` is the **top-level route component** that wraps all route groups. It handles authentication initialization: checks for stored tokens, fetches the current user via `useMe`, and updates the auth store before rendering any routes. While initializing, it shows a loading spinner.

```typescript
// shared/routes/RootLayout.tsx
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useMe } from "@/features/auth/api/me/useMe";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { Box } from "@/shared/components/layout/Box";
import { AuthStatus } from "@/shared/types/status";

export const RootLayout: React.FC = () => {
  const { setUser, setStatus, status } = useAuthStore();
  const hasToken = !!localStorage.getItem("accessToken");

  const { data: user, isError, isSuccess } = useMe({
    enabled: hasToken && status === AuthStatus.Idle,
  });

  useEffect(() => {
    if (!hasToken) {
      setStatus(AuthStatus.Unauthenticated);
      return;
    }
    if (isSuccess && user) {
      setUser(user);
    }
    if (isError) {
      setStatus(AuthStatus.Unauthenticated);
    }
  }, [hasToken, isSuccess, isError, user, setUser, setStatus]);

  // Show spinner while initializing auth
  if (status === AuthStatus.Idle && hasToken) {
    return (
      <Box className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Box>
    );
  }

  return <Outlet />;
};
```

### 8.3 The 4 Files Per Route Group

Each route group folder contains exactly 4 files with clear responsibilities:

| File              | Responsibility                                                                 |
| ----------------- | ------------------------------------------------------------------------------ |
| `role-path.ts`    | **Path constants.** Single source of truth for all URLs of this role.          |
| `Role.tsx`        | **Guard.** Checks auth/permissions, redirects if unauthorized, renders `<Outlet />` if valid. |
| `RoleRoot.tsx`    | **Default redirect.** Redirects the base path (`/main/`) to the default sub-route. |
| `RoleRoutes.tsx`  | **Route map.** Typed object mapping each path key to `{ path, element, label, layout }`. |

### 8.4 Shared Route Interface

```typescript
// shared/interfaces/router.ts
export interface Route {
  path: string;
  element: React.ReactNode;
  label?: string;
  layout?: React.ComponentType;
}
```

### 8.5 Code Examples

**Step 1 — Path Constants** (`user-path.ts`)

```typescript
// shared/routes/UserRoutes/user-path.ts
export const UserPath = {
  ROOT: '/main/',
  OVERVIEW: '/main/overview',
  REPORTS: '/main/reports',
  MY_ORGANIZATION: '/main/organization',
  ANY: '*',
} as const;

export type UserPath = keyof typeof UserPath;
```

> Uses `as const` + `keyof typeof` to get a union type of the keys (`"ROOT" | "OVERVIEW" | ...`), ensuring the route map is exhaustive.

**Step 2 — Guard Component** (`Auth.tsx`)

Guards use `useUserInfo()` and the `AuthStatus` enum to check auth state. Use simple `if` statements (no `else`, no `if-else`) — each condition returns early.

```typescript
// shared/routes/AuthRoutes/Auth.tsx
import { Navigate, Outlet } from 'react-router-dom';

import { useUserInfo } from '@/features/auth/hooks/useUserInfo';
import { AuthStatus } from '@/shared/types/status';

import { AdminPath } from '../AdminRoutes/admin-path';
import { UserPath } from '../UserRoutes/user-path';

export const Auth: React.FC = () => {
  const { authStatus, userPermissions } = useUserInfo();

  if (authStatus === AuthStatus.Authenticated) {
    return userPermissions?.isAdmin() ? (
      <Navigate to={AdminPath.ROOT} replace />
    ) : (
      <Navigate to={UserPath.ROOT} replace />
    );
  }

  return <Outlet />;
};
```

> The Guard handles: authentication check, role-based redirects, and renders `<Outlet />` only when the user is not authenticated (guest).

**Step 3 — Root Redirect** (`UserRoot.tsx`)

```typescript
// shared/routes/UserRoutes/UserRoot.tsx
import { Navigate } from 'react-router-dom';
import { UserPath } from './user-path';

export const UserRoot: React.FC = () => {
  return <Navigate to={UserPath.OVERVIEW} replace />;
};
```

**Step 4 — Route Definitions** (`UserRoutes.tsx`)

```typescript
// shared/routes/UserRoutes/UserRoutes.tsx
import { Navigate } from 'react-router-dom';
import type { Route } from '@/shared/interfaces/router';
import { UserLayout } from '@/shared/layout/UserLayout';
import { Overview } from '@/features/reports/pages/Overview';
import { Organization } from '@/features/user-management/pages/Organization';
import { UserPath } from './user-path';

export const UserRoutes: { [key in UserPath]: Route } = {
  ROOT: {
    path: UserPath.ROOT,
    element: <Navigate to={UserPath.OVERVIEW} replace />,
  },
  OVERVIEW: {
    path: UserPath.OVERVIEW,
    element: <Overview />,
    label: 'OVERVIEW',
    layout: UserLayout,
  },
  REPORTS: {
    path: `${UserPath.REPORTS}/*`,
    element: <Reports />,
    label: 'REPORTS',
    layout: UserLayout,
  },
  MY_ORGANIZATION: {
    path: UserPath.MY_ORGANIZATION,
    element: <Organization />,
    label: 'MY_ORGANIZATION',
    layout: UserLayout,
  },
  ANY: {
    path: UserPath.ANY,
    element: <Navigate to={UserPath.OVERVIEW} replace />,
  },
} as const;
```

> The type `{ [key in UserPath]: Route }` forces exhaustiveness — if you add a new path to `UserPath`, TypeScript will error until you define its route.

### 8.6 Main Router (Assembly)

The main router wraps everything under `RootLayout` for auth initialization. Each route group is mounted at its own base path:

```typescript
// shared/routes/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Admin } from './AdminRoutes/Admin';
import { AdminRoutes } from './AdminRoutes/AdminRoutes';
import { Auth } from './AuthRoutes/Auth';
import { AuthRoutes } from './AuthRoutes/AuthRoutes';
import { LayoutWrapper } from './LayoutWrapper';
import { RootLayout } from './RootLayout';
import { User } from './UserRoutes/User';
import { UserRoutes } from './UserRoutes/UserRoutes';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,            // Auth initialization wrapper
    children: [
      {
        path: '/',
        element: <Auth />,              // Guest/Auth Guard
        children: Object.values(AuthRoutes).map(({ path, element, layout }) => ({
          path,
          element: <LayoutWrapper layout={layout} element={element} />,
        })),
      },
      {
        path: '/admin',
        element: <Admin />,             // Admin Guard
        children: Object.values(AdminRoutes).map(({ path, element, layout }) => ({
          path,
          element: <LayoutWrapper layout={layout} element={element} />,
        })),
      },
      {
        path: '/user',
        element: <User />,              // User Guard
        children: Object.values(UserRoutes).map(({ path, element, layout }) => ({
          path,
          element: <LayoutWrapper layout={layout} element={element} />,
        })),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
```

### 8.7 LayoutWrapper

```typescript
// shared/routes/LayoutWrapper.tsx
interface LayoutWrapperProps {
  layout?: React.ComponentType<{ children: React.ReactNode }>;
  element: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  layout: Layout,
  element,
}) => {
  if (Layout) return <Layout>{element}</Layout>;
  return <>{element}</>;
};
```

### 8.8 Flow Summary

```
RootLayout (auth initialization: token check → useMe → set store)
     │
     ▼
RolePath (constants)
     │
     ▼
RoleRoutes (map: key → { path, element, layout })
     │
     ▼
router.tsx ── createBrowserRouter
     │            │
     │            ▼
     │     Role.tsx (Guard: auth + permissions + <Outlet />)
     │            │
     │            ▼
     │     LayoutWrapper (wraps element with its layout)
     │            │
     │            ▼
     └──── Feature Page (from features/[name]/pages/)
```

### 8.9 Rules

- **One folder per role group.** Never mix routes from different roles.
- **Paths are the single source of truth.** Always reference `UserPath.OVERVIEW` instead of hardcoding `'/main/overview'`.
- **Route map must be exhaustive.** The `{ [key in UserPath]: Route }` type ensures every path has a definition.
- **Guards handle auth only.** Business logic belongs in containers, not in route guards.
- **Layouts are assigned per route**, not per group. Different routes in the same group can have different layouts.
- **RootLayout wraps all route groups.** Auth initialization happens once at the top level.

---

## 9. ROLES & PERMISSIONS

### 9.1 Role Definition

Roles are defined as a shared constant in `src/shared/types/roles.ts`:

```typescript
// shared/types/roles.ts
export const Role = {
  SuperAdmin: 'super_admin',
  Admin: 'admin',
  User: 'user',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
```

Domain models reference `RoleType` instead of duplicating string unions:

```typescript
// features/auth/models/user.model.ts
import type { RoleType } from '@/shared/types/roles';

export type UserRole = RoleType;

export interface User {
  id: string;
  role: UserRole;
  // ...
}
```

### 9.2 Permission System

Permissions are defined in `src/shared/helpers/permissions.ts` using a **config-driven** pattern that supports granular CRUD permissions per feature:

```typescript
// shared/helpers/permissions.ts
import { Role, type RoleType } from '../types/roles';

const permissionConfig = {
  // Role group checks
  isAdmin: [Role.SuperAdmin, Role.Admin],
  isUser: [Role.User],

  // Granular CRUD permissions (add per feature as needed)
  // users: {
  //   create: [Role.SuperAdmin],
  //   read: [Role.SuperAdmin, Role.Admin],
  //   update: [Role.SuperAdmin],
  //   delete: [Role.SuperAdmin],
  // },
} as const;

export const userPermissions = (currentRole: RoleType) => {
  const hasPermission = (roles: readonly RoleType[]) =>
    roles.includes(currentRole);

  return {
    isAdmin: () => hasPermission(permissionConfig.isAdmin),
    isUser: () => hasPermission(permissionConfig.isUser),
    // users: {
    //   create: () => hasPermission(permissionConfig.users.create),
    //   read: () => hasPermission(permissionConfig.users.read),
    //   update: () => hasPermission(permissionConfig.users.update),
    //   delete: () => hasPermission(permissionConfig.users.delete),
    // },
  };
};

export type UserPermissions = ReturnType<typeof userPermissions>;
```

### 9.3 useUserInfo Hook

The `useUserInfo` hook is a **central auth info hook** that provides auth status, permissions, and loading state. It lives in `features/auth/hooks/` and reads from the auth store:

```typescript
// features/auth/hooks/useUserInfo.ts
import {
  type UserPermissions,
  userPermissions,
} from '@/shared/helpers/permissions';

import { useAuthStore } from '../stores/useAuthStore';

export const useUserInfo = () => {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);

  const permissions: UserPermissions | null = user
    ? userPermissions(user.role)
    : null;

  const userInfoLoading = status === 'idle';

  return {
    authStatus: status,          // 'idle' | 'authenticated' | 'unauthenticated'
    userPermissions: permissions, // UserPermissions | null
    userInfoLoading,             // true while auth is initializing
  };
};
```

**Usage in guards and containers:**

```typescript
const { authStatus, userPermissions, userInfoLoading } = useUserInfo();

if (userPermissions?.isAdmin()) {
  // Admin-only logic
}
```

### 9.4 Adding Permissions for a New Feature

When a new feature needs permission checks:

1. Add the CRUD config to `permissionConfig` in `shared/helpers/permissions.ts`.
2. Add the corresponding methods to the `userPermissions` return object.
3. Use in guards or containers via `useUserInfo().userPermissions?.feature.action()`.

---

## 10. SHARED TYPES & ENUMS

### 10.1 AuthStatus

Authentication state is represented as a const object pattern in `shared/types/status.ts`:

```typescript
// shared/types/status.ts
export const AuthStatus = {
  Idle: "idle",             // Token exists, pending validation
  Authenticated: "authenticated",
  Unauthenticated: "unauthenticated",
} as const;

export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus];
```

**Usage:** Always compare against `AuthStatus.Authenticated` (not raw `"authenticated"` strings). This provides autocomplete, refactoring safety, and a single source of truth.

### 10.2 Const Object + Type Pattern

For enums, always use the **const object + type extraction** pattern instead of TypeScript `enum`:

```typescript
export const MyEnum = {
  Foo: "foo",
  Bar: "bar",
} as const;

export type MyEnum = (typeof MyEnum)[keyof typeof MyEnum]; // "foo" | "bar"
```

This pattern:
- Is tree-shakeable (unlike TS enums).
- Provides both a runtime value (`MyEnum.Foo`) and a type (`MyEnum`).
- Works consistently across the codebase for roles, statuses, and other union types.

---

## 11. AI-DRIVEN DEVELOPMENT APPROACH

This project is developed with AI assistance. The following guidelines ensure consistency:

1. **Always follow the Adapter Pattern** when generating API integration code.
2. **Generate all layers** (DTO + Mapper in `api/[endpoint]/`, Model, Hook, Container, Component) when creating a new feature.
3. **Use the existing design system** (Shadcn UI components) before creating new UI primitives. Install Shadcn components via `npx shadcn@latest add`, never create them manually.
4. **Respect the path aliases** (`@/shared/...`, `@/features/...`) in all imports.
5. **Follow the naming conventions** table strictly.
6. **When creating a new feature**, scaffold the folder structure first, then implement layer by layer following the data flow direction (DTO + Mapper -> Model -> Hook -> Schema -> Container -> Component -> Page).
7. **Mutations use `mutate` + callbacks**, never `mutateAsync` + `try/catch`.
8. **Mappers are always co-located** with their DTO file, never in a separate `helpers/*.mapper.ts`.
9. **Never hardcode paths.** Always use path constants from `*-path.ts` files (e.g., `AuthPath.ROOT`, `AdminPath.OVERVIEW`).
10. **No `switch/case` or `if-else` chains.** Use `if` with early returns or object lookup tables.
11. **Use `AuthStatus` enum** for auth state comparisons, never raw strings.
12. **Derive store initial state** from runtime values (e.g., `localStorage`) via helper functions.
13. **Use `useAuthStore.getState().logout()`** in interceptors and non-React contexts for reactive auth handling.
14. **Intra-page navigation uses callbacks**, not `<Link>`. Pages pass callbacks to containers, containers pass them to components as `<button type="button">` actions.
15. **Containers with 3+ operations become folders** with an orchestrator and leaf containers (Section 4.13).
16. **Data tables use the Responsive Table → Cards pattern** (Section 4.14). Always label mobile card fields.
17. **Cross-feature data access uses local hooks**, never cross-feature imports (Section 4.15).
18. **Loading/error states render inside the content area**, preserving headers and navigation (Section 4.16).
19. **Extract custom hooks** when logic exceeds ~200 lines or has 5+ memos/effects. Don't use `useReducer` for derived data managed by `react-hook-form` (Section 4.18).
20. **Keep presentational components under ~200 lines of JSX.** Extract visual blocks into sub-components. Never put business logic in presentational components (Section 4.19).
21. **Organize `components/` into semantic subfolders** grouped by vista/operation when the folder exceeds ~8 files. When a consumer subfolder exceeds ~10 files, sub-group tab/section components with their sub-components into sub-folders (e.g., `detail/payments/`, `detail/assignees/`). Max nesting: 2 levels (Section 4.20).
22. **Do not use React 19 form hooks** (`useActionState`, `useFormStatus`, `useOptimistic`) with `react-hook-form`. They are for native HTML form actions only.
23. **Use shared state components** (`PageLoading`, `PageError`, `PageEmpty`, `PageNotFound`) for all loading, error, empty, and not-found states. Never write inline `<P>` patterns for these (Section 4.21).
