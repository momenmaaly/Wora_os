# WORA OS — Main Workspace Design Source Lock

> **Status: LOCKED.** This document pins the one, authoritative visual reference for the WORA Main Workspace.
> Every design and implementation agent working on the Main Workspace must read this document and use the referenced image as the exact visual target.

---

## 1. Source of truth

| Field | Value |
|---|---|
| Repository copy | [`docs/design/main-workspace/reference/wora-main-workspace.png`](reference/wora-main-workspace.png) |
| Original source URL | https://drive.google.com/file/d/1i9MX-rD7smv1zizi76nooaQRYEF4iqG7/view?usp=drivesdk |
| Google Drive file ID | `1i9MX-rD7smv1zizi76nooaQRYEF4iqG7` |
| Drive head revision ID | `0B5kP82WeUJD-eTdxYk5TWG9tQUtBWTYrL0ttOXlwbmVLaTlBPQ` |
| Drive owner | Momen Alsadek |
| Drive created / modified | 2026-11-19T00:33:50.468Z / 2026-11-19T00:33:51.298Z |
| Original filename | `wora.photo.agen` (Drive reports extension `agen`) |
| Actual format | **PNG** (Drive MIME type `image/png`; valid PNG signature `89 50 4E 47 0D 0A 1A 0A`) |
| Repository filename | `wora-main-workspace.png` (renamed only — **no byte of content changed**) |

The original Drive name has the extension `.agen`. The file content is a standard PNG, as both the Drive MIME type and the file signature confirm. The repository copy keeps the bytes exactly. Only the filename changed, to match the required path.

## 2. Image properties

| Property | Value |
|---|---|
| Dimensions | **1672 × 941 px** (width × height) |
| Aspect ratio | ≈ 1.777 : 1 (close to 16:9) |
| Colour type | Truecolour RGB (PNG colour type 2), no alpha channel |
| Bit depth | 8 bits per channel (24-bit) |
| Interlace | None |
| Physical resolution (DPI) | Not specified (the file has no `pHYs` chunk). Treat it as 1672 × 941 logical pixels at 1× |
| File size | **2,695,320 bytes** (≈ 2.57 MiB) |
| PNG chunks | `IHDR`, `caBX`, `IDAT`, `IEND` (all CRCs valid, no bytes after `IEND`) |
| Embedded provenance | `caBX` chunk with C2PA Content Credentials (claim generator: OpenAI; signed 2026-11-18). Kept unchanged |

## 3. Checksums

| Algorithm | Value |
|---|---|
| **SHA-256** | **`6f91ff3d27f1d69d7189b6d1a599088086bb50048d1c0b492e3ebcdb718036a1`** |
| SHA-1 | `171fd8768a678a233849b65a2a4e4d0d1ac11608` |
| MD5 | `392bf9c78aec95a10dc3388bb276a8cb` |

There is a machine-checkable checksum file next to the image:

```bash
cd docs/design/main-workspace/reference
sha256sum -c wora-main-workspace.png.sha256
# expected: wora-main-workspace.png: OK
```

## 4. Retrieval and verification record

| Step | Result |
|---|---|
| Retrieval date | 2026-11-20 |
| Retrieval method | Authenticated Google Drive API (`files.get` with `alt=media`, raw stored bytes), through the connected Google Drive account. No export, conversion, screenshot or re-encode |
| Drive metadata access | ✅ Success: file is readable by the connected account |
| Byte download | ✅ Success: 2,695,320 bytes, equal to the Drive-reported `size` |
| SHA-256 vs Drive `sha256Checksum` | ✅ **MATCH** |
| SHA-1 vs Drive `sha1Checksum` | ✅ **MATCH** |
| MD5 vs Drive `md5Checksum` | ✅ **MATCH** |
| Dimensions vs Drive `imageMediaMetadata` | ✅ **MATCH** (1672 × 941) |
| PNG structural integrity | ✅ Valid signature, every chunk CRC valid, IDAT fully decompresses to the expected 4,720,997 bytes (941 rows × (1 + 1672 × 3)) |
| Repository copy vs downloaded file | ✅ Byte-identical (`cmp`) |
| Modifications applied | **None.** No crop, resize, compression, recolour, metadata strip or enhancement |

**Overall status: ✅ RETRIEVED AND VERIFIED. The repository copy is byte-for-byte identical to the Google Drive original.**

## 5. Visible element inventory (for verification only)

This list exists only so agents can check that nothing is missing. It does **not** replace the image and does not reinterpret it. **If this list and the image ever disagree, the image wins.**

- **Top-left brand area:** WORA logo and wordmark, "Enterprise" badge, collapse chevron.
- **Company selector:** "My Company" with a dropdown, and a "Live" status indicator.
- **Left navigation:** Company Overview (active), Executive Office, Departments, Agent Directory, Projects, Tasks & Workflows, Knowledge Base, Reports & Analytics, Integrations, Billing & Usage, Settings.
- **Upgrade card:** crown icon, "Upgrade to Pro", "Unlock more power for your company", "Upgrade Now" button.
- **Top search bar:** "Search across your company…".
- **Status strip:** My Company / Operational · 24 AI Employees · 08 Working · 03 Waiting · 01 Blocked.
- **Top-right:** notification bell with badge "3", user profile "Momen Maaly / CEO" with an avatar and dropdown.
- **Live Activity panel:** Marketing Agent (Finished creating ideas, 2m ago), Dev Agent (Pushed new code, 3m ago), Reviewer Agent (Approved the changes, 4m ago), Video Producer (Started rendering video, 5m ago), "View All →".
- **Central 3D isometric office floor:** a central WORA logo plinth, a lounge area with a tree, and roaming robot agents. The labelled department rooms are Executive Office (crown), Marketing, Engineering, Creative Studio, Management, Research, and QA & Testing. Each room has robot agents at desks, monitors, plants and furniture.
- **Bottom command bar:** robot avatar with a voice icon, "Executive Command", input "Tell your company what to do…", and a send button.
- **Bottom-right view switcher:** 3D View (active), Floor Plan, Live View.

## 6. Mandatory rules for all future design and implementation agents

1. **Exact visual target.** `reference/wora-main-workspace.png` (SHA-256 `6f91ff3d…718036a1`) is the only visual target for the Main Workspace. Match it exactly in layout, proportions, colours, typography, iconography, spacing, labels, copy, element order and 3D composition.
2. **No redesign.** Do not reinterpret, "improve", modernise, restyle or improvise.
3. **No additions.** Do not add elements, panels, labels, icons, rooms, agents or features that are not visible in the reference.
4. **No removals.** Every visible element must be present. Do not omit, merge or simplify elements.
5. **No replacement.** Do not swap in substitute images, AI-regenerated versions, mock-ups or alternative references.
6. **Real UI, not a backdrop.** Rebuild the design as real, functional, interactive UI components and real 3D objects. **Never use the reference image, or any crop of it, as a background, texture, overlay or placeholder in the application.**
7. **Text is exact.** Copy every visible string exactly as shown, including capitalisation, punctuation and numbers.
8. **Do not alter the reference.** Do not edit, re-export, compress, optimise, crop, rename or move `reference/wora-main-workspace.png`. Repository tooling (image optimisers, LFS migration, linters) must not rewrite it.
9. **Verify before use.** Before starting work, run `sha256sum -c reference/wora-main-workspace.png.sha256`. If the checksum does not match, **stop** and report it. Do not proceed with a mismatched reference.
10. **Mandatory hand-off.** Every specialist assigned to Main Workspace design or implementation must get this document and the exact reference file (repository path or the Drive URL above), not a description, screenshot or re-encoded copy.
11. **Change control.** Only the project owner can approve a change to the design source. A change needs a new image, new checksums, and an update to this document in the same commit. Agents must not change the source on their own initiative.
12. **Visual QA.** Compare implementation reviews directly against this reference at 1672 × 941 (and at proportional scales). Any visible deviation is a defect.
