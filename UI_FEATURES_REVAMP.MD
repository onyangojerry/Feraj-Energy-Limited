# UI & Features Revamp Plan - Feraj Energy Limited

This document outlines the planned improvements for the Feraj Energy Limited web application, specifically focusing on the Products page and overall user experience. The goal is to create a more functional, informative, and high-conversion platform for solar energy solutions.

## 1. Products Page Overhaul

### 1.1 Advanced Filtering System
Based on the `products ppt.pdf`, the filtering will be expanded beyond simple categories.

*   **Categorization (Multi-level):**
    *   **Core PV Components:** Solar Panels (Monocrystalline), Hybrid Inverters, Lithium-ion Batteries, MPPT Controllers.
    *   **Water Solutions:** Solar Water Pumps (DC/AC Brushless), Solar Water Heaters (Vacuum Tube).
    *   **Decentralized & Off-Grid:** Solar Home Systems (SHS), Street Lights (All-in-One), Portable Power Stations.
*   **Brand Filter:** 
    *   *Panels:* Jinko, Trina, Longi, Canadian Solar, ZNSHINE.
    *   *Inverters:* Deye, SRNE, GoodWe, Solis, Growatt, MUST, Victron.
    *   *Batteries:* BYD, Felicity, Vestwoods, Pylontech.
    *   *Water Solutions:* Grundfos, Lorentz, Dayliff, Veichi, Megasun.
    *   *Others:* Bluetti, EcoFlow, Jackery, Sun King, M-Kopa.
*   **Target Market/Application Filter:**
    *   Residential
    *   Commercial & Industrial (C&I)
    *   Agriculture (Irrigation, Rural Water)
    *   Off-Grid / Rural Households
    *   Emergency Backup / Camping / Mobile Vendors
    *   Public Infrastructure (Street Lighting)
*   **Technical Specification Filters (Dynamic):**
    *   *Solar Panels:* Peak Power (500W - 725W), Conversion Efficiency (21% - 25%).
    *   *Inverters:* Power Rating (1.6KW - 12KW), MPPT Count (2-4).
    *   *Batteries:* Capacity (3KWh - 30KWh), Cycle Life (2500 - 6000 cycles).
    *   *Water Pumps:* Max Flow Rate (up to 88m³/h), Max Head (up to 270m).
    *   *Water Heaters:* Tank Capacity (150L, 180L, 300L).
*   **Price Range Slider:** Filter products by KES price range.
*   **Availability:** Toggle for "In Stock" only.

### 1.2 Enhanced Product Cards & Grid
*   **Grid/List View Toggle:** Allow users to switch between a dense grid and a detailed list view.
*   **Quick Spec Badges:** Highlight 2-3 critical specs on the card (e.g., "720W | 23.2% Eff" for panels).
*   **Comparison Toggle:** A checkbox on each card to "Add to Compare".
*   **Dynamic Labels:** "Best Seller", "High Efficiency", "New Arrival", "Agriculture Pick".
*   **Hover States:** Reveal secondary images or a "Quick View" button.

### 1.3 Product Comparison Tool
*   A floating comparison bar that appears when 2 or more products are selected.
*   A dedicated comparison page/modal showing a side-by-side technical specification table.

## 2. New "Smart" Features

### 2.1 Interactive Energy Configurator (Product Finder)
A step-by-step wizard to guide non-technical users to the right solution:
1.  **Goal:** "Power my home", "Water my crops", "Portable power", "Street lighting".
2.  **Scale:** (e.g., number of rooms, acreage, or specific appliances).
3.  **Budget:** Estimated range.
4.  **Result:** A curated list of recommended products (Package deals).

### 2.2 Inquiry/Quote System
*   Instead of just "Add to Cart", add a "Request Expert Quote" button for complex systems (like C&I or large-scale irrigation).
*   A simple form that pre-fills the selected product details.

## 3. UI/UX Refinements

### 3.1 Visual Consistency
*   **Cinematic Aesthetic:** Maintain the dark, premium "cinematic" look but improve readability with better contrast for technical data.
*   **Skeleton Loading:** Refine skeleton screens for a smoother perceived performance.
*   **Animated Transitions:** Use Framer Motion for filter changes and grid re-ordering.

### 3.2 Performance & Technical Improvements
*   **Infinite Scroll/Load More:** Replace or supplement pagination for a better browsing experience.
*   **URL Syncing:** Sync filter state with URL parameters so users can share specific filtered views.
*   **Supabase Optimization:** Update `products.service.ts` to support more complex query filtering on the backend.

## 4. Implementation Phases

1.  **Phase 1 (Data & Service):** Update Supabase schema (if needed) and `products.service.ts` to support brand, sub-category, and specification-based queries.
2.  **Phase 2 (Filter UI):** Build the advanced sidebar filter component with collapsible sections.
3.  **Phase 3 (Product Display):** Redesign product cards and implement the Grid/List toggle.
4.  **Phase 4 (Comparison Tool):** Implement the comparison logic and UI.
5.  **Phase 5 (Smart Features):** Build the Energy Configurator wizard.

---
*Created on: 2026-04-27*
