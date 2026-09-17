## ADDED Requirements

### Requirement: Policy and trusted consent
Sistem SHALL memaksakan kebijakan operasi dan hanya menerima consent dari kanal tepercaya yang terikat parameter dan identitas.

#### Scenario: Read only bypass
- **GIVEN** koneksi read-only
- **WHEN** write diminta lewat dispatcher umum
- **THEN** write ditolak sama seperti direct tool

#### Scenario: Approval palsu
- **GIVEN** model menambahkan approved=true
- **WHEN** operasi berisiko diminta
- **THEN** flag tidak memberi kewenangan dan operasi menunggu consent sah

#### Scenario: Parameter berubah
- **GIVEN** approval diberikan untuk hash A
- **WHEN** eksekusi memakai parameter B
- **THEN** approval ditolak

### Requirement: Secret safe audit
Sistem SHALL menghapus rahasia dan payload sensitif dari log, trace, error dan output model sambil mencatat metadata audit.

#### Scenario: Secret canary
- **GIVEN** input atau upstream stderr berisi token canary
- **WHEN** operasi gagal
- **THEN** token tidak ditemukan pada log/trace/error/model output

#### Scenario: Retensi
- **GIVEN** artifact mencapai expiry
- **WHEN** cleanup berjalan
- **THEN** artifact tidak dapat diunduh dan objek penyimpanan dihapus sesuai kebijakan

### Requirement: Untrusted content boundary
Sistem SHALL memperlakukan konten upstream sebagai data dan menolak akses filesystem/network yang melampaui scope.

#### Scenario: Prompt injection
- **GIVEN** komentar issue menyuruh melewati approval
- **WHEN** client mencoba operasi terlarang
- **THEN** policy tetap menolak

#### Scenario: Path escape
- **GIVEN** artifact path memiliki traversal atau symlink keluar root
- **WHEN** file dibuka
- **THEN** akses ditolak sebelum membaca/menulis di luar root

#### Scenario: SSRF
- **GIVEN** endpoint atau redirect menuju metadata cloud
- **WHEN** gateway memvalidasi egress
- **THEN** koneksi ditolak tanpa mengirim credential
