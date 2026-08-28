#!/usr/bin/env python3
"""Atualiza placares de jogos finalizados e recalcula estatísticas dos times."""
from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
LIVE = DOCS / "live"
MIRROR = ROOT / "copa-brasil-apostas" / "live"
UA = "Mozilla/5.0 (compatible; BetDaJosi/1.0; +https://josimascarenhas.github.io/bet-da-josi/)"

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

TEAM_ALIASES: dict[str, list[str]] = {
    "palmeiras": ["palmeiras"],
    "santos": ["santos"],
    "flamengo": ["flamengo"],
    "corinthians": ["corinthians"],
    "sao-paulo": ["saopaulo", "sãopaulo", "spfc"],
    "internacional": ["internacional", "inter"],
    "gremio": ["gremio", "grêmio"],
    "atletico-mg": ["atleticomg", "atléticomg", "galo"],
    "cruzeiro": ["cruzeiro"],
    "vasco": ["vasco"],
    "vitoria": ["vitoria", "vitória", "vit"],
    "bahia": ["bahia"],
    "botafogo": ["botafogo"],
    "fluminense": ["fluminense", "flu"],
    "goias": ["goias", "goiás"],
    "sport": ["sport"],
    "nautico": ["nautico", "náutico"],
    "novorizontino": ["novorizontino"],
    "athletic-pr": ["athletic", "athletico"],
    "sao-bernardo": ["saobernardo", "sãobernardo"],
    "bayern-munich": ["bayern", "bayernmunich"],
    "vfb-stuttgart": ["stuttgart"],
    "racing": ["racing"],
    "elche": ["elche"],
    "alaves": ["alaves", "alavés"],
    "villarreal": ["villarreal"],
    "rio-ave": ["rioave"],
    "sporting-cp": ["sporting", "sportingcp"],
}


def load_calendario() -> list:
    raw = (DOCS / "calendario.js").read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    return json.loads(m.group(1)).get("jogos", []) if m else []


def save_calendario(updates: dict[str, str]) -> None:
    raw = (DOCS / "calendario.js").read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    if not m:
        return
    data = json.loads(m.group(1))
    changed = False
    for g in data.get("jogos", []):
        gid = g.get("id")
        if gid in updates and not g.get("placar"):
            g["placar"] = updates[gid]
            changed = True
    if not changed:
        return
    data.setdefault("meta", {})["atualizadoEm"] = datetime.now(timezone(timedelta(hours=-3))).strftime("%Y-%m-%d")
    text = "window.CALENDARIO_2026 = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "calendario.js").write_text(text, encoding="utf-8")


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_team(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def team_tokens(name: str) -> set[str]:
    key = normalize_team(name)
    aliases = TEAM_ALIASES.get(key, [key])
    return {normalize_team(a) for a in aliases}


def text_has_team(text: str, team: str) -> bool:
    norm = normalize_team(text)
    for tok in team_tokens(team):
        if tok and tok in norm:
            return True
    return False


def text_has_both_teams(text: str, home: str, away: str) -> bool:
    return text_has_team(text, home) and text_has_team(text, away)


def fetch_url(url: str, timeout: int = 25) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", "replace")


def parse_ge_rss() -> list[dict]:
    try:
        xml = fetch_url("https://ge.globo.com/rss/ge/")
        root = ET.fromstring(xml)
    except (urllib.error.URLError, TimeoutError, ET.ParseError) as exc:
        print(f"GE RSS skip: {exc}")
        return []
    items: list[dict] = []
    for item in root.findall(".//item"):
        title = unescape(item.findtext("title", "") or "")
        link = item.findtext("link", "") or ""
        pub = item.findtext("pubDate", "") or ""
        desc = unescape(item.findtext("description", "") or "")
        iso_date = ""
        if pub:
            try:
                iso_date = parsedate_to_datetime(pub).astimezone(
                    timezone(timedelta(hours=-3))
                ).strftime("%Y-%m-%d")
            except (TypeError, ValueError, OverflowError):
                pass
        if not iso_date and link:
            m = re.search(r"/noticia/(\d{4})/(\d{2})/(\d{2})/", link)
            if m:
                iso_date = f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
        items.append({"title": title, "link": link, "text": f"{title} {desc}", "date": iso_date})
    return items


def score_from_news_text(text: str, home: str, away: str) -> tuple[int, int] | None:
    t = unescape(text)
    if not text_has_both_teams(t, home, away):
        return None
    if re.search(r"empat(am|aram|ou|a)[^.]{0,80}sem gols?", t, re.I):
        return 0, 0
    if re.search(r"empat(am|aram|ou|a)[^.]{0,40}0\s*[x×X]\s*0", t, re.I):
        return 0, 0
    home_label = home.replace("-", " ")
    away_label = away.replace("-", " ")
    for first, second, is_home_first in (
        (home_label, away_label, True),
        (away_label, home_label, False),
    ):
        m = re.search(
            rf"{re.escape(first)}[^\d]{{0,50}}(\d+)\s*[x×X]\s*(\d+)[^\d]{{0,50}}{re.escape(second)}",
            t,
            re.I,
        )
        if m:
            a, b = int(m.group(1)), int(m.group(2))
            return (a, b) if is_home_first else (b, a)
    if re.search(r"(vence|venceu|derrota|goleada|resultado|placar|terminou|ficam no empate)", t, re.I):
        m = re.search(
            rf"(\d+)\s*[x×X]\s*(\d+)[^.]{{0,80}}(?:{re.escape(home_label)}|{re.escape(away_label)})",
            t,
            re.I,
        )
        if m:
            a, b = int(m.group(1)), int(m.group(2))
            if a <= 9 and b <= 9:
                return a, b
        m = re.search(r"por\s+(\d+)\s+a\s+(\d+)", t, re.I)
        if m:
            a, b = int(m.group(1)), int(m.group(2))
            if a <= 9 and b <= 9:
                return a, b
    return None


def game_kickoff_passed(game: dict, now: datetime) -> bool:
    try:
        gd = datetime.strptime(game["data"], "%Y-%m-%d").date()
    except ValueError:
        return False
    if gd < now.date():
        return True
    if gd > now.date():
        return False
    horario = game.get("horario") or "23:59"
    try:
        hh, mm = horario.split(":")[:2]
        kick = datetime(
            gd.year, gd.month, gd.day, int(hh), int(mm),
            tzinfo=timezone(timedelta(hours=-3)),
        )
        return now >= kick + timedelta(minutes=105)
    except (ValueError, TypeError):
        return now.hour >= 23


def pending_games(jogos: list, now: datetime, days_back: int = 14) -> list[dict]:
    start = now.date() - timedelta(days=days_back)
    pending = []
    for g in jogos:
        if not g.get("mandante") or not g.get("visitante") or g.get("placar"):
            continue
        try:
            gd = datetime.strptime(g["data"], "%Y-%m-%d").date()
        except ValueError:
            continue
        if gd < start or gd > now.date():
            continue
        if gd < now.date() or game_kickoff_passed(g, now):
            pending.append(g)
    return pending


def fetch_scores_from_ge(jogos: list, now: datetime) -> dict[str, dict]:
    news = parse_ge_rss()
    if not news:
        return {}
    out: dict[str, dict] = {}
    for g in pending_games(jogos, now):
        gdate = g.get("data", "")
        for item in news:
            if gdate and item.get("date") and item["date"] != gdate:
                continue
            text = item["text"]
            if not text_has_both_teams(text, g["mandante"], g["visitante"]):
                continue
            sc = score_from_news_text(text, g["mandante"], g["visitante"])
            if not sc:
                continue
            placar = f"{sc[0]}-{sc[1]}"
            out[g["id"]] = {
                "status": "finished",
                "placar": placar,
                "golsCasa": sc[0],
                "golsFora": sc[1],
                "data": gdate,
                "comp": g.get("comp"),
                "fonte": "ge",
            }
            print(f"GE placar: {g['mandante']} x {g['visitante']} ({gdate}) = {placar}")
            break
    return out


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


def build_scores_map(jogos: list, api_key: str, now: datetime) -> tuple[dict, str]:
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

    ge_scores = fetch_scores_from_ge(jogos, now)
    for gid, entry in ge_scores.items():
        if gid not in out:
            out[gid] = entry
            # patch in-memory jogos for stats recalculation
            for g in jogos:
                if g.get("id") == gid:
                    g["placar"] = entry["placar"]
                    break
    if ge_scores:
        fonte = "calendário + ge.globo.com"

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
            fonte = "calendário + ge.globo.com + the-odds-api.com" if ge_scores else "calendário + the-odds-api.com"

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

    scores, fonte_scores = build_scores_map(jogos, api_key, now)

    ge_updates = {gid: e["placar"] for gid, e in scores.items() if e.get("fonte") == "ge"}
    if ge_updates:
        save_calendario(ge_updates)
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
