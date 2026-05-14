# ⚡ LEVI — Premium Workout Timer

A world-class, mobile-first fitness app built with React + Vite + TailwindCSS + Framer Motion.

## 🚀 Get Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## ✨ Features

- **Smart Workout Timer** — Circular animated timer with work/rest phases, auto-advance, beep cues
- **Workout Builder** — Add, reorder (drag & drop), delete exercises with live duration sliders  
- **5 Training Modes** — HIIT, Tabata, Strength, Cardio, Custom
- **Dashboard** — Streak, stats, weekly activity chart, recent workouts
- **Profile & Badges** — Achievements, weekly calories, settings
- **Completion Celebration** — Confetti animation on workout finish
- **Sound Effects** — Web Audio API beeps and countdowns (toggleable)
- **localStorage Persistence** — Workouts and stats saved locally
- **Mobile-First** — Built for phones; safe area insets, thumb-friendly controls

## 🎨 Design

- Matte black (#080808) background
- Neon green (#39FF14) primary accent  
- Purple (#A855F7) secondary / rest phase
- Glassmorphism cards with blur
- Bebas Neue display font + DM Sans body + JetBrains Mono for timer

## 📁 Structure

```
src/
  components/
    BottomNav.jsx        # Mobile tab navigation
    CircularTimer.jsx    # Animated SVG progress timer
    Confetti.jsx         # Workout completion celebration
    WorkoutBuilder.jsx   # Drag-and-drop exercise builder modal
    WorkoutSession.jsx   # Full-screen active workout overlay
  pages/
    Dashboard.jsx        # Home / stats overview
    WorkoutsPage.jsx     # Library with filter chips
    ExplorePage.jsx      # Browse by training mode
    ProfilePage.jsx      # Stats, badges, settings
  hooks/
    useWorkout.js        # All timer + workout state logic
  data/
    workouts.js          # Default workouts + constants
```
