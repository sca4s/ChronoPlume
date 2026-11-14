# ChronoPlume — 3D Aerial Odyssey

Welcome to **ChronoPlume**, a feature-rich, 3D aerial obstacle game built with **Three.js** and the **Web Audio API**. Designed with a high-contrast pastel frosted aesthetic, adaptive multi-touch hardware controls, procedural sound effects, and a dynamic celestial cycle, ChronoPlume is fully split into modular files (`index.html`, `style.css`, and `main.js`) ready for instant deployment to GitHub.


## 🚀 Features & Gameplay Mechanics

* **Proportional Responsive UI**: Fluidly scales across desktops, tablets, and mobile phones with zero element overlap and equidistant spacing.
* **Hardware Pre-Detection & Dual Initiation**: Automatically scans your device on startup to select the optimal control layout, followed by a live 3D Studio screen to customize your world biome, sky mode, camera perspective, and bird chassis.
* **Three Celestial Sky Modes**: Choose between **Dynamic** (with customizable start phase), **Fixed Day**, or **Fixed Night**. In dynamic mode, accelerate or decelerate the day/night cycle using the **W** and **S** keys.
* **Bird Speed & Trajectory Guidance**: Fine-tune your forward velocity using the **A** and **D** keys while following a real-time parabolic path projection arc.
* **First-Person Bird's-Eye POV Mode**: Press **C** or tap the **CAM** button to instantly toggle between the classic side-scrolling 3D view and a first-person pilot perspective through glowing portal rings.
* **Procedural Web Audio Synthesizer**: Zero external audio dependencies! Experience custom-synthesized acoustic wing flaps, crystal score arpeggios, camera switches, and atmospheric theme waves.
* **Equidistant Slide-Out HUD & Reflow**: Hide telemetry panels individually with smooth slide-out transitions while remaining cards vertically reflow automatically. Use **Unhide All UI** to restore them instantly.
* **Progress Persistence & Pause Studio**: Pause your flight at any time to modify settings live, or save your progress to `localStorage` before returning to the home screen.

## 🎮 Controls Guide

| Action | Desktop Keyboard | Touch Handheld / On-Screen Buttons |
| --- | --- | --- |
| **Flap / Jump** | `Up Arrow` or `Space` | Tap **▲ FLAP** button or tap anywhere on the 3D sky viewport |
| **Accelerate Bird** | `A` Key | **A Speed+** button |
| **Decelerate Bird** | `D` Key | **D Speed-** button |
| **Accelerate Sky Cycle** | `W` Key | **W Cycle+** button |
| **Decelerate Sky Cycle** | `S` Key | **S Cycle-** button |
| **Toggle Camera POV** | `C` Key | **CAM** button |
| **Pause / Settings** | `Escape` Key | **Pause / Settings** button in top navigation bar |
