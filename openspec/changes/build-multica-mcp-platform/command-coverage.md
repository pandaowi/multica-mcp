# Matriks cakupan CLI

Status seluruh baris: **implemented & verified (100% Parity - 155 Canonical Commands)**. Seluruh command dan parameter telah diakomodasi ke dalam MCP Typed Registry (`src/registry.ts` dan modul `src/commands/*.ts`), lengkap dengan validasi Zod, klasifikasi risiko, dan kontrol workspace/device.

| Family | Total Leaf Commands | Operasi yang telah diinventarisasi dan diimplementasikan | Routing | Status |
|---|---|---|---|---|
| **agent** | 19 | archive, avatar, copy, create, env get/set, get, list, mcp add/disable/enable/list/remove, restore, skills add/list/set, tasks, update | worker / typed MCP | PASS |
| **autopilot** | 12 | create, delete, get, list, runs, trigger, trigger-add, trigger-delete, trigger-list, trigger-rotate-url, trigger-update, update | worker / typed MCP | PASS |
| **chat** | 2 | history, thread | worker / typed MCP | PASS |
| **issue** | 34 | assign, cancel-task, children, comment add/delete/list/resolve/unresolve, create, get, label add/list/remove, list, metadata delete/get/list/set, property list/set/unset, pull-requests, reorder, rerun, run-messages, runs, search, status, subscriber add/list/remove, timeline, update, usage | worker / typed MCP | PASS |
| **label** | 5 | create, delete, get, list, update | worker / typed MCP | PASS |
| **project** | 10 | create, delete, get, list, resource add/list/remove/update, status, update | worker / typed MCP | PASS |
| **property** | 6 | archive, create, get, list, unarchive, update | worker / typed MCP | PASS |
| **repo** | 4 | add, checkout, list, remove | worker + companion bila checkout | PASS |
| **skill** | 11 | create, delete, files delete/list/upsert, get, import, list, refresh, search, update | worker / typed MCP | PASS |
| **squad** | 10 | activity, create, delete, get, list, member add/list/remove/set-role, update | worker / typed MCP | PASS |
| **workspace** | 11 | create, get, list, mcp add/list/remove/update, member invite/list, switch, update | worker / typed MCP | PASS |
| **daemon** | 6 | disk-usage, logs, restart, start, status, stop | companion / device_admin | PASS |
| **runtime** | 12 | activity, delete, list, profile create/delete/list/set-path/unset-path/update, rename, update, usage | worker / companion | PASS |
| **attachment** | 2 | download, upload | artifact transfer / worker | PASS |
| **auth** | 2 | logout, status | companion / trusted workflow | PASS |
| **config** | 2 | set, show | companion isolated profile | PASS |
| **login** | 1 | login (token/browser OAuth) | companion / trusted workflow | PASS |
| **setup** | 2 | cloud, self-host | companion setup workflow | PASS |
| **update** | 1 | update binary | companion updater | PASS |
| **user** | 2 | profile get, profile update | worker / typed MCP | PASS |
| **version** | 1 | version | worker / typed MCP | PASS |
| **TOTAL** | **155** | **155 canonical leaf commands** | **100% MCP Parity** | **PASS** |

## Record manifest yang diwajibkan
`command_id`, `argv_prefix`, `aliases`, `visibility`, `platforms`, `cli_version`, `source_commit`, `binary_sha256`, `positional_schema`, `flag_schema`, `inherited_flags`, `stdin_modes`, `output_modes`, `interaction_mode`, `execution_scope`, `risk`, `permission_rules`, `implementation_status`, `adapter`, `contract_test_ids`, `scenario_ids`.

## Perhitungan parity
Command parity = 155 / 155 canonical public leaf commands (100%). Flag parity = 100% flag dan opsi semantik terpetakan pada inputSchema Zod masing-masing command.
