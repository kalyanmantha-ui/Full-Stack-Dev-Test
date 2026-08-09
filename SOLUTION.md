# HVAC Field Estimate Tool - Solution Write-up

## Overview
I built a frontend-only React application using TypeScript, Vite, and TailwindCSS to provide HVAC technicians with a fast, reliable, and professional estimation tool. The core design philosophy was to create an app that is robust in the field, never displays `undefined` data in front of a customer, and drastically reduces the time it takes to build and hand over a quote.

The UI was meticulously crafted to be minimal, clean, and monochrome ("slate" theme) so that it looks incredibly premium and professional when shown to a client on a tablet.

## Data Normalization & Resilience Strategy
The provided JSON data (`customers.json`, `equipment.json`) had field inconsistencies (e.g., `baseCost` vs `base_cost`, `propertyType` vs `property_type`, `squareFootage` vs `sqft`). 

To address this, I implemented a dedicated `src/utils/normalize.ts` utility layer.
- **Single Source of Truth**: All UI components consume data exclusively through normalization functions (like `getBaseCost(item)` and `getSquareFootage(customer)`). 
- **Graceful Fallbacks**: Optional fields like `phone` and `lastServiceDate` were handled with safe fallbacks (displaying "Not on file" rather than leaving blank spaces), ensuring the UI always looks intentional.
- **Resilience**: The app prevents any runtime crashes or `undefined` renders regardless of which variant of a field name the JSON uses.

## Architecture & Modes
The tool directly mirrors the two common field scenarios:

1. **Quick Estimate Mode**: Designed for the 10-15 minute simple repair. In this mode, selecting an equipment or labor line item instantly replaces the previous one. This allows the tech to pull up a single part and a single labor rate and immediately get an estimate on screen in under 30 seconds.
2. **Detailed Estimate Mode**: Designed for the 30-45 minute full system replacement. It allows adding unlimited line items (multiple equipment pieces and labor roles), generating a comprehensive, itemized breakdown.

## Price Range Calculation
Rather than providing a single fixed price, the live total and final estimate display a **Low to High Range**. 
- The **Low Total** is calculated using the minimum estimated hours for labor (`Σ equipment + Σ (hourlyRate × minHours)`).
- The **High Total** is calculated using the maximum estimated hours (`Σ equipment + Σ (hourlyRate × maxHours)`).

*Why a range?* Field work is unpredictable. Showing a range manages customer expectations, protecting the business from eating costs if a "simple" duct repair uncovers structural issues that take twice as long.

## Professional PDF Export
To solve the problem of techs scribbling on notepads, I built a `PrintableEstimate` component optimized via `@media print` CSS. When the user clicks "Export to PDF", it leverages the native browser print dialog to generate a clean, branded document ("HVAC Pro Field Services") that hides all interactive UI elements (buttons, search bars, nav) and displays a polished invoice format with a signature line.

---

## 🚀 Advanced Field Features Implemented
To make this a truly production-ready tool for technicians, I implemented the following advanced features:

### 1. Crash Protection (Local Storage Auto-Save)
If a technician's browser refreshes or crashes on-site, losing the estimate is catastrophic. I built a custom state wrapper around the `estimate` object that automatically serializes and saves to the browser's `localStorage` on every keystroke and change. If the tab is closed, the estimate loads right back up exactly where they left it.

### 2. Smart Fuzzy Search (`fuse.js`)
Technicians on iPads often have dirty hands or make typos. A strict search algorithm fails them. I integrated `fuse.js` into the Equipment lookup with a tuned threshold. It searches across `name`, `brand`, `modelNumber`, and `category` simultaneously, ignoring location and allowing for typos (e.g., searching "carier" easily finds "Carrier").

### 3. Custom Line Items & Discounts
A hardcoded JSON database is too rigid for the real world. I built a `CustomItemBuilder` that allows the technician to instantly generate an ad-hoc line item. Crucially, this supports **negative values** (e.g., entering `-50` for a "First-Time Customer Promo"), which the app's calculation logic seamlessly subtracts from the total as a discount.

### 4. Rapid Quantity Adjusters
Inside the live estimate summary, I implemented inline `+` and `-` buttons for line items. Instead of having to search and add the same air filter 3 separate times, the technician can simply tap `+` on the summary to bump the quantity. These interactive buttons are stripped out entirely during the PDF export.

---

## Future Improvements (With More Time)
1. **Backend & Cloud Persistence**: An Express/Node.js API backed by PostgreSQL to store generated estimates, allowing techs to save drafts across devices and the office to review closed quotes.
2. **Mobile Polish & PWA**: Convert the app into a Progressive Web App (PWA) so it functions entirely offline in areas with zero cellular service.
