#!/usr/bin/env python3
"""Atualiza placares de jogos finalizados e recalcula estatísticas dos times."""
from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
LIVE = DOCS / "live"
MIRROR = ROOT / "copa-brasil-apostas" / "live"

COMPS = (
    "brasileirao", "serieb", "libertadores", "copa",
    "premier-league", "la-liga", "bundesliga", "primeira-liga",
)

LEAGUE_AVG = {
    "brasileirao": 1.24, "serieb": 1.11, "libertadores": 1.18, "copa": 1.07,
    "premier-league": 1.43, "la-liga": 1.28, "bundesliga": 1.53, "primeira-liga": 1.23,
}

SPORT_MAP = {
    "premier-league": "soccer_epl",
    "la-liga": "soccer_spain_la_liga",
    "bundesliga": "soccer_germany_bundesliga",
    "primeira-liga": "soccer_portugal_primeira_liga",
    "serieb": "soccer_brazil_serie_b",
    "brasileirao": "soccer_brazil_campeonato",
    "libertadores": "soccer_conmebol_copa_libertadores",
}


def load_calendario() -> list:
    raw = (DOCS / "calendario.js").read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    return json.loads(m.group(1)).get("jogos", []) if m else []


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


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


def fetch_api_scores(sport_key: str, api_key: str, days_from: int = 7) -> list:
    url = (
        f"https://api.the-odds-api.com/v4/sports/{sport_key}/scores/"
        f"?apiKey={api_key}&daysFrom={days_from}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "BetDaJosi/1.0"})
    with urllib.request.urlopen(req, timeout=25) as resp:
        return json.loads(resp.read().decode("utf-8"))


def opp_abbr(name: str) -> str:
    parts = re.split(r"[-\s]", name)
    if len(parts) >= 2:
        return (parts[0][:3] + parts[1][:2]).upper()[:5]
    return name[:3].upper()


def result_label(is_home: bool, gf: int, ga: int, opp: str) -> str:
    letter = "V" if gf > ga else ("E" if gf == ga else "D")
    if is_home:
        return f"{letter} {gf}-{ga} {opp_abbr(opp)}"
    return f"{letter} {gf}-{ga}"


def sequencia_from(ultimos5: list[str]) -> str:
    if not ultimos5:
        return ""
    last = ultimos5[-1]
    letter = last[0] if last else "E"
    n = 1
    for i in range(len(ultimos5) - 2, -1, -1):
        if ultimos5[i] and ultimos5[i][0] == letter:
            n += 1
        else:
            break
    return f"{n}{letter}"


def estimate_xg(gpg: float, league: str) -> float:
    avg = LEAGUE_AVG.get(league, 1.2)
    return round(gpg * 0.72 + avg * 0.28, 2)


def split_stats(games: list[dict], team: str) -> dict:
    home_g, home_gs, away_g, away_gs = [], [], [], []
    for g in games:
        if g["mandante"] == team:
            home_g.append(g["gf"])
            home_gs.append(g["ga"])
        else:
            away_g.append(g["gf"])
            away_gs.append(g["ga"])
    def avg(xs):
        return round(sum(xs) / len(xs), 2) if xs else None

    out = {}
    if home_g:
        out["casa"] = {
            "j": len(home_g),
            "gpg": avg(home_g),
            "gsg": avg(home_gs),
        }
    if away_g:
        out["fora"] = {
            "j": len(away_g),
            "gpg": avg(away_g),
            "gsg": avg(away_gs),
        }
    return out


def compute_team_comp_stats(team: str, comp: str, games: list[dict]) -> dict | None:
    if not games:
        return None
    gf_list, ga_list = [], []
    over25, btts, clean = 0, 0, 0
    ultimos5_raw: list[str] = []

    for g in games:
        gf, ga = g["gf"], g["ga"]
        is_home = g["mandante"] == team
        opp = g["visitante"] if is_home else g["mandante"]
        gf_list.append(gf)
        ga_list.append(ga)
        total = gf + ga
        if total >= 3:
            over25 += 1
        if gf > 0 and ga > 0:
            btts += 1
        if ga == 0:
            clean += 1
        ultimos5_raw.append(result_label(is_home, gf, ga, opp))

    n = len(games)
    gpg = round(sum(gf_list) / n, 2)
    gsg = round(sum(ga_list) / n, 2)
    ultimos5 = ultimos5_raw[-5:]

    stats = {
        "jogos": n,
        "golsPorJogo": gpg,
        "golsSofridosPorJogo": gsg,
        "over25Pct": round(over25 / n * 100),
        "bttsPct": round(btts / n * 100),
        "cleanSheetPct": round(clean / n * 100),
        "ultimos5": ultimos5,
        "sequencia": sequencia_from(ultimos5),
        "xGporJogo": estimate_xg(gpg, comp),
        "xGSporJogo": estimate_xg(gsg, comp),
    }
    stats.update(split_stats(games, team))
    return stats


def build_scores_map(jogos: list, api_key: str) -> tuple[dict, str]:
    now = datetime.now(timezone(timedelta(hours=-3)))
    today = now.date()
    out: dict[str, dict] = {}
    fonte = "calendário"

    for g in jogos:
        if not g.get("id") or not g.get("placar"):
            continue
        parsed = parse_placar(g["placar"])
        if not parsed:
            continue
        out[g["id"]] = {
            "status": "finished",
            "placar": g["placar"],
            "golsCasa": parsed[0],
            "golsFora": parsed[1],
            "data": g.get("data"),
            "comp": g.get("comp"),
        }

    if api_key:
        by_comp: dict[str, list] = defaultdict(list)
        window_start = today - timedelta(days=14)
        for g in jogos:
            if not g.get("mandante") or not g.get("visitante"):
                continue
            try:
                gd = datetime.strptime(g["data"], "%Y-%m-%d").date()
            except ValueError:
                continue
            if gd < window_start or gd > today + timedelta(days=1):
                continue
            by_comp[g.get("comp", "")].append(g)

        fetched = 0
        for comp, games in by_comp.items():
            sport = SPORT_MAP.get(comp)
            if not sport:
                continue
            try:
                events = fetch_api_scores(sport, api_key, days_from=7)
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
                print(f"API scores skip {comp}: {exc}")
                continue
            for g in games:
                ev = match_game_to_event(g, events)
                if not ev or not ev.get("completed"):
                    continue
                sc = score_from_event(ev)
                if not sc:
                    continue
                placar = f"{sc[0]}-{sc[1]}"
                out[g["id"]] = {
                    "status": "finished",
                    "placar": placar,
                    "golsCasa": sc[0],
                    "golsFora": sc[1],
                    "data": g.get("data"),
                    "comp": g.get("comp"),
                    "fonte": "api",
                }
                fetched += 1
        if fetched:
            fonte = "calendário + the-odds-api.com"

    return out, fonte


def effective_placar(g: dict, scores: dict) -> str | None:
    patch = scores.get(g.get("id", ""))
    if patch and patch.get("placar"):
        return patch["placar"]
    return g.get("placar")


def collect_finished_games(jogos: list, scores: dict) -> list[dict]:
    finished = []
    for g in jogos:
        if not g.get("mandante") or not g.get("visitante"):
            continue
        placar = effective_placar(g, scores)
        if not placar:
            continue
        parsed = parse_placar(placar)
        if not parsed:
            continue
        hc, ac = parsed
        finished.append({
            **g,
            "placar": placar,
            "golsCasa": hc,
            "golsFora": ac,
        })
    return finished


def build_team_stats(finished: list[dict]) -> dict[str, dict]:
    by_team_comp: dict[str, dict[str, list]] = defaultdict(lambda: defaultdict(list))

    for g in finished:
        comp = g.get("comp", "brasileirao")
        if comp not in COMPS:
            continue
        hc, ac = g["golsCasa"], g["golsFora"]
        home, away = g["mandante"], g["visitante"]
        by_team_comp[home][comp].append({
            "data": g["data"], "mandante": home, "visitante": away,
            "gf": hc, "ga": ac,
        })
        by_team_comp[away][comp].append({
            "data": g["data"], "mandante": home, "visitante": away,
            "gf": ac, "ga": hc,
        })

    times_patch: dict[str, dict] = {}
    for team, comps in by_team_comp.items():
        patch: dict = {}
        for comp, games in comps.items():
            games.sort(key=lambda x: x["data"])
            stats = compute_team_comp_stats(team, comp, games)
            if stats:
                patch[comp] = stats
        if patch:
            times_patch[team] = patch
    return times_patch


def merge_football(existing: dict, times_patch: dict, meta: dict) -> dict:
    base = existing if existing else {"meta": {}, "times": {}}
    base.setdefault("meta", {})
    base.setdefault("times", {})
    for team, patch in times_patch.items():
        if team not in base["times"]:
            base["times"][team] = {}
        for comp, stats in patch.items():
            base["times"][team].setdefault(comp, {})
            base["times"][team][comp].update(stats)
    base["meta"].update(meta)
    return base


def write_live(name: str, payload: dict) -> None:
    text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    LIVE.mkdir(parents=True, exist_ok=True)
    (LIVE / name).write_text(text, encoding="utf-8")
    MIRROR.mkdir(parents=True, exist_ok=True)
    (MIRROR / name).write_text(text, encoding="utf-8")


def main():
    now = datetime.now(timezone(timedelta(hours=-3)))
    jogos = load_calendario()
    api_key = os.environ.get("THE_ODDS_API_KEY", "").strip()

    scores, fonte_scores = build_scores_map(jogos, api_key)
    finished = collect_finished_games(jogos, scores)
    times_patch = build_team_stats(finished)

    existing_foot = load_json(LIVE / "football.json")
    meta = {
        "atualizadoEm": now.strftime("%Y-%m-%dT%H:%M:%S-03:00"),
        "fonte": "resultados + recálculo estatístico",
        "jogosFinalizados": len(finished),
        "timesAtualizados": len(times_patch),
        "placaresFonte": fonte_scores,
    }
    football = merge_football(existing_foot, times_patch, meta)

    scores_payload = {
        "meta": {
            "atualizadoEm": now.isoformat(),
            "fonte": fonte_scores,
            "jogos": len(scores),
            "finalizadosTotal": len(finished),
        },
        "jogos": scores,
    }

    results_payload = {
        "meta": {
            "atualizadoEm": now.isoformat(),
            "fonte": "calendário + placares ao vivo",
            "ultimosFinalizados": min(30, len(finished)),
        },
        "ultimos": [
            {
                "id": g["id"],
                "data": g["data"],
                "comp": g.get("comp"),
                "mandante": g["mandante"],
                "visitante": g["visitante"],
                "placar": g["placar"],
            }
            for g in sorted(finished, key=lambda x: x["data"], reverse=True)[:30]
        ],
    }

    write_live("scores.json", scores_payload)
    write_live("football.json", football)
    write_live("results.json", results_payload)

    print(
        f"Updated results — {len(scores)} placares, {len(times_patch)} times, "
        f"{len(finished)} jogos finalizados ({fonte_scores})"
    )


if __name__ == "__main__":
    main()
