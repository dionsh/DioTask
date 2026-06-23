# DioTask 📝

A modern, mobile-first **task manager** built with React Native (Expo), with a
clean UI inspired by Todoist, TickTick and Microsoft To Do.

Create tasks with **due dates** and **priorities**, complete them with a tap or
swipe, and **search, filter and sort** your list. Each user gets their own
account and task list, everything is **saved on-device** (works offline), and a
**Dashboard** tracks your progress alongside live data from two public APIs.
Includes **light/dark mode**, smooth animations and full sign-up / log-in.

---

## ✨ Features

### Core
- **Task list** with three states handled gracefully: loading, empty, and populated.
- **Task cards** showing title, completion status, created date and quick actions
  (toggle complete + delete).
- **Add task** with required **title** and **description**, an optional **due
  date** and **priority**, friendly inline validation, and an auto-generated
  created date + "Not completed" status.
- **Edit task** — update the title, description, due date or priority of an
  existing task (reachable from the details screen header or its Edit button).
- **Task details screen** showing the full title, description, status, due date
  and created date.
- **Complete / uncomplete** tasks — completed tasks are visually distinguished
  with a different color, a checkmark, and a strikethrough title.
- **Delete tasks** with a confirmation alert before removal.
- **Public API integration** — the Dashboard fetches live statistics from
  [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos) on startup
  (total / completed / pending + completion rate) with proper **loading** and
  **error** states (pull-to-refresh + retry).
- **Quote of the Day** — a second public API ([DummyJSON quotes](https://dummyjson.com/quotes),
  filtered to successful business leaders like Jobs, Ford, Buffett, Disney and
  Oprah) shown at the top of the Dashboard. A new quote loads on each refresh
  (tap the refresh icon or pull-to-refresh) — it is **not** cached for a day.

### Bonus
- 🔍 **Search** tasks by title in real time.
- 🧮 **Filter** tasks: All / Pending / Completed (with live counts).
- 📅 **Due dates** with a built-in calendar picker (no native dependency),
  friendly labels ("Today", "Tomorrow", "3 days ago") and **overdue
  highlighting** in red.
- 🚦 **Priority** (Low / Medium / High) shown as a colored dot on each card.
- ↕️ **Sorting** the list by **due date** (earliest/overdue first) or newest.
- 💾 **Local persistence** with **AsyncStorage** — tasks survive app restarts.
- 🧭 **Navigation** via **Drawer + Bottom Tabs + Stack** (React Navigation).
- 📊 A **Dashboard** comparing public API stats with your own local task stats.

### Extras
- 🔐 **Sign up / Log in** flow with form validation, password show/hide, route
  guarding and a logout option in the drawer. Accounts are stored **locally**
  with AsyncStorage (no backend) — purely to demonstrate the flow. Each account
  has its **own task list** (tasks are persisted per-user).
- 🎉 **Completion celebration** — a fun, dependency-free `Animated` overlay
  ("Good job! Task completed") with a springing checkmark and a particle burst,
  shown whenever you mark a task complete.
- 🌙 **Dark mode** — a full light/dark theme with a toggle in the drawer. The
  choice is **persisted** and defaults to the device's system appearance.
- 👆 **Swipe actions** — swipe a task card right to complete/uncomplete or left
  to delete (the on-card tap targets still work too).

---

## 🛠 Technologies Used

| Area              | Tech                                                        |
| ----------------- | ----------------------------------------------------------- |
| Framework         | React Native + Expo (SDK 56)                                |
| Language          | JavaScript (functional components + hooks)                  |
| Navigation        | React Navigation — Drawer, Bottom Tabs, Native Stack        |
| Local storage     | `@react-native-async-storage/async-storage`                 |
| Gestures          | `react-native-gesture-handler` (swipe actions)              |
| Theming           | Custom light/dark theme via React Context + `useThemedStyles` |
| Icons             | `@expo/vector-icons` (Ionicons)                             |
| Typography        | Plus Jakarta Sans (`@expo-google-fonts/plus-jakarta-sans`)  |
| State sharing     | React Context + custom hooks                                |

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI building blocks
│   ├── CelebrationOverlay.js  # Animated "good job!" celebration
│   ├── DateField.js           # Due-date field + calendar picker modal
│   ├── EmptyState.js
│   ├── Fab.js
│   ├── FilterTabs.js
│   ├── HeaderMenuButton.js
│   ├── InputField.js          # + password show/hide toggle
│   ├── Loader.js
│   ├── PrimaryButton.js
│   ├── PrioritySelector.js    # Low / Medium / High segmented control
│   ├── ProgressBar.js
│   ├── QuoteCard.js           # "Quote of the Day" (business leaders) card
│   ├── SearchBar.js
│   ├── StatCard.js
│   ├── StatusBadge.js
│   ├── SwipeableTaskRow.js    # Swipe-to-complete / swipe-to-delete wrapper
│   ├── TaskCard.js
│   └── TaskForm.js            # Shared create/edit form
├── data/              # Data layer (no UI)
│   ├── api.js                 # Public API integration
│   ├── AuthContext.js         # Local auth store (state + persistence)
│   ├── CelebrationContext.js  # Exposes celebrate(); renders the overlay
│   ├── confirm.js             # Cross-platform confirm dialog (web + native)
│   ├── helpers.js             # id, date, due-date + priority helpers
│   ├── storage.js             # AsyncStorage read/write (tasks, auth, theme)
│   ├── TasksContext.js        # Global task store (state + persistence)
│   ├── ThemeContext.js        # Light/dark theme store (persisted)
│   └── theme.js               # Design tokens (light + dark palettes)
├── hooks/             # Custom hooks
│   ├── useAppTheme.js         # Active palette + theme controls
│   ├── useAuth.js             # Access auth state/actions
│   ├── useCelebration.js      # Trigger the celebration
│   ├── useQuote.js            # Fetch a business-leader quote of the day
│   ├── useTasks.js            # Access the task store
│   ├── useThemedStyles.js     # Build a StyleSheet from the active palette
│   └── useTodosApi.js         # Fetch dashboard stats
├── navigation/        # Navigators
│   ├── AuthNavigator.js       # Login ↔ Register
│   ├── CustomDrawerContent.js # User info + theme toggle + logout
│   ├── DrawerNavigator.js
│   ├── RootNavigator.js       # Auth gating (root)
│   ├── StackNavigator.js      # TaskList → Details / Add / Edit
│   └── TabNavigator.js        # Tasks + Dashboard tabs
└── screens/           # Screens
    ├── AboutScreen.js
    ├── AddTaskScreen.js
    ├── DashboardScreen.js
    ├── EditTaskScreen.js
    ├── LoginScreen.js
    ├── RegisterScreen.js
    ├── TaskDetailsScreen.js
    └── TaskListScreen.js
```

### Navigation map

```
RootNavigator (chooses based on auth state)
├── (signed out)  →  AuthNavigator (Login ↔ Register)
└── (signed in)   →  DrawerNavigator (root)
                     ├── Home  →  TabNavigator
                     │            ├── Tasks      →  StackNavigator (TaskList → TaskDetails → AddTask / EditTask)
                     │            └── Dashboard  →  DashboardScreen
                     └── About →  AboutScreen
```

### Architecture notes
- **Separation of concerns:** screens compose reusable components; all data
  access flows through the `data/` layer and custom `hooks/`.
- **Single source of truth:** `TasksContext` owns the task list, hydrates it from
  AsyncStorage on startup and persists every change automatically.
- **Design tokens & theming:** spacing/typography come from `data/theme.js`,
  while colors come from the active light/dark palette via `useThemedStyles`, so
  the look stays consistent and the whole app re-themes instantly on toggle.

---

## 🚀 Getting started

### Prerequisites
- **Node.js 20+ (LTS)** and **npm**.
- A global Expo CLI is **not** required — every command below uses `npx`.
- To preview the app, one of:
  - any modern **web browser** (no device needed), **or**
  - an **Android** phone with **Expo Go**, **or**
  - an **Android emulator** / **iOS Simulator** (Simulator is macOS-only).

> **📱 iPhone note:** this project targets **Expo SDK 56**, but the **Expo Go**
> app on the iOS App Store currently supports only up to **SDK 54**, so Expo Go
> can't open it on iPhone. On iPhone, either run it on the **web**, use an
> **Android** device, or create a **development build** with EAS:
> `npx expo install expo-dev-client` → `eas build --profile development -p ios`.

### 1. Install dependencies
```bash
npm install
```
This installs everything the app needs — including the web dependencies
(`react-dom`, `react-native-web`, `@expo/metro-runtime`), so **no extra installs
are required**.

### 2. Start the development server
```bash
npx expo start        # or: npm start
```
Then, in the terminal that opens:
- Press **`w`** to open it in the **browser**.
- Press **`a`** for the **Android emulator**, or **`i`** for the **iOS Simulator** (macOS).
- On an **Android** phone, scan the QR code with the **Expo Go** app.

Platform shortcuts:
```bash
npm run web        # open in the browser
npm run android    # open on Android
npm run ios        # open on iOS (macOS only)
```

### Troubleshooting
```bash
npx expo install --fix   # realign any dependency to the installed SDK
npx expo start --clear   # start with a cleared Metro bundler cache
npx expo start --tunnel  # phone on a different network than your computer
```

---

## 📦 Build / Deliverables

This repository contains the complete React Native source code, including:
- Full navigation setup (Drawer + Tabs + Stack)
- AsyncStorage persistence (tasks, accounts, theme)
- Two public API integrations (task stats + quote of the day) with loading/error handling
- Light/dark theming and reusable components on a shared design system

---

Made with care · **DioTask**
