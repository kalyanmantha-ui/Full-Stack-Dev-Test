# HVAC Field Estimate Tool - Take-Home Assessment

## Overview
Thank you for reviewing my submission. This project is a frontend-only React application built with TypeScript, Vite, and TailwindCSS. It is designed to serve as a fast, reliable, and professional estimation tool for HVAC technicians in the field. 

The core philosophy behind this architecture was to create a resilient application that protects the user from messy raw data, minimizes runtime errors, and provides a premium, client-facing experience on mobile tablets.

## Setup & Running Locally
To test this application locally, please run the following commands:
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## Architecture & Technical Decisions

### 1. Data Normalization Layer
The provided JSON data contained several field inconsistencies (e.g., `baseCost` vs `base_cost`, `squareFootage` vs `sqft`). 
* **Approach:** I implemented a dedicated utility layer (`src/utils/normalize.ts`) to intercept and standardize this data before it reaches the UI components.
* **Why:** This creates a Single Source of Truth, preventing `undefined` runtime crashes and ensuring that missing data (like a phone number) degrades gracefully (e.g., displaying "Not on file") rather than breaking the layout.

### 2. Dual Estimation Modes
To handle the unpredictability of field service, the app supports two distinct workflows:
* **Quick Mode:** For fast, 15-minute diagnostic trips. Adding a new labor or equipment item instantly overwrites the previous one.
* **Detailed Mode:** For comprehensive system replacements, allowing an unlimited, itemized list of parts and labor.

### 3. Range-Based Pricing
* **Approach:** The live total and final PDF calculate a **Low to High Range** based on the minimum and maximum estimated labor hours provided in the JSON. 
* **Why:** Field work often uncovers hidden issues. Presenting a range instead of a fixed price manages customer expectations and protects business margins.

---

## Advanced Field Features & Testing Guide

I implemented several advanced features to make this a truly production-ready tool. Here is how you can test them:

### Local Storage Persistence (Crash Protection)
* **What it does:** The application state automatically serializes to the browser's `localStorage` on every change. 
* **How to test:** Build an estimate with multiple line items. Hard refresh the page or close the browser tab and reopen it. The estimate will remain perfectly intact, protecting the technician from catastrophic data loss in the field.

### Fuzzy Search (Powered by `fuse.js`)
* **What it does:** Technicians on iPads often make typos. A strict search fails them. I integrated `fuse.js` to search across equipment `name`, `brand`, `modelNumber`, and `category` simultaneously, tolerating spelling errors.
* **How to test:** In the Equipment search bar, type `carier` (instead of Carrier) or `furnce`. The app will intelligently score and return the correct equipment.

### Custom Line Items & Instant Discounts
* **What it does:** Hardcoded JSON databases are too rigid. I built a `CustomItemBuilder` that allows the technician to generate ad-hoc line items on the fly. Crucially, it supports negative numbers for instant discounting.
* **How to test:** Scroll down to the Custom Item block. Enter "First-Time Promo" and an amount of `-50`. Click Add. Verify the total drops by $50 and the summary highlights the discount amount in green.

### Quantity Controls
* **What it does:** Rapid adjustment toggles allow technicians to increase or decrease line item quantities directly from the estimate summary without having to search for the item again.
* **How to test:** Click the `-` and `+` buttons next to any line item in the summary. Note that the total recalculates instantly, and the `-` button disables at `1` to prevent accidental zeroing.

### Professional PDF Export
* **What it does:** A specialized `PrintableEstimate` component leverages `@media print` CSS rules to strip out all interactive UI elements and format the screen as a clean invoice.
* **How to test:** Click the "Export to PDF" button. The browser's native print dialog will open, showing a branded document with a signature line, entirely hiding the search bars, quantity buttons, and application controls.
