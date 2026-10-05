# data/

| File | What it is |
|---|---|
| `keywords.csv` | Blog keywords (informational). **The rows here are GENERAL EXAMPLES with made-up numbers** — replace with your real export (Semrush → Keyword Strategy Builder → Export CSV, or let `/keyword-research` build it). |
| `service-keywords.csv` | Money keywords for service pages (service + city), sorted by CPC. Demo numbers too. |
| `publish-log.json` | Every page the skills published, used for the daily publishing limit (`npm run cadence`) and to never reuse a keyword. |

Columns understood (any order, extra columns ignored): `Keyword, Intent, Volume, Keyword Difficulty, CPC (USD), lang`.
Semrush, Ahrefs and hand-made CSVs all work. `lang` (`ar`/`en`) is optional but recommended when you mix languages.
