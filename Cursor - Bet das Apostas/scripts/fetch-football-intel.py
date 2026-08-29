#!/usr/bin/env python3
"""Gera live/intel.json e enriquece live/football.json — xG, descanso, desfalques, árbitro."""
from __future__ import annotations

import json
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
LIVE = DOCS / "live"

INJURY_KW = (
    "lesão", "lesao", "suspenso", "suspens", "desfalque", "fora do jogo",
    "não joga", "nao joga", "dúvida", "duvida", "machucado", "contundido",
    "departamento médico", "departamento medico",
)
IMPACT_HIGH = ("titular", "artilheiro", "capitão", "capitao", "gerson", "hulk", "cano", "neymar", "endrick", "memphis")
IMPACT_MED = ("suspenso", "suspens", "desfalque")

LEAGUE_AVG = {
    "brasileirao": 1.24, "serieb": 1.11, "libertadores": 1.18, "copa": 1.07,
    "premier-league": 1.43, "la-liga": 1.28, "bundesliga": 1.53, "primeira-liga": 1.23, "mls": 1.52,
}

# Média histórica cartões/jogo por árbitro (CBF / fontes públicas — amostra)
REFEREES_BR = {
    "jonathan benkenstein": 4.6, "flavio rodrigues": 5.1, "wilton pereira": 4.9,
    "raphael claus": 5.4, "anderson daronco": 4.2, "bruno arleu": 4.8,
    "wagner reway": 5.0, "default": 4.9,
}

SERIE_B_GE = {
    "Goias": "https://ge.globo.com/go/futebol/times/goias/",
    "Sport": "https://ge.globo.com/pe/futebol/times/sport/",
    "Juventude": "https://ge.globo.com/rs/futebol/times/juventude/",
    "Ceara": "https://ge.globo.com/ce/futebol/times/ceara/",
    "Fortaleza": "https://ge.globo.com/ce/futebol/times/fortaleza/",
    "Corinthians": "https://ge.globo.com/futebol/times/corinthians/",
    "Palmeiras": "https://ge.globo.com/futebol/times/palmeiras/",
    "Flamengo": "https://ge.globo.com/futebol/times/flamengo/",
}


def load_calendario() -> dict:
    raw = (DOCS / "calendario.js").read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    return json.loads(m.group(1)) if m else {"jogos": []}


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def parse_date(s: str) -> datetime:
    return datetime.strptime(s, "%Y-%m-%d")


def team_rest_days(team: str, game_date: str, jogos: list) -> int | None:
    gd = parse_date(game_date)
    last = None
    for g in jogos:
        if not g.get("placar"):
            continue
        if g["mandante"] != team and g["visitante"] != team:
            continue
        try:
            d = parse_date(g["data"])
        except ValueError:
            continue
        if d >= gd:
            continue
        if last is None or d > last:
            last = d
    if last is None:
        return None
    return (gd - last).days


def games_in_window(team: str, game_date: str, jogos: list, days: int = 7) -> int:
    gd = parse_date(game_date)
    start = gd - timedelta(days=days)
    n = 0
    for g in jogos:
        if g["mandante"] != team and g["visitante"] != team:
            continue
        try:
            d = parse_date(g["data"])
        except ValueError:
            continue
        if start < d < gd:
            n += 1
    return n


def estimate_xg(gpg: float, league: str) -> float:
    avg = LEAGUE_AVG.get(league, 1.2)
    return round(gpg * 0.72 + avg * 0.28, 2)


def estimate_xgs(gsg: float, league: str) -> float:
    avg = LEAGUE_AVG.get(league, 1.2)
    return round(gsg * 0.72 + avg * 0.28, 2)


def impact_from_text(text: str) -> str:
    t = text.lower()
    if any(k in t for k in IMPACT_HIGH):
        return "alto"
    if any(k in t for k in IMPACT_MED):
        return "medio"
    return "medio"


def extract_injuries_from_news(news: dict) -> dict[str, list]:
    out: dict[str, list] = {}
    foot = news.get("futebol", {})
    seen: dict[str, set] = {}

    def add(team: str, item: dict):
        title = (item.get("titulo") or "").lower()
        if not any(k in title for k in INJURY_KW):
            return
        player = item.get("titulo", "").split("—")[0].split(":")[0].strip()[:60]
        entry = {
            "jogador": player[:40] or "Atleta",
            "motivo": "notícia GE",
            "impacto": impact_from_text(title),
        }
        seen.setdefault(team, set())
        key = entry["jogador"][:20]
        if key in seen[team]:
            return
        seen[team].add(key)
        out.setdefault(team, []).append(entry)

    for team, items in (foot.get("times") or {}).items():
        for item in items or []:
            add(team, item)
    for item in foot.get("geral") or []:
        for team in foot.get("times", {}):
            if team.lower() in (item.get("titulo") or "").lower():
                add(team, item)
    return out


def merge_football_patch(existing: dict, times_patch: dict) -> dict:
    base = existing if existing else {"meta": {}, "times": {}}
    base.setdefault("meta", {})
    base.setdefault("times", {})
    for team, patch in times_patch.items():
        if team not in base["times"]:
            base["times"][team] = {}
        for comp, stats in patch.items():
            if comp in ("desfalques", "retornando"):
                base["times"][team][comp] = stats
            else:
                base["times"][team].setdefault(comp, {})
                base["times"][team][comp].update(stats)
    base["meta"]["atualizadoEm"] = datetime.now(timezone(timedelta(hours=-3))).strftime(
        "%Y-%m-%dT%H:%M:%S-03:00"
    )
    base["meta"]["fonte"] = "CBF / GE / modelo xG / calendário"
    return base


def load_js_window(path: Path, var_name: str) -> dict:
    if not path.exists():
        return {}
    raw = path.read_text(encoding="utf-8")
    m = re.search(rf"window\.{re.escape(var_name)}\s*=\s*(\{{.+\}})\s*;?\s*$", raw, re.DOTALL)
    if not m:
        return {}
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return {}


def static_team_stats() -> dict[str, dict[str, dict]]:
    """team -> comp -> stats from bundled JS datasets."""
    out: dict[str, dict[str, dict]] = {}
    fields = ("golsPorJogo", "golsSofridosPorJogo", "escanteiosPorJogo", "cartoesPorJogo")
    for path in [DOCS / "data.js", DOCS / "serie-b-data.js", DOCS / "libertadores-data.js", DOCS / "europe-data.js"]:
        if not path.exists():
            continue
        raw = path.read_text(encoding="utf-8")
        for tm in re.finditer(r'"([A-Za-z0-9][A-Za-z0-9\-]*)"\s*:\s*\{', raw):
            team = tm.group(1)
            chunk = raw[tm.start(): tm.start() + 12000]
            for comp in LEAGUE_AVG:
                cm = re.search(rf'"{re.escape(comp)}"\s*:\s*\{{', chunk)
                if not cm:
                    continue
                sub = chunk[cm.start(): cm.start() + 2500]
                stats: dict = {}
                for field in fields:
                    fm = re.search(rf'"{re.escape(field)}"\s*:\s*([\d.]+)', sub)
                    if fm:
                        stats[field] = float(fm.group(1))
                if stats.get("golsPorJogo"):
                    out.setdefault(team, {})[comp] = stats
    return out


def main():
    cal = load_calendario()
    jogos = cal.get("jogos", [])
    news = load_json(LIVE / "news.json")
    injuries = extract_injuries_from_news(news)

    today = datetime.now(timezone(timedelta(hours=-3))).strftime("%Y-%m-%d")
    upcoming = [g for g in jogos if g.get("data") >= today and g.get("mandante") and not g.get("placar")]

    intel_jogos = {}
    times_patch: dict[str, dict] = {}

    teams_in_scope: set[str] = set()
    for g in upcoming[:80]:
        teams_in_scope.add(g["mandante"])
        teams_in_scope.add(g["visitante"])

    for g in upcoming:
        gid = g["id"]
        home, away = g["mandante"], g["visitante"]
        comp = g.get("comp", "brasileirao")
        rest_h = team_rest_days(home, g["data"], jogos)
        rest_a = team_rest_days(away, g["data"], jogos)
        g7_h = games_in_window(home, g["data"], jogos)
        g7_a = games_in_window(away, g["data"], jogos)
        ref = g.get("arbitro") or ""
        ref_cards = REFEREES_BR.get(ref.lower(), REFEREES_BR["default"]) if ref else None
        intel_jogos[gid] = {
            "restMandante": rest_h,
            "restVisitante": rest_a,
            "games7Mandante": g7_h,
            "games7Visitante": g7_a,
            "arbitro": ref or None,
            "cartoesArbitro": ref_cards,
        }

    # Load team stats from static data + live football patch
    football_existing = load_json(LIVE / "football.json")
    static_stats = static_team_stats()

    for team in teams_in_scope:
        patch: dict = {}
        if team in injuries:
            patch["desfalques"] = injuries[team][:5]
        for comp in LEAGUE_AVG:
            comp_stats = (
                static_stats.get(team, {}).get(comp)
                or football_existing.get("times", {}).get(team, {}).get(comp)
                or football_existing.get("times", {}).get(team, {}).get("brasileirao")
                or football_existing.get("times", {}).get(team, {}).get("serieb")
            )
            if not comp_stats:
                continue
            gpg = comp_stats.get("golsPorJogo", LEAGUE_AVG[comp])
            gsg = comp_stats.get("golsSofridosPorJogo", LEAGUE_AVG[comp])
            esc = comp_stats.get("escanteiosPorJogo")
            cart = comp_stats.get("cartoesPorJogo")
            comp_patch = {
                "xGporJogo": estimate_xg(float(gpg), comp),
                "xGSporJogo": estimate_xgs(float(gsg), comp),
            }
            if esc:
                comp_patch["escanteiosPorJogo"] = esc
            if cart:
                comp_patch["cartoesPorJogo"] = cart
            patch[comp] = comp_patch
        if patch:
            times_patch[team] = patch

    intel = {
        "meta": {
            "atualizadoEm": datetime.now(timezone(timedelta(hours=-3))).isoformat(),
            "fonte": "calendário + GE + modelo xG",
        },
        "times": times_patch,
        "jogos": intel_jogos,
    }

    LIVE.mkdir(parents=True, exist_ok=True)
    (LIVE / "intel.json").write_text(
        json.dumps(intel, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote intel.json — {len(intel_jogos)} jogos, {len(times_patch)} times")

    merged = merge_football_patch(football_existing, times_patch)
    (LIVE / "football.json").write_text(
        json.dumps(merged, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("Updated football.json with xG patches")

    mirror = ROOT / "copa-brasil-apostas" / "live"
    mirror.mkdir(parents=True, exist_ok=True)
    for name in ("intel.json", "football.json"):
        (mirror / name).write_text((LIVE / name).read_text(encoding="utf-8"), encoding="utf-8")


if __name__ == "__main__":
    main()
