# Intent_Cart
# Amazon Now - Interactive Quick-Commerce Prototype

An interactive high-fidelity presentation and emulator prototyping the Amazon Now quick-commerce user experience. This prototype showcases context-aware conversational shopping, predictive needs forecasting, instant 10-minute dispatch triage, and interactive swipe gestures.

## 🚀 Key Features

### 1. 🛡️ High-Fidelity Tactical Emergency Mode
* **AI Triage Scanning HUD:** Simulates a live MFC (Micro-Fulfillment Center) stock reserve lock and courier assignment sequence.
* **Rider Dispatch Tracker:** Live GPS progress stepper simulating courier coordinates, route optimization, and progress updates.
* **Interactive Carousel:** Switch dynamically between primary choices (e.g., Pampers Baby Dry Pack) and alternatives (e.g., Huggies Wonder Pants) with active price adjustments.
* **Swipe-to-Order:** Custom physics-simulated drag-to-buy slider to instantly order and dispatch.

### 2. ❓ Context-Aware Guided Decision Helper
A dynamic step-by-step triage quiz that morphs questions, options, and recommendations automatically based on your active shopping intent:
* **🍼 Baby Care/Diapers:** Recommends correct diaper fit and brand (Pampers vs. Huggies vs. MamyPoko) by size/weight, skin sensitivity, and budget.
* **🍝 Pasta Cooking:** Customizes recipes and spaghetti styles (gourmet vs. gluten-free) based on dietary options.
* **🎉 Birthday Party:** Dynamically aggregates speaker, balloon, and lighting combinations for child or adult events.
* **🏔️ Himalayan Trekking:** Recommends optimized winter/monsoon expedition gear.
* **🏢 Dorm/Hostel Setup:** Dynamically matches lock, extension board, and cooling fan options.

### 3. 🛒 Smart Cart & Need Prediction
* **AI Depletion Predictor:** Renders depletion meters for household repeat-purchases (e.g., Espresso Beans, Toilet Paper) calculating stock exhaustion intervals.
* **Refill Bundle:** One-tap addition to order bundle options before products fully run out.
* **Upsell Recommendations:** Shows contextually relevant complementary products (e.g., adding Rao's Marinara Sauce automatically when Spaghetti is chosen).

## 📂 Project Structure

* `index.html`: The core presentation and emulator layout.
* `index.css`: Custom animations, neon glow properties, and responsive layout styles.
* `app.js`: State management, dynamic triage logic, swipe mechanics, and tracking timers.
* `pampers_diapers.png` & `huggies_diapers.png`: Custom local diaper product packaging images.

## 💻 How to Run Locally

### Option A: Using VS Code (Live Server)
1. Open VS Code and select `File` → `Open Folder...`
2. Choose the directory: `D:\Projects\Intent_Cart`
3. Click the **Go Live** button at the bottom-right status bar *(requires the Live Server extension by Ritwick Dey)*.

### Option B: Python Local Server
1. Open your terminal inside the project directory.
2. Run the following command:
   ```bash
   python -m http.server 8000
   ```
3. Navigate to `http://localhost:8000` in your web browser.
