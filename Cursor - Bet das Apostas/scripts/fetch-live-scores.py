#!/usr/bin/env python3
"""Gera live/scores.json — placares ao vivo e finalizados."""
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

LABELS = {
    "Bayern-Munich": "Bayern Munich", "VfB-Stuttgart": "Stuttgart",
    "Racing": "Racing", "Elche": "Elche", "Alaves": "Alavés", "Villarreal": "Villarreal",
    "Rio-Ave": "Rio Ave", "Sporting-CP": "Sporting CP",
    "Goias": "Goiás", "Sao-Bernardo": "São Bernardo",
    "Novorizontino": "Novorizontino", "Sport": "Sport",
    "Nautico": "Náutico", "Athletic-PR": "Athletic",
}

SPORT_MAP = {
    "premier-league": "soccer_epl",
    "la-liga": "soccer_spain_la_liga",
    "bundesliga": "soccer_germany_bundesliga",
    "primeira-liga": "soccer_portugal_primeira_liga",
    "mls": "soccer_usa_mls",
    "serieb": "soccer_brazil_serie_b",
    "brasileirao": "soccer_brazil_campeonato",
    "libertadores": "soccer_conmebol_copa_libertadores",
}


def lbl(key: str) -> str:
    return LABELS.get(key, key.replace("-", " "))


def load_calendario() -> list:
    raw = (DOCS / "calendario.js").read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    if not m:
        return []
    return json.loads(m.group(1)).get("jogos", [])


def normalize_team(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def parse_placar(placar: str) -> tuple[int, int] | None:
    m = re.match(r"(\d+)\s*[-x×X]\s*(\d+)", str(placar))
    if not m:
        m = re.match(r"(\d+)-(\d+)", str(placar))
    return (int(m.group(1)), int(m.group(2))) if m else None


def score_from_event(event: dict) -> tuple[int, int] | None:
    scores = event.get("scores") or []
    if len(scores) < 2:
        return None
    home_name = normalize_team(event.get("home_team", ""))
    s0 = int(scores[0].get("score") or 0)
    s1 = int(scores[1].get("score") or 0)
    n0 = normalize_team(scores[0].get("name", ""))
    if n0 == home_name or home_name in n0 or n0 in home_name:
        return s0, s1
    return s1, s0


def match_game_to_event(game: dict, events: list) -> dict | None:
    home = normalize_team(game["mandante"])
    away = normalize_team(game["visitante"])
    gdate = game.get("data", "")
    for ev in events:
        eh = normalize_team(ev.get("home_team", ""))
        ea = normalize_team(ev.get("away_team", ""))
        if not ((home in eh or eh in home) and (away in ea or ea in away)):
            continue
        ev_date = (ev.get("commence_time") or "")[:10]
        if ev_date and gdate and ev_date != gdate:
            continue
        return ev
    return None


def fetch_api_scores(sport_key: str, api_key: str) -> list:
    url = (
        f"https://api.the-odds-api.com/v4/sports/{sport_key}/scores/"
        f"?apiKey={api_key}&daysFrom=3"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "BetDaJosi/1.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    now = datetime.now(timezone(timedelta(hours=-3)))
    today = now.date()
    jogos = load_calendario()
    out: dict[str, dict] = {}
    fonte = "calendário"

    # Placares já registrados no calendário (últimos 3 dias + hoje)
    for g in jogos:
        if not g.get("id") or not g.get("placar"):
            continue
        try:
            gd = datetime.strptime(g["data"], "%Y-%m-%d").date()
        except ValueError:
            continue
        if (today - gd).days > 3:
            continue
        parsed = parse_placar(g["placar"])
        if not parsed:
            continue
        out[g["id"]] = {
            "status": "finished",
            "placar": g["placar"],
            "golsCasa": parsed[0],
            "golsFora": parsed[1],
        }

    api_key = os.environ.get("THE_ODDS_API_KEY", "").strip()
    if api_key:
        by_comp: dict[str, list] = {}
        window_start = today - timedelta(days=1)
        window_end = today + timedelta(days=7)
        for g in jogos:
            if not g.get("mandante") or not g.get("visitante"):
                continue
            try:
                gd = datetime.strptime(g["data"], "%Y-%m-%d").date()
            except ValueError:
                continue
            if gd < window_start or gd > window_end:
                continue
            by_comp.setdefault(g.get("comp", ""), []).append(g)

        fetched = 0
        for comp, games in by_comp.items():
            sport = SPORT_MAP.get(comp)
            if not sport:
                continue
            try:
                events = fetch_api_scores(sport, api_key)
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
                print(f"API scores skip {comp}: {exc}")
                continue
            for g in games:
                ev = match_game_to_event(g, events)
                if not ev:
                    continue
                sc = score_from_event(ev)
                if not sc:
                    continue
                status = "finished" if ev.get("completed") else "live"
                entry = {
                    "status": status,
                    "placar": f"{sc[0]}-{sc[1]}",
                    "golsCasa": sc[0],
                    "golsFora": sc[1],
                }
                if not ev.get("completed"):
                    entry["minuto"] = None
                    entry["periodo"] = "Ao vivo"
                out[g["id"]] = entry
                fetched += 1
        if fetched:
            fonte = "the-odds-api.com + calendário"

    payload = {
        "meta": {
            "atualizadoEm": now.isoformat(),
            "fonte": fonte,
            "jogos": len(out),
        },
        "jogos": out,
    }

    LIVE.mkdir(parents=True, exist_ok=True)
    (LIVE / "scores.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote scores.json — {len(out)} jogos ({fonte})")

    mirror = ROOT / "copa-brasil-apostas" / "live"
    mirror.mkdir(parents=True, exist_ok=True)
    (mirror / "scores.json").write_text((LIVE / "scores.json").read_text(encoding="utf-8"), encoding="utf-8")


if __name__ == "__main__":
    main()
