#!/usr/bin/env python3
"""Gera live/odds.json — odds de mercado (API ou referência consolidada)."""
from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
LIVE = DOCS / "live"

# Odds de referência consolidada (28/08/2026) — substituídas quando THE_ODDS_API_KEY estiver definida
REFERENCE_ODDS = {
    "eu-bundesliga-2026-08-28-Bayern-Munich-VfB-Stuttgart": {
        "Bayern Munich (1)": 1.42, "Empate (X)": 4.80, "Stuttgart (2)": 6.50,
        "Over 2.5": 1.55, "Under 2.5": 2.35, "Sim (BTTS)": 1.72, "Nao": 2.05,
    },
    "eu-la-liga-2026-08-28-Racing-Elche": {
        "Racing (1)": 1.95, "Empate (X)": 3.40, "Elche (2)": 3.80,
        "Over 2.5": 2.10, "Under 2.5": 1.68, "Sim (BTTS)": 1.85, "Nao": 1.90,
    },
    "eu-la-liga-2026-08-28-Alaves-Villarreal": {
        "Alavés (1)": 2.75, "Empate (X)": 3.30, "Villarreal (2)": 2.50,
        "Over 2.5": 1.95, "Under 2.5": 1.80, "Sim (BTTS)": 1.70, "Nao": 2.05,
    },
    "eu-primeira-liga-2026-08-28-Rio-Ave-Sporting-CP": {
        "Rio Ave (1)": 5.50, "Empate (X)": 4.00, "Sporting CP (2)": 1.55,
        "Over 2.5": 1.65, "Under 2.5": 2.15, "Sim (BTTS)": 1.80, "Nao": 1.95,
    },
    "s2-2026-08-28-Goias-Sao-Bernardo": {
        "Goiás (1)": 2.05, "Empate (X)": 3.10, "São Bernardo (2)": 3.60,
        "Over 2.5": 2.20, "Under 2.5": 1.62, "Sim (BTTS)": 1.95, "Nao": 1.78,
    },
    "s2-2026-08-28-Novorizontino-Sport": {
        "Novorizontino (1)": 2.30, "Empate (X)": 3.00, "Sport (2)": 3.10,
        "Over 2.5": 2.05, "Under 2.5": 1.72, "Sim (BTTS)": 1.82, "Nao": 1.92,
    },
    "s2-2026-08-28-Nautico-Athletic-PR": {
        "Náutico (1)": 2.15, "Empate (X)": 3.05, "Athletic (2)": 3.40,
        "Over 2.5": 2.15, "Under 2.5": 1.65, "Sim (BTTS)": 1.88, "Nao": 1.86,
    },
}

LABELS = {
    "Bayern-Munich": "Bayern Munich", "VfB-Stuttgart": "Stuttgart",
    "Racing": "Racing", "Elche": "Elche", "Alaves": "Alavés", "Villarreal": "Villarreal",
    "Rio-Ave": "Rio Ave", "Sporting-CP": "Sporting CP",
    "Goias": "Goiás", "Sao-Bernardo": "São Bernardo",
    "Novorizontino": "Novorizontino", "Sport": "Sport",
    "Nautico": "Náutico", "Athletic-PR": "Athletic",
}


def lbl(key: str) -> str:
    return LABELS.get(key, key.replace("-", " "))


SPORT_MAP = {
    "premier-league": "soccer_epl",
    "la-liga": "soccer_spain_la_liga",
    "bundesliga": "soccer_germany_bundesliga",
    "primeira-liga": "soccer_portugal_primeira_liga",
}


def load_calendario() -> list:
    raw = (DOCS / "calendario.js").read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    if not m:
        return []
    return json.loads(m.group(1)).get("jogos", [])


def fetch_api_odds(sport_key: str, api_key: str) -> list:
    url = (
        f"https://api.the-odds-api.com/v4/sports/{sport_key}/odds"
        f"?apiKey={api_key}&regions=eu&markets=h2h,totals,btts&oddsFormat=decimal"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "BetDaJosi/1.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def normalize_team(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def match_game_to_api(game: dict, api_events: list) -> dict | None:
    home = normalize_team(game["mandante"])
    away = normalize_team(game["visitante"])
    for ev in api_events:
        eh = normalize_team(ev.get("home_team", ""))
        ea = normalize_team(ev.get("away_team", ""))
        if (home in eh or eh in home) and (away in ea or ea in away):
            return ev
    return None


def parse_api_markets(event: dict, home_key: str, away_key: str) -> dict:
    home_label, away_label = lbl(home_key), lbl(away_key)
    out = {}
    for book in event.get("bookmakers", [])[:3]:
        for market in book.get("markets", []):
            key = market.get("key")
            for o in market.get("outcomes", []):
                name = o.get("name", "")
                price = o.get("price")
                if not price:
                    continue
                if key == "h2h":
                    if name == event.get("home_team"):
                        out[home_label + " (1)"] = price
                    elif name == event.get("away_team"):
                        out[away_label + " (2)"] = price
                    elif name == "Draw":
                        out["Empate (X)"] = price
                elif key == "totals":
                    pt = o.get("point")
                    if name == "Over" and pt == 2.5:
                        out["Over 2.5"] = price
                    if name == "Under" and pt == 2.5:
                        out["Under 2.5"] = price
                elif key == "btts":
                    if name == "Yes":
                        out["Sim (BTTS)"] = price
                    if name == "No":
                        out["Nao"] = price
        if out:
            break
    return out


def main():
    today = datetime.now(timezone(timedelta(hours=-3))).strftime("%Y-%m-%d")
    jogos = [g for g in load_calendario() if g.get("data") == today and g.get("mandante") and not g.get("placar")]

    out_jogos = dict(REFERENCE_ODDS)
    fonte = "referência consolidada (casas EU)"
    api_key = os.environ.get("THE_ODDS_API_KEY", "").strip()

    if api_key:
        fetched = 0
        by_comp: dict[str, list] = {}
        for g in jogos:
            by_comp.setdefault(g.get("comp", ""), []).append(g)
        for comp, games in by_comp.items():
            sport = SPORT_MAP.get(comp)
            if not sport:
                continue
            try:
                events = fetch_api_odds(sport, api_key)
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
                print(f"API odds skip {comp}: {exc}")
                continue
            for g in games:
                ev = match_game_to_api(g, events)
                if not ev:
                    continue
                mercados = parse_api_markets(ev, g["mandante"], g["visitante"])
                if mercados:
                    out_jogos[g["id"]] = mercados
                    fetched += 1
        if fetched:
            fonte = "the-odds-api.com"

    payload = {
        "meta": {
            "atualizadoEm": datetime.now(timezone(timedelta(hours=-3))).isoformat(),
            "fonte": fonte,
            "jogosHoje": len(jogos),
        },
        "jogos": out_jogos,
    }

    LIVE.mkdir(parents=True, exist_ok=True)
    (LIVE / "odds.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote odds.json — {len(out_jogos)} jogos ({fonte})")

    mirror = ROOT / "copa-brasil-apostas" / "live"
    mirror.mkdir(parents=True, exist_ok=True)
    (mirror / "odds.json").write_text((LIVE / "odds.json").read_text(encoding="utf-8"), encoding="utf-8")


if __name__ == "__main__":
    main()
