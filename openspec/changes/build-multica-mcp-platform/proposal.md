# Multica MCP Platform

## Why
Pengguna agy dan Codex membutuhkan akses seluruh kemampuan CLI Multica melalui MCP, termasuk membuat agent pada workspace tertentu. Dua repo komunitas yang diperiksa hanya mencakup sebagian perintah. Produk untuk banyak pengguna juga membutuhkan identitas, kredensial, cache, persetujuan, dan eksekusi perangkat yang terisolasi.

## What Changes
- Bangun MCP dengan katalog perintah bertipe dan parity terhadap CLI versi terpatok.
- Sediakan mode lokal stdio dan gateway bersama melalui Streamable HTTP.
- Tambahkan companion lokal berpasangan untuk operasi yang menyentuh perangkat pengguna.
- Gunakan identitas individual; tidak ada PAT admin bersama untuk semua pengguna.
- Tambahkan kebijakan akses, persetujuan operasi berisiko, audit tanpa rahasia, dan rekonsiliasi kegagalan.
- Sediakan onboarding serta pengujian integrasi agy dan Codex.

## Capabilities
### New Capabilities
- `cli-parity`: inventaris, schema, discovery, dan pengujian semua command/flag.
- `identity-isolation`: autentikasi, akses tenant/workspace, kredensial, dan pencabutan.
- `execution-routing`: eksekusi lokal, worker terisolasi, companion, serta job lifecycle.
- `agent-management`: pembuatan dan konfigurasi agent pada workspace eksplisit.
- `safety-audit`: kebijakan, persetujuan, kerahasiaan, audit, dan perlindungan input.
- `client-experience`: onboarding, penemuan kemampuan, hasil dan error konsisten.
- `operations`: reliability, distribusi, observability, dan release gate.
- `administration`: organisasi, peran admin, workspace/command policy, quota, audit, dan lifecycle koneksi/perangkat.

### Modified Capabilities
Tidak ada; repository aplikasi masih kosong.

## Impact
Aplikasi baru: MCP server, companion, registry/adapters CLI, gateway, identity integration, penyimpanan job dan audit, serta suite pengujian. PRD ada pada `prd.md`, arsitektur pada `design.md`, cakupan pada `command-coverage.md`, dan implementasi pada `tasks.md`.

Semua artifact adalah proposal. Jangan mengarsipkan sebagai spesifikasi yang sudah diterapkan sebelum implementasi dan verifikasi selesai.
