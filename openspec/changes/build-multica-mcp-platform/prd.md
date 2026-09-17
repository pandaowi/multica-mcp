# PRD — Multica MCP Platform

## 1. Status dan keputusan produk
Tanggal: 17 September 2026. Status: siap ditinjau untuk implementasi, belum aplikasi berjalan.

Mandat pengguna: banyak pengguna memakai agy atau Codex untuk mengontrol Multica melalui MCP; semua perintah CLI harus terakomodasi; kemudahan dan keamanan menjadi prioritas.

Keputusan rancangan: mendukung instalasi lokal independen maupun layanan gateway bersama. Gateway tidak mengambil alih mesin pengguna. Operasi lokal dijalankan companion pada perangkat yang dipasangkan. Ini menjaga cakupan CLI penuh tanpa berbagi HOME, token, atau daemon antar pengguna.

Dalam mode gateway, agy dan Codex **selalu berjalan di sisi client pengguna**. Gateway tidak memasang, menjalankan, atau mengendalikan binary `agy`, `codex`, atau coding-agent lain di host server. Host server hanya menjalankan MCP gateway, policy/identity services, Multica CLI/API worker yang terisolasi, dan dispatcher. Bila sebuah command membutuhkan lingkungan lokal pengguna, gateway mengirimkannya ke companion yang dipasangkan; bila command hanya membutuhkan Multica API, gateway dapat menjalankannya melalui worker terisolasi.

## 2. Pengguna dan pekerjaan utama
| Persona | Pekerjaan | Keberhasilan |
|---|---|---|
| Pengguna individu | Hubungkan client, pilih workspace, kelola agent dan issue | Tidak perlu menyalin token ke percakapan |
| Anggota tim | Akses workspace yang menjadi haknya | Tidak melihat objek, hasil, atau cache pengguna lain |
| Administrator organisasi | Tetapkan workspace/perangkat/operasi yang boleh dipakai | Kebijakan tidak dapat dilewati lewat flag CLI |
| Operator platform | Deploy, upgrade, audit, pulihkan layanan | Tidak membutuhkan PAT Multica admin bersama |
| Auditor | Memeriksa aktivitas dan perubahan kebijakan | Tidak memperoleh credential atau isi sensitif secara otomatis |

## 3. Tujuan dan ukuran keberhasilan
Target penerimaan berikut adalah target desain, belum hasil benchmark:
- 100% canonical leaf command publik dan opsi semantik versi CLI yang dipatok memiliki adapter, workflow, dan tes. Alias dipetakan; tidak dihitung ganda.
- 100% operasi lokal memiliki jalur companion atau stdio. Denial karena izin tidak dihitung sebagai implementasi hilang; command yang belum punya adapter tetap gap.
- Nol kebocoran lintas pengguna/workspace pada suite negatif, concurrency, dan audit.
- Onboarding pengguna yang sudah memiliki CLI/login: median <= 5 menit pada uji usability.
- Overhead gateway p95 <= 500 ms, tidak termasuk antrean, startup CLI, jaringan upstream, atau waktu eksekusi.
- Target awal kapasitas: 100 sesi aktif, 20 command bersamaan total, default 2 per pengguna; harus dibuktikan load test.
- Ketersediaan gateway target 99,5% per bulan; kesalahan upstream dilaporkan terpisah.

## 4. Ruang lingkup
Semua kelompok CLI, subcommand, flag, input file/stdin, pagination, streaming, output format dan global option masuk inventaris. Daftar awal ada di `command-coverage.md`; sumber otoritatif rilis adalah binary terverifikasi dan help tree versi terpatok, bukan README komunitas.

Fitur platform: identitas individual, workspace eksplisit, daftar capability, schema validasi, preview dampak, approval sesuai kebijakan, idempotency, job status/cancel, audit redacted, artifact download/upload, diagnostics, dan update terkontrol.

Auth/login/setup, perubahan profil, daemon, repo checkout, update binary dan path lokal tetap didukung sebagai workflow perangkat. Secret dimasukkan di UI/terminal tepercaya, bukan sebagai parameter tool yang ditulis model. Nilai sensitif dari config/env tidak dikembalikan mentah ke model; pemilik dapat melihatnya melalui kanal lokal tepercaya.

Tidak termasuk: shell umum, menjalankan executable sewenang-wenang, memintas izin Multica, berbagi identitas admin, implementasi ulang AI runtime, atau janji mendukung otomatis setiap versi CLI masa depan.

## 5. Kebutuhan fungsional
| ID | Kebutuhan P0 | Capability |
|---|---|---|
| FR-01 | Discovery, describe, dan eksekusi semua command versi baseline | cli-parity |
| FR-02 | Login gateway dan koneksi Multica individual, pencabutan akses | identity-isolation |
| FR-03 | Workspace eksplisit dan authorization untuk setiap resource | identity-isolation |
| FR-04 | Create/get/update/copy/archive/restore agent dan pengaturan terkait | agent-management |
| FR-05 | Jalur lokal untuk seluruh operasi perangkat/interaktif | execution-routing |
| FR-06 | Read-only policy, batas write, approval untuk dampak berisiko | safety-audit |
| FR-07 | Hasil bertipe, pagination, job, error dan rekonsiliasi | execution-routing |
| FR-08 | agy dan Codex dapat discovery, invoke, dan membaca hasil | client-experience |
| FR-09 | Distribusi terverifikasi, audit, quotas dan observability | operations |
| FR-10 | Administrasi organisasi, peran, workspace, command policy, koneksi, perangkat, quota dan audit | administration |

P0 berarti wajib sebelum klaim general availability dengan parity penuh. Pilot boleh subset, tetapi wajib menunjukkan gap dan tidak dipasarkan sebagai full CLI.

## 5.1 Pengelolaan MCP
Deployment multi-user SHALL memiliki control plane administrasi. Pada versi awal control plane dapat berupa konfigurasi deklaratif tervalidasi dan CLI admin; dashboard web dapat ditambahkan kemudian. Policy tetap disimpan dan dipaksakan server-side sehingga tidak dapat diubah melalui parameter yang dikirim agy/Codex.

Peran minimum:

| Peran | Lingkup |
|---|---|
| Platform admin | Konfigurasi deployment, IdP, kebijakan global, versi yang didukung, incident response dan audit lintas organisasi sesuai mandat |
| Organization admin | Pengguna, role, workspace allowlist, command policy, quota, koneksi dan perangkat dalam organisasinya |
| User | Mengelola koneksi Multica miliknya dan memakai workspace/command yang diizinkan |
| Auditor | Membaca metadata audit yang telah disaring tanpa melihat secret atau payload sensitif secara default |

Admin MCP tidak otomatis menjadi admin Multica, tidak otomatis memperoleh credential pengguna, dan tidak otomatis dapat membaca isi seluruh workspace. Izin efektif tetap merupakan irisan izin upstream pengguna dan policy MCP. Impersonation dilarang secara default; emergency break-glass, bila kelak dibutuhkan, harus dirancang terpisah dengan approval ganda, masa berlaku singkat dan audit khusus.

Workspace policy per koneksi/organisasi mendukung `deny_all`, `single`, `allowlist`, dan `all_authorized`. Default produksi adalah `deny_all` sebelum provisioning, lalu `single` atau `allowlist` setelah disetujui. `all_authorized` harus dipilih eksplisit. Workspace baru tidak otomatis masuk allowlist kecuali policy organisasi menyatakannya.

Admin dapat mengatur allow/deny/require-approval per command atau command family, risk ceiling, read-only mode, quota/rate/concurrency, retensi, device grant, origin Multica yang diizinkan, serta pencabutan session/koneksi/perangkat. Setiap perubahan policy memiliki actor, before/after hash, alasan, waktu berlaku, versi dan audit event. Policy change yang memperluas akses memerlukan kewenangan lebih tinggi daripada perubahan yang mempersempit akses.

## 6. Alur utama
### Membuat agent
1. Pengguna menghubungkan identitas Multica dan memilih workspace yang dapat diakses.
2. Client menemukan runtime yang dapat dipakai di workspace tersebut.
3. MCP menerima nama, runtime, model/instruksi dan opsi yang disetujui.
4. Policy mengecek akses, dampak konfigurasi, serta kebutuhan approval.
5. Eksekusi menggunakan workspace eksplisit; hasil diverifikasi dengan pembacaan ulang.
6. Pengguna menerima agent ID, workspace ID, dan hasil final atau status perlu rekonsiliasi.

### Operasi lokal dari gateway
Pengguna memasangkan perangkat lewat flow tepercaya. Permintaan checkout atau daemon diarahkan ke device ID miliknya. Companion memverifikasi grant, workspace, path dan approval. Jika offline, hasil menunjukkan `DEVICE_OFFLINE`; tidak dialihkan ke perangkat pengguna lain.

### Operasi berisiko
Penghapusan, perubahan kredensial, pemasangan kode/skill/MCP executable, perubahan permission atau update binary menampilkan ringkasan dampak di UI tepercaya. Persetujuan terikat hash parameter, principal, workspace, perangkat dan expiry. Membaca data atau write rutin yang sudah diizinkan tidak meminta konfirmasi berulang.

## 7. Keamanan dan privasi
Izin efektif adalah irisan izin upstream, kebijakan organisasi, cakupan koneksi, batas perangkat, serta consent. HTTP publik selalu terautentikasi. Konten issue/komentar/tool result dianggap data tidak tepercaya dan tidak boleh mengubah kebijakan. Rahasia tidak berada di prompt, log, URL, error, argv, atau telemetry.

Retensi awal yang diusulkan: metadata audit 90 hari, hasil job redacted 24 jam, artefak transfer 1 jam; dapat dikurangi oleh organisasi. Secret tetap tersimpan hanya selama koneksi aktif. Penghapusan/pencabutan harus mencakup job queued, cache, grant dan salinan temporer; backup mengikuti periode retensi yang terdokumentasi.

## 8. Penerimaan produk
- Dua pengguna menjalankan create agent bersamaan di workspace berbeda tanpa scope tertukar.
- Admin organisasi membatasi pengguna ke workspace A; `workspace list` hanya menampilkan workspace yang diizinkan dan operasi ke workspace B ditolak walaupun token upstream dapat mengaksesnya.
- Perubahan command policy oleh admin langsung berlaku pada job baru dan diperiksa ulang sebelum job queued dieksekusi.
- Admin MCP tidak dapat mengekspor PAT Multica pengguna atau membuka payload sensitif hanya karena memiliki peran admin.
- Pengguna A tidak dapat membaca job, file, kredensial, perangkat atau cache B dengan menebak ID.
- Seluruh daftar CLI baseline lulus matriks adapter dan skenario perilaku; tidak ada placeholder dianggap selesai.
- Command yang meminta token membuka flow aman dan tidak menampilkan token dalam percakapan.
- Versi CLI tidak didukung menghasilkan incompatibility yang jelas sebelum side effect.
- Putus koneksi setelah write tidak menyebabkan pengulangan write tanpa rekonsiliasi.
- Skenario agy dan Codex lulus pada versi client yang dicatat. Ketidakmampuan transport native diselesaikan melalui bridge stdio lokal yang diuji.

Pengujian MCP tidak boleh bergantung hanya pada kemampuan memanggil MCP dari agy atau Codex. Kebenaran protocol dan business behavior harus dapat diuji tanpa AI client melalui MCP protocol harness/Inspector, fake CLI, dan staging integration client. Agy/Codex hanya menjadi lapisan interoperability terakhir. Kegagalan harus diklasifikasikan sekurangnya sebagai `protocol`, `schema/policy`, `adapter/Multica`, `transport/auth`, `companion`, atau `AI-client compatibility`.

## 9. Tahapan
M0: baseline CLI, eksperimen client dan auth. M1: mode stdio, registry, create agent dan semua read. M2: semua write, companion dan guardrails. M3: gateway multi-user, OAuth, isolation dan audit. M4: tutup seluruh gap parity, security/load/usability tests, dokumentasi dan GA. Semua tahap merupakan implementasi mendatang.

## 10. Asumsi yang perlu divalidasi
IdP, lokasi hosting/data residency, versi CLI/client baseline dan jumlah pengguna produksi belum diberikan. Desain awal memakai OIDC provider, PostgreSQL, worker Linux terisolasi dan companion macOS/Linux/Windows. Akses credential CLI untuk worker harus dibuktikan pada M0; jika hanya tersedia profil, provisioning dilakukan lewat flow tepercaya. Tidak mengasumsikan Multica menyediakan delegated OAuth.
