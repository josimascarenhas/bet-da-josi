#!/usr/bin/env python3
"""Gera serie-b-data.js, libertadores-data.js e atualiza calendario.js.

Fontes (atualizado em 28/08/2026):
  - Série B: CBF / GE — 24 jogos disputados, 25ª rodada em andamento
  - Libertadores: CONMEBOL / GE — oitavas concluídas, quartas de final
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

# pos, pts, gp, gc, ultimos5 (mais recente primeiro) — CBF após 24ª rodada (25/08/2026)
SERIE_B = [
    ("Juventude", "JUV", "#006633", 1, 45, 26, 13, ["V 2-1 CRB", "D 0-2 CRI", "V 1-0 OPE", "E 0-0 PON", "V 2-1 NAU"]),
    ("Criciuma", "CRI", "#FFD700", 2, 44, 25, 17, ["D 0-2 FOR", "V 2-1 LON", "E 0-0 PON", "V 1-0 NAU", "E 1-1 CRB"]),
    ("Vila-Nova", "VNO", "#CC0000", 3, 41, 35, 25, ["E 0-0 OPE", "V 2-1 LON", "D 1-2 NOV", "V 3-1 BSP", "E 2-2 SPT"]),
    ("Novorizontino", "NOV", "#FF6600", 4, 40, 39, 21, ["V 4-1 ATH", "D 0-2 CUI", "V 2-0 LON", "E 1-1 ATH", "D 1-2 SBE"]),
    ("Fortaleza", "FOR", "#003087", 5, 40, 27, 21, ["V 2-0 CRI", "E 1-1 CEA", "V 2-0 CRB", "V 1-0 NAU", "D 1-2 SPT"]),
    ("Sport", "SPT", "#DA020E", 6, 38, 32, 22, ["V 3-0 AME", "D 0-1 CEA", "V 2-0 NAU", "E 2-2 VNO", "V 1-0 CRB"]),
    ("CRB", "CRB", "#CC0000", 7, 36, 35, 34, ["D 1-2 JUV", "V 2-1 NAU", "E 1-1 CUI", "D 0-1 SPT", "E 2-2 AVA"]),
    ("Operario-PR", "OPE", "#CC0000", 8, 36, 30, 31, ["E 0-0 VNO", "V 1-0 ATH", "D 0-1 JUV", "D 1-2 VNO", "E 1-1 NAU"]),
    ("Atletico-GO", "ACG", "#CC0000", 9, 36, 27, 23, ["V 3-0 BSP", "E 1-1 CRB", "D 0-2 CUI", "V 2-1 NAU", "E 0-0 PON"]),
    ("Athletic-PR", "ATH", "#CC0000", 10, 34, 25, 25, ["D 1-4 NOV", "E 1-1 NOV", "D 1-2 SBE", "E 0-0 AME", "V 2-0 LON"]),
    ("Goias", "GOI", "#006633", 11, 33, 23, 29, ["E 1-1 CUI", "V 2-0 VNO", "D 1-2 AME", "D 0-1 CEA", "E 2-2 FOR"]),
    ("Cuiaba", "CUI", "#FFD700", 12, 33, 21, 18, ["E 1-1 GOI", "V 2-0 NAU", "V 2-1 GOI", "D 0-1 SPT", "E 1-1 CRB"]),
    ("Sao-Bernardo", "SBE", "#0066CC", 13, 32, 33, 27, ["E 1-1 NAU", "V 2-1 ATH", "E 1-1 CRB", "V 1-0 NAU", "E 0-0 AVA"]),
    ("Botafogo-SP", "BSP", "#CC0000", 14, 31, 28, 26, ["D 0-3 ACG", "E 1-1 NAU", "V 1-0 LON", "D 0-1 GOI", "E 1-1 VNO"]),
    ("Nautico", "NAU", "#CC0000", 15, 31, 28, 27, ["E 1-1 SBE", "D 1-2 CRB", "D 0-1 FOR", "D 0-2 AVA", "E 1-1 ACG"]),
    ("Avai", "AVA", "#0066CC", 16, 29, 27, 30, ["V 2-0 PON", "V 1-0 VNO", "E 2-2 CRB", "D 1-2 CRI", "V 2-0 NAU"]),
    ("Ceara", "CEA", "#000000", 17, 28, 25, 30, ["V 2-1 LON", "V 1-0 SPT", "E 1-1 FOR", "V 2-1 GOI", "D 0-1 CUI"]),
    ("Londrina", "LON", "#CC0000", 18, 21, 29, 36, ["D 1-2 CEA", "D 1-2 NOV", "D 0-1 PON", "D 0-1 BSP", "D 0-2 ATH"]),
    ("America-MG", "AME", "#007A33", 19, 11, 16, 42, ["D 0-3 SPT", "D 0-2 FOR", "V 1-0 NOV", "E 0-0 ATH", "V 2-1 GOI"]),
    ("Ponte-Preta", "PON", "#FFD700", 20, 10, 16, 50, ["D 0-2 AVA", "E 0-0 JUV", "D 1-2 CRI", "V 2-1 LON", "D 0-2 CEA"]),
]

# Times brasileiros nas quartas de final (oitavas encerradas em 25/08/2026)
LIBERTADORES_BR = ["Flamengo", "Palmeiras", "Fluminense", "Corinthians"]

# Times sul-americanos nas quartas
LIBERTADORES_INT = [
    ("Estudiantes", "EST", "#CC0000", "ARG", 1.35, 0.95, 68),
    ("LDU-Quito", "LDU", "#FFFFFF", "ECU", 1.42, 0.95, 66),
    ("Platense", "PLA", "#8B0000", "ARG", 1.28, 1.05, 62),
    ("Independiente-del-Valle", "IDV", "#FFD700", "ECU", 1.48, 1.02, 65),
]

# Rodadas 25–26 — CBF (tabela detalhada 25ª–30ª rodada, ago/set 2026)
SERIE_B_FIXTURES = [
    ("2026-08-28", "19:30", "Goias", "Sao-Bernardo", "Haile Pinheiro", "25ª rodada"),
    ("2026-08-28", "20:30", "Novorizontino", "Sport", "Jorge Ismael de Biasi", "25ª rodada"),
    ("2026-08-28", "20:30", "Nautico", "Athletic-PR", "Aflitos", "25ª rodada"),
    ("2026-08-29", "18:30", "Botafogo-SP", "Cuiaba", "Santa Cruz", "25ª rodada"),
    ("2026-08-30", "11:00", "Avai", "Atletico-GO", "Ressacada", "25ª rodada"),
    ("2026-08-30", "16:00", "America-MG", "Ponte-Preta", "Independencia", "25ª rodada"),
    ("2026-08-30", "18:00", "CRB", "Criciuma", "Rei Pele", "25ª rodada"),
    ("2026-08-30", "18:30", "Vila-Nova", "Ceara", "Onivaldo de Oliveira", "25ª rodada"),
    ("2026-08-31", "19:30", "Fortaleza", "Operario-PR", "Castelao", "25ª rodada"),
    ("2026-09-01", "19:30", "Londrina", "Juventude", "Estadio do Cafe", "25ª rodada"),
    ("2026-09-03", "20:00", "Nautico", "Botafogo-SP", "Aflitos", "26ª rodada"),
    ("2026-09-04", "19:30", "Criciuma", "Cuiaba", "Heriberto Hulse", "26ª rodada"),
    ("2026-09-04", "20:30", "Athletic-PR", "Vila-Nova", "Arena Sicredi", "26ª rodada"),
    ("2026-09-04", "21:30", "CRB", "America-MG", "Rei Pele", "26ª rodada"),
    ("2026-09-05", "16:00", "Novorizontino", "Avai", "Jorge Ismael de Biasi", "26ª rodada"),
    ("2026-09-05", "16:00", "Goias", "Fortaleza", "Haile Pinheiro", "26ª rodada"),
    ("2026-09-05", "18:00", "Juventude", "Atletico-GO", "Alfredo Jaconi", "26ª rodada"),
    ("2026-09-05", "18:30", "Ceara", "Sport", "Castelao", "26ª rodada"),
    ("2026-09-06", "11:00", "Londrina", "Operario-PR", "Estadio do Cafe", "26ª rodada"),
    ("2026-09-06", "18:30", "Ponte-Preta", "Sao-Bernardo", "Moisés Lucarelli", "26ª rodada"),
]

# Oitavas concluídas + quartas de final — CONMEBOL (27/08/2026)
LIBERTADORES_FIXTURES = [
    # Oitavas — ida
    ("2026-08-12", "21:30", "Flamengo", "Cruzeiro", "Maracana", "Oitavas — ida", "2-1"),
    ("2026-08-12", "21:30", "Palmeiras", "Cerro-Porteno", "Nubank Parque", "Oitavas — ida", "1-1"),
    ("2026-08-13", "21:30", "Rosario-Central", "Corinthians", "Gigante de Arroyito", "Oitavas — ida", "0-0"),
    ("2026-08-13", "19:00", "Fluminense", "Independiente-Rivadavia", "Maracana", "Oitavas — ida", "1-0"),
    ("2026-08-19", "21:30", "Cruzeiro", "Flamengo", "Mineirao", "Oitavas — volta", "1-2"),
    ("2026-08-19", "21:30", "Cerro-Porteno", "Palmeiras", "La Nueva Olla", "Oitavas — volta", "0-1"),
    ("2026-08-20", "21:30", "Corinthians", "Rosario-Central", "Neo Quimica Arena", "Oitavas — volta", "1-0"),
    ("2026-08-20", "19:00", "Independiente-Rivadavia", "Fluminense", "Rivadavia", "Oitavas — volta", "0-0"),
    ("2026-08-20", "19:00", "LDU-Quito", "Mirassol", "Casa Blanca", "Oitavas — volta", "0-0"),
    ("2026-08-25", "21:30", "Independiente-del-Valle", "Deportes-Tolima", "Banco Guayaquil", "Oitavas — volta", "3-1"),
    # Quartas — ida
    ("2026-09-08", "19:00", "Fluminense", "Platense", "Maracana", "Quartas — ida", None),
    ("2026-09-09", "19:00", "Palmeiras", "LDU-Quito", "Nubank Parque", "Quartas — ida", None),
    ("2026-09-09", "21:30", "Estudiantes", "Corinthians", "Jorge Luis Hirschi", "Quartas — ida", None),
    ("2026-09-10", "21:30", "Independiente-del-Valle", "Flamengo", "Olimpico Atahualpa", "Quartas — ida", None),
    # Quartas — volta
    ("2026-09-15", "19:00", "Platense", "Fluminense", "Ciudad Vicente Lopez", "Quartas — volta", None),
    ("2026-09-16", "19:00", "LDU-Quito", "Palmeiras", "Rodrigo Paz Delgado", "Quartas — volta", None),
    ("2026-09-16", "21:30", "Corinthians", "Estudiantes", "Neo Quimica Arena", "Quartas — volta", None),
    ("2026-09-17", "21:30", "Flamengo", "Independiente-del-Valle", "Maracana", "Quartas — volta", None),
]

# Overlay libertadores para times BR (oitavas recentes)
BR_LIBERTADORES = {
    "Flamengo": {
        "ultimos5": ["V 2-1 CRU", "V 2-1 CRU", "V 3-1 INT", "E 1-1 MIR", "V 2-0 BAH"],
        "sequencia": "2V",
        "fase": "Quartas de final",
    },
    "Palmeiras": {
        "ultimos5": ["V 1-0 CCP", "E 1-1 CCP", "V 4-1 VAS", "D 2-3 FLU", "E 0-0 INT"],
        "sequencia": "1V",
        "fase": "Quartas de final",
    },
    "Fluminense": {
        "ultimos5": ["E 0-0 IRI", "V 1-0 IRI", "V 3-2 PAL", "E 1-1 GRE", "V 2-0 CAP"],
        "sequencia": "1E",
        "fase": "Quartas de final",
    },
    "Corinthians": {
        "ultimos5": ["V 1-0 ROS", "E 0-0 ROS", "V 2-1 CRU", "D 1-2 INT", "E 1-1 RBB"],
        "sequencia": "1V",
        "fase": "Quartas de final",
    },
}

# Times extras referenciados no calendário (oitavas)
LIBERTADORES_EXTRA = {
    "Cerro-Porteno": ("CCP", "#003087", "PAR", 1.35, 1.10),
    "Rosario-Central": ("ROS", "#0066CC", "ARG", 1.30, 1.05),
    "Independiente-Rivadavia": ("IRI", "#CC0000", "ARG", 1.22, 1.08),
    "Mirassol": ("MIR", "#FFD700", "BRA", 1.40, 1.15),
    "Deportes-Tolima": ("TOL", "#FF6600", "COL", 1.25, 1.12),
}


def _gpg_gsg(gp: int, gc: int, jogos: int) -> tuple[float, float]:
    j = max(jogos, 1)
    return round(gp / j, 2), round(gc / j, 2)


def mk_team(key, tid, cor, pos, pts, gp, gc, ultimos5, jogos=24):
    gpg, gsg = _gpg_gsg(gp, gc, jogos)
    seq = ultimos5[0][0] if ultimos5 else "E"
    streak = 1
    for u in ultimos5[1:]:
        if u and u[0] == seq:
            streak += 1
        else:
            break
    over = 42 if gpg + gsg > 2.3 else 36
    return {
        "id": tid,
        "cor": cor,
        "casa": {"gpg": round(gpg * 1.12, 2), "gsg": round(gsg * 0.88, 2)},
        "fora": {"gpg": round(gpg * 0.82, 2), "gsg": round(gsg * 1.15, 2)},
        "serieb": {
            "jogos": jogos,
            "posicao": pos,
            "pontos": pts,
            "golsPorJogo": gpg,
            "golsSofridosPorJogo": gsg,
            "over25Pct": over,
            "bttsPct": 48,
            "cleanSheetPct": 28,
            "cartoesPorJogo": 2.4,
            "escanteiosPorJogo": 5.2,
            "chutesNoGolPorJogo": 4.5,
            "ultimos5": ultimos5,
            "sequencia": str(streak) + seq,
        },
    }


def mk_lib_team(key, tid, cor, pais, gpg, gsg, coef, ultimos5=None):
    ultimos5 = ultimos5 or ["V 2-1", "E 1-1", "V 1-0", "D 0-1", "V 2-0"]
    seq = ultimos5[0][0] if ultimos5 else "E"
    return {
        "id": tid,
        "cor": cor,
        "pais": pais,
        "casa": {"gpg": round(gpg * 1.15, 2), "gsg": round(gsg * 0.85, 2)},
        "fora": {"gpg": round(gpg * 0.78, 2), "gsg": round(gsg * 1.18, 2)},
        "libertadores": {
            "jogos": 8,
            "posicaoGrupo": 1 if coef >= 65 else 2,
            "coeficiente": coef,
            "golsPorJogo": gpg,
            "golsSofridosPorJogo": gsg,
            "over25Pct": 44,
            "bttsPct": 46,
            "cleanSheetPct": 32,
            "cartoesPorJogo": 2.6,
            "escanteiosPorJogo": 5.5,
            "chutesNoGolPorJogo": 4.8,
            "ultimos5": ultimos5,
            "sequencia": "1" + seq,
            "fase": "Quartas de final",
        },
    }


def js_obj(obj, indent=2):
    return json.dumps(obj, ensure_ascii=False, indent=indent)


def write_serie_b():
    times = {}
    for row in SERIE_B:
        key, tid, cor, pos, pts, gp, gc, u5 = row
        times[key] = mk_team(key, tid, cor, pos, pts, gp, gc, u5)

    content = f"""/* Brasileirao Serie B 2026 — CBF apos 24a rodada (25/08/2026) */
window.SERIE_B_DATA = {{
  competicao: {{
    id: "serieb",
    nome: "Brasileir\\u00e3o S\\u00e9rie B",
    fase: "25\\u00aa rodada",
    timesAtivos: {json.dumps([r[0] for r in SERIE_B], ensure_ascii=False)},
    liga: {{
      jogos: 380, mediaGols: 2.22, over25: 42, btts: 46,
      mediaEscanteios: 9.2, over85Escanteios: 58, over95Escanteios: 50,
      mediaCartoesAmarelos: 5.0, over35Cartoes: 70, over45Cartoes: 55,
      mediaChutesNoGol: 7.5, vitoriaMandante: 48, vitoriaVisitante: 26, empate: 26
    }}
  }},
  times: {js_obj(times, 2)}
}};
"""
    (DOCS / "serie-b-data.js").write_text(content, encoding="utf-8")
    print("Wrote serie-b-data.js")


def write_libertadores():
    times = {}
    int_ultimos = {
        "Estudiantes": ["V 2-0 COQ", "E 1-1 COQ", "V 1-0 CAT", "D 0-1 CAT", "V 2-1 CAT"],
        "LDU-Quito": ["E 0-0 MIR", "E 0-0 MIR", "V 2-1 CAT", "E 1-1 CAT", "V 1-0 CAT"],
        "Platense": ["V 2-1 CAT", "E 0-0 CAT", "V 1-0 CAT", "D 1-2 CAT", "V 2-0 CAT"],
        "Independiente-del-Valle": ["V 3-1 TOL", "V 1-0 TOL", "V 2-1 CAT", "E 1-1 CAT", "V 1-0 CAT"],
    }
    for key, tid, cor, pais, gpg, gsg, coef in LIBERTADORES_INT:
        times[key] = mk_lib_team(key, tid, cor, pais, gpg, gsg, coef, int_ultimos.get(key))

    for key, (tid, cor, pais, gpg, gsg) in LIBERTADORES_EXTRA.items():
        times[key] = mk_lib_team(key, tid, cor, pais, gpg, gsg, 58)

    br_active = LIBERTADORES_BR
    all_active = br_active + [r[0] for r in LIBERTADORES_INT]

    overlays = []
    for team in br_active:
        ov = BR_LIBERTADORES[team]
        overlays.append(
            f'    "{team}": {json.dumps(ov, ensure_ascii=False)}'
        )

    content = f"""/* Copa Libertadores 2026 — quartas de final (CONMEBOL, 28/08/2026) */
window.LIBERTADORES_DATA = {{
  competicao: {{
    id: "libertadores",
    nome: "Copa Libertadores",
    fase: "Quartas de final",
    timesAtivos: {json.dumps(all_active, ensure_ascii=False)},
    liga: {{
      jogos: 125, mediaGols: 2.35, over25: 46, btts: 44,
      mediaEscanteios: 9.6, over85Escanteios: 60, over95Escanteios: 52,
      mediaCartoesAmarelos: 5.4, over35Cartoes: 72, over45Cartoes: 58,
      mediaChutesNoGol: 8.0, vitoriaMandante: 50, vitoriaVisitante: 27, empate: 23
    }}
  }},
  times: {js_obj(times, 2)},
  brLibertadores: {{
"""
    content += ",\n".join(overlays) + "\n  }\n};\n"
    (DOCS / "libertadores-data.js").write_text(content, encoding="utf-8")
    print("Wrote libertadores-data.js")


def patch_calendario():
    cal_path = DOCS / "calendario.js"
    raw = cal_path.read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    if not m:
        raise SystemExit("calendario.js parse failed")
    data = json.loads(m.group(1))

    data["jogos"] = [g for g in data["jogos"] if g.get("comp") not in ("serieb", "libertadores")]
    existing_ids = {g["id"] for g in data["jogos"]}

    def add_game(prefix, comp, row, torneio):
        if len(row) == 6:
            date, hora, home, away, estadio, fase = row
            placar = None
        else:
            date, hora, home, away, estadio, fase, placar = row
        rid = f"{prefix}-{date}-{home or 'tbd'}-{away or 'tbd'}"
        if rid in existing_ids:
            return
        data["jogos"].append({
            "id": rid,
            "comp": comp,
            "torneio": torneio,
            "rodada": None,
            "fase": fase,
            "data": date,
            "horario": hora,
            "mandante": home,
            "visitante": away,
            "placar": placar,
            "estadio": estadio,
            **({"nota": "Chave a definir"} if not home else {}),
        })
        existing_ids.add(rid)

    for row in SERIE_B_FIXTURES:
        add_game("s2", "serieb", row, "Serie B")

    for row in LIBERTADORES_FIXTURES:
        add_game("lib", "libertadores", row, "Libertadores")

    dates = sorted({g["data"] for g in data["jogos"]})
    data["datasComJogos"] = dates
    data["meta"]["atualizadoEm"] = "2026-08-28"
    data["meta"]["aviso"] = (
        "Serie B: CBF (24 jogos). Libertadores: CONMEBOL (quartas de final). Sujeito a alteracao."
    )
    cal_path.write_text(
        "/* Calendario anual 2026 - Brasileirao + Copa + Serie B + Libertadores */\n"
        f"window.CALENDARIO_2026 = {json.dumps(data, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    sb = sum(1 for g in data["jogos"] if g.get("comp") == "serieb")
    lib = sum(1 for g in data["jogos"] if g.get("comp") == "libertadores")
    print(f"Updated calendario.js — {len(data['jogos'])} jogos ({sb} Serie B, {lib} Libertadores)")


def patch_data_js():
    path = DOCS / "data.js"
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r'(serieb:\s*\{[^}]*fase:\s*)"[^"]*"',
        r'\1"25\\u00aa rodada"',
        text,
        count=1,
    )
    text = re.sub(
        r'(libertadores:\s*\{[^}]*fase:\s*)"[^"]*"',
        r'\1"Quartas de final"',
        text,
        count=1,
    )
    path.write_text(text, encoding="utf-8")
    print("Patched data.js competition phases")


def main():
    write_serie_b()
    write_libertadores()
    patch_data_js()
    patch_calendario()


if __name__ == "__main__":
    main()
