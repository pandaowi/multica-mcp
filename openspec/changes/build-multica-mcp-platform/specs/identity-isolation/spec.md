## ADDED Requirements

### Requirement: Individual identity
Sistem SHALL mengautentikasi pengguna HTTP secara individual dan memisahkan token gateway dari kredensial Multica.

#### Scenario: Audience salah
- **GIVEN** token valid untuk service lain
- **WHEN** token dipakai pada gateway
- **THEN** request ditolak tanpa akses upstream

#### Scenario: Koneksi asing
- **GIVEN** pengguna A mengetahui connection ID B
- **WHEN** A meminta command dengan koneksi itu
- **THEN** FORBIDDEN dikembalikan tanpa pengungkapan secret

### Requirement: Workspace isolation
Sistem SHALL mengikat setiap operasi workspace pada principal, connection dan workspace eksplisit serta memverifikasi akses resource.

#### Scenario: Concurrency lintas workspace
- **GIVEN** dua pengguna punya workspace berbeda
- **WHEN** keduanya membuat agent bersamaan
- **THEN** hasil dan cache tetap pada principal/workspace masing-masing

#### Scenario: ID asing
- **GIVEN** pengguna memiliki akses workspace A saja
- **WHEN** resource workspace B diminta lewat scope A
- **THEN** request ditolak tanpa mengembalikan data B

### Requirement: Revocation
Sistem SHALL menerapkan pencabutan koneksi dan grant pada operasi queued, cache dan otorisasi baru.

#### Scenario: Grant dicabut
- **GIVEN** job belum dieksekusi
- **WHEN** grant perangkat dicabut
- **THEN** job tidak dijalankan dan cache grant dibatalkan
