## 1. Baseline dan keputusan awal
- [ ] 1.1 Pilih versi CLI/tag/commit/checksum dan OS baseline; catat provenance.
- [ ] 1.2 Crawl help tree dan source registration; hasilkan manifest command/flag/alias/platform lengkap.
- [ ] 1.3 Verifikasi credential bootstrap CLI dalam sandbox tanpa token argv atau log.
- [ ] 1.4 Pilih IdP, hosting, residency, Node LTS dan versi SDK terkunci.
- [ ] 1.5 Uji agy/Codex stdio dan HTTP/OAuth; tetapkan versi client dan fallback bridge.

## 2. Core dan registry
- [ ] 2.1 Bangun schema registry, search/describe dan typed dispatcher tanpa raw shell.
- [ ] 2.2 Bangun executor absolute-path, environment allowlist, parser dan limits.
- [ ] 2.3 Implementasikan identity context, connection/workspace validation dan policy engine.
- [ ] 2.4 Implementasikan direct tools dari schema yang sama; contract-test parity direct/dispatcher.
- [ ] 2.5 Tambahkan pagination, streaming bounded, error envelope dan output artifacts.

## 3. Seluruh adapter CLI
- [ ] 3.1 Implementasikan agent lifecycle, env, skills, MCP, avatar dan tasks; uji create di dua workspace.
- [ ] 3.2 Implementasikan issue CRUD, assignment, status, hierarchy, comments dan run operations.
- [ ] 3.3 Implementasikan subscriber, metadata, labels dan properties.
- [ ] 3.4 Implementasikan project/resources, workspace/member/MCP dan user profile.
- [ ] 3.5 Implementasikan skill/files/labels, squads/members/activity.
- [ ] 3.6 Implementasikan autopilot, run history, schedule dan webhook triggers.
- [ ] 3.7 Implementasikan runtime/profile dan repo operations.
- [ ] 3.8 Implementasikan attachment, chat, help/completion, format dan global option mapping.
- [ ] 3.9 Tutup command/flag tambahan hasil manifest; pastikan tidak ada planned/missing adapter sebelum GA.

## 4. Local companion dan onboarding
- [ ] 4.1 Implementasikan stdio local mode dan profile isolation.
- [ ] 4.2 Implementasikan pairing, device keys, outbound channel, scoped grants, replay prevention dan revoke.
- [ ] 4.3 Implementasikan auth/login/setup/config melalui trusted UI dengan secret references.
- [ ] 4.4 Implementasikan daemon lifecycle/logs/disk, checkout, local paths dan signed updater.
- [ ] 4.5 Implementasikan path sandbox dan transfer artifact dengan expiry dan ownership.
- [ ] 4.6 Sediakan onboarding agy/Codex dan bridge untuk gateway; uji usability <= 5 menit median.

## 5. Gateway multi-user
- [ ] 5.1 Implementasikan OAuth protected-resource discovery, PKCE, token validation dan OIDC integration.
- [ ] 5.2 Implementasikan vault/KMS, credential provisioning dan rotation/revocation.
- [ ] 5.3 Implementasikan DB isolation/RLS dan cache key per identity/workspace.
- [ ] 5.4 Implementasikan isolated workers tanpa host mounts/socket/metadata access.
- [ ] 5.5 Implementasikan quota/fairness, dispatch dan authorization recheck sebelum execution.
- [ ] 5.6 Implementasikan control plane admin terpisah dari MCP data plane dengan RBAC tenant-scoped.
- [ ] 5.7 Implementasikan organization/membership/role lifecycle dan bootstrap platform admin yang diaudit.
- [ ] 5.8 Implementasikan workspace modes `deny_all`, `single`, `allowlist`, `all_authorized`; gunakan deny-by-default.
- [ ] 5.9 Implementasikan command allow/deny/require-approval, risk ceiling, quota, retention dan policy versioning.
- [ ] 5.10 Implementasikan connection/device approval, revoke, organization suspension dan queued-job re-evaluation.
- [ ] 5.11 Implementasikan admin audit search/export redacted tanpa secret export atau impersonation.

## 6. Safety dan reliability
- [ ] 6.1 Implementasikan risk classification, read-only dan trusted approval hash-bound.
- [ ] 6.2 Implementasikan jobs, idempotency conflict, outcome_unknown dan reconciliation.
- [ ] 6.3 Implementasikan cancellation, partial batch outcome dan reconnect cursor.
- [ ] 6.4 Implementasikan redacted audit/tracing, retention cleanup dan export tenant-scoped.
- [ ] 6.5 Implementasikan SSRF/redirect/DNS controls dan endpoint enrollment.

## 7. Verifikasi dan rilis
- [ ] 7.1 Buat protocol test harness/MCP Inspector suite sehingga server dapat diuji tanpa agy atau Codex.
- [ ] 7.2 Buat component tests dengan fake CLI/API, vault, policy, worker dan companion; tambahkan secret-canary assertions.
- [ ] 7.3 Buat staging integration tests terhadap CLI baseline dan workspace/principal fixtures.
- [ ] 7.4 Buat client interoperability smoke tests untuk agy/Codex pada versi yang dicatat.
- [ ] 7.5 Buat matriks klasifikasi kegagalan: protocol, schema/policy, adapter/Multica, transport/auth, companion, client compatibility.
- [ ] 7.6 Buat tes untuk setiap skenario delta spec dan petakan requirement ke test IDs.
- [ ] 7.6a Uji RBAC/IDOR control plane, deny-overrides, policy re-evaluation, role escalation dan secret non-exportability.
- [ ] 7.7 Uji isolation concurrency, IDOR, approval replay, injection, path escape dan secret canary.
- [ ] 7.8 Uji kegagalan setelah write, worker crash, companion offline, revocation dan recovery.
- [ ] 7.9 Jalankan load 100 sesi/20 command, ukur latency, fairness dan resource limits.
- [ ] 7.10 Jalankan client matrix agy/Codex pada OS supported termasuk flow interaktif.
- [ ] 7.11 Audit dependency/license, SBOM, checksum/provenance dan rollback artifacts.
- [ ] 7.12 Terbitkan coverage report 100%, limitations, onboarding, runbook dan release evidence.
- [ ] 7.13 Review penerimaan; baru archive OpenSpec change setelah implementasi terbukti selesai.
