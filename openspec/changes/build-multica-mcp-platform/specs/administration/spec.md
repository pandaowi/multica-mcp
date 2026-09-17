## ADDED Requirements

### Requirement: Tenant-scoped administration
Sistem SHALL menyediakan control plane administrasi tenant-scoped yang terpisah dari MCP data plane dan SHALL menerapkan role `platform_admin`, `organization_admin`, `user`, serta `auditor`.

#### Scenario: Organization admin manages own tenant
- **GIVEN** seorang organization admin untuk organisasi A
- **WHEN** admin mengubah workspace policy organisasi A
- **THEN** perubahan tervalidasi, diversi, dan diaudit
- **AND** admin tidak memperoleh akses ke organisasi B

#### Scenario: Model invokes admin operation
- **GIVEN** agy atau Codex terhubung ke MCP data plane sebagai user
- **WHEN** model mencoba memanggil operasi admin yang tidak didaftarkan sebagai tool pengguna
- **THEN** operasi tidak tersedia atau ditolak
- **AND** policy tidak berubah

### Requirement: Workspace policy management
Sistem SHALL mendukung mode workspace `deny_all`, `single`, `allowlist`, dan `all_authorized`, dengan deny-by-default untuk koneksi baru pada deployment multi-user.

#### Scenario: Upstream access exceeds MCP policy
- **GIVEN** credential pengguna dapat mengakses workspace A dan B
- **AND** MCP allowlist hanya berisi workspace A
- **WHEN** pengguna melakukan discovery atau operasi pada workspace B
- **THEN** data workspace B tidak ditampilkan dan operasi ditolak

#### Scenario: Newly created workspace
- **GIVEN** organization memakai allowlist tanpa auto-enroll
- **WHEN** pengguna yang berhak membuat workspace C
- **THEN** workspace C tidak otomatis dapat digunakan melalui MCP sampai policy diperbarui

### Requirement: Command and risk policy
Sistem SHALL mendukung allow, deny, dan require-approval pada command/family, serta SHALL menggunakan deny-overrides pada seluruh layer policy.

#### Scenario: Dispatcher policy parity
- **GIVEN** `agent.mcp.add` ditandai require-approval
- **WHEN** command dipanggil melalui dispatcher umum
- **THEN** aturan yang sama diterapkan seperti direct tool

#### Scenario: Policy changes while queued
- **GIVEN** sebuah write job masih queued
- **WHEN** admin menambahkan deny sebelum side effect dimulai
- **THEN** worker mengevaluasi ulang policy terbaru dan menolak job

### Requirement: Administrative secret boundary
Admin MCP SHALL NOT secara otomatis memperoleh plaintext credential Multica, payload sensitif, atau kemampuan impersonasi pengguna.

#### Scenario: Credential inspection
- **GIVEN** admin melihat detail koneksi pengguna
- **WHEN** detail ditampilkan atau diekspor
- **THEN** hanya status, owner, origin, scopes, fingerprint dan metadata rotasi yang terlihat
- **AND** plaintext credential tidak tersedia

#### Scenario: Audit export
- **GIVEN** auditor memiliki izin export metadata
- **WHEN** audit diekspor
- **THEN** token, prompt, isi file dan payload sensitif telah disaring

### Requirement: Administrative lifecycle and audit
Setiap perubahan role, policy, connection, device, quota, retention, session, dan status organisasi SHALL menghasilkan audit event dengan actor, target, before/after hash, alasan, versi, dan waktu berlaku.

#### Scenario: Organization suspension
- **GIVEN** organisasi memiliki request baru, queued jobs dan running jobs
- **WHEN** platform admin mensuspensi organisasi
- **THEN** request baru ditolak, queued jobs tanpa side effect dibatalkan, dan running jobs dihentikan atau direkonsiliasi

#### Scenario: Access-expanding policy change
- **GIVEN** admin mengusulkan perubahan yang memperluas akses
- **WHEN** policy engine mengevaluasi perubahan
- **THEN** kewenangan dan approval yang diwajibkan diverifikasi sebelum perubahan berlaku
