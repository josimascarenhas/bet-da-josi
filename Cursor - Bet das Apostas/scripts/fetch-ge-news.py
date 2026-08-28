#!/usr/bin/env python3
"""Busca notícias do ge.globo.com e gera live/news.json."""
from __future__ import annotations

import http.client
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from pathlib import Path

UA = "Mozilla/5.0 (compatible; BetDaJosi/1.0; +https://josimascarenhas.github.io/bet-da-josi/)"
NS = {"media": "http://search.yahoo.com/mrss/", "atom": "http://www.w3.org/2005/Atom"}

FOOTBALL_TEAMS = [
    {"key": "Palmeiras", "slug": "palmeiras", "url": "https://ge.globo.com/futebol/times/palmeiras/", "section": "Palmeiras"},
    {"key": "Flamengo", "slug": "flamengo", "url": "https://ge.globo.com/futebol/times/flamengo/", "section": "Flamengo"},
    {"key": "Athletico-PR", "slug": "athletico-pr", "url": "https://ge.globo.com/pr/futebol/times/athletico-pr/", "section": "Athletico-PR"},
    {"key": "Fluminense", "slug": "fluminense", "url": "https://ge.globo.com/futebol/times/fluminense/", "section": "Fluminense"},
    {"key": "Cruzeiro", "slug": "cruzeiro", "url": "https://ge.globo.com/futebol/times/cruzeiro/", "section": "Cruzeiro"},
    {"key": "Bahia", "slug": "bahia", "url": "https://ge.globo.com/ba/futebol/times/bahia/", "section": "Bahia"},
    {"key": "Bragantino", "slug": "bragantino", "url": "https://ge.globo.com/sp/vale-do-paraiba-regiao/futebol/times/bragantino/", "section": "Bragantino"},
    {"key": "Coritiba", "slug": "coritiba", "url": "https://ge.globo.com/pr/futebol/times/coritiba/", "section": "Coritiba"},
    {"key": "Atletico-MG", "slug": "atletico-mg", "url": "https://ge.globo.com/futebol/times/atletico-mg/", "section": "Atlético-MG"},
    {"key": "Corinthians", "slug": "corinthians", "url": "https://ge.globo.com/futebol/times/corinthians/", "section": "Corinthians"},
    {"key": "Botafogo", "slug": "botafogo", "url": "https://ge.globo.com/futebol/times/botafogo/", "section": "Botafogo"},
    {"key": "Vitoria", "slug": "vitoria", "url": "https://ge.globo.com/ba/futebol/times/vitoria/", "section": "Vitória"},
    {"key": "Sao-Paulo", "slug": "sao-paulo", "url": "https://ge.globo.com/futebol/times/sao-paulo/", "section": "São Paulo"},
    {"key": "Santos", "slug": "santos", "url": "https://ge.globo.com/futebol/times/santos/", "section": "Santos"},
    {"key": "Gremio", "slug": "gremio", "url": "https://ge.globo.com/futebol/times/gremio/", "section": "Grêmio"},
    {"key": "Internacional", "slug": "internacional", "url": "https://ge.globo.com/futebol/times/internacional/", "section": "Internacional"},
    {"key": "Mirassol", "slug": "mirassol", "url": "https://ge.globo.com/futebol/times/mirassol/", "section": "Mirassol"},
    {"key": "Remo", "slug": "remo", "url": "https://ge.globo.com/pa/futebol/times/remo/", "section": "Remo"},
    {"key": "Vasco", "slug": "vasco", "url": "https://ge.globo.com/futebol/times/vasco/", "section": "Vasco"},
    {"key": "Chapecoense", "slug": "chapecoense", "url": "https://ge.globo.com/sc/futebol/times/chapecoense/", "section": "Chapecoense"},
]

SPORT_SECTIONS = [
    {"sport": "tenis", "url": "https://ge.globo.com/tenis/", "path": "/tenis/", "label": "Tênis"},
    {"sport": "basquete", "url": "https://ge.globo.com/basquete/", "path": "/basquete/", "label": "Basquete"},
    {"sport": "ufc", "url": "https://ge.globo.com/combate/", "path": "/combate/", "label": "UFC / Combate"},
]


def fetch(url: str, timeout: int = 25, retries: int = 3) -> str:
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read().decode("utf-8", "replace")
        except (urllib.error.URLError, TimeoutError, ConnectionError, OSError, http.client.IncompleteRead) as exc:
            last_err = exc
            if attempt < retries - 1:
                continue
            raise exc
    raise last_err or RuntimeError("fetch failed")


def iso_from_pub(pub: str) -> str:
    if not pub:
        return ""
    try:
        return parsedate_to_datetime(pub).astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError, OverflowError):
        return ""


def fmt_date(iso: str, url: str = "") -> str:
    if iso:
        try:
            dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
            return dt.strftime("%d/%m/%Y %H:%M")
        except ValueError:
            pass
    m = re.search(r"/noticia/(\d{4})/(\d{2})/(\d{2})/", url)
    if m:
        return f"{m.group(3)}/{m.group(2)}/{m.group(1)}"
    return ""


def normalize_item(title: str, url: str, resumo: str = "", imagem: str = "", pub: str = "") -> dict:
    url = url.replace("http://", "https://")
    iso = iso_from_pub(pub)
    return {
        "titulo": unescape(title.strip()),
        "resumo": unescape(re.sub(r"\s+", " ", resumo or "").strip())[:280],
        "url": url,
        "imagem": imagem or "",
        "data": iso,
        "dataFmt": fmt_date(iso, url),
    }


def dedupe_sort(items: list[dict], limit: int = 15) -> list[dict]:
    seen: set[str] = set()
    out: list[dict] = []
    for it in sorted(items, key=lambda x: x.get("data") or "", reverse=True):
        url = it.get("url", "")
        if not url or url in seen:
            continue
        seen.add(url)
        out.append(it)
        if len(out) >= limit:
            break
    return out


def parse_rss() -> list[dict]:
    try:
        xml = fetch("https://ge.globo.com/rss/ge/")
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"RSS erro: {exc}", file=sys.stderr)
        return []
    root = ET.fromstring(xml)
    items: list[dict] = []
    for item in root.findall(".//item"):
        title = item.findtext("title", "")
        link = item.findtext("link", "")
        pub = item.findtext("pubDate", "")
        subtitle = item.find("{atom}subtitle", NS)
        resumo = subtitle.text if subtitle is not None else ""
        media = item.find("{media}content", NS)
        img = media.get("url", "") if media is not None else ""
        if title and link:
            items.append(normalize_item(title, link, resumo, img, pub))
    return items


def scrape_page_news(html: str, path_filter: str | None = None, limit: int = 15) -> list[dict]:
    items: list[dict] = []
    pattern = re.compile(
        r'"title":"((?:[^"\\]|\\.)+)"[\s\S]{0,2500}?"url":"(https://ge\.globo\.com/[^"]+/noticia/\d{4}/\d{2}/\d{2}/[^"]+\.ghtml)"',
        re.MULTILINE,
    )
    for m in pattern.finditer(html):
        title = m.group(1).encode().decode("unicode_escape")
        url = m.group(2)
        if path_filter and path_filter not in url:
            continue
        block = m.group(0)
        img_m = re.search(r'"image":\{"url":"([^"]+)"', block)
        if not img_m:
            img_m = re.search(r'"url":"(https://s2-ge\.glbimg\.com/[^"]+)"', block)
        img = img_m.group(1) if img_m else ""
        sub_m = re.search(r'"summary":"((?:[^"\\]|\\.)*)"', block)
        resumo = sub_m.group(1).encode().decode("unicode_escape") if sub_m else ""
        items.append(normalize_item(title, url, resumo, img, ""))
        if len(items) >= limit * 2:
            break
    return dedupe_sort(items, limit)


def fetch_recommendations(section: str, limit: int = 8) -> list[dict]:
    url = (
        "https://recomendacao.globo.com/v3/globocom/ab/GE-TRENDING-CONTEXT-user"
        f"?responseFormat=legacyPublishing&anchors.section={urllib.parse.quote(section)}"
    )
    try:
        raw = fetch(url)
        data = json.loads(raw)
    except (urllib.error.URLError, json.JSONDecodeError, TimeoutError):
        return []
    items: list[dict] = []
    for entry in data[:limit]:
        content = entry.get("content") or {}
        link = content.get("url") or entry.get("url") or ""
        if not link or "/noticia/" not in link:
            continue
        title = content.get("title") or content.get("recommendationTitle") or ""
        resumo = content.get("summary") or content.get("recommendationSummary") or ""
        img = ""
        image = content.get("image") or {}
        if isinstance(image, dict):
            sizes = image.get("sizes") or {}
            for key in ("M", "S", "L", "XS"):
                if key in sizes and sizes[key].get("url"):
                    img = sizes[key]["url"]
                    break
            if not img:
                img = image.get("url", "")
        items.append(normalize_item(title, link, resumo, img, ""))
    return items


def filter_rss_for_team(rss_items: list[dict], team: dict) -> list[dict]:
    slug = team["slug"]
    keys = {team["key"].lower(), slug.lower(), team["section"].lower()}
    out: list[dict] = []
    for it in rss_items:
        url_l = it["url"].lower()
        title_l = it["titulo"].lower()
        if f"/times/{slug}/" in url_l:
            out.append(it)
            continue
        if any(k in title_l or k in url_l for k in keys):
            out.append(it)
    return out


def build_football_news(rss_items: list[dict]) -> dict:
    geral = [it for it in rss_items if "/futebol/" in it["url"]][:20]
    times: dict[str, list[dict]] = {}
    for team in FOOTBALL_TEAMS:
        collected: list[dict] = []
        try:
            html = fetch(team["url"])
            collected.extend(scrape_page_news(html, f"/times/{team['slug']}/noticia/", 12))
        except (urllib.error.URLError, TimeoutError) as exc:
            print(f"  {team['key']} página: {exc}", file=sys.stderr)
        collected.extend(fetch_recommendations(team["section"], 6))
        collected.extend(filter_rss_for_team(rss_items, team))
        times[team["key"]] = dedupe_sort(collected, 12)
        print(f"  {team['key']}: {len(times[team['key']])} notícias")
    return {"geral": dedupe_sort(geral, 20), "times": times}


def build_section_news(section: dict, rss_items: list[dict]) -> list[dict]:
    collected: list[dict] = []
    try:
        html = fetch(section["url"])
        collected.extend(scrape_page_news(html, section["path"], 15))
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"  {section['sport']} página: {exc}", file=sys.stderr)
    collected.extend([it for it in rss_items if section["path"] in it["url"]])
    return dedupe_sort(collected, 20)


def main() -> int:
    print("Buscando RSS ge.globo.com…")
    rss = parse_rss()
    print(f"RSS: {len(rss)} itens")

    print("Futebol (20 times)…")
    futebol = build_football_news(rss)

    other: dict[str, dict] = {}
    for section in SPORT_SECTIONS:
        print(f"{section['label']}…")
        other[section["sport"]] = {"geral": build_section_news(section, rss)}

    payload = {
        "meta": {
            "atualizadoEm": datetime.now(timezone.utc).isoformat(),
            "fonte": "ge.globo.com",
            "fonteUrl": "https://ge.globo.com/",
        },
        "futebol": futebol,
        "tenis": other["tenis"],
        "basquete": other["basquete"],
        "ufc": other["ufc"],
    }

    root = Path(__file__).resolve().parents[1]
    targets = [
        root / "docs" / "live" / "news.json",
        root / "copa-brasil-apostas" / "live" / "news.json",
    ]
    for path in targets:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Gravado: {path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
