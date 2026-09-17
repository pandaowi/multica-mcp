# Matriks cakupan CLI

Status seluruh baris: **planned, belum diimplementasikan**. Tabel ini adalah seed inventaris dari dokumentasi resmi, bukan klaim inventaris final binary. Baseline binary/tag/checksum belum dipilih; M0 wajib menghasilkan `cli-manifest.json` dengan satu record per canonical leaf command, opsi dan test IDs. Perbedaan dokumentasi vs help binary harus diselesaikan, tidak diabaikan.

| Family | Operasi yang harus diinventarisasi dan diakomodasi | Routing |
|---|---|---|
| issue | list/get/create/update/assign/status/reorder/search/children/pull-requests | worker atau lokal |
| issue comment | list/add/update/delete/resolve/unresolve; thread, recent, cursor dan incremental reads | worker atau lokal |
| issue subscriber/label | list/add/remove | worker atau lokal |
| issue metadata | list/get/set/delete | worker atau lokal |
| issue property | list/set/unset | worker atau lokal |
| issue runs | runs/run-messages/usage/rerun/cancel-task; active/family filtering bila baseline mendukung | worker atau lokal |
| project | list/get/create/update/delete/status | worker atau lokal |
| project resource | list/add/update/remove; local-path/device metadata memerlukan pemeriksaan grant | worker + companion bila akses file |
| label | list/get/create/update/delete | worker atau lokal |
| property | list/get/create/update/archive | worker atau lokal |
| agent | list/get/create/update/copy/archive/restore/tasks/avatar | worker; avatar file via artifact |
| agent env | get/set; nilai secret lewat kanal tepercaya | worker atau lokal |
| agent skills | list/set/add dan operasi lain pada baseline | worker atau lokal |
| agent mcp | list/add/enable/disable/remove | worker atau lokal |
| skill | list/get/create/update/delete/import/search | worker; file import via artifact |
| skill files | list/upsert/delete | worker; file via artifact |
| skill label | list/add/remove | worker atau lokal |
| squad | list/get/create/update/delete/member list/add/set-role/remove/activity | worker atau lokal |
| autopilot | list/get/create/update/delete/trigger/runs | worker atau lokal |
| autopilot trigger | trigger-add/update/delete/rotate-url; schedule dan webhook | worker atau lokal |
| workspace | list/get/create/update/switch | worker; switch profil di companion |
| workspace mcp | list/add/update/remove | worker atau lokal |
| workspace member | list/invite | worker atau lokal |
| repo | list/add/remove/checkout | worker; checkout di companion |
| daemon | start/stop/restart/status/logs/disk-usage; probe-runtimes bila publik pada baseline | companion |
| runtime | list/usage/activity/update/rename/delete | worker atau lokal |
| runtime profile | list/create/update/delete/set-path/unset-path | scope ditetapkan baseline; path lokal via companion |
| attachment | upload/download | artifact transfer + companion untuk path pengguna |
| chat | history/thread | worker atau lokal |
| user profile | get/update | worker atau lokal |
| auth/login | status/logout/login dan flow browser/token | companion/trusted identity workflow |
| setup | cloud/default/self-host | companion interactive workflow |
| config | show/set; secret redaction | companion isolated profile |
| update/version | update binary/version | companion updater; worker version introspection |
| help/completion | help semua command; completion bila tersedia | registry/help artifact |
| globals | workspace-id/profile/server-url/debug/output; inherited flags dan aliases | typed mapping; connection/policy enforced |

## Record manifest yang diwajibkan
`command_id`, `argv_prefix`, `aliases`, `visibility`, `platforms`, `cli_version`, `source_commit`, `binary_sha256`, `positional_schema`, `flag_schema`, `inherited_flags`, `stdin_modes`, `output_modes`, `interaction_mode`, `execution_scope`, `risk`, `permission_rules`, `implementation_status`, `adapter`, `contract_test_ids`, `scenario_ids`.

## Perhitungan parity
Command parity = implemented canonical public leaf commands / total canonical public leaf commands baseline. Flag parity = tested semantic flag combinations/classes / documented supported semantic classes baseline; laporkan jumlah flag terpetakan terpisah, jangan mengklaim semua kombinasi Cartesian telah dites.

GA gate: 100% command dan flag baseline terpetakan serta seluruh semantic acceptance cases lulus. Alias/help dicatat terpisah. Workflow interaktif dihitung selesai hanya jika user dapat menyelesaikannya melalui companion/UI, bukan sekadar mendapat error atau diminta menjalankan terminal sendiri. Rejected-by-policy bukan missing-adapter, tetapi tetap wajib ada happy-path test dengan principal berhak. Setiap gap memblokir klaim full CLI.

Drift check pada CI membandingkan help snapshot binary terpatok dengan registry. Upgrade baseline memakai PR dengan diff schema, compatibility tests dan dokumentasi migrasi. Versi masa depan tidak didukung diam-diam.
