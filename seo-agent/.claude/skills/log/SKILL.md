---
name: log
description: Write one entry to the agent's own Notion work log after a command finishes (audit, fix, check, blog, service, keywords, tech-seo, voice, publish, build-site, new-project). Write-only; separate from any other Notion page. Use automatically at the end of every agent command, or when the user types /log.
---

# /log — Notion work log (write-only)

1. Read `agent.json` → `notionLog`. If `enabled` is false or the Notion connector is not available, skip silently and mention it once in the reply.
2. Create **one** page in the data source `notionLog.dataSource` (Notion `create-pages` with `parent: {data_source_id}`), properties:
   - `المهمة`: short title in Arabic, e.g. "فحص متجر MalFun" / "مقال: Textilstifte fixieren"
   - `date:التاريخ:start`: today (YYYY-MM-DD), `date:التاريخ:is_datetime`: 0
   - `المشروع`: project name from `project.json` (add it as a new option if missing — the select accepts new values)
   - `الأمر`: the command, e.g. `/audit`
   - `النتيجة`: `تم` · `ينتظر قرارك` (needs the user: missing facts, approval, a connector) · `فشل`
   - `الملخص`: 1–3 sentences in Arabic: what was done + the key numbers (score, errors fixed, word count)
   - `الخطوة الجاية`: the one next action, and who does it
   - `الملفات`: repo paths of the reports/drafts created
3. Never write to, update or read other Notion pages or databases (the OpenSEO page stays untouched).
