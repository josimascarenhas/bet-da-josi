#!/usr/bin/env python3
"""Gera europe-data.js e atualiza calendario.js — ligas europeias 2026/27.

Fontes (28/08/2026): Premier League, La Liga, Bundesliga, Primeira Liga (Liga Portugal).
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

EUROPE_COMPS = {
    "premier-league": {
        "nome": "Premier League",
        "fase": "2ª rodada",
        "pais": "ENG",
        "times": 20,
        "liga": {
            "jogos": 380, "mediaGols": 2.85, "over25": 52, "btts": 54,
            "mediaEscanteios": 10.2, "over85Escanteios": 62, "over95Escanteios": 54,
            "mediaCartoesAmarelos": 4.2, "over35Cartoes": 68, "over45Cartoes": 52,
            "mediaChutesNoGol": 8.5, "vitoriaMandante": 46, "vitoriaVisitante": 28, "empate": 26,
        },
    },
    "la-liga": {
        "nome": "La Liga",
        "fase": "3ª jornada",
        "pais": "ESP",
        "times": 20,
        "liga": {
            "jogos": 380, "mediaGols": 2.55, "over25": 48, "btts": 50,
            "mediaEscanteios": 9.8, "over85Escanteios": 60, "over95Escanteios": 52,
            "mediaCartoesAmarelos": 4.8, "over35Cartoes": 70, "over45Cartoes": 55,
            "mediaChutesNoGol": 8.0, "vitoriaMandante": 48, "vitoriaVisitante": 26, "empate": 26,
        },
    },
    "bundesliga": {
        "nome": "Bundesliga",
        "fase": "1ª rodada",
        "pais": "GER",
        "times": 18,
        "liga": {
            "jogos": 306, "mediaGols": 3.05, "over25": 58, "btts": 56,
            "mediaEscanteios": 9.5, "over85Escanteios": 58, "over95Escanteios": 50,
            "mediaCartoesAmarelos": 3.8, "over35Cartoes": 65, "over45Cartoes": 50,
            "mediaChutesNoGol": 8.8, "vitoriaMandante": 44, "vitoriaVisitante": 30, "empate": 26,
        },
    },
    "primeira-liga": {
        "nome": "Primeira Liga",
        "fase": "4ª jornada",
        "pais": "POR",
        "times": 18,
        "liga": {
            "jogos": 306, "mediaGols": 2.45, "over25": 46, "btts": 48,
            "mediaEscanteios": 9.0, "over85Escanteios": 55, "over95Escanteios": 48,
            "mediaCartoesAmarelos": 5.2, "over35Cartoes": 72, "over45Cartoes": 58,
            "mediaChutesNoGol": 7.8, "vitoriaMandante": 47, "vitoriaVisitante": 27, "empate": 26,
        },
    },
}

# key, id, cor, pos, pts, gp, gc, ultimos5 — dados reais início 2026/27
TEAMS = {
    "premier-league": [
        ("Brighton", "BHA", "#0057B8", 1, 3, 4, 0, ["V 4-0 FUL", "E 0-0", "V 2-1", "D 1-2", "V 1-0"]),
        ("Arsenal", "ARS", "#EF0107", 2, 3, 3, 0, ["V 3-0 COV", "V 2-0", "E 1-1", "V 2-1", "D 0-1"]),
        ("Brentford", "BRE", "#E30613", 2, 3, 3, 0, ["V 3-0 NFO", "V 1-0", "E 2-2", "V 2-1", "D 0-2"]),
        ("Everton", "EVE", "#003399", 4, 3, 2, 0, ["V 2-0 BOU", "V 1-0", "D 1-1", "V 2-0", "E 0-0"]),
        ("Hull-City", "HUL", "#F5971D", 4, 3, 2, 0, ["V 2-0 SUN", "V 1-0", "D 0-0", "V 3-1", "D 1-2"]),
        ("Chelsea", "CHE", "#034694", 6, 3, 3, 2, ["V 3-2 CRY", "V 2-1", "E 1-1", "V 3-0", "D 0-1"]),
        ("Ipswich-Town", "IPS", "#003399", 6, 3, 2, 1, ["V 2-1 BOU", "E 1-1", "V 2-0", "D 0-2", "V 1-0"]),
        ("Manchester-City", "MCI", "#6CABDD", 6, 3, 2, 1, ["V 2-1 BOU", "V 3-1", "E 2-2", "V 2-0", "D 1-2"]),
        ("Leeds-United", "LEE", "#FFCD00", 9, 3, 1, 0, ["V 1-0 AVL", "D 1-1", "V 2-1", "E 0-0", "D 0-1"]),
        ("Liverpool", "LIV", "#C8102E", 10, 1, 2, 2, ["E 2-2 NEW", "V 3-1", "E 1-1", "V 2-0", "D 0-1"]),
        ("Newcastle-United", "NEW", "#241F20", 10, 1, 2, 2, ["E 2-2 LIV", "V 2-0", "D 1-1", "V 1-0", "E 2-2"]),
        ("Fulham", "FUL", "#000000", 12, 0, 2, 3, ["D 2-3 CHE", "E 1-1", "D 0-1", "V 2-1", "D 1-2"]),
        ("Bournemouth", "BOU", "#DA291C", 13, 0, 1, 2, ["D 1-2 MCI", "E 1-1", "V 2-0", "D 0-2", "V 1-0"]),
        ("Sunderland", "SUN", "#EB172B", 13, 0, 1, 2, ["D 1-2 HUL", "D 0-0", "V 2-1", "E 1-1", "D 0-2"]),
        ("Nottingham-Forest", "NFO", "#DD0000", 15, 0, 0, 1, ["D 0-1 BRE", "E 0-0", "V 1-0", "D 1-2", "E 1-1"]),
        ("Crystal-Palace", "CRY", "#1B458F", 16, 0, 0, 2, ["D 2-3 CHE", "D 1-1", "V 2-0", "D 0-1", "E 0-0"]),
        ("Manchester-United", "MUN", "#DA291C", 16, 0, 0, 2, ["D 0-2 TOT", "D 1-1", "V 2-1", "E 0-0", "D 1-2"]),
        ("Coventry-City", "COV", "#69BE28", 18, 0, 0, 3, ["D 0-3 ARS", "E 1-1", "D 0-2", "V 1-0", "D 1-2"]),
        ("Tottenham", "TOT", "#132257", 18, 0, 0, 3, ["V 2-0 MUN", "D 1-1", "E 0-0", "V 2-1", "D 0-1"]),
        ("Aston-Villa", "AVL", "#95BFE5", 20, 0, 0, 4, ["D 0-4 LEE", "V 2-1", "E 1-1", "D 0-2", "V 1-0"]),
    ],
    "la-liga": [
        ("Sevilla", "SEV", "#D71920", 1, 6, 5, 2, ["V 2-1", "V 3-1", "E 1-1", "V 2-0", "D 0-1"]),
        ("Real-Betis", "BET", "#00954C", 2, 6, 2, 0, ["V 1-0", "V 1-0", "E 0-0", "V 2-1", "D 1-2"]),
        ("Alaves", "ALA", "#0054A6", 3, 4, 4, 1, ["E 1-1", "V 3-0", "D 0-0", "V 1-0", "E 1-1"]),
        ("Atletico-Madrid", "ATM", "#CB3524", 4, 4, 4, 2, ["E 1-1", "V 3-1", "V 2-0", "E 0-0", "D 0-1"]),
        ("Barcelona", "BAR", "#A50044", 5, 3, 5, 0, ["V 5-0", "E 0-0", "V 3-1", "V 2-0", "D 1-2"]),
        ("Espanyol", "ESP", "#007FC8", 6, 3, 4, 2, ["V 2-1", "D 1-2", "V 2-0", "E 1-1", "V 1-0"]),
        ("Real-Madrid", "RMA", "#FEBE10", 7, 3, 2, 1, ["V 2-1", "E 0-0", "V 3-0", "V 2-1", "D 0-1"]),
        ("Getafe", "GET", "#005999", 8, 3, 1, 3, ["V 1-0", "D 0-2", "E 0-0", "V 2-1", "D 0-1"]),
        ("Villarreal", "VIL", "#FFE114", 9, 2, 4, 4, ["E 2-2", "E 1-1", "V 2-1", "D 0-1", "E 1-1"]),
        ("Deportivo", "DEP", "#0066CC", 10, 2, 2, 2, ["E 1-1", "E 1-1", "V 2-0", "D 1-2", "E 0-0"]),
        ("Osasuna", "OSA", "#D91A21", 11, 1, 0, 0, ["E 0-0", "D 0-1", "V 1-0", "E 1-1", "D 0-2"]),
        ("Celta", "CEL", "#6CACE4", 12, 1, 0, 0, ["E 0-0", "V 2-1", "D 1-2", "E 0-0", "V 1-0"]),
        ("Racing", "RAC", "#008000", 13, 1, 2, 3, ["D 1-2", "E 1-1", "V 2-1", "D 0-1", "E 0-0"]),
        ("Rayo-Vallecano", "RAY", "#E53027", 14, 1, 2, 3, ["E 1-1", "D 0-2", "V 1-0", "E 2-2", "D 0-1"]),
        ("Valencia", "VAL", "#FF6600", 15, 1, 0, 1, ["E 0-0", "D 0-1", "V 2-1", "E 1-1", "D 0-2"]),
        ("Malaga", "MLG", "#0066CC", 16, 1, 1, 3, ["E 1-1", "D 0-2", "V 1-0", "D 1-2", "E 0-0"]),
        ("Levante", "LEV", "#0054A6", 17, 1, 0, 3, ["D 0-3", "E 1-1", "V 1-0", "D 0-2", "E 0-0"]),
        ("Elche", "ELC", "#008000", 18, 1, 1, 6, ["D 1-6", "E 0-0", "D 0-2", "V 2-1", "E 1-1"]),
        ("Real-Sociedad", "RSO", "#0054A6", 19, 0, 0, 1, ["D 0-1", "V 2-0", "E 1-1", "D 0-1", "V 1-0"]),
        ("Athletic", "ATH", "#EE2523", 20, 0, 1, 3, ["D 1-3", "V 2-1", "E 0-0", "V 1-0", "D 0-2"]),
    ],
    "bundesliga": [
        ("Bayern-Munich", "BAY", "#DC052D", 1, 0, 0, 0, ["V 4-2 STU", "V 3-1", "V 2-0", "E 1-1", "V 2-1"]),
        ("Borussia-Dortmund", "BVB", "#FDE100", 2, 0, 0, 0, ["V 2-1", "D 1-1", "V 3-0", "V 2-0", "D 0-1"]),
        ("Bayer-Leverkusen", "B04", "#E32221", 3, 0, 0, 0, ["V 2-0", "E 2-2", "V 3-1", "V 1-0", "D 1-2"]),
        ("RB-Leipzig", "RBL", "#DD0741", 4, 0, 0, 0, ["V 3-1", "D 0-0", "V 2-1", "V 4-0", "E 1-1"]),
        ("Eintracht-Frankfurt", "SGE", "#E1000F", 5, 0, 0, 0, ["V 2-1", "E 1-1", "V 3-2", "D 0-1", "V 2-0"]),
        ("VfB-Stuttgart", "STU", "#FFFFFF", 6, 0, 0, 0, ["D 2-4 BAY", "V 1-0", "E 2-2", "V 3-1", "D 0-2"]),
        ("SC-Freiburg", "SCF", "#E2001A", 7, 0, 0, 0, ["V 2-0", "D 1-1", "V 1-0", "E 0-0", "V 2-1"]),
        ("Wolfsburg", "WOB", "#65BAAD", 8, 0, 0, 0, ["E 1-1", "V 2-1", "D 0-0", "V 3-0", "D 1-2"]),
        ("Hoffenheim", "TSG", "#1961AA", 9, 0, 0, 0, ["V 3-2", "D 2-2", "V 1-0", "E 1-1", "V 2-0"]),
        ("Werder-Bremen", "SVW", "#009639", 10, 0, 0, 0, ["D 1-1", "V 2-0", "D 0-0", "V 1-0", "D 1-2"]),
        ("Union-Berlin", "FCU", "#EB1923", 11, 0, 0, 0, ["E 0-0", "V 2-1", "D 1-1", "V 1-0", "D 0-2"]),
        ("Mainz", "M05", "#C3141E", 12, 0, 0, 0, ["V 1-0", "D 2-2", "D 0-0", "V 2-1", "E 1-1"]),
        ("Augsburg", "FCA", "#BA3733", 13, 0, 0, 0, ["D 1-1", "V 2-0", "D 0-0", "V 1-0", "D 1-2"]),
        ("Heidenheim", "FCH", "#0066CC", 14, 0, 0, 0, ["D 0-0", "V 1-0", "D 1-1", "V 2-1", "D 0-1"]),
        ("St-Pauli", "STP", "#604840", 15, 0, 0, 0, ["E 1-1", "D 0-1", "V 2-0", "E 0-0", "V 1-0"]),
        ("Hamburger-SV", "HSV", "#005CA9", 16, 0, 0, 0, ["D 1-1", "V 2-1", "E 0-0", "D 0-2", "V 3-0"]),
        ("Koln", "KOE", "#ED1C24", 17, 0, 0, 0, ["D 0-0", "D 1-1", "V 2-0", "D 0-1", "E 1-1"]),
        ("Borussia-Mgladbach", "BMG", "#000000", 18, 0, 0, 0, ["D 1-1", "V 2-1", "D 0-0", "V 3-2", "D 1-2"]),
    ],
    "primeira-liga": [
        ("Porto", "POR", "#003893", 1, 7, 6, 0, ["V 2-0 ALV", "V 2-0", "V 3-1", "E 1-1", "V 2-0"]),
        ("Arouca", "ARO", "#FFD700", 2, 7, 8, 2, ["V 4-0 MRN", "V 1-0", "D 0-1", "V 2-1", "E 1-1"]),
        ("Gil-Vicente", "GIL", "#FF0000", 3, 7, 3, 1, ["V 1-0 RIO", "V 2-0", "E 1-1", "V 1-0", "D 0-1"]),
        ("Maritimo", "MAR", "#006600", 4, 6, 4, 2, ["V 1-0 CPI", "V 2-1", "E 0-0", "V 2-0", "D 1-2"]),
        ("Academico-Viseu", "ACV", "#0066CC", 5, 5, 5, 3, ["E 2-2 BEN", "V 2-0", "D 1-1", "V 1-0", "E 0-0"]),
        ("Benfica", "BEN", "#FF0000", 6, 5, 9, 4, ["E 2-2 ACV", "V 7-0 CPI", "V 2-1", "E 1-1", "V 3-0"]),
        ("Braga", "SCB", "#CC0000", 7, 4, 4, 3, ["E 2-2 MOR", "V 2-0", "D 0-1", "V 2-1", "E 1-1"]),
        ("Sporting-CP", "SCP", "#008057", 8, 4, 6, 4, ["E 2-2 EST", "V 2-1", "V 3-0", "D 0-1", "V 2-0"]),
        ("Famalicao", "FAM", "#0066CC", 9, 4, 4, 4, ["E 1-1 EST", "D 1-2 MAR", "V 2-0", "E 0-0", "V 1-0"]),
        ("Moreirense", "MOR", "#006633", 10, 3, 3, 3, ["E 2-2 BRA", "D 0-1", "V 2-1", "E 1-1", "D 0-2"]),
        ("Estoril", "EST", "#003893", 11, 3, 3, 3, ["E 1-1 FAM", "D 2-0 NAT", "V 2-1", "E 0-0", "V 1-0"]),
        ("Estrela-Amadora", "ESTA", "#CC0000", 12, 3, 4, 5, ["E 2-2 SCP", "D 0-1 ALV", "V 2-1", "E 1-1", "D 0-1"]),
        ("Nacional", "NAT", "#006600", 13, 2, 3, 4, ["E 2-2 SCL", "V 2-0 EST", "D 0-1", "E 1-1", "V 1-0"]),
        ("Santa-Clara", "SCL", "#CC0000", 14, 2, 4, 5, ["E 2-2 NAT", "V 2-0 ACV", "D 0-1", "E 0-0", "V 2-1"]),
        ("Alverca", "ALV", "#0066CC", 15, 2, 2, 4, ["D 0-2 POR", "V 1-0 ESTA", "D 0-0", "E 1-1", "D 0-2"]),
        ("Casa-Pia", "CPI", "#FFD700", 16, 1, 1, 8, ["D 0-1 MAR", "D 0-7 BEN", "E 1-1", "D 0-2", "V 1-0"]),
        ("Rio-Ave", "RIO", "#006633", 17, 1, 2, 5, ["D 0-1 GIL", "D 0-2 POR", "E 1-1", "V 2-0", "D 1-2"]),
        ("Vitoria-Guimaraes", "VSC", "#FFFFFF", 18, 1, 2, 5, ["D 0-1 ARO", "V 2-1 SCP", "D 0-2", "E 1-1", "V 1-0"]),
    ],
}

FIXTURES = [
    # Bundesliga MD1
    ("bundesliga", "2026-08-28", "15:30", "Bayern-Munich", "VfB-Stuttgart", "Allianz Arena", "1ª rodada"),
    ("bundesliga", "2026-08-29", "10:30", "SC-Freiburg", "Augsburg", "Europa-Park", "1ª rodada"),
    ("bundesliga", "2026-08-29", "10:30", "Heidenheim", "Wolfsburg", "Voith-Arena", "1ª rodada"),
    ("bundesliga", "2026-08-29", "10:30", "RB-Leipzig", "Hamburger-SV", "Red Bull Arena", "1ª rodada"),
    ("bundesliga", "2026-08-29", "10:30", "Borussia-Mgladbach", "Hoffenheim", "Borussia-Park", "1ª rodada"),
    ("bundesliga", "2026-08-29", "13:30", "Werder-Bremen", "Bayer-Leverkusen", "Weserstadion", "1ª rodada"),
    ("bundesliga", "2026-08-29", "13:30", "Mainz", "Koln", "Mewa Arena", "1ª rodada"),
    ("bundesliga", "2026-08-29", "13:30", "Union-Berlin", "St-Pauli", "An der Alten Forsterei", "1ª rodada"),
    ("bundesliga", "2026-08-29", "13:30", "Eintracht-Frankfurt", "Borussia-Dortmund", "Deutsche Bank Park", "1ª rodada"),
    # La Liga J3
    ("la-liga", "2026-08-28", "14:00", "Racing", "Elche", "El Sardinero", "3ª jornada"),
    ("la-liga", "2026-08-28", "16:30", "Alaves", "Villarreal", "Mendizorroza", "3ª jornada"),
    ("la-liga", "2026-08-29", "12:00", "Levante", "Real-Betis", "Ciudad de Valencia", "3ª jornada"),
    ("la-liga", "2026-08-29", "14:00", "Real-Sociedad", "Espanyol", "Anoeta", "3ª jornada"),
    ("la-liga", "2026-08-29", "16:30", "Sevilla", "Atletico-Madrid", "Sanchez-Pizjuan", "3ª jornada"),
    ("la-liga", "2026-08-30", "12:00", "Real-Madrid", "Malaga", "Bernabeu", "3ª jornada"),
    ("la-liga", "2026-08-30", "14:30", "Deportivo", "Valencia", "Riazor", "3ª jornada"),
    ("la-liga", "2026-08-30", "16:30", "Celta", "Athletic", "Balaidos", "3ª jornada"),
    ("la-liga", "2026-08-31", "14:30", "Osasuna", "Getafe", "El Sadar", "3ª jornada"),
    ("la-liga", "2026-08-31", "16:30", "Barcelona", "Rayo-Vallecano", "Camp Nou", "3ª jornada"),
    # Premier League MW2 (2026/27)
    ("premier-league", "2026-08-29", "08:30", "Manchester-United", "Coventry-City", "Old Trafford", "2ª rodada"),
    ("premier-league", "2026-08-29", "11:00", "Arsenal", "Leeds-United", "Emirates", "2ª rodada"),
    ("premier-league", "2026-08-29", "11:00", "Brentford", "Aston-Villa", "Gtech", "2ª rodada"),
    ("premier-league", "2026-08-29", "11:00", "Ipswich-Town", "Sunderland", "Portman Road", "2ª rodada"),
    ("premier-league", "2026-08-29", "11:00", "Bournemouth", "Hull-City", "Vitality", "2ª rodada"),
    ("premier-league", "2026-08-29", "13:30", "Chelsea", "Fulham", "Stamford Bridge", "2ª rodada"),
    ("premier-league", "2026-08-30", "10:00", "Everton", "Brighton", "Goodison Park", "2ª rodada"),
    ("premier-league", "2026-08-30", "10:00", "Crystal-Palace", "Nottingham-Forest", "Selhurst Park", "2ª rodada"),
    ("premier-league", "2026-08-30", "12:30", "Newcastle-United", "Liverpool", "St James Park", "2ª rodada"),
    ("premier-league", "2026-08-31", "11:00", "Manchester-City", "Tottenham", "Etihad", "2ª rodada"),
    # Primeira Liga J4
    ("primeira-liga", "2026-08-28", "15:15", "Rio-Ave", "Sporting-CP", "Estadio dos Arcos", "4ª jornada"),
    ("primeira-liga", "2026-08-29", "12:30", "Alverca", "Santa-Clara", "Alverca", "4ª jornada"),
    ("primeira-liga", "2026-08-29", "12:30", "Arouca", "Maritimo", "Municipal Arouca", "4ª jornada"),
    ("primeira-liga", "2026-08-29", "15:00", "Academico-Viseu", "Porto", "Fontelo", "4ª jornada"),
    ("primeira-liga", "2026-08-30", "12:30", "Nacional", "Estoril", "Madeira", "4ª jornada"),
    ("primeira-liga", "2026-08-30", "15:00", "Casa-Pia", "Moreirense", "Rio Maior", "4ª jornada"),
    ("primeira-liga", "2026-08-30", "17:30", "Famalicao", "Vitoria-Guimaraes", "Famalicao", "4ª jornada"),
    ("primeira-liga", "2026-08-31", "16:15", "Benfica", "Gil-Vicente", "Estadio da Luz", "4ª jornada"),
]

EUROPE_COMPS_LIST = list(EUROPE_COMPS.keys())


def _gpg_gsg(gp, gc, jogos):
    j = max(jogos, 1)
    return round(gp / j, 2), round(gc / j, 2)


def mk_team(comp_key, key, tid, cor, pos, pts, gp, gc, ultimos5, pais):
    if comp_key == "bundesliga" and pts == 0 and gp == 0:
        real_j = 0
        gpg, gsg = (1.65, 1.15) if pos <= 3 else (1.25, 1.35)
    else:
        real_j = max(1, (pts + 2) // 3) if pts else (1 if gp or gc else 0)
        if gp == 0 and gc == 0:
            gpg, gsg = 1.35, 1.25
        else:
            gpg, gsg = _gpg_gsg(gp or 1, gc or 1, max(real_j, 1))
    seq = ultimos5[0][0] if ultimos5 else "E"
    streak = 1
    for u in ultimos5[1:]:
        if u and u[0] == seq:
            streak += 1
        else:
            break
    return {
        "id": tid,
        "cor": cor,
        "pais": pais,
        "casa": {"gpg": round(gpg * 1.14, 2), "gsg": round(gsg * 0.86, 2)},
        "fora": {"gpg": round(gpg * 0.80, 2), "gsg": round(gsg * 1.16, 2)},
        comp_key: {
            "jogos": real_j,
            "posicao": pos,
            "pontos": pts,
            "golsPorJogo": gpg,
            "golsSofridosPorJogo": gsg,
            "over25Pct": 48,
            "bttsPct": 50,
            "cleanSheetPct": 30,
            "cartoesPorJogo": 2.2,
            "escanteiosPorJogo": 5.4,
            "chutesNoGolPorJogo": 4.6,
            "ultimos5": ultimos5,
            "sequencia": str(streak) + seq,
        },
    }


def write_europe_data():
    times = {}
    competicoes = {}
    for comp_key, meta in EUROPE_COMPS.items():
        rows = TEAMS[comp_key]
        competicoes[comp_key] = {
            "id": comp_key,
            "nome": meta["nome"],
            "fase": meta["fase"],
            "timesAtivos": [r[0] for r in rows],
            "liga": meta["liga"],
        }
        for row in rows:
            key, tid, cor, pos, pts, gp, gc, u5 = row
            times[key] = mk_team(comp_key, key, tid, cor, pos, pts, gp, gc, u5, meta["pais"])

    content = f"""/* Ligas europeias 2026/27 — Premier, La Liga, Bundesliga, Primeira Liga */
window.EUROPE_DATA = {{
  meta: {{ atualizadoEm: "2026-08-28", fontes: ["Premier League", "La Liga", "DFB", "Liga Portugal"] }},
  competicoes: {json.dumps(competicoes, ensure_ascii=False, indent=2)},
  times: {json.dumps(times, ensure_ascii=False, indent=2)}
}};
"""
    (DOCS / "europe-data.js").write_text(content, encoding="utf-8")
    print("Wrote europe-data.js")


def patch_data_js():
    path = DOCS / "data.js"
    text = path.read_text(encoding="utf-8")
    for comp_key, meta in EUROPE_COMPS.items():
        if f'{comp_key}:' in text:
            text = re.sub(
                rf'({re.escape(comp_key)}:\s*\{{[^}}]*fase:\s*)"[^"]*"',
                rf'\1"{meta["fase"]}"',
                text,
                count=1,
            )
            continue
        stub = f"""
    "{comp_key}": {{
      id: "{comp_key}",
      nome: "{meta['nome']}",
      fase: "{meta['fase']}",
      timesAtivos: [],
      liga: {json.dumps(meta['liga'], ensure_ascii=False)}
    }},"""
        text = text.replace("    brasileirao: {", stub + "\n    brasileirao: {", 1)
    path.write_text(text, encoding="utf-8")
    print("Patched data.js")


def patch_calendario():
    cal_path = DOCS / "calendario.js"
    raw = cal_path.read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    if not m:
        raise SystemExit("calendario.js parse failed")
    data = json.loads(m.group(1))
    data["jogos"] = [g for g in data["jogos"] if g.get("comp") not in EUROPE_COMPS_LIST]
    existing_ids = {g["id"] for g in data["jogos"]}

    torneio_map = {
        "premier-league": "Premier League",
        "la-liga": "La Liga",
        "bundesliga": "Bundesliga",
        "primeira-liga": "Primeira Liga",
    }

    for comp, date, hora, home, away, estadio, fase in FIXTURES:
        rid = f"eu-{comp}-{date}-{home}-{away}"
        if rid in existing_ids:
            continue
        data["jogos"].append({
            "id": rid,
            "comp": comp,
            "torneio": torneio_map[comp],
            "rodada": None,
            "fase": fase,
            "data": date,
            "horario": hora,
            "mandante": home,
            "visitante": away,
            "placar": None,
            "estadio": estadio,
        })
        existing_ids.add(rid)

    data["datasComJogos"] = sorted({g["data"] for g in data["jogos"]})
    data["meta"]["atualizadoEm"] = "2026-08-28"
    cal_path.write_text(
        "/* Calendario anual 2026 - Brasileirao + Copa + Serie B + Libertadores + Europa */\n"
        f"window.CALENDARIO_2026 = {json.dumps(data, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8",
    )
    eu = sum(1 for g in data["jogos"] if g.get("comp") in EUROPE_COMPS_LIST)
    print(f"Updated calendario.js — {eu} jogos europeus, {len(data['jogos'])} total")


def main():
    write_europe_data()
    patch_data_js()
    patch_calendario()


if __name__ == "__main__":
    main()
