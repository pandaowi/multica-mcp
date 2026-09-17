## ADDED Requirements

### Requirement: Versioned command coverage
Sistem SHALL menyediakan adapter atau workflow untuk setiap canonical public leaf command dan opsi semantik CLI baseline, serta melaporkan gap secara eksplisit.

#### Scenario: Baseline lengkap
- **GIVEN** help tree baseline telah diinventarisasi
- **WHEN** release candidate dievaluasi
- **THEN** setiap command dan flag memiliki mapping serta contract test; gap memblokir klaim parity

#### Scenario: CLI berubah
- **GIVEN** binary berbeda dari versi yang didukung
- **WHEN** operasi mutasi diminta
- **THEN** eksekusi ditolak dengan CLI_INCOMPATIBLE sebelum side effect

### Requirement: Typed command dispatch
Sistem SHALL memvalidasi command ID dan argumen dengan registry yang sama untuk direct tool dan dispatcher, tanpa shell atau raw argv dari model.

#### Scenario: Unknown command
- **GIVEN** client mengirim command ID tidak terdaftar
- **WHEN** dispatcher memvalidasi input
- **THEN** VALIDATION_ERROR dikembalikan dan subprocess tidak dibuat

#### Scenario: Option injection
- **GIVEN** field nama berisi flag atau shell metacharacter
- **WHEN** command valid dieksekusi
- **THEN** nilai tetap data atau ditolak schema dan tidak menjadi command/flag tambahan

### Requirement: Interactive and file parity
Sistem SHALL mendukung input interaktif, secret, file, stdin, output dan streaming melalui kanal yang sesuai tanpa membocorkan secret ke model.

#### Scenario: Login token
- **GIVEN** command membutuhkan PAT
- **WHEN** login dimulai
- **THEN** trusted UI menerima secret dan client hanya menerima status

#### Scenario: File input
- **GIVEN** pengguna memiliki artifact yang diunggah
- **WHEN** command membutuhkan file
- **THEN** executor menggunakan artifact milik pengguna dan menolak handle pengguna lain
