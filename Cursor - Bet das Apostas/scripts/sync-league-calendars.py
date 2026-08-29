#!/usr/bin/env python3
"""Sincroniza calendários oficiais das ligas europeias em calendario.js.

Fonte principal: https://www.365scores.com/pt-br (API webws.365scores.com).
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
CAL_PATH = DOCS / "calendario.js"

# Horários em Brasília (BRT). Confrontos e placares conferidos no 365scores (ago/2026).
FIXTURES: dict[str, list[dict]] = {
    "premier-league": [
        # Matchweek 1 — sem Hull x United (não ocorreu; United estreia na MW2)
        {"data": "2026-08-21", "horario": "16:00", "mandante": "Arsenal", "visitante": "Coventry-City", "fase": "1ª rodada", "placar": "3-0"},
        {"data": "2026-08-22", "horario": "11:00", "mandante": "Everton", "visitante": "Crystal-Palace", "fase": "1ª rodada", "placar": "2-0"},
        {"data": "2026-08-22", "horario": "11:00", "mandante": "Ipswich-Town", "visitante": "Sunderland", "fase": "1ª rodada", "placar": "2-1"},
        {"data": "2026-08-22", "horario": "11:00", "mandante": "Nottingham-Forest", "visitante": "Leeds-United", "fase": "1ª rodada", "placar": "0-1"},
        {"data": "2026-08-22", "horario": "13:30", "mandante": "Brentford", "visitante": "Tottenham", "fase": "1ª rodada", "placar": "3-0"},
        {"data": "2026-08-23", "horario": "10:00", "mandante": "Brighton", "visitante": "Aston-Villa", "fase": "1ª rodada", "placar": "4-0"},
        {"data": "2026-08-23", "horario": "10:00", "mandante": "Manchester-City", "visitante": "Bournemouth", "fase": "1ª rodada", "placar": "2-1"},
        {"data": "2026-08-23", "horario": "12:30", "mandante": "Newcastle-United", "visitante": "Liverpool", "fase": "1ª rodada", "placar": "2-2"},
        {"data": "2026-08-24", "horario": "16:00", "mandante": "Fulham", "visitante": "Chelsea", "fase": "1ª rodada", "placar": "2-3"},
        # Matchweek 2
        {"data": "2026-08-28", "horario": "16:00", "mandante": "Crystal-Palace", "visitante": "Manchester-City", "fase": "2ª rodada", "placar": "1-4"},
        {"data": "2026-08-29", "horario": "08:30", "mandante": "Liverpool", "visitante": "Nottingham-Forest", "fase": "2ª rodada"},
        {"data": "2026-08-29", "horario": "11:00", "mandante": "Coventry-City", "visitante": "Hull-City", "fase": "2ª rodada"},
        {"data": "2026-08-29", "horario": "11:00", "mandante": "Bournemouth", "visitante": "Everton", "fase": "2ª rodada"},
        {"data": "2026-08-29", "horario": "13:30", "mandante": "Tottenham", "visitante": "Newcastle-United", "fase": "2ª rodada"},
        {"data": "2026-08-30", "horario": "10:00", "mandante": "Sunderland", "visitante": "Fulham", "fase": "2ª rodada"},
        {"data": "2026-08-30", "horario": "10:00", "mandante": "Leeds-United", "visitante": "Brentford", "fase": "2ª rodada"},
        {"data": "2026-08-30", "horario": "10:00", "mandante": "Chelsea", "visitante": "Brighton", "fase": "2ª rodada"},
        {"data": "2026-08-30", "horario": "12:30", "mandante": "Manchester-United", "visitante": "Ipswich-Town", "fase": "2ª rodada"},
        {"data": "2026-08-31", "horario": "16:00", "mandante": "Aston-Villa", "visitante": "Arsenal", "fase": "2ª rodada"},
    ],
    "la-liga": [
        # Jornada 1 (início)
        {"data": "2026-08-15", "horario": "14:30", "mandante": "Alaves", "visitante": "Getafe", "fase": "1ª jornada", "placar": "3-0"},
        {"data": "2026-08-15", "horario": "16:30", "mandante": "Sevilla", "visitante": "Rayo-Vallecano", "fase": "1ª jornada", "placar": "2-1"},
        {"data": "2026-08-16", "horario": "12:00", "mandante": "Racing", "visitante": "Villarreal", "fase": "1ª jornada", "placar": "2-2"},
        {"data": "2026-08-16", "horario": "14:00", "mandante": "Espanyol", "visitante": "Levante", "fase": "1ª jornada", "placar": "3-0"},
        {"data": "2026-08-17", "horario": "16:00", "mandante": "Deportivo", "visitante": "Elche", "fase": "1ª jornada", "placar": "1-1"},
        {"data": "2026-08-25", "horario": "16:00", "mandante": "Valencia", "visitante": "Real-Betis", "fase": "1ª jornada", "placar": "0-1"},
        {"data": "2026-08-26", "horario": "16:00", "mandante": "Real-Madrid", "visitante": "Real-Sociedad", "fase": "1ª jornada", "placar": "4-1"},
        {"data": "2026-08-27", "horario": "15:30", "mandante": "Celta", "visitante": "Osasuna", "fase": "1ª jornada", "placar": "1-2"},
        {"data": "2026-08-27", "horario": "16:00", "mandante": "Barcelona", "visitante": "Athletic", "fase": "1ª jornada", "placar": "2-0"},
        # Jornada 2
        {"data": "2026-08-20", "horario": "16:00", "mandante": "Rayo-Vallecano", "visitante": "Alaves", "fase": "2ª jornada", "placar": "1-1"},
        {"data": "2026-08-21", "horario": "16:00", "mandante": "Real-Betis", "visitante": "Real-Sociedad", "fase": "2ª jornada", "placar": "1-0"},
        {"data": "2026-08-22", "horario": "12:00", "mandante": "Athletic", "visitante": "Sevilla", "fase": "2ª jornada", "placar": "1-3"},
        {"data": "2026-08-22", "horario": "14:30", "mandante": "Valencia", "visitante": "Celta", "fase": "2ª jornada", "placar": "0-0"},
        {"data": "2026-08-22", "horario": "16:30", "mandante": "Espanyol", "visitante": "Real-Madrid", "fase": "2ª jornada", "placar": "1-2"},
        {"data": "2026-08-23", "horario": "12:00", "mandante": "Atletico-Madrid", "visitante": "Villarreal", "fase": "2ª jornada", "placar": "2-2"},
        {"data": "2026-08-23", "horario": "14:30", "mandante": "Getafe", "visitante": "Racing", "fase": "2ª jornada", "placar": "1-0"},
        {"data": "2026-08-23", "horario": "16:30", "mandante": "Elche", "visitante": "Barcelona", "fase": "2ª jornada", "placar": "0-5"},
        {"data": "2026-08-24", "horario": "14:30", "mandante": "Osasuna", "visitante": "Levante", "fase": "2ª jornada", "placar": "0-0"},
        {"data": "2026-08-24", "horario": "16:30", "mandante": "Malaga", "visitante": "Deportivo", "fase": "2ª jornada", "placar": "1-1"},
        # Jornada 3
        {"data": "2026-08-28", "horario": "14:00", "mandante": "Racing", "visitante": "Elche", "fase": "3ª jornada", "placar": "3-2"},
        {"data": "2026-08-28", "horario": "16:30", "mandante": "Alaves", "visitante": "Villarreal", "fase": "3ª jornada", "placar": "1-0"},
        {"data": "2026-08-29", "horario": "12:00", "mandante": "Levante", "visitante": "Real-Betis", "fase": "3ª jornada"},
        {"data": "2026-08-29", "horario": "14:00", "mandante": "Real-Sociedad", "visitante": "Espanyol", "fase": "3ª jornada"},
        {"data": "2026-08-29", "horario": "16:30", "mandante": "Sevilla", "visitante": "Atletico-Madrid", "fase": "3ª jornada"},
        {"data": "2026-08-30", "horario": "12:00", "mandante": "Real-Madrid", "visitante": "Malaga", "fase": "3ª jornada"},
        {"data": "2026-08-30", "horario": "14:30", "mandante": "Deportivo", "visitante": "Valencia", "fase": "3ª jornada"},
        {"data": "2026-08-30", "horario": "16:30", "mandante": "Celta", "visitante": "Athletic", "fase": "3ª jornada"},
        {"data": "2026-08-31", "horario": "14:30", "mandante": "Osasuna", "visitante": "Getafe", "fase": "3ª jornada"},
        {"data": "2026-08-31", "horario": "16:30", "mandante": "Barcelona", "visitante": "Rayo-Vallecano", "fase": "3ª jornada"},
    ],
    "primeira-liga": [
        # Jornada 1
        {"data": "2026-08-07", "horario": "16:15", "mandante": "Estoril", "visitante": "Famalicao", "fase": "1ª jornada", "placar": "1-1"},
        {"data": "2026-08-08", "horario": "11:30", "mandante": "Maritimo", "visitante": "Casa-Pia", "fase": "1ª jornada", "placar": "1-0"},
        {"data": "2026-08-08", "horario": "14:00", "mandante": "Vitoria-Guimaraes", "visitante": "Arouca", "fase": "1ª jornada", "placar": "0-1"},
        {"data": "2026-08-08", "horario": "16:30", "mandante": "Estrela-Amadora", "visitante": "Sporting-CP", "fase": "1ª jornada", "placar": "2-2"},
        {"data": "2026-08-09", "horario": "14:00", "mandante": "Porto", "visitante": "Alverca", "fase": "1ª jornada", "placar": "2-0"},
        {"data": "2026-08-09", "horario": "16:30", "mandante": "Gil-Vicente", "visitante": "Rio-Ave", "fase": "1ª jornada", "placar": "1-0"},
        {"data": "2026-08-09", "horario": "16:30", "mandante": "Moreirense", "visitante": "Braga", "fase": "1ª jornada", "placar": "2-2"},
        {"data": "2026-08-09", "horario": "16:30", "mandante": "Benfica", "visitante": "Academico-Viseu", "fase": "1ª jornada", "placar": "2-2"},
        {"data": "2026-08-10", "horario": "16:15", "mandante": "Santa-Clara", "visitante": "Nacional", "fase": "1ª jornada", "placar": "2-2"},
        # Jornada 2
        {"data": "2026-08-14", "horario": "16:15", "mandante": "Sporting-CP", "visitante": "Vitoria-Guimaraes", "fase": "2ª jornada", "placar": "3-2"},
        {"data": "2026-08-15", "horario": "11:30", "mandante": "Alverca", "visitante": "Estrela-Amadora", "fase": "2ª jornada", "placar": "2-2"},
        {"data": "2026-08-15", "horario": "14:00", "mandante": "Academico-Viseu", "visitante": "Santa-Clara", "fase": "2ª jornada", "placar": "0-1"},
        {"data": "2026-08-15", "horario": "16:30", "mandante": "Rio-Ave", "visitante": "Porto", "fase": "2ª jornada", "placar": "0-2"},
        {"data": "2026-08-16", "horario": "11:30", "mandante": "Nacional", "visitante": "Estoril", "fase": "2ª jornada", "placar": "2-0"},
        {"data": "2026-08-16", "horario": "14:00", "mandante": "Arouca", "visitante": "Moreirense", "fase": "2ª jornada", "placar": "4-0"},
        {"data": "2026-08-16", "horario": "16:30", "mandante": "Famalicao", "visitante": "Maritimo", "fase": "2ª jornada", "placar": "1-2"},
        {"data": "2026-08-17", "horario": "16:15", "mandante": "Casa-Pia", "visitante": "Benfica", "fase": "2ª jornada", "placar": "0-7"},
        # Jornada 3
        {"data": "2026-08-22", "horario": "11:30", "mandante": "Maritimo", "visitante": "Academico-Viseu", "fase": "3ª jornada", "placar": "2-2"},
        {"data": "2026-08-22", "horario": "14:00", "mandante": "Estoril", "visitante": "Rio-Ave", "fase": "3ª jornada", "placar": "0-2"},
        {"data": "2026-08-22", "horario": "16:30", "mandante": "Sporting-CP", "visitante": "Alverca", "fase": "3ª jornada", "placar": "3-1"},
        {"data": "2026-08-23", "horario": "11:30", "mandante": "Vitoria-Guimaraes", "visitante": "Nacional", "fase": "3ª jornada", "placar": "1-0"},
        {"data": "2026-08-23", "horario": "14:00", "mandante": "Santa-Clara", "visitante": "Famalicao", "fase": "3ª jornada", "placar": "1-0"},
        {"data": "2026-08-23", "horario": "16:30", "mandante": "Porto", "visitante": "Arouca", "fase": "3ª jornada", "placar": "2-0"},
        {"data": "2026-08-24", "horario": "16:15", "mandante": "Gil-Vicente", "visitante": "Casa-Pia", "fase": "3ª jornada", "placar": "2-0"},
        # Jornada 4
        {"data": "2026-08-28", "horario": "16:15", "mandante": "Rio-Ave", "visitante": "Sporting-CP", "fase": "4ª jornada", "placar": "0-4"},
        {"data": "2026-08-29", "horario": "11:30", "mandante": "Alverca", "visitante": "Santa-Clara", "fase": "4ª jornada"},
        {"data": "2026-08-29", "horario": "11:30", "mandante": "Arouca", "visitante": "Maritimo", "fase": "4ª jornada"},
        {"data": "2026-08-29", "horario": "14:00", "mandante": "Academico-Viseu", "visitante": "Porto", "fase": "4ª jornada"},
        {"data": "2026-08-30", "horario": "11:30", "mandante": "Nacional", "visitante": "Estrela-Amadora", "fase": "4ª jornada"},
        {"data": "2026-08-30", "horario": "14:00", "mandante": "Casa-Pia", "visitante": "Moreirense", "fase": "4ª jornada"},
        {"data": "2026-08-30", "horario": "16:30", "mandante": "Famalicao", "visitante": "Gil-Vicente", "fase": "4ª jornada"},
        {"data": "2026-08-31", "horario": "16:15", "mandante": "Braga", "visitante": "Vitoria-Guimaraes", "fase": "4ª jornada"},
        {"data": "2026-08-31", "horario": "16:15", "mandante": "Benfica", "visitante": "Estoril", "fase": "4ª jornada"},
    ],
    "bundesliga": [
        {"data": "2026-08-28", "horario": "15:30", "mandante": "Bayern-Munich", "visitante": "VfB-Stuttgart", "fase": "1ª rodada", "placar": "5-1"},
        {"data": "2026-08-29", "horario": "10:30", "mandante": "SV-Elversberg", "visitante": "Bayer-Leverkusen", "fase": "1ª rodada"},
        {"data": "2026-08-29", "horario": "10:30", "mandante": "Koln", "visitante": "Hoffenheim", "fase": "1ª rodada"},
        {"data": "2026-08-29", "horario": "10:30", "mandante": "Union-Berlin", "visitante": "Eintracht-Frankfurt", "fase": "1ª rodada"},
        {"data": "2026-08-29", "horario": "10:30", "mandante": "Mainz", "visitante": "SC-Paderborn", "fase": "1ª rodada"},
        {"data": "2026-08-29", "horario": "10:30", "mandante": "RB-Leipzig", "visitante": "Borussia-Mgladbach", "fase": "1ª rodada"},
        {"data": "2026-08-29", "horario": "13:30", "mandante": "Borussia-Dortmund", "visitante": "Hamburger-SV", "fase": "1ª rodada"},
        {"data": "2026-08-30", "horario": "10:30", "mandante": "SC-Freiburg", "visitante": "Werder-Bremen", "fase": "1ª rodada"},
        {"data": "2026-08-30", "horario": "12:30", "mandante": "Augsburg", "visitante": "Schalke-04", "fase": "1ª rodada"},
    ],
    "mls": [
        {"data": "2026-08-29", "horario": "17:30", "mandante": "Seattle-Sounders", "visitante": "Chicago-Fire", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "20:30", "mandante": "Toronto-FC", "visitante": "New-York-City-FC", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "20:30", "mandante": "New-York-Red-Bulls", "visitante": "Philadelphia-Union", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "20:30", "mandante": "Inter-Miami", "visitante": "CF-Montreal", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "20:30", "mandante": "DC-United", "visitante": "Los-Angeles-FC", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "20:30", "mandante": "Atlanta-United", "visitante": "Charlotte-FC", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "21:30", "mandante": "Nashville-SC", "visitante": "FC-Cincinnati", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "21:30", "mandante": "Minnesota-United", "visitante": "Orlando-City", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "21:30", "mandante": "Sporting-KC", "visitante": "Vancouver-Whitecaps", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "21:30", "mandante": "Houston-Dynamo", "visitante": "San-Jose-Earthquakes", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "22:30", "mandante": "Colorado-Rapids", "visitante": "Real-Salt-Lake", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "23:30", "mandante": "San-Diego-FC", "visitante": "LA-Galaxy", "fase": "Rodada 28"},
        {"data": "2026-08-29", "horario": "23:30", "mandante": "Portland-Timbers", "visitante": "Austin-FC", "fase": "Rodada 28"},
        {"data": "2026-08-30", "horario": "20:00", "mandante": "New-England-Revolution", "visitante": "Columbus-Crew", "fase": "Rodada 28"},
        {"data": "2026-08-30", "horario": "20:00", "mandante": "FC-Dallas", "visitante": "St-Louis-City", "fase": "Rodada 28"},
    ],
    "serieb": [
        {"data": "2026-08-07", "horario": "19:30", "mandante": "Operario-PR", "visitante": "Sao-Bernardo", "fase": "rodada", "placar": "1-3"},
        {"data": "2026-08-07", "horario": "20:30", "mandante": "Ceara", "visitante": "Ponte-Preta", "fase": "rodada", "placar": "2-0"},
        {"data": "2026-08-08", "horario": "16:00", "mandante": "Vila-Nova", "visitante": "Sport", "fase": "rodada", "placar": "0-1"},
        {"data": "2026-08-08", "horario": "18:30", "mandante": "Botafogo-SP", "visitante": "America-MG", "fase": "rodada", "placar": "2-1"},
        {"data": "2026-08-09", "horario": "11:00", "mandante": "Athletic-PR", "visitante": "Criciuma", "fase": "rodada", "placar": "2-0"},
        {"data": "2026-08-09", "horario": "16:00", "mandante": "Novorizontino", "visitante": "Juventude", "fase": "rodada", "placar": "0-1"},
        {"data": "2026-08-09", "horario": "16:00", "mandante": "Nautico", "visitante": "Atletico-GO", "fase": "rodada", "placar": "1-1"},
        {"data": "2026-08-09", "horario": "18:00", "mandante": "Cuiaba", "visitante": "Fortaleza", "fase": "rodada", "placar": "1-1"},
        {"data": "2026-08-10", "horario": "19:30", "mandante": "Goias", "visitante": "Londrina", "fase": "rodada", "placar": "1-0"},
        {"data": "2026-08-14", "horario": "19:30", "mandante": "Ponte-Preta", "visitante": "Nautico", "fase": "rodada", "placar": "1-1"},
        {"data": "2026-08-14", "horario": "19:30", "mandante": "Sao-Bernardo", "visitante": "Botafogo-SP", "fase": "rodada", "placar": "0-1"},
        {"data": "2026-08-14", "horario": "20:30", "mandante": "Sport", "visitante": "Londrina", "fase": "rodada", "placar": "2-1"},
        {"data": "2026-08-15", "horario": "16:00", "mandante": "Criciuma", "visitante": "Goias", "fase": "rodada", "placar": "1-0"},
        {"data": "2026-08-15", "horario": "16:00", "mandante": "Atletico-GO", "visitante": "Vila-Nova", "fase": "rodada", "placar": "0-2"},
        {"data": "2026-08-15", "horario": "16:00", "mandante": "Ceara", "visitante": "Cuiaba", "fase": "rodada", "placar": "1-3"},
        {"data": "2026-08-15", "horario": "18:30", "mandante": "Juventude", "visitante": "Fortaleza", "fase": "rodada", "placar": "0-0"},
        {"data": "2026-08-16", "horario": "11:00", "mandante": "Operario-PR", "visitante": "Avai", "fase": "rodada", "placar": "1-2"},
        {"data": "2026-08-16", "horario": "18:30", "mandante": "CRB", "visitante": "Novorizontino", "fase": "rodada", "placar": "0-0"},
        {"data": "2026-08-16", "horario": "18:30", "mandante": "America-MG", "visitante": "Athletic-PR", "fase": "rodada", "placar": "1-3"},
        {"data": "2026-08-20", "horario": "19:30", "mandante": "Athletic-PR", "visitante": "CRB", "fase": "rodada", "placar": "0-2"},
        {"data": "2026-08-20", "horario": "20:30", "mandante": "Novorizontino", "visitante": "America-MG", "fase": "rodada", "placar": "3-0"},
        {"data": "2026-08-22", "horario": "18:00", "mandante": "Ceara", "visitante": "Londrina", "fase": "rodada", "placar": "2-1"},
        {"data": "2026-08-22", "horario": "18:30", "mandante": "Cuiaba", "visitante": "Goias", "fase": "rodada", "placar": "1-1"},
        {"data": "2026-08-23", "horario": "16:00", "mandante": "Ponte-Preta", "visitante": "Avai", "fase": "rodada", "placar": "0-2"},
        {"data": "2026-08-23", "horario": "16:00", "mandante": "Sao-Bernardo", "visitante": "Nautico", "fase": "rodada", "placar": "1-1"},
        {"data": "2026-08-23", "horario": "18:00", "mandante": "Operario-PR", "visitante": "Vila-Nova", "fase": "rodada", "placar": "0-0"},
        {"data": "2026-08-23", "horario": "18:30", "mandante": "Criciuma", "visitante": "Fortaleza", "fase": "rodada", "placar": "0-2"},
        {"data": "2026-08-24", "horario": "19:30", "mandante": "Athletic-PR", "visitante": "Novorizontino", "fase": "rodada", "placar": "1-4"},
        {"data": "2026-08-24", "horario": "19:30", "mandante": "Sport", "visitante": "America-MG", "fase": "rodada", "placar": "3-0"},
        {"data": "2026-08-25", "horario": "19:30", "mandante": "Atletico-GO", "visitante": "Botafogo-SP", "fase": "rodada", "placar": "3-0"},
        {"data": "2026-08-25", "horario": "19:30", "mandante": "Juventude", "visitante": "CRB", "fase": "rodada", "placar": "2-1"},
        {"data": "2026-08-28", "horario": "19:30", "mandante": "Goias", "visitante": "Sao-Bernardo", "fase": "rodada"},
        {"data": "2026-08-28", "horario": "20:30", "mandante": "Novorizontino", "visitante": "Sport", "fase": "rodada"},
        {"data": "2026-08-28", "horario": "20:30", "mandante": "Nautico", "visitante": "Athletic-PR", "fase": "rodada"},
        {"data": "2026-08-29", "horario": "18:30", "mandante": "Botafogo-SP", "visitante": "Cuiaba", "fase": "rodada"},
        {"data": "2026-08-30", "horario": "16:00", "mandante": "Avai", "visitante": "Atletico-GO", "fase": "rodada"},
        {"data": "2026-08-30", "horario": "16:00", "mandante": "America-MG", "visitante": "Ponte-Preta", "fase": "rodada"},
        {"data": "2026-08-30", "horario": "18:00", "mandante": "CRB", "visitante": "Criciuma", "fase": "rodada"},
        {"data": "2026-08-30", "horario": "18:30", "mandante": "Vila-Nova", "visitante": "Ceara", "fase": "rodada"},
        {"data": "2026-08-31", "horario": "19:30", "mandante": "Fortaleza", "visitante": "Operario-PR", "fase": "rodada"},
    ],
}


def load_calendario() -> dict:
    raw = CAL_PATH.read_text(encoding="utf-8")
    m = re.search(r"window\.CALENDARIO_2026\s*=\s*(\{.+\})\s*;?\s*$", raw, re.DOTALL)
    return json.loads(m.group(1)) if m else {"jogos": []}


def make_id(comp: str, fx: dict) -> str:
    if comp == "serieb":
        prefix = "s2"
    elif comp == "mls":
        prefix = "us-mls"
    else:
        prefix = f"eu-{comp}"
    return f"{prefix}-{fx['data']}-{fx['mandante']}-{fx['visitante']}"


def build_game(comp: str, fx: dict) -> dict:
    return {
        "id": make_id(comp, fx),
        "comp": comp,
        "torneio": "MLS" if comp == "mls" else comp.replace("-", " ").title(),
        "rodada": None,
        "fase": fx["fase"],
        "data": fx["data"],
        "horario": fx["horario"],
        "mandante": fx["mandante"],
        "visitante": fx["visitante"],
        "placar": fx.get("placar"),
        "estadio": fx.get("estadio"),
    }


def sync() -> int:
    data = load_calendario()
    comps_to_replace = set(FIXTURES.keys())
    kept = [g for g in data.get("jogos", []) if g.get("comp") not in comps_to_replace]
    added = []
    for comp, fixtures in FIXTURES.items():
        for fx in fixtures:
            added.append(build_game(comp, fx))
    data["jogos"] = kept + added
    data["jogos"].sort(key=lambda g: (g.get("data") or "", g.get("horario") or "", g.get("id") or ""))
    data.setdefault("meta", {})["atualizadoEm"] = datetime.now(timezone(timedelta(hours=-3))).strftime("%Y-%m-%d")
    fontes = data["meta"].setdefault("fontes", [])
    if "365scores" not in fontes:
        fontes.append("365scores")
    CAL_PATH.write_text(
        "window.CALENDARIO_2026 = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    return len(added)


if __name__ == "__main__":
    n = sync()
    print(f"sync-league-calendars: {n} jogos europeus atualizados (fonte 365scores)")
