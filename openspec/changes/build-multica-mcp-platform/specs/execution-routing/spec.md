## ADDED Requirements

### Requirement: Device ownership
Sistem SHALL menjalankan operasi lokal hanya pada perangkat yang dimiliki atau secara eksplisit diberikan kepada principal dengan scope sesuai.

#### Scenario: Perangkat offline
- **GIVEN** command checkout membutuhkan companion
- **WHEN** perangkat target offline
- **THEN** DEVICE_OFFLINE ditampilkan tanpa routing ke perangkat lain

#### Scenario: Replay grant
- **GIVEN** grant telah dipakai
- **WHEN** grant dikirim kembali ke companion
- **THEN** companion menolak sebelum eksekusi

### Requirement: Client-side coding agents
Gateway SHALL treat agy, Codex, and other coding agents as MCP clients running on the user's device; the gateway MUST NOT install, spawn, resume, or control those coding-agent binaries on the server host.

#### Scenario: Shared gateway request
- **GIVEN** agy or Codex connects to the gateway over authenticated MCP transport
- **WHEN** the client invokes a Multica command
- **THEN** the gateway executes only a registered Multica adapter or routes the local workflow to the user's paired companion
- **AND** the gateway does not invoke an agy/codex executable on the server

#### Scenario: Local stdio request
- **GIVEN** the user configures `command` for a local MCP binary
- **WHEN** the client starts the MCP server
- **THEN** the binary runs on the user's device under that user's local profile
- **AND** this mode is identified as local/bridge mode rather than shared gateway mode

### Requirement: Job lifecycle
Sistem SHALL menyediakan status, pembatalan, pagination dan hasil akhir yang tidak mengklaim rollback atau transaksi yang tidak didukung upstream.

#### Scenario: Timeout setelah write
- **GIVEN** upstream mungkin telah membuat agent
- **WHEN** respons koneksi hilang
- **THEN** operation menjadi outcome_unknown dan tidak otomatis mengulang create

#### Scenario: Idempotency conflict
- **GIVEN** key sudah dipakai dengan parameter A
- **WHEN** key sama dipakai dengan parameter B
- **THEN** conflict dikembalikan tanpa write kedua

#### Scenario: Cancel
- **GIVEN** job sudah membuat perubahan upstream
- **WHEN** pengguna membatalkan
- **THEN** proses dihentikan bila memungkinkan dan hasil menjelaskan efek yang telah terjadi

### Requirement: Local administrative workflows
Sistem SHALL menyediakan lifecycle terisolasi untuk login, setup, daemon, config, checkout dan update tanpa mengubah profil pengguna lain.

#### Scenario: Daemon start
- **GIVEN** profil perangkat valid telah dipilih
- **WHEN** start diminta
- **THEN** status start diverifikasi dan job selesai sementara daemon tetap hidup

#### Scenario: Update gagal
- **GIVEN** updater memperoleh binary tidak valid
- **WHEN** verifikasi checksum gagal
- **THEN** binary tidak dipasang dan versi aktif dipertahankan
