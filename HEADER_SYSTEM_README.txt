BW modular global header installed.

Files added/updated:
- assets/js/bw-header.js: builds the shared header on every HTML page.
- assets/css/style.css: contains the global header layout rules.

Header rules:
- Back goes one step up based on page location/map.
- Home always goes to index.html.
- Pages one step from the dashboard have Back and Home both pointing to index.html.
- Store label, Change Store, Suggest Edit, and page-specific actions appear right-aligned.
- Suggest Edit opens the default email client with subject "Suggested edit" and first body line set to the current page URL.
