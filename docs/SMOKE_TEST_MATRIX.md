# Smoke-test matrix

Run the relevant rows after every screen migration. Mark completion in the pull request, not in this source file.

| Area | Required checks |
|---|---|
| App home | Default route loads; feed filters select/deselect; visitor profile opens; search, settings, calendar, marketplace, quick actions, and flat switcher open and dismiss correctly. |
| Bottom navigation | Social and Buy & Sell destinations switch without losing the expected active state. |
| Marketplace | Search surface and category/listing content render; listing wizard opens; back navigation returns correctly. |
| Listing wizard | All six steps validate, advance, go back, edit, skip photos, preview, submit, and exit as before. Currency and numeric fields retain formatting. |
| Search | Typing, clearing, scopes, results, recent suggestions, no-results state, back navigation, and daily-help profile opening work. |
| Settings | Theme toggles; profile capture, Family, list groups, switches, and back navigation work. |
| Face capture | Loading, denied permission, permission request, capture, preview, retake, submit, and back states work with camera permissions. |
| Family | Overview, adult and child selection, validation, contact picker, exit preference, confirmation, sharing, and back actions work. |
| Daily help | Profile actions, attendance, disclosure sections, switches, reviews, and navigation work. |
| Visitor calendar | Day selection, month controls, week/full modes, drag interaction, picker modal, event list, empty date, and back navigation work. |
| Component catalog | All production components render in Storybook in light and dark mode; controls and documented interactions respond. |
