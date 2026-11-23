# Time-Boxed Visual Completion — Phase Decisions

**Review date:** 2026-11-23 UTC
**Branch:** `arena/96310a5d-wora-os`
**Acceptance policy:** overall composition and principal elements are recognizable; large obvious gaps are addressed within the phase's repair cap; required interactions work; no critical test/render failure. Pixel parity is not required. No backend/infrastructure work, push, merge or deploy is included.

| Order | Phase | Decision | Evidence / limitation |
|---:|---|---|---|
| 1 | Department Interiors | **Complete (time-boxed)** | One final permitted round reprojected the six measured department wall-display centers/sizes against their existing pixel boxes while keeping the HOME camera and department layout fixed. Weighted deep-audit MAE improved 54.3843769 → 54.2047334 and SSIM 0.1455960 → 0.1470805. Seven departments remain present and interactive. Fine-grained materials/furnishings still differ; see `KNOWN-VISUAL-DIFFERENCES.md` and `01-department-interiors/stage-result.md`. |
| 2 | Architecture & Environment | **Complete** | The live scene retains the central WORA plinth, seven labelled department zones, atrium/walkways, visible building/platform, vegetation, glazing and lighting accents in the reference composition. Residual low-poly environmental style is documented. HOME camera/projection was not changed in the final interior round. |
| 3 | Robots Reconstruction | **Complete** | Browser interaction audit lists 47 unique `ROBOT-001`…`ROBOT-047`, all with identity/location checks and full profile details. They are real scene actors (not a flattened image); their catalogued positions and department roles are inspectable. The local profile/task data is demo-fixture data, not real employee/backend data. |
| 4 | Dashboard UI Fidelity | **Complete** | The desktop UI reproduces the reference's dark sidebar, search/summary header, live activity, executive command and view controls as DOM UI with working navigation/search/selection; it is not baked into the scene. Browser audit confirms all 11 navigation items, profile detail disclosure, view switching, and command-not-sent disclosure. Header counts remain the supplied static reference snapshot (24) and are distinct from 47 scene actors. |
| 5 | Living Agent Behaviors | **Complete (local demo scope)** | Deterministic activity cycles drive actor motion and status, history, progress, collaboration pairing, pause/resume/reset/speed controls, and live panel counts. Browser audit confirms the panel and mute control. This is explicitly a local visual simulation only; no real agent runtime, external communication or task execution is claimed. Reduced-motion support is implemented. |
| 6 | Final Responsive QA | **Complete** | Fresh Chromium browser QA passed at 1920×1080, 1440×900, 1366×768, 390×844 and 430×932. All captures had zero browser errors. Mobile search selected all 47 employee entries and both Floor Plan and Live View modes switched. No owner-provided mobile reference exists, so mobile pixel scores are diagnostic, not acceptance gates. Software-WebGL headless FPS is not representative of user hardware. |

## Aggregate decision

The preview has a recognizable reference-led composition, an actual interactive DOM dashboard and 3D scene, 47 individually catalogued scene robots, state-driven local demo behaviors, and responsive desktop/mobile modes. The completed phases are not reopened for small residual image differences. Residuals and limits are recorded in [`KNOWN-VISUAL-DIFFERENCES.md`](KNOWN-VISUAL-DIFFERENCES.md). The preview is not photorealistic or pixel-identical, and local demo behaviors must not be represented as connected production agents.

## Verification record

- `npm run qa:browser` — passed; 5 viewport captures; `browserErrors: []`.
- `npm run qa:visual-fidelity` — completed; fresh native and responsive captures; `browserErrors: []`. Metrics retained as diagnostics only; no pixel-parity gate.
- `scripts/department-interiors-deep-audit.mjs` — final-round weighted MAE/SSIM above; full per-section evidence in the linked audit directory.
- Required full project validation is recorded in the final completion report; no deploy/push/merge performed.
