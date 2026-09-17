## ADDED Requirements

### Requirement: Create agent in explicit workspace
Sistem SHALL membuat agent pada workspace eksplisit dengan runtime berizin dan mengembalikan ID serta hasil verifikasi.

#### Scenario: Create berhasil
- **GIVEN** principal memiliki akses workspace dan runtime
- **WHEN** nama unik dan konfigurasi valid dikirim
- **THEN** agent dibuat dan get ulang memastikan workspace/runtime sesuai

#### Scenario: Runtime terlarang
- **GIVEN** runtime tidak dapat digunakan principal
- **WHEN** create diminta
- **THEN** FORBIDDEN dikembalikan dan agent tidak dibuat

#### Scenario: Workspace kosong
- **GIVEN** request create tidak menentukan workspace
- **WHEN** validasi berlangsung
- **THEN** WORKSPACE_REQUIRED dikembalikan tanpa menggunakan default tersembunyi

### Requirement: Agent lifecycle parity
Sistem SHALL mendukung seluruh lifecycle serta opsi konfigurasi agent baseline dengan policy sesuai dampak.

#### Scenario: MCP executable
- **GIVEN** konfigurasi agent berisi command MCP baru
- **WHEN** perubahan diajukan
- **THEN** policy code-execution diterapkan dan approval tepercaya diperlukan bila diwajibkan

#### Scenario: Lifecycle
- **GIVEN** principal memiliki hak yang diperlukan
- **WHEN** get/update/copy/archive/restore dan bindings dijalankan
- **THEN** setiap operasi mengikuti kontrak CLI baseline dan memiliki verifikasi hasil
