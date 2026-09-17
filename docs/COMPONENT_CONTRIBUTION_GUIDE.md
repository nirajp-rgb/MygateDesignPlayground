# Component contribution guide

## Classification

- **Actions:** triggers such as buttons and icon buttons.
- **Forms:** value entry and controlled selection.
- **Navigation:** movement between destinations or screens.
- **Data display:** compact representations of content and metadata.
- **Layout:** surfaces and collections that arrange children without product meaning.
- **Feedback:** status, progress, warnings, and confirmation.
- **Overlays:** modal presentation and dismissal behavior.
- **Patterns:** feature-specific compositions built from public components.
- **Internal:** catalog and development-only helpers; never import these into product screens.

## Decision order

1. Use an existing component unchanged.
2. Use an existing documented variant or slot.
3. Add a variant when the interaction and semantic role are the same.
4. Create a pattern when the composition is feature-specific.
5. Create a core component only for repeated cross-feature use or reusable complex behavior.

## Required component contract

- Controlled value/state where the component is interactive.
- Default, pressed, disabled, selected, and error behavior where relevant.
- Accessibility role, label, state, and minimum touch target.
- Semantic tokens only.
- Explicit props for supported variation; no appearance-changing escape hatch.
- Named exports from the category and public barrels.
- A production Storybook example with purpose and supported states.
- Interaction tests for state changes and callbacks.

## Review checklist

- The component does not duplicate an existing semantic role.
- Screen code contains product composition, not private controls.
- Domain language appears only in patterns, not generic primitives.
- Light and dark modes remain legible.
- Existing compatibility props are retained or migrated without breaking callers.
- `npm run validate` passes from a clean install.
