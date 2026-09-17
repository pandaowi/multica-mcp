# OpenSpec — Multica MCP Platform

Dokumen pembangunan MCP Multica untuk banyak pengguna agy/Codex, dengan prioritas kemudahan, keamanan dan seluruh CLI baseline.

Change aktif: [build-multica-mcp-platform](changes/build-multica-mcp-platform/proposal.md).

- [PRD](changes/build-multica-mcp-platform/prd.md)
- [Technical design](changes/build-multica-mcp-platform/design.md)
- [CLI coverage](changes/build-multica-mcp-platform/command-coverage.md)
- [Implementation tasks](changes/build-multica-mcp-platform/tasks.md)
- [Delta specifications](changes/build-multica-mcp-platform/specs/)
- [Sources and verification limits](changes/build-multica-mcp-platform/sources.md)

Gunakan schema bawaan `spec-driven`. `prd.md`, `command-coverage.md` dan `sources.md` adalah artifact pendukung; proposal/design/specs/tasks mengikuti workflow standar. Root `openspec/specs/` belum diisi karena belum ada perilaku aplikasi yang diimplementasikan.

Validasi dari root repository:

```bash
npx --yes @fission-ai/openspec@1.13.1 validate build-multica-mcp-platform --strict
```

Tahap berikutnya adalah tugas M0 di tasks.md, bukan menganggap semua command atau dukungan client sudah tersedia.
