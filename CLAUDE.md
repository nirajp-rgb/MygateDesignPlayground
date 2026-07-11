# MygateDesignPlayground — Project Instructions

## Design System: Foundation (New)

All Figma work in this project uses the **Foundation (New)** library as the single source of truth
for design tokens. When mapping any value to a variable, always load the
`foundation-token-mapping` skill first.

### Token mapping rules (summary)

**Always resolve semantic role from node context before picking a token.** Never map by hex value
alone — the same hex can belong to multiple tokens with different semantic meaning.

**Colors:**
- `TEXT` fill → `Color/Content/*`
- `FRAME`/`RECTANGLE` fill (background) → `Color/Surface/*`
- Stroke → `Color/Border/*`
- Interactive text links ("View All", CTAs) → `Color/Content/action`
- Brand accent (icons, illustrations) → `Color/Accent/primary`
- Button with primary action fill → `Color/Surface/action-primary`
- Button with ghost/secondary fill → `Color/Surface/action-secondary`

**Spacing/padding/gap:** Always `primitives/Dimension/N` (exact value match only — flag any
value that doesn't have a matching token).

**Corner radius:** `Semantic/borderRadius/100–full` mapped to values 4–999.

### Source of truth for token values

Before mapping, run `get_design_context` on the node and extract all `var(--color\/...)` CSS
variable references. The fallback hex values in the generated code are the authoritative resolved
values for each Foundation (New) token in this file. Use these to verify mappings — not raw hex
lookups.

### Ambiguous cases

If a node's role is unclear, **flag it with candidate tokens and don't silently apply one**.
Wrong semantic tokens are worse than unbound values.
