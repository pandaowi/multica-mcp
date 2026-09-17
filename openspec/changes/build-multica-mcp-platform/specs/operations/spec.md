## ADDED Requirements

### Requirement: Release evidence
Sistem SHALL memblokir GA sampai parity, isolation, client interoperability dan performance gates memiliki bukti pengujian.

#### Scenario: Gap parity
- **GIVEN** satu command masih planned
- **WHEN** GA pipeline dijalankan
- **THEN** release full parity gagal

#### Scenario: Load
- **GIVEN** 100 sesi dan 20 command bersamaan diuji
- **WHEN** benchmark selesai
- **THEN** overhead p95 dan per-user fairness dilaporkan terhadap target PRD

### Requirement: Safe deployment
Sistem SHALL mendistribusikan artifact terverifikasi dan menolak HTTP tanpa autentikasi serta versi companion yang tidak kompatibel.

#### Scenario: HTTP tanpa auth
- **GIVEN** konfigurasi authorization hilang
- **WHEN** gateway startup
- **THEN** startup gagal sebelum menerima traffic

#### Scenario: Companion lama
- **GIVEN** versi companion tidak kompatibel
- **WHEN** handshake berlangsung
- **THEN** routing job ditolak dengan pesan upgrade yang jelas
