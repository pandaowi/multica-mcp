# Sumber dan batas verifikasi

Diakses 17 September 2026. Dokumen produk/desain adalah keputusan rancangan baru, bukan salinan dokumentasi upstream atau klaim aplikasi sudah berfungsi.

- [Multica CLI reference](https://multica.ai/docs/cli): sumber kategori command dan workspace selection. Help binary versi terpatok harus menjadi baseline final.
- [Multica CLI and daemon source documentation](https://github.com/multica-ai/multica/blob/main/CLI_AND_DAEMON.md): referensi perilaku lokal dan CLI. Branch main dapat berubah; wajib dipatok saat M0.
- [Korkyzer source snapshot](https://github.com/Korkyzer/multica-mcp/tree/cfc253f1554a79f0e30d81b5b06b129907d04d56): diperiksa source registry, agent schema, argv builder, subprocess executor dan logger. Referensi pola CLI; bukan jaminan kompatibilitas.
- [strider2038 source snapshot](https://github.com/strider2038/multica-mcp/tree/5fbfc8e1b250599eee676614f2ab103b6f25f460): diperiksa registry, HTTP client, workspace scope dan read-only guards. Referensi pemisahan komponen.
- [OpenSpec concepts](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md): struktur change, proposal, design, tasks dan delta specs.
- [MCP HTTP authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization): dasar pemisahan identity/authorization gateway. Versi protokol produksi dinegosiasikan dan diuji saat implementasi.

Tidak dilakukan: pengujian akun Multica live, validasi token upstream, benchmark atau uji integrasi agy/Codex. Tidak ada asumsi Multica mendukung OAuth delegation. Tidak ada baseline CLI final atau janji bahwa daftar dokumentasi sama dengan seluruh command binary.
