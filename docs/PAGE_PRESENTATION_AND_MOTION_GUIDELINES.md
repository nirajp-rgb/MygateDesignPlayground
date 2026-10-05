# Page presentation and motion guidelines

These rules are mandatory for every new screen, route transition, modal, sheet, drawer, and animated state change. They adapt Apple’s Human Interface Guidelines to this React Native product while preserving the Mygate component and token system.

## Page presentation

Choose the presentation model from the user’s intent and relationship to the current page.

### Hierarchical navigation

- Use a full-page route when people are moving deeper into the information hierarchy, such as Settings → Notification settings.
- Preserve the previous page and return people to the same position and state when they go back.
- Use `AppHeader` with the standard back affordance. Back returns to the parent page; it does not cancel or close a task.
- Keep the transition direction consistent with the hierarchy and platform convention. Entering a child and returning to its parent must feel spatially related.
- Avoid opening a modal for ordinary navigation or content browsing.

### Drill-in page presentation

- Use a native stack route for a hierarchical child launched from an existing page. This preserves the parent’s position and state and enables the platform navigation gesture.
- Keep the parent in the navigation stack. On iOS, use the system push/pop transition: the child enters from the trailing edge and the interactive leading-edge swipe tracks the user’s finger when returning.
- Let the native stack own both enter and Back motion. A custom `AppHeader` may hide the stack header, but its Back action must call `navigation.goBack()`.
- Keep `gestureEnabled` on for ordinary drill navigation. Do not place the child inside a React Native `Modal`, because a modal is not part of the navigation stack and cannot provide the native back-swipe interaction.
- Use Back for drill navigation. Reserve Close for independent tasks or utility surfaces such as Quick Actions.
- Do not combine a route swap, modal animation, or screen-root animation with the native stack transition. One presentation owner controls the complete transition.

### Modal presentation

- Use modality only when it provides a clear benefit: a critical decision, confirmation, narrowly scoped task, or focused creation/editing flow.
- Keep modal tasks short and streamlined. Use a full-screen modal only for immersive content or a complex, self-contained task.
- Give every modal an explicit dismissal path. Use action language that communicates whether the result is saved, cancelled, or discarded.
- Dismiss the current modal before presenting another. Never stack sheets or modals.
- Avoid deep navigation hierarchies inside a modal. If subviews are essential, provide one clear path and keep the dismissal action distinct from Back.

### Sheets and transient surfaces

- Use a sheet for a focused task or choice that is closely related to the current page and returns to it immediately.
- Prefer a page for prolonged, multistep, or content-heavy work.
- Preserve enough of the parent context to make the relationship clear.
- Use the existing `ModalSheet` and approved overlay components instead of creating local modal controls.

### Presentation review

Before implementation, state which model the page uses: hierarchical route, modal, sheet, or inline disclosure. Verify that:

- the presentation matches the task’s scope;
- Back and Close/Cancel have distinct meanings;
- dismissal returns people to a predictable state;
- no modal is stacked over another modal;
- route keys and callbacks preserve the established navigation contract.

## Motion principles

### Purpose

- Add motion only to explain hierarchy, preserve spatial context, show cause and effect, provide feedback, or communicate a state change.
- Do not animate decoration for its own sake or add repeated motion to frequent interactions.
- Prefer the motion already owned by system controls and public components.

### Continuity and direction

- Motion must follow the initiating gesture and the expected dismissal direction.
- Elements that persist between states should remain visually continuous instead of disappearing and reappearing without explanation.
- Use consistent transitions for the same navigation relationship throughout the app.
- When movement does not communicate useful spatial information, prefer a subtle fade.
- Keep the source page in the native navigation stack so its state is restored when the child is popped.

### Timing and interaction

- Keep feedback brief, precise, and visually quiet.
- Never make people wait for nonessential animation to finish. Navigation, dismissal, and repeated actions must remain interruptible.
- Avoid large bounces, overshoot, parallax, flashing, rapid oscillation, and unnecessary full-screen movement.
- Animate only the properties needed to communicate the change and avoid expensive redraws.
- Never run a screen-root exit animation and then swap or dismiss the page. This creates a visible double transition; dismissal motion belongs to the navigation or presentation component.

### Reduced motion and accessibility

- Never use motion as the only way to communicate status, success, error, selection, or hierarchy. Pair it with persistent visual and accessibility state.
- Respect the platform Reduce Motion preference for every custom transition.
- Under Reduce Motion, replace large translation, zoom, depth, blur, and spring effects with a short fade, color change, highlight, or immediate state change.
- Stop automatic and repetitive motion when Reduce Motion is enabled.
- Test the completed interaction both with standard motion and Reduce Motion enabled.

### Motion review

Every custom animation must document or make evident:

- its communication purpose;
- the element or state relationship it explains;
- how it can be interrupted or skipped;
- its Reduce Motion alternative;
- the semantic state that remains understandable without animation.

## Sources

- [Apple Human Interface Guidelines — Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles)
- [Apple Human Interface Guidelines — Modality](https://developer.apple.com/design/human-interface-guidelines/modality)
- [Apple Human Interface Guidelines — Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)
- [Apple Human Interface Guidelines — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
