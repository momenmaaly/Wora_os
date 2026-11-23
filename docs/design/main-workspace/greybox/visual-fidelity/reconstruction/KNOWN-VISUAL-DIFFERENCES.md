# Known Visual Differences — WORA Main Workspace

Decision record for the time-boxed visual completion pass. This list records residuals intentionally accepted after the final allowed Department Interiors round and the ordered follow-on reviews. It is not a pixel-parity claim.

## Accepted residuals

- **Scene rendering style and richness:** the reference is a polished, photorealistic/isometric office illustration; the live scene is an intentionally stylised low-poly Three.js reconstruction. Glass, furniture, plants, floor reflections, screen detail, soft shadows and lighting therefore remain materially less realistic. At the requested time box, replacing the scene with an image would violate the real interactive-UI requirement and rebuilding all assets would exceed this prototype's scope.
- **Fine interior details:** chair silhouettes, desk accessories, shelving/book density, small-screen graphics, wall seams, materials and small shadow/reflection differences are approximate. Display graphics are semantic/category-consistent only; exact small text, values and content are not inferable from the supplied reference.
- **Department metrics:** the last-round deep audit improved weighted MAE from 54.3843769 to 54.2047334 (8-bit scale) and weighted SSIM from 0.1455960 to 0.1470805. This is supporting evidence, not a pixel-equivalence score. The audit bounds are rectangular measurement ROIs, may overlap, and are not semantic furniture masks. See `reconstruction/01-department-interiors/deep-audit/after-final-department-interiors-round/audit.md` and `stage-result.md`.
- **Mobile scene framing:** mobile is a vertically composed responsive workspace with a compact 3D scene and a bottom view switcher, not a bespoke mobile illustration. There is no owner-provided mobile reference; mobile pixel comparisons are diagnostics only. The mobile browser capture shows all scene departments at a smaller scale to preserve the whole-workspace overview.
- **Reference snapshot figures:** the header's “24 AI Employees” and activity figures reproduce the supplied static reference snapshot. They are distinct from the 47 visible, catalogued robot actors and should not be read as the runtime actor count.
- **People and activity content:** robot names/roles/skills and activity state are deterministic local demo fixtures, not connected to a real employee, task, persistence, or agent backend. Text is used where speech voices are unavailable; the browser QA runtime reported zero speech voices.
- **Peripheral responsive details:** spacing, typography, icon glyphs and some panel sizing vary slightly with viewport and browser rendering. Browser QA passed at 1920×1080, 1440×900, 1366×768, 390×844 and 430×932 with no browser errors.

## Completion policy

These are small-to-material style differences known at this prototype fidelity, not reasons to reopen a completed phase under the current acceptance policy. Reopen only for a regression, broken required interaction, or newly supplied authoritative reference that changes the design evidence. No pixel-diff threshold is an acceptance gate by itself.
