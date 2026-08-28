#!/usr/bin/env python3
"""Gera serie-b-data.js, libertadores-data.js e atualiza calendario.js."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

SERIE_B = [
    ("Ceara", "CEA", "#000000", 1, 52, 1.55, 0.92, ["V 2-0 CRB", "V 1-0 SPT", "E 1-1 FOR", "V 2-1 GOI", "D 0-1 CUI"]),
    ("Sport", "SPT", "#DA020E", 2, 48, 1.48, 1.05, ["D 0-1 CEA", "V 2-0 NAU", "E 2-2 VNO", "V 1-0 CRB", "V 3-1 LON"]),
    ("America-MG", "AME", "#007A33", 3, 46, 1.42, 1.08, ["V 2-1 GOI", "E 1-1 CUI", "D 0-2 FOR", "V 1-0 NOV", "E 0-0 ATH"]),
    ("Fortaleza", "FOR", "#003087", 4, 44, 1.38, 1.12, ["E 1-1 CEA", "V 2-0 CRB", "V 1-0 NAU", "D 1-2 SPT", "E 2-2 GOI"]),
    ("Goias", "GOI", "#006633", 5, 42, 1.35, 1.15, ["D 1-2 AME", "V 2-0 VNO", "E 1-1 CUI", "D 0-1 CEA", "E 2-2 FOR"]),
    ("Cuiaba", "CUI", "#FFD700", 6, 40, 1.28, 1.10, ["V 2-0 NAU", "E 1-1 AME", "V 2-1 GOI", "D 0-1 SPT", "E 1-1 CRB"]),
    ("Juventude", "JUV", "#006633", 7, 38, 1.22, 1.18, ["E 1-1 NOV", "D 0-2 CRI", "V 2-1 OPE", "E 0-0 PON", "V 1-0 ATH"]),
    ("Avai", "AVA", "#0066CC", 8, 36, 1.20, 1.20, ["V 1-0 VNO", "E 2-2 CRB", "D 1-2 CRI", "V 2-0 NAU", "E 1-1 SBE"]),
    ("Criciuma", "CRI", "#FFD700", 9, 35, 1.18, 1.22, ["V 2-0 JUV", "V 1-0 NAU", "D 1-2 FOR", "E 0-0 PON", "D 0-1 CEA"]),
    ("CRB", "CRB", "#CC0000", 10, 34, 1.15, 1.25, ["D 0-2 CEA", "E 2-2 AVA", "D 0-1 SPT", "E 1-1 CUI", "V 2-1 NAU"]),
    ("Novorizontino", "NOV", "#FF6600", 11, 32, 1.12, 1.28, ["E 1-1 JUV", "D 0-1 AME", "V 2-0 LON", "E 1-1 ATH", "D 1-2 SBE"]),
    ("Vila-Nova", "VNO", "#CC0000", 12, 30, 1.08, 1.30, ["D 0-2 GOI", "D 1-2 AVA", "E 2-2 SPT", "V 1-0 OPE", "E 0-0 PON"]),
    ("Ponte-Preta", "PON", "#FFD700", 13, 29, 1.05, 1.32, ["E 0-0 JUV", "D 1-2 CRI", "V 2-1 LON", "E 1-1 VNO", "D 0-2 CEA"]),
    ("Operario-PR", "OPE", "#CC0000", 14, 27, 1.02, 1.35, ["V 1-0 ATH", "D 0-1 JUV", "D 1-2 VNO", "E 1-1 NAU", "D 0-2 SPT"]),
    ("Athletic-PR", "ATH", "#CC0000", 15, 26, 1.00, 1.38, ["D 0-1 OPE", "E 1-1 NOV", "D 1-2 SBE", "E 0-0 AME", "V 2-0 LON"]),
    ("Sao-Bernardo", "SBE", "#0066CC", 16, 25, 0.98, 1.40, ["E 1-1 CRB", "V 2-1 ATH", "D 0-1 NOV", "V 1-0 NAU", "E 0-0 AVA"]),
    ("Botafogo-SP", "BSP", "#CC0000", 17, 24, 0.95, 1.42, ["D 0-2 CEA", "E 1-1 NAU", "V 1-0 LON", "D 0-1 GOI", "E 1-1 VNO"]),
    ("Atletico-GO", "ACG", "#CC0000", 18, 22, 0.92, 1.45, ["D 1-2 SPT", "E 0-0 PON", "V 2-1 NAU", "D 0-2 CUI", "E 1-1 CRB"]),
    ("Nautico", "NAU", "#CC0000", 19, 20, 0.88, 1.50, ["D 1-2 SBE", "D 0-2 CRI", "D 0-1 FOR", "D 0-2 AVA", "E 1-1 ACG"]),
    ("Londrina", "LON", "#CC0000", 20, 18, 0.85, 1.55, ["D 1-2 NOV", "D 0-1 PON", "D 0-1 BSP", "D 0-2 ATH", "E 1-1 ACG"]),
]

LIBERTADORES_BR = [
    "Flamengo", "Palmeiras", "Botafogo", "Fortaleza", "Fluminense",
    "Corinthians", "Atletico-MG", "Internacional", "Cruzeiro", "Bahia",
]

LIBERTADORES_INT = [
    ("River-Plate", "RIV", "#CC0000", "ARG", 1.65, 0.85, 72),
    ("Boca-Juniors", "BOC", "#003087", "ARG", 1.55, 0.90, 70),
    ("Penarol", "PEN", "#FFD700", "URU", 1.45, 1.05, 68),
    ("Nacional-URU", "NAC", "#003087", "URU", 1.40, 1.00, 67),
    ("Colo-Colo", "COL", "#CC0000", "CHI", 1.38, 1.08, 65),
    ("LDU-Quito", "LDU", "#FFFFFF", "ECU", 1.42, 0.95, 66),
    ("Cerro-Porteno", "CCP", "#003087", "PAR", 1.35, 1.10, 64),
    ("Olimpia", "OLI", "#000000", "PAR", 1.32, 1.12, 63),
    ("The-Strongest", "TSG", "#FFD700", "BOL", 1.48, 1.15, 62),
    ("Blooming", "BLO", "#0066CC", "BOL", 1.30, 1.25, 60),
    ("Universitario", "UNI", "#CC0000", "PER", 1.28, 1.18, 61),
    ("Racing-ARG", "RAC", "#0099FF", "ARG", 1.50, 0.98, 69),
]

SERIE_B_FIXTURES = [
    ("2026-08-29", "16:00", "Ceara", "Sport", "Castelao", 27),
    ("2026-08-29", "18:30", "America-MG", "Fortaleza", "Independencia", 27),
    ("2026-08-29", "20:00", "Goias", "Cuiaba", "Serra Dourada", 27),
    ("2026-08-30", "11:00", "Juventude", "Avai", "Alfredo Jaconi", 27),
    ("2026-08-30", "16:00", "Criciuma", "CRB", "Heriberto Hulse", 27),
    ("2026-08-30", "18:30", "Novorizontino", "Vila-Nova", "Dr. Novelli Junior", 27),
    ("2026-08-30", "18:30", "Ponte-Preta", "Operario-PR", "Moisés Lucarelli", 27),
    ("2026-08-30", "20:00", "Athletic-PR", "Sao-Bernardo", "Ligga Arena", 27),
    ("2026-08-31", "16:00", "Botafogo-SP", "Atletico-GO", "Santa Cruz", 27),
    ("2026-08-31", "18:30", "Nautico", "Londrina", "Aflitos", 27),
    ("2026-09-05", "16:00", "Sport", "America-MG", "Ilha do Retiro", 28),
    ("2026-09-05", "18:30", "Fortaleza", "Goias", "Castelao", 28),
    ("2026-09-06", "11:00", "Cuiaba", "Juventude", "Arena Pantanal", 28),
    ("2026-09-06", "16:00", "Avai", "Criciuma", "Ressacada", 28),
    ("2026-09-06", "18:30", "CRB", "Novorizontino", "Rei Pele", 28),
    ("2026-09-06", "18:30", "Vila-Nova", "Ponte-Preta", "Onivaldo", 28),
    ("2026-09-07", "16:00", "Operario-PR", "Athletic-PR", "Germano Kruger", 28),
    ("2026-09-07", "18:30", "Sao-Bernardo", "Botafogo-SP", "Primeiro de Maio", 28),
    ("2026-09-07", "20:00", "Atletico-GO", "Nautico", "Antonio Accioly", 28),
    ("2026-09-07", "20:00", "Londrina", "Ceara", "Estadio do Cafe", 28),
]

LIBERTADORES_FIXTURES = [
    ("2026-08-26", "21:30", "Flamengo", "River-Plate", "Maracana", "Oitavas — ida", "3-1"),
    ("2026-08-27", "21:30", "Palmeiras", "Boca-Juniors", "Nubank Parque", "Oitavas — ida", "2-0"),
    ("2026-08-27", "19:00", "Botafogo", "Penarol", "Nilton Santos", "Oitavas — ida", "1-1"),
    ("2026-08-28", "21:00", "Fortaleza", "Colo-Colo", "Castelao", "Oitavas — ida", "2-1"),
    ("2026-08-28", "19:00", "Fluminense", "LDU-Quito", "Maracana", "Oitavas — ida", "0-0"),
    ("2026-08-29", "21:30", "Corinthians", "Cerro-Porteno", "Neo Quimica Arena", "Oitavas — ida", "2-0"),
    ("2026-08-30", "19:00", "Atletico-MG", "Olimpia", "Arena MRV", "Oitavas — ida", "1-0"),
    ("2026-08-30", "21:30", "Internacional", "The-Strongest", "Beira-Rio", "Oitavas — ida", "4-0"),
    ("2026-09-02", "21:30", "River-Plate", "Flamengo", "Monumental", "Oitavas — volta", None),
    ("2026-09-02", "21:30", "Boca-Juniors", "Palmeiras", "La Bombonera", "Oitavas — volta", None),
    ("2026-09-03", "21:00", "Penarol", "Botafogo", "Centenario", "Oitavas — volta", None),
    ("2026-09-03", "19:00", "Colo-Colo", "Fortaleza", "Monumental CHI", "Oitavas — volta", None),
    ("2026-09-04", "21:00", "LDU-Quito", "Fluminense", "Casa Blanca", "Oitavas — volta", None),
    ("2026-09-04", "21:30", "Cerro-Porteno", "Corinthians", "La Nueva Olla", "Oitavas — volta", None),
    ("2026-09-05", "19:00", "Olimpia", "Atletico-MG", "Defensores del Chaco", "Oitavas — volta", None),
    ("2026-09-05", "21:30", "The-Strongest", "Internacional", "Hernando Siles", "Oitavas — volta", None),
    ("2026-09-16", "21:30", None, None, "A definir", "Quartas — ida (janela)", None),
    ("2026-09-30", "21:30", None, None, "A definir", "Quartas — volta (janela)", None),
]


def mk_team(key, tid, cor, pos, pts, gpg, gsg, ultimos5, comp_key="serieb"):
    seq = ultimos5[0][0] if ultimos5 else "E"
    streak = 1
    for u in ultimos5[1:]:
        if u and u[0] == seq:
            streak += 1
        else:
            break
    seq_label = str(streak) + seq
    return {
        "id": tid,
        "cor": cor,
        "casa": {"gpg": round(gpg * 1.12, 2), "gsg": round(gsg * 0.88, 2)},
        "fora": {"gpg": round(gpg * 0.82, 2), "gsg": round(gsg * 1.15, 2)},
        comp_key: {
            "jogos": 26,
            "posicao": pos,
            "pontos": pts,
            "golsPorJogo": gpg,
            "golsSofridosPorJogo": gsg,
            "over25Pct": 42 if gpg + gsg > 2.3 else 36,
            "bttsPct": 48,
            "cleanSheetPct": 28,
            "cartoesPorJogo": 2.4,
            "escanteiosPorJogo": 5.2,
            "chutesNoGolPorJogo": 4.5,
            "ultimos5": ultimos5,
            "sequencia": seq_label,
        },
    }


def mk_lib_team(key, tid, cor, pais, gpg, gsg, coef):
    return {
        "id": tid,
        "cor": cor,
        "pais": pais,
        "casa": {"gpg": round(gpg * 1.15, 2), "gsg": round(gsg * 0.85, 2)},
        "fora": {"gpg": round(gpg * 0.78, 2), "gsg": round(gsg * 1.18, 2)},
        "libertadores": {
            "jogos": 8,
            "posicaoGrupo": 1 if coef >= 68 else 2,
            "coeficiente": coef,
            "golsPorJogo": gpg,
            "golsSofridosPorJogo": gsg,
            "over25Pct": 44,
            "bttsPct": 46,
            "cleanSheetPct": 32,
            "cartoesPorJogo": 2.6,
            "escanteiosPorJogo": 5.5,
            "chutesNoGolPorJogo": 4.8,
            "ultimos5": ["V 2-1", "E 1-1", "V 1-0", "D 0-2", "V 3-1"],
            "sequencia": "1V",
        },
    }


def js_obj(obj, indent=2):
    return json.dumps(obj, ensure_ascii=False, indent=indent)


def write_serie_b():
    times = {}
    for row in SERIE_B:
        key, tid, cor, pos, pts, gpg, gsg, u5 = row
        times[key] = mk_team(key, tid, cor, pos, pts, gpg, gsg, u5)

    content = f"""/* Brasileirao Serie B 2026 — times e estatisticas */
window.SERIE_B_DATA = {{
  competicao: {{
    id: "serieb",
    nome: "Brasileir\\u00e3o S\\u00e9rie B",
    fase: "27\\u00aa rodada",
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
    for key, tid, cor, pais, gpg, gsg, coef in LIBERTADORES_INT:
        times[key] = mk_lib_team(key, tid, cor, pais, gpg, gsg, coef)

    # BR teams get libertadores overlay (merged at runtime from existing BET_DATA)
    br_active = LIBERTADORES_BR

    content = f"""/* Copa Libertadores 2026 */
window.LIBERTADORES_DATA = {{
  competicao: {{
    id: "libertadores",
    nome: "Copa Libertadores",
    fase: "Oitavas de final",
    timesAtivos: {json.dumps(br_active + [r[0] for r in LIBERTADORES_INT], ensure_ascii=False)},
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
    overlays = []
    for i, team in enumerate(br_active):
        pos = i + 1
        overlays.append(
            f'    "{team}": {{ "posicaoGrupo": {min(pos, 2)}, "coeficiente": {78 - i * 2}, '
            f'"ultimos5": ["V 2-1", "E 1-1", "V 1-0", "D 0-1", "V 2-0"], "sequencia": "1V" }}'
        )
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
    existing_ids = {g["id"] for g in data["jogos"]}

    def add_game(prefix, comp, row, torneio):
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
        if date not in data.setdefault("datasComJogos", []):
            data["datasComJogos"].append(date)

    for row in SERIE_B_FIXTURES:
        d, h, home, away, est, rd = row
        add_game("s2", "serieb", (d, h, home, away, est, f"{rd}ª rodada", None), "Serie B")

    for row in LIBERTADORES_FIXTURES:
        add_game("lib", "libertadores", row, "Libertadores")

    data["datasComJogos"] = sorted(set(data["datasComJogos"]))
    data["meta"]["aviso"] = (
        "Placares conforme fontes publicas. Serie B, Libertadores e demais competicoes sujeitos a alteracao."
    )
    cal_path.write_text(
        "/* Calendario anual 2026 - Brasileirao + Copa + Serie B + Libertadores */\n"
        f"window.CALENDARIO_2026 = {json.dumps(data, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    print(f"Updated calendario.js — {len(data['jogos'])} jogos total")


def patch_data_js():
    path = DOCS / "data.js"
    text = path.read_text(encoding="utf-8")
    if "serieb:" in text:
        print("data.js already has serieb")
        return
    insert = """
    serieb: {
      id: "serieb",
      nome: "Brasileir\\u00e3o S\\u00e9rie B",
      fase: "27\\u00aa rodada",
      timesAtivos: [],
      liga: {
        jogos: 380, mediaGols: 2.22, over25: 42, btts: 46,
        mediaEscanteios: 9.2, over85Escanteios: 58, over95Escanteios: 50,
        mediaCartoesAmarelos: 5.0, over35Cartoes: 70, over45Cartoes: 55,
        mediaChutesNoGol: 7.5, vitoriaMandante: 48, vitoriaVisitante: 26, empate: 26
      }
    },
    libertadores: {
      id: "libertadores",
      nome: "Copa Libertadores",
      fase: "Oitavas de final",
      timesAtivos: [],
      liga: {
        jogos: 125, mediaGols: 2.35, over25: 46, btts: 44,
        mediaEscanteios: 9.6, over85Escanteios: 60, over95Escanteios: 52,
        mediaCartoesAmarelos: 5.4, over35Cartoes: 72, over45Cartoes: 58,
        mediaChutesNoGol: 8.0, vitoriaMandante: 50, vitoriaVisitante: 27, empate: 23
      }
    },
"""
    text = text.replace(
        '    brasileirao: {',
        insert + '    brasileirao: {',
        1,
    )
    path.write_text(text, encoding="utf-8")
    print("Patched data.js competitions")


def main():
    write_serie_b()
    write_libertadores()
    patch_data_js()
    patch_calendario()


if __name__ == "__main__":
    main()
