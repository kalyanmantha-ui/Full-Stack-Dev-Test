# HVAC Field Estimate Tool - Solution Write-up

## Overview
I built a frontend-only React application using TypeScript, Vite, and TailwindCSS to provide HVAC technicians with a fast, reliable, and professional estimation tool. The core design philosophy was to create an app that never leaves the user guessing and never displays `undefined` data in front of a customer, while dramatically reducing the time it takes to build a quote.

## Data Normalization & Resilience Strategy
The provided JSON data (`customers.json`, `equipment.json`) had field inconsistencies (e.g., `baseCost` vs `base_cost`, `propertyType` vs `property_type`, `squareFootage` vs `sqft`). 

To address this, I implemented a dedicated `src/utils/normalize.ts` utility layer.
- **Single Source of Truth**: All UI components consume data exclusively through normalization functions (like `getBaseCost(item)` and `getSquareFootage(customer)`). 
- **Graceful Fallbacks**: Optional fields like `phone` and `lastServiceDate` were handled with safe fallbacks (displaying "Not on file" rather than leaving blank spaces), ensuring the UI always looks intentional.
- **Resilience**: The app prevents any runtime crashes or `undefined` renders regardless of which variant of a field name the JSON uses.

## Architecture & Modes
The tool directly mirrors the two common field scenarios described in the README:

1. **Quick Estimate Mode**: Designed for the 10-15 minute simple repair. In this mode, selecting an equipment or labor line item instantly replaces the previous one. This allows the tech to pull up a single part and a single labor rate and immediately get an estimate on screen in under 30 seconds.
2. **Detailed Estimate Mode**: Designed for the 30-45 minute full system replacement. It allows adding unlimited line items (multiple equipment pieces and labor roles), generating a comprehensive, itemized breakdown.

## Price Range Calculation
Rather than providing a single fixed price, the live total and final estimate display a **Low to High Range**. 
- The **Low Total** is calculated using the minimum estimated hours for labor (`Σ equipment + Σ (hourlyRate × minHours)`).
- The **High Total** is calculated using the maximum estimated hours (`Σ equipment + Σ (hourlyRate × maxHours)`).

*Why a range?* Field work is unpredictable. Showing a range manages customer expectations, protecting the business from eating costs if a "simple" duct repair uncovers structural issues that take twice as long.

## Professional PDF Export
To solve the problem of techs scribbling on notepads, I built a `PrintableEstimate` component optimized via `@media print` CSS. When the user clicks "Export to PDF", it leverages the native browser print dialog to generate a clean, branded document ("HVAC Pro Field Services") that hides all interactive UI elements (buttons, search bars, nav) and displays a polished invoice format with a signature line.

## Future Improvements (With More Time)
If I had more time, I would add:
1. **Backend & Persistence**: An Express/Node.js API backed by PostgreSQL to store generated estimates, allowing techs to save drafts and the office to review closed quotes.
2. **Authentication**: JWT-based auth so estimates are tied to specific technicians.
3. **Mobile Polish & PWA**: Convert the app into a Progressive Web App (PWA) so it functions entirely offline in areas with poor cellular service, syncing data once the tech is back online.
4. **Rich Search**: Implement fuzzy searching (using a library like Fuse.js) for equipment to catch typos.
