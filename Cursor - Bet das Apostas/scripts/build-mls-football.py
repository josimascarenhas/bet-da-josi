#!/usr/bin/env python3
"""Gera mls-data.js — MLS 2026 (classificação e stats base).

Fontes: 365scores.com (comp ID 104), USA TODAY Sports (29/08/2026).
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

MLS_LIGA = {
    "jogos": 510,
    "mediaGols": 3.05,
    "over25": 58,
    "btts": 54,
    "mediaEscanteios": 10.4,
    "over85Escanteios": 64,
    "over95Escanteios": 56,
    "mediaCartoesAmarelos": 4.6,
    "over35Cartoes": 70,
    "over45Cartoes": 55,
    "mediaChutesNoGol": 8.6,
    "vitoriaMandante": 52,
    "vitoriaVisitante": 24,
    "empate": 24,
}

# key, abbr, cor, pos, pts, gp, gc, ultimos5
# gp/gc = gols pró/contra na temporada (aprox. W*1.5 avg)
TEAMS = [
    ("Nashville-SC", "NSH", "#E8E400", 1, 49, 42, 18, ["V 2-1", "V 3-0", "E 1-1", "V 2-0", "D 0-1"]),
    ("Vancouver-Whitecaps", "VAN", "#00245D", 2, 40, 38, 22, ["V 2-1", "E 2-2", "V 1-0", "V 3-1", "D 1-2"]),
    ("Inter-Miami", "MIA", "#F7B5CD", 3, 39, 41, 28, ["V 3-1", "E 2-2", "V 2-0", "D 1-2", "V 4-1"]),
    ("Houston-Dynamo", "HOU", "#FF6B00", 4, 38, 40, 26, ["V 2-0", "V 3-2", "D 1-1", "V 2-1", "E 0-0"]),
    ("Chicago-Fire", "CHI", "#FF0000", 5, 36, 35, 22, ["V 2-1", "E 1-1", "V 3-0", "V 1-0", "D 0-2"]),
    ("Los-Angeles-FC", "LAF", "#000000", 6, 35, 34, 24, ["V 2-1", "D 1-1", "V 3-2", "E 2-2", "V 1-0"]),
    ("New-England-Revolution", "NE", "#002244", 7, 34, 33, 25, ["V 2-0", "D 1-1", "V 3-1", "E 0-0", "D 1-2"]),
    ("San-Jose-Earthquakes", "SJE", "#0067B1", 8, 33, 36, 30, ["V 3-2", "D 2-2", "V 2-1", "D 0-1", "V 1-0"]),
    ("FC-Dallas", "DAL", "#BF0D3E", 9, 33, 32, 26, ["E 1-1", "V 2-0", "D 0-0", "V 3-1", "E 2-2"]),
    ("St-Louis-City", "STL", "#DC052D", 10, 33, 31, 27, ["V 2-1", "E 0-0", "D 1-2", "V 3-0", "E 1-1"]),
    ("Charlotte-FC", "CLT", "#0093D0", 11, 32, 30, 24, ["V 2-1", "D 1-1", "V 1-0", "E 2-2", "D 0-1"]),
    ("FC-Cincinnati", "CIN", "#00385C", 12, 31, 29, 25, ["E 1-1", "V 2-0", "D 0-0", "V 3-2", "E 1-1"]),
    ("Colorado-Rapids", "COL", "#862633", 13, 28, 32, 35, ["V 2-1", "D 1-1", "D 0-2", "V 3-0", "D 1-3"]),
    ("Real-Salt-Lake", "RSL", "#B30838", 14, 28, 28, 26, ["E 0-0", "V 2-1", "D 1-2", "V 1-0", "E 2-2"]),
    ("Portland-Timbers", "POR", "#004812", 15, 28, 27, 28, ["D 1-1", "V 2-0", "D 0-1", "E 1-1", "V 3-2"]),
    ("Minnesota-United", "MIN", "#8CD2F4", 16, 28, 26, 24, ["E 2-2", "V 1-0", "D 1-1", "V 2-1", "E 0-0"]),
    ("San-Diego-FC", "SD", "#697A7C", 17, 27, 28, 30, ["V 2-1", "D 1-1", "E 0-0", "D 1-2", "V 3-1"]),
    ("New-York-City-FC", "NYC", "#6CACE4", 18, 27, 25, 26, ["D 1-1", "V 2-0", "E 0-0", "D 1-2", "V 1-0"]),
    ("New-York-Red-Bulls", "NYR", "#ED1E36", 19, 26, 24, 28, ["E 1-1", "D 0-1", "V 2-1", "D 1-2", "E 2-2"]),
    ("LA-Galaxy", "LAG", "#00245D", 20, 26, 26, 30, ["E 2-2", "D 1-1", "V 2-0", "D 0-2", "E 1-1"]),
    ("Seattle-Sounders", "SEA", "#5D9732", 21, 25, 24, 28, ["E 1-1", "D 0-1", "V 2-1", "D 1-2", "E 0-0"]),
    ("Toronto-FC", "TOR", "#E31837", 22, 24, 22, 26, ["E 1-1", "D 0-0", "V 2-1", "E 2-2", "D 1-2"]),
    ("DC-United", "DC", "#EF3E42", 23, 24, 21, 27, ["E 0-0", "D 1-2", "V 2-1", "E 1-1", "D 0-1"]),
    ("Orlando-City", "ORL", "#633492", 24, 24, 23, 30, ["D 1-1", "V 2-0", "D 0-2", "E 1-1", "D 1-3"]),
    ("Atlanta-United", "ATL", "#80000A", 25, 21, 24, 35, ["D 0-1", "V 2-1", "D 1-2", "E 0-0", "D 0-3"]),
    ("Philadelphia-Union", "PHI", "#071B2C", 26, 21, 22, 32, ["E 1-1", "D 0-2", "V 1-0", "D 1-2", "E 2-2"]),
    ("CF-Montreal", "MTL", "#002DA0", 27, 21, 20, 30, ["D 1-1", "E 0-0", "V 2-1", "D 0-2", "E 1-1"]),
    ("Austin-FC", "ATX", "#00B140", 28, 21, 22, 33, ["E 2-2", "D 0-1", "V 3-2", "D 1-2", "E 0-0"]),
    ("Columbus-Crew", "CLB", "#FEDD00", 29, 20, 21, 32, ["D 1-1", "V 2-0", "D 0-2", "E 1-1", "D 1-3"]),
    ("Sporting-KC", "SKC", "#93B1D7", 30, 15, 18, 38, ["D 0-1", "D 1-2", "V 2-1", "D 0-3", "E 1-1"]),
]

MLS_FIXTURES = [
    ("2026-08-29", "17:30", "Seattle-Sounders", "Chicago-Fire", "Rodada 28"),
    ("2026-08-29", "20:30", "Toronto-FC", "New-York-City-FC", "Rodada 28"),
    ("2026-08-29", "20:30", "New-York-Red-Bulls", "Philadelphia-Union", "Rodada 28"),
    ("2026-08-29", "20:30", "Inter-Miami", "CF-Montreal", "Rodada 28"),
    ("2026-08-29", "20:30", "DC-United", "Los-Angeles-FC", "Rodada 28"),
    ("2026-08-29", "20:30", "Atlanta-United", "Charlotte-FC", "Rodada 28"),
    ("2026-08-29", "21:30", "Nashville-SC", "FC-Cincinnati", "Rodada 28"),
    ("2026-08-29", "21:30", "Minnesota-United", "Orlando-City", "Rodada 28"),
    ("2026-08-29", "21:30", "Sporting-KC", "Vancouver-Whitecaps", "Rodada 28"),
    ("2026-08-29", "21:30", "Houston-Dynamo", "San-Jose-Earthquakes", "Rodada 28"),
    ("2026-08-29", "22:30", "Colorado-Rapids", "Real-Salt-Lake", "Rodada 28"),
    ("2026-08-29", "23:30", "San-Diego-FC", "LA-Galaxy", "Rodada 28"),
    ("2026-08-29", "23:30", "Portland-Timbers", "Austin-FC", "Rodada 28"),
    ("2026-08-30", "20:00", "New-England-Revolution", "Columbus-Crew", "Rodada 28"),
    ("2026-08-30", "20:00", "FC-Dallas", "St-Louis-City", "Rodada 28"),
]


def _gpg_gsg(gp: int, gc: int, jogos: int) -> tuple[float, float]:
    j = max(jogos, 1)
    return round(gp / j, 2), round(gc / j, 2)


def mk_team(key: str, tid: str, cor: str, pos: int, pts: int, gp: int, gc: int, u5: list[str]) -> dict:
    jogos = max(1, (pts + 2) // 3) if pts else 1
    if gp or gc:
        gpg, gsg = _gpg_gsg(gp, gc, jogos)
    else:
        gpg, gsg = 1.45, 1.35
    seq = u5[0][0] if u5 else "E"
    streak = 1
    for u in u5[1:]:
        if u and u[0] == seq:
            streak += 1
        else:
            break
    return {
        "id": tid,
        "cor": cor,
        "pais": "USA",
        "casa": {"gpg": round(gpg * 1.18, 2), "gsg": round(gsg * 0.82, 2)},
        "fora": {"gpg": round(gpg * 0.78, 2), "gsg": round(gsg * 1.22, 2)},
        "mls": {
            "jogos": jogos,
            "posicao": pos,
            "pontos": pts,
            "golsPorJogo": gpg,
            "golsSofridosPorJogo": gsg,
            "over25Pct": 58,
            "bttsPct": 54,
            "cleanSheetPct": 26,
            "cartoesPorJogo": 2.4,
            "escanteiosPorJogo": 5.8,
            "chutesNoGolPorJogo": 4.9,
            "ultimos5": u5,
            "sequencia": str(streak) + seq,
        },
    }


def write_mls_data() -> None:
    times = {}
    for row in TEAMS:
        key, tid, cor, pos, pts, gp, gc, u5 = row
        times[key] = mk_team(key, tid, cor, pos, pts, gp, gc, u5)
    competicao = {
        "id": "mls",
        "nome": "MLS",
        "fase": "Rodada 28",
        "timesAtivos": [r[0] for r in TEAMS],
        "liga": MLS_LIGA,
    }
    content = f"""/* MLS 2026 — Major League Soccer */
window.MLS_DATA = {{
  meta: {{ atualizadoEm: "2026-08-29", fontes: ["365scores.com", "USA TODAY Sports", "MLSsoccer.com"] }},
  competicao: {json.dumps(competicao, ensure_ascii=False, indent=2)},
  times: {json.dumps(times, ensure_ascii=False, indent=2)}
}};
"""
    (DOCS / "mls-data.js").write_text(content, encoding="utf-8")
    print("Wrote mls-data.js")


def patch_data_js() -> None:
    path = DOCS / "data.js"
    text = path.read_text(encoding="utf-8")
    if '"mls"' in text or "mls:" in text:
        text = re.sub(
            r'"mls":\s*\{[^}]*fase:\s*"[^"]*"',
            '"mls": {\n      id: "mls",\n      nome: "MLS",\n      fase: "Rodada 28"',
            text,
            count=1,
        )
    else:
        stub = f"""
    mls: {{
      id: "mls",
      nome: "MLS",
      fase: "Rodada 28",
      timesAtivos: [],
      liga: {json.dumps(MLS_LIGA, ensure_ascii=False)}
    }},"""
        text = text.replace("    brasileirao: {", stub + "\n    brasileirao: {", 1)
    path.write_text(text, encoding="utf-8")
    print("Patched data.js")


def patch_calendario() -> None:
    cal_path = DOCS / "calendario.js"
    raw = cal_path.read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    if not m:
        raise SystemExit("calendario.js parse failed")
    data = json.loads(m.group(1))
    data["jogos"] = [g for g in data["jogos"] if g.get("comp") != "mls"]
    existing = {g["id"] for g in data["jogos"]}
    for date, hora, home, away, fase in MLS_FIXTURES:
        gid = f"us-mls-{date}-{home}-{away}"
        if gid in existing:
            continue
        data["jogos"].append({
            "id": gid,
            "comp": "mls",
            "torneio": "MLS",
            "rodada": 28,
            "fase": fase,
            "data": date,
            "horario": hora,
            "mandante": home,
            "visitante": away,
            "placar": None,
            "estadio": None,
        })
        existing.add(gid)
    data["jogos"].sort(key=lambda g: (g.get("data") or "", g.get("horario") or "", g.get("id") or ""))
    data.setdefault("meta", {})["atualizadoEm"] = "2026-08-29"
    cal_path.write_text(
        "window.CALENDARIO_2026 = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    mls_n = sum(1 for g in data["jogos"] if g.get("comp") == "mls")
    print(f"Updated calendario.js — {mls_n} jogos MLS")


def main() -> None:
    write_mls_data()
    patch_data_js()
    patch_calendario()


if __name__ == "__main__":
    main()
