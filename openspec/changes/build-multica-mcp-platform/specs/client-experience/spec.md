## ADDED Requirements

### Requirement: Client compatibility
Sistem SHALL menyediakan onboarding dan pengujian end-to-end agy serta Codex pada versi yang dicatat tanpa mengasumsikan dukungan extension opsional.

#### Scenario: Client stdio
- **GIVEN** client target telah dikonfigurasi
- **WHEN** discovery dan create agent dipanggil
- **THEN** schema, hasil dan error dapat dipahami client

#### Scenario: HTTP tidak native
- **GIVEN** client target tidak mendukung flow HTTP yang diperlukan
- **WHEN** pengguna memilih gateway
- **THEN** bridge stdio teruji menyediakan jalur autentikasi dan eksekusi

### Requirement: Actionable discovery
Sistem SHALL menampilkan kemampuan, scope perangkat, risiko dan alasan denial tanpa meminta token di chat.

#### Scenario: Command lokal
- **GIVEN** pengguna mencari daemon stop
- **WHEN** describe dipanggil
- **THEN** hasil menunjukkan kebutuhan device dan izin sebelum eksekusi

#### Scenario: Approval UI unavailable
- **GIVEN** client tidak mendukung UI approval native
- **WHEN** consent diperlukan
- **THEN** trusted browser/companion flow tersedia dan operasi tidak otomatis disetujui
