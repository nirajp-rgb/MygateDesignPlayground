# Agent Rules: UI Development

These rules are mandatory for every change to screens, components, patterns, and tokens.

1. Search `src/components/index.ts` and Storybook before creating UI. Screens compose the public component API; they do not recreate controls.
2. Import components from `src/components`. Do not import internal category implementation paths from screens.
3. Screen files must not import `Pressable`, `Touchable*`, `TextInput`, native `Button`, native `Switch`, or `Modal` from `react-native`. Use the existing component or an approved product pattern.
4. Use semantic exports from `src/tokens`. Never hardcode colors, typography metrics, spacing, radii, or shadows in UI code when a token exists.
5. Extend an existing component through a typed variant or slot before adding a similarly shaped component.
6. Add a core component only when it has two credible cross-feature uses or owns uniquely reusable accessibility/interaction behavior. Feature-specific compositions belong in `src/patterns/<domain>`.
7. New public components must be controlled, typed, accessible, exported from the public barrel, registered in the category barrel, represented in the production Storybook catalog, and covered by interaction tests.
8. `style` may place a component in its parent layout. It must not redefine the component's color, typography, shape, or state appearance.
9. Preserve existing route keys, visible copy, callbacks, and interaction behavior unless the task explicitly changes product behavior.
10. A UI task is complete only when `npm run validate` passes and the relevant rows in `docs/SMOKE_TEST_MATRIX.md` have been checked.

Read `docs/COMPONENT_CONTRIBUTION_GUIDE.md` for classification and review criteria.
