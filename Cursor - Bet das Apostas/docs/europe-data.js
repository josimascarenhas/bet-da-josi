/* Ligas europeias 2026/27 — Premier, La Liga, Bundesliga, Primeira Liga */
window.EUROPE_DATA = {
  meta: { atualizadoEm: "2026-08-28", fontes: ["Premier League", "La Liga", "DFB", "Liga Portugal"] },
  competicoes: {
  "premier-league": {
    "id": "premier-league",
    "nome": "Premier League",
    "fase": "2ª rodada",
    "timesAtivos": [
      "Brighton",
      "Arsenal",
      "Brentford",
      "Everton",
      "Hull-City",
      "Chelsea",
      "Ipswich-Town",
      "Manchester-City",
      "Leeds-United",
      "Liverpool",
      "Newcastle-United",
      "Fulham",
      "Bournemouth",
      "Sunderland",
      "Nottingham-Forest",
      "Crystal-Palace",
      "Manchester-United",
      "Coventry-City",
      "Tottenham",
      "Aston-Villa"
    ],
    "liga": {
      "jogos": 380,
      "mediaGols": 2.85,
      "over25": 52,
      "btts": 54,
      "mediaEscanteios": 10.2,
      "over85Escanteios": 62,
      "over95Escanteios": 54,
      "mediaCartoesAmarelos": 4.2,
      "over35Cartoes": 68,
      "over45Cartoes": 52,
      "mediaChutesNoGol": 8.5,
      "vitoriaMandante": 46,
      "vitoriaVisitante": 28,
      "empate": 26
    }
  },
  "la-liga": {
    "id": "la-liga",
    "nome": "La Liga",
    "fase": "3ª jornada",
    "timesAtivos": [
      "Sevilla",
      "Real-Betis",
      "Alaves",
      "Atletico-Madrid",
      "Barcelona",
      "Espanyol",
      "Real-Madrid",
      "Getafe",
      "Villarreal",
      "Deportivo",
      "Osasuna",
      "Celta",
      "Racing",
      "Rayo-Vallecano",
      "Valencia",
      "Malaga",
      "Levante",
      "Elche",
      "Real-Sociedad",
      "Athletic"
    ],
    "liga": {
      "jogos": 380,
      "mediaGols": 2.55,
      "over25": 48,
      "btts": 50,
      "mediaEscanteios": 9.8,
      "over85Escanteios": 60,
      "over95Escanteios": 52,
      "mediaCartoesAmarelos": 4.8,
      "over35Cartoes": 70,
      "over45Cartoes": 55,
      "mediaChutesNoGol": 8.0,
      "vitoriaMandante": 48,
      "vitoriaVisitante": 26,
      "empate": 26
    }
  },
  "bundesliga": {
    "id": "bundesliga",
    "nome": "Bundesliga",
    "fase": "1ª rodada",
    "timesAtivos": [
      "Bayern-Munich",
      "Borussia-Dortmund",
      "Bayer-Leverkusen",
      "RB-Leipzig",
      "Eintracht-Frankfurt",
      "VfB-Stuttgart",
      "SC-Freiburg",
      "Hoffenheim",
      "Werder-Bremen",
      "Union-Berlin",
      "Mainz",
      "Augsburg",
      "Hamburger-SV",
      "Koln",
      "Borussia-Mgladbach",
      "Schalke-04",
      "SC-Paderborn",
      "SV-Elversberg"
    ],
    "liga": {
      "jogos": 306,
      "mediaGols": 3.05,
      "over25": 58,
      "btts": 56,
      "mediaEscanteios": 9.5,
      "over85Escanteios": 58,
      "over95Escanteios": 50,
      "mediaCartoesAmarelos": 3.8,
      "over35Cartoes": 65,
      "over45Cartoes": 50,
      "mediaChutesNoGol": 8.8,
      "vitoriaMandante": 44,
      "vitoriaVisitante": 30,
      "empate": 26
    }
  },
  "primeira-liga": {
    "id": "primeira-liga",
    "nome": "Primeira Liga",
    "fase": "4ª jornada",
    "timesAtivos": [
      "Porto",
      "Arouca",
      "Gil-Vicente",
      "Maritimo",
      "Academico-Viseu",
      "Benfica",
      "Braga",
      "Sporting-CP",
      "Famalicao",
      "Moreirense",
      "Estoril",
      "Estrela-Amadora",
      "Nacional",
      "Santa-Clara",
      "Alverca",
      "Casa-Pia",
      "Rio-Ave",
      "Vitoria-Guimaraes"
    ],
    "liga": {
      "jogos": 306,
      "mediaGols": 2.45,
      "over25": 46,
      "btts": 48,
      "mediaEscanteios": 9.0,
      "over85Escanteios": 55,
      "over95Escanteios": 48,
      "mediaCartoesAmarelos": 5.2,
      "over35Cartoes": 72,
      "over45Cartoes": 58,
      "mediaChutesNoGol": 7.8,
      "vitoriaMandante": 47,
      "vitoriaVisitante": 27,
      "empate": 26
    }
  }
},
  times: {
  "Brighton": {
    "id": "BHA",
    "cor": "#0057B8",
    "pais": "ENG",
    "casa": {
      "gpg": 4.56,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 3.2,
      "gsg": 1.16
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 1,
      "pontos": 3,
      "golsPorJogo": 4.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 4-0 FUL",
        "E 0-0",
        "V 2-1",
        "D 1-2",
        "V 1-0"
      ],
      "sequencia": "1V"
    }
  },
  "Arsenal": {
    "id": "ARS",
    "cor": "#EF0107",
    "pais": "ENG",
    "casa": {
      "gpg": 3.42,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 2.4,
      "gsg": 1.16
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 2,
      "pontos": 3,
      "golsPorJogo": 3.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 3-0 COV",
        "V 2-0",
        "E 1-1",
        "V 2-1",
        "D 0-1"
      ],
      "sequencia": "2V"
    }
  },
  "Brentford": {
    "id": "BRE",
    "cor": "#E30613",
    "pais": "ENG",
    "casa": {
      "gpg": 3.42,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 2.4,
      "gsg": 1.16
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 2,
      "pontos": 3,
      "golsPorJogo": 3.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 3-0 NFO",
        "V 1-0",
        "E 2-2",
        "V 2-1",
        "D 0-2"
      ],
      "sequencia": "2V"
    }
  },
  "Everton": {
    "id": "EVE",
    "cor": "#003399",
    "pais": "ENG",
    "casa": {
      "gpg": 2.28,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 1.16
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 4,
      "pontos": 3,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-0 BOU",
        "V 1-0",
        "D 1-1",
        "V 2-0",
        "E 0-0"
      ],
      "sequencia": "2V"
    }
  },
  "Hull-City": {
    "id": "HUL",
    "cor": "#F5971D",
    "pais": "ENG",
    "casa": {
      "gpg": 2.28,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 1.16
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 4,
      "pontos": 3,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-0 SUN",
        "V 1-0",
        "D 0-0",
        "V 3-1",
        "D 1-2"
      ],
      "sequencia": "2V"
    }
  },
  "Chelsea": {
    "id": "CHE",
    "cor": "#034694",
    "pais": "ENG",
    "casa": {
      "gpg": 3.42,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 2.4,
      "gsg": 2.32
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 6,
      "pontos": 3,
      "golsPorJogo": 3.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 3-2 CRY",
        "V 2-1",
        "E 1-1",
        "V 3-0",
        "D 0-1"
      ],
      "sequencia": "2V"
    }
  },
  "Ipswich-Town": {
    "id": "IPS",
    "cor": "#003399",
    "pais": "ENG",
    "casa": {
      "gpg": 2.28,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 1.16
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 6,
      "pontos": 3,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-1 BOU",
        "E 1-1",
        "V 2-0",
        "D 0-2",
        "V 1-0"
      ],
      "sequencia": "1V"
    }
  },
  "Manchester-City": {
    "id": "MCI",
    "cor": "#6CABDD",
    "pais": "ENG",
    "casa": {
      "gpg": 2.28,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 1.16
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 6,
      "pontos": 3,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-1 BOU",
        "V 3-1",
        "E 2-2",
        "V 2-0",
        "D 1-2"
      ],
      "sequencia": "2V"
    }
  },
  "Leeds-United": {
    "id": "LEE",
    "cor": "#FFCD00",
    "pais": "ENG",
    "casa": {
      "gpg": 1.14,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 1.16
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 9,
      "pontos": 3,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 1-0 AVL",
        "D 1-1",
        "V 2-1",
        "E 0-0",
        "D 0-1"
      ],
      "sequencia": "1V"
    }
  },
  "Liverpool": {
    "id": "LIV",
    "cor": "#C8102E",
    "pais": "ENG",
    "casa": {
      "gpg": 2.28,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 2.32
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 10,
      "pontos": 1,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 NEW",
        "V 3-1",
        "E 1-1",
        "V 2-0",
        "D 0-1"
      ],
      "sequencia": "1E"
    }
  },
  "Newcastle-United": {
    "id": "NEW",
    "cor": "#241F20",
    "pais": "ENG",
    "casa": {
      "gpg": 2.28,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 2.32
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 10,
      "pontos": 1,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 LIV",
        "V 2-0",
        "D 1-1",
        "V 1-0",
        "E 2-2"
      ],
      "sequencia": "1E"
    }
  },
  "Fulham": {
    "id": "FUL",
    "cor": "#000000",
    "pais": "ENG",
    "casa": {
      "gpg": 2.28,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 3.48
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 12,
      "pontos": 0,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 2-3 CHE",
        "E 1-1",
        "D 0-1",
        "V 2-1",
        "D 1-2"
      ],
      "sequencia": "1D"
    }
  },
  "Bournemouth": {
    "id": "BOU",
    "cor": "#DA291C",
    "pais": "ENG",
    "casa": {
      "gpg": 1.14,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 2.32
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 13,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 1-2 MCI",
        "E 1-1",
        "V 2-0",
        "D 0-2",
        "V 1-0"
      ],
      "sequencia": "1D"
    }
  },
  "Sunderland": {
    "id": "SUN",
    "cor": "#EB172B",
    "pais": "ENG",
    "casa": {
      "gpg": 1.14,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 2.32
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 13,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 1-2 HUL",
        "D 0-0",
        "V 2-1",
        "E 1-1",
        "D 0-2"
      ],
      "sequencia": "2D"
    }
  },
  "Nottingham-Forest": {
    "id": "NFO",
    "cor": "#DD0000",
    "pais": "ENG",
    "casa": {
      "gpg": 1.14,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 1.16
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 15,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-1 BRE",
        "E 0-0",
        "V 1-0",
        "D 1-2",
        "E 1-1"
      ],
      "sequencia": "1D"
    }
  },
  "Crystal-Palace": {
    "id": "CRY",
    "cor": "#1B458F",
    "pais": "ENG",
    "casa": {
      "gpg": 1.14,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 2.32
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 16,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 2-3 CHE",
        "D 1-1",
        "V 2-0",
        "D 0-1",
        "E 0-0"
      ],
      "sequencia": "2D"
    }
  },
  "Manchester-United": {
    "id": "MUN",
    "cor": "#DA291C",
    "pais": "ENG",
    "casa": {
      "gpg": 1.14,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 2.32
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 16,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-2 TOT",
        "D 1-1",
        "V 2-1",
        "E 0-0",
        "D 1-2"
      ],
      "sequencia": "2D"
    }
  },
  "Coventry-City": {
    "id": "COV",
    "cor": "#69BE28",
    "pais": "ENG",
    "casa": {
      "gpg": 1.14,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 3.48
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 18,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-3 ARS",
        "E 1-1",
        "D 0-2",
        "V 1-0",
        "D 1-2"
      ],
      "sequencia": "1D"
    }
  },
  "Tottenham": {
    "id": "TOT",
    "cor": "#132257",
    "pais": "ENG",
    "casa": {
      "gpg": 1.14,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 3.48
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 18,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-0 MUN",
        "D 1-1",
        "E 0-0",
        "V 2-1",
        "D 0-1"
      ],
      "sequencia": "1V"
    }
  },
  "Aston-Villa": {
    "id": "AVL",
    "cor": "#95BFE5",
    "pais": "ENG",
    "casa": {
      "gpg": 1.14,
      "gsg": 3.44
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 4.64
    },
    "premier-league": {
      "jogos": 1,
      "posicao": 20,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 4.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-4 LEE",
        "V 2-1",
        "E 1-1",
        "D 0-2",
        "V 1-0"
      ],
      "sequencia": "1D"
    }
  },
  "Sevilla": {
    "id": "SEV",
    "cor": "#D71920",
    "pais": "ESP",
    "casa": {
      "gpg": 2.85,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 2.0,
      "gsg": 1.16
    },
    "la-liga": {
      "jogos": 2,
      "posicao": 1,
      "pontos": 6,
      "golsPorJogo": 2.5,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-1",
        "V 3-1",
        "E 1-1",
        "V 2-0",
        "D 0-1"
      ],
      "sequencia": "2V"
    }
  },
  "Real-Betis": {
    "id": "BET",
    "cor": "#00954C",
    "pais": "ESP",
    "casa": {
      "gpg": 1.14,
      "gsg": 0.43
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 0.58
    },
    "la-liga": {
      "jogos": 2,
      "posicao": 2,
      "pontos": 6,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 0.5,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 1-0",
        "V 1-0",
        "E 0-0",
        "V 2-1",
        "D 1-2"
      ],
      "sequencia": "2V"
    }
  },
  "Alaves": {
    "id": "ALA",
    "cor": "#0054A6",
    "pais": "ESP",
    "casa": {
      "gpg": 2.28,
      "gsg": 0.43
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 0.58
    },
    "la-liga": {
      "jogos": 2,
      "posicao": 3,
      "pontos": 4,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 0.5,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 1-1",
        "V 3-0",
        "D 0-0",
        "V 1-0",
        "E 1-1"
      ],
      "sequencia": "1E"
    }
  },
  "Atletico-Madrid": {
    "id": "ATM",
    "cor": "#CB3524",
    "pais": "ESP",
    "casa": {
      "gpg": 2.28,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 1.16
    },
    "la-liga": {
      "jogos": 2,
      "posicao": 4,
      "pontos": 4,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 1-1",
        "V 3-1",
        "V 2-0",
        "E 0-0",
        "D 0-1"
      ],
      "sequencia": "1E"
    }
  },
  "Barcelona": {
    "id": "BAR",
    "cor": "#A50044",
    "pais": "ESP",
    "casa": {
      "gpg": 5.7,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 4.0,
      "gsg": 1.16
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 5,
      "pontos": 3,
      "golsPorJogo": 5.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 5-0",
        "E 0-0",
        "V 3-1",
        "V 2-0",
        "D 1-2"
      ],
      "sequencia": "1V"
    }
  },
  "Espanyol": {
    "id": "ESP",
    "cor": "#007FC8",
    "pais": "ESP",
    "casa": {
      "gpg": 4.56,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 3.2,
      "gsg": 2.32
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 6,
      "pontos": 3,
      "golsPorJogo": 4.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-1",
        "D 1-2",
        "V 2-0",
        "E 1-1",
        "V 1-0"
      ],
      "sequencia": "1V"
    }
  },
  "Real-Madrid": {
    "id": "RMA",
    "cor": "#FEBE10",
    "pais": "ESP",
    "casa": {
      "gpg": 2.28,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 1.16
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 7,
      "pontos": 3,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-1",
        "E 0-0",
        "V 3-0",
        "V 2-1",
        "D 0-1"
      ],
      "sequencia": "1V"
    }
  },
  "Getafe": {
    "id": "GET",
    "cor": "#005999",
    "pais": "ESP",
    "casa": {
      "gpg": 1.14,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 3.48
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 8,
      "pontos": 3,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 1-0",
        "D 0-2",
        "E 0-0",
        "V 2-1",
        "D 0-1"
      ],
      "sequencia": "1V"
    }
  },
  "Villarreal": {
    "id": "VIL",
    "cor": "#FFE114",
    "pais": "ESP",
    "casa": {
      "gpg": 4.56,
      "gsg": 3.44
    },
    "fora": {
      "gpg": 3.2,
      "gsg": 4.64
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 9,
      "pontos": 2,
      "golsPorJogo": 4.0,
      "golsSofridosPorJogo": 4.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2",
        "E 1-1",
        "V 2-1",
        "D 0-1",
        "E 1-1"
      ],
      "sequencia": "2E"
    }
  },
  "Deportivo": {
    "id": "DEP",
    "cor": "#0066CC",
    "pais": "ESP",
    "casa": {
      "gpg": 2.28,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 2.32
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 10,
      "pontos": 2,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 1-1",
        "E 1-1",
        "V 2-0",
        "D 1-2",
        "E 0-0"
      ],
      "sequencia": "2E"
    }
  },
  "Osasuna": {
    "id": "OSA",
    "cor": "#D91A21",
    "pais": "ESP",
    "casa": {
      "gpg": 1.54,
      "gsg": 1.07
    },
    "fora": {
      "gpg": 1.08,
      "gsg": 1.45
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 11,
      "pontos": 1,
      "golsPorJogo": 1.35,
      "golsSofridosPorJogo": 1.25,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 0-0",
        "D 0-1",
        "V 1-0",
        "E 1-1",
        "D 0-2"
      ],
      "sequencia": "1E"
    }
  },
  "Celta": {
    "id": "CEL",
    "cor": "#6CACE4",
    "pais": "ESP",
    "casa": {
      "gpg": 1.54,
      "gsg": 1.07
    },
    "fora": {
      "gpg": 1.08,
      "gsg": 1.45
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 12,
      "pontos": 1,
      "golsPorJogo": 1.35,
      "golsSofridosPorJogo": 1.25,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 0-0",
        "V 2-1",
        "D 1-2",
        "E 0-0",
        "V 1-0"
      ],
      "sequencia": "1E"
    }
  },
  "Racing": {
    "id": "RAC",
    "cor": "#008000",
    "pais": "ESP",
    "casa": {
      "gpg": 2.28,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 3.48
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 13,
      "pontos": 1,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 1-2",
        "E 1-1",
        "V 2-1",
        "D 0-1",
        "E 0-0"
      ],
      "sequencia": "1D"
    }
  },
  "Rayo-Vallecano": {
    "id": "RAY",
    "cor": "#E53027",
    "pais": "ESP",
    "casa": {
      "gpg": 2.28,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 3.48
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 14,
      "pontos": 1,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 1-1",
        "D 0-2",
        "V 1-0",
        "E 2-2",
        "D 0-1"
      ],
      "sequencia": "1E"
    }
  },
  "Valencia": {
    "id": "VAL",
    "cor": "#FF6600",
    "pais": "ESP",
    "casa": {
      "gpg": 1.14,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 1.16
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 15,
      "pontos": 1,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 0-0",
        "D 0-1",
        "V 2-1",
        "E 1-1",
        "D 0-2"
      ],
      "sequencia": "1E"
    }
  },
  "Malaga": {
    "id": "MLG",
    "cor": "#0066CC",
    "pais": "ESP",
    "casa": {
      "gpg": 1.14,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 3.48
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 16,
      "pontos": 1,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 1-1",
        "D 0-2",
        "V 1-0",
        "D 1-2",
        "E 0-0"
      ],
      "sequencia": "1E"
    }
  },
  "Levante": {
    "id": "LEV",
    "cor": "#0054A6",
    "pais": "ESP",
    "casa": {
      "gpg": 1.14,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 3.48
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 17,
      "pontos": 1,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-3",
        "E 1-1",
        "V 1-0",
        "D 0-2",
        "E 0-0"
      ],
      "sequencia": "1D"
    }
  },
  "Elche": {
    "id": "ELC",
    "cor": "#008000",
    "pais": "ESP",
    "casa": {
      "gpg": 1.14,
      "gsg": 5.16
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 6.96
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 18,
      "pontos": 1,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 6.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 1-6",
        "E 0-0",
        "D 0-2",
        "V 2-1",
        "E 1-1"
      ],
      "sequencia": "1D"
    }
  },
  "Real-Sociedad": {
    "id": "RSO",
    "cor": "#0054A6",
    "pais": "ESP",
    "casa": {
      "gpg": 1.14,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 1.16
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 19,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-1",
        "V 2-0",
        "E 1-1",
        "D 0-1",
        "V 1-0"
      ],
      "sequencia": "1D"
    }
  },
  "Athletic": {
    "id": "ATH",
    "cor": "#EE2523",
    "pais": "ESP",
    "casa": {
      "gpg": 1.14,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 3.48
    },
    "la-liga": {
      "jogos": 1,
      "posicao": 20,
      "pontos": 0,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 1-3",
        "V 2-1",
        "E 0-0",
        "V 1-0",
        "D 0-2"
      ],
      "sequencia": "1D"
    }
  },
  "Bayern-Munich": {
    "id": "BAY",
    "cor": "#DC052D",
    "pais": "GER",
    "casa": {
      "gpg": 1.88,
      "gsg": 0.99
    },
    "fora": {
      "gpg": 1.32,
      "gsg": 1.33
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 1,
      "pontos": 0,
      "golsPorJogo": 1.65,
      "golsSofridosPorJogo": 1.15,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 4-2 STU",
        "V 3-1",
        "V 2-0",
        "E 1-1",
        "V 2-1"
      ],
      "sequencia": "3V"
    }
  },
  "Borussia-Dortmund": {
    "id": "BVB",
    "cor": "#FDE100",
    "pais": "GER",
    "casa": {
      "gpg": 1.88,
      "gsg": 0.99
    },
    "fora": {
      "gpg": 1.32,
      "gsg": 1.33
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 2,
      "pontos": 0,
      "golsPorJogo": 1.65,
      "golsSofridosPorJogo": 1.15,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-1",
        "D 1-1",
        "V 3-0",
        "V 2-0",
        "D 0-1"
      ],
      "sequencia": "1V"
    }
  },
  "Bayer-Leverkusen": {
    "id": "B04",
    "cor": "#E32221",
    "pais": "GER",
    "casa": {
      "gpg": 1.88,
      "gsg": 0.99
    },
    "fora": {
      "gpg": 1.32,
      "gsg": 1.33
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 3,
      "pontos": 0,
      "golsPorJogo": 1.65,
      "golsSofridosPorJogo": 1.15,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-0",
        "E 2-2",
        "V 3-1",
        "V 1-0",
        "D 1-2"
      ],
      "sequencia": "1V"
    }
  },
  "RB-Leipzig": {
    "id": "RBL",
    "cor": "#DD0741",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 4,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 3-1",
        "D 0-0",
        "V 2-1",
        "V 4-0",
        "E 1-1"
      ],
      "sequencia": "1V"
    }
  },
  "Eintracht-Frankfurt": {
    "id": "SGE",
    "cor": "#E1000F",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 5,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-1",
        "E 1-1",
        "V 3-2",
        "D 0-1",
        "V 2-0"
      ],
      "sequencia": "1V"
    }
  },
  "VfB-Stuttgart": {
    "id": "STU",
    "cor": "#FFFFFF",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 6,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 2-4 BAY",
        "V 1-0",
        "E 2-2",
        "V 3-1",
        "D 0-2"
      ],
      "sequencia": "1D"
    }
  },
  "SC-Freiburg": {
    "id": "SCF",
    "cor": "#E2001A",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 7,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-0",
        "D 1-1",
        "V 1-0",
        "E 0-0",
        "V 2-1"
      ],
      "sequencia": "1V"
    }
  },
  "Wolfsburg": {
    "id": "WOB",
    "cor": "#65BAAD",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 8,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 1-1",
        "V 2-1",
        "D 0-0",
        "V 3-0",
        "D 1-2"
      ],
      "sequencia": "1E"
    }
  },
  "Hoffenheim": {
    "id": "TSG",
    "cor": "#1961AA",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 9,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 3-2",
        "D 2-2",
        "V 1-0",
        "E 1-1",
        "V 2-0"
      ],
      "sequencia": "1V"
    }
  },
  "Werder-Bremen": {
    "id": "SVW",
    "cor": "#009639",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 10,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 1-1",
        "V 2-0",
        "D 0-0",
        "V 1-0",
        "D 1-2"
      ],
      "sequencia": "1D"
    }
  },
  "Union-Berlin": {
    "id": "FCU",
    "cor": "#EB1923",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 11,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 0-0",
        "V 2-1",
        "D 1-1",
        "V 1-0",
        "D 0-2"
      ],
      "sequencia": "1E"
    }
  },
  "Mainz": {
    "id": "M05",
    "cor": "#C3141E",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 12,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 1-0",
        "D 2-2",
        "D 0-0",
        "V 2-1",
        "E 1-1"
      ],
      "sequencia": "1V"
    }
  },
  "Augsburg": {
    "id": "FCA",
    "cor": "#BA3733",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 13,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 1-1",
        "V 2-0",
        "D 0-0",
        "V 1-0",
        "D 1-2"
      ],
      "sequencia": "1D"
    }
  },
  "Heidenheim": {
    "id": "FCH",
    "cor": "#0066CC",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 14,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-0",
        "V 1-0",
        "D 1-1",
        "V 2-1",
        "D 0-1"
      ],
      "sequencia": "1D"
    }
  },
  "St-Pauli": {
    "id": "STP",
    "cor": "#604840",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 15,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 1-1",
        "D 0-1",
        "V 2-0",
        "E 0-0",
        "V 1-0"
      ],
      "sequencia": "1E"
    }
  },
  "Hamburger-SV": {
    "id": "HSV",
    "cor": "#005CA9",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 16,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 1-1",
        "V 2-1",
        "E 0-0",
        "D 0-2",
        "V 3-0"
      ],
      "sequencia": "1D"
    }
  },
  "Koln": {
    "id": "KOE",
    "cor": "#ED1C24",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 17,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-0",
        "D 1-1",
        "V 2-0",
        "D 0-1",
        "E 1-1"
      ],
      "sequencia": "2D"
    }
  },
  "Borussia-Mgladbach": {
    "id": "BMG",
    "cor": "#000000",
    "pais": "GER",
    "casa": {
      "gpg": 1.42,
      "gsg": 1.16
    },
    "fora": {
      "gpg": 1.0,
      "gsg": 1.57
    },
    "bundesliga": {
      "jogos": 0,
      "posicao": 18,
      "pontos": 0,
      "golsPorJogo": 1.25,
      "golsSofridosPorJogo": 1.35,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 1-1",
        "V 2-1",
        "D 0-0",
        "V 3-2",
        "D 1-2"
      ],
      "sequencia": "1D"
    }
  },
  "Schalke-04": {
    "id": "S04", "cor": "#005CA9", "pais": "GER",
    "casa": {"gpg": 1.35, "gsg": 1.2}, "fora": {"gpg": 0.95, "gsg": 1.5},
    "bundesliga": {"jogos": 0, "posicao": 12, "pontos": 0, "golsPorJogo": 1.2, "golsSofridosPorJogo": 1.35, "over25Pct": 46, "bttsPct": 48, "cleanSheetPct": 28, "cartoesPorJogo": 2.3, "escanteiosPorJogo": 5.2, "chutesNoGolPorJogo": 4.5, "ultimos5": ["V 2-0", "D 1-1", "V 1-0", "D 0-1", "E 1-1"], "sequencia": "1V"}
  },
  "SC-Paderborn": {
    "id": "SCP", "cor": "#0066B3", "pais": "GER",
    "casa": {"gpg": 1.38, "gsg": 1.25}, "fora": {"gpg": 0.9, "gsg": 1.55},
    "bundesliga": {"jogos": 0, "posicao": 14, "pontos": 0, "golsPorJogo": 1.15, "golsSofridosPorJogo": 1.4, "over25Pct": 44, "bttsPct": 46, "cleanSheetPct": 26, "cartoesPorJogo": 2.4, "escanteiosPorJogo": 5.0, "chutesNoGolPorJogo": 4.3, "ultimos5": ["V 2-1", "D 0-0", "V 1-0", "D 1-2", "E 2-2"], "sequencia": "1V"}
  },
  "SV-Elversberg": {
    "id": "SVE", "cor": "#005CA9", "pais": "GER",
    "casa": {"gpg": 1.3, "gsg": 1.3}, "fora": {"gpg": 0.85, "gsg": 1.6},
    "bundesliga": {"jogos": 0, "posicao": 16, "pontos": 0, "golsPorJogo": 1.1, "golsSofridosPorJogo": 1.45, "over25Pct": 42, "bttsPct": 44, "cleanSheetPct": 24, "cartoesPorJogo": 2.5, "escanteiosPorJogo": 4.8, "chutesNoGolPorJogo": 4.1, "ultimos5": ["V 1-0", "D 1-1", "D 0-2", "V 2-1", "E 0-0"], "sequencia": "1V"}
  },
  "Porto": {
    "id": "POR",
    "cor": "#003893",
    "pais": "POR",
    "casa": {
      "gpg": 2.28,
      "gsg": 0.28
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 0.38
    },
    "primeira-liga": {
      "jogos": 3,
      "posicao": 1,
      "pontos": 7,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 0.33,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 2-0 ALV",
        "V 2-0",
        "V 3-1",
        "E 1-1",
        "V 2-0"
      ],
      "sequencia": "3V"
    }
  },
  "Arouca": {
    "id": "ARO",
    "cor": "#FFD700",
    "pais": "POR",
    "casa": {
      "gpg": 3.04,
      "gsg": 0.58
    },
    "fora": {
      "gpg": 2.14,
      "gsg": 0.78
    },
    "primeira-liga": {
      "jogos": 3,
      "posicao": 2,
      "pontos": 7,
      "golsPorJogo": 2.67,
      "golsSofridosPorJogo": 0.67,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 4-0 MRN",
        "V 1-0",
        "D 0-1",
        "V 2-1",
        "E 1-1"
      ],
      "sequencia": "2V"
    }
  },
  "Gil-Vicente": {
    "id": "GIL",
    "cor": "#FF0000",
    "pais": "POR",
    "casa": {
      "gpg": 1.14,
      "gsg": 0.28
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 0.38
    },
    "primeira-liga": {
      "jogos": 3,
      "posicao": 3,
      "pontos": 7,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 0.33,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 1-0 RIO",
        "V 2-0",
        "E 1-1",
        "V 1-0",
        "D 0-1"
      ],
      "sequencia": "2V"
    }
  },
  "Maritimo": {
    "id": "MAR",
    "cor": "#006600",
    "pais": "POR",
    "casa": {
      "gpg": 2.28,
      "gsg": 0.86
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 1.16
    },
    "primeira-liga": {
      "jogos": 2,
      "posicao": 4,
      "pontos": 6,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 1.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "V 1-0 CPI",
        "V 2-1",
        "E 0-0",
        "V 2-0",
        "D 1-2"
      ],
      "sequencia": "2V"
    }
  },
  "Academico-Viseu": {
    "id": "ACV",
    "cor": "#0066CC",
    "pais": "POR",
    "casa": {
      "gpg": 2.85,
      "gsg": 1.29
    },
    "fora": {
      "gpg": 2.0,
      "gsg": 1.74
    },
    "primeira-liga": {
      "jogos": 2,
      "posicao": 5,
      "pontos": 5,
      "golsPorJogo": 2.5,
      "golsSofridosPorJogo": 1.5,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 BEN",
        "V 2-0",
        "D 1-1",
        "V 1-0",
        "E 0-0"
      ],
      "sequencia": "1E"
    }
  },
  "Benfica": {
    "id": "BEN",
    "cor": "#FF0000",
    "pais": "POR",
    "casa": {
      "gpg": 5.13,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 3.6,
      "gsg": 2.32
    },
    "primeira-liga": {
      "jogos": 2,
      "posicao": 6,
      "pontos": 5,
      "golsPorJogo": 4.5,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 ACV",
        "V 7-0 CPI",
        "V 2-1",
        "E 1-1",
        "V 3-0"
      ],
      "sequencia": "1E"
    }
  },
  "Braga": {
    "id": "SCB",
    "cor": "#CC0000",
    "pais": "POR",
    "casa": {
      "gpg": 2.28,
      "gsg": 1.29
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 1.74
    },
    "primeira-liga": {
      "jogos": 2,
      "posicao": 7,
      "pontos": 4,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 1.5,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 MOR",
        "V 2-0",
        "D 0-1",
        "V 2-1",
        "E 1-1"
      ],
      "sequencia": "1E"
    }
  },
  "Sporting-CP": {
    "id": "SCP",
    "cor": "#008057",
    "pais": "POR",
    "casa": {
      "gpg": 3.42,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 2.4,
      "gsg": 2.32
    },
    "primeira-liga": {
      "jogos": 2,
      "posicao": 8,
      "pontos": 4,
      "golsPorJogo": 3.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 EST",
        "V 2-1",
        "V 3-0",
        "D 0-1",
        "V 2-0"
      ],
      "sequencia": "1E"
    }
  },
  "Famalicao": {
    "id": "FAM",
    "cor": "#0066CC",
    "pais": "POR",
    "casa": {
      "gpg": 2.28,
      "gsg": 1.72
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 2.32
    },
    "primeira-liga": {
      "jogos": 2,
      "posicao": 9,
      "pontos": 4,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 2.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 1-1 EST",
        "D 1-2 MAR",
        "V 2-0",
        "E 0-0",
        "V 1-0"
      ],
      "sequencia": "1E"
    }
  },
  "Moreirense": {
    "id": "MOR",
    "cor": "#006633",
    "pais": "POR",
    "casa": {
      "gpg": 3.42,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 2.4,
      "gsg": 3.48
    },
    "primeira-liga": {
      "jogos": 1,
      "posicao": 10,
      "pontos": 3,
      "golsPorJogo": 3.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 BRA",
        "D 0-1",
        "V 2-1",
        "E 1-1",
        "D 0-2"
      ],
      "sequencia": "1E"
    }
  },
  "Estoril": {
    "id": "EST",
    "cor": "#003893",
    "pais": "POR",
    "casa": {
      "gpg": 3.42,
      "gsg": 2.58
    },
    "fora": {
      "gpg": 2.4,
      "gsg": 3.48
    },
    "primeira-liga": {
      "jogos": 1,
      "posicao": 11,
      "pontos": 3,
      "golsPorJogo": 3.0,
      "golsSofridosPorJogo": 3.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 1-1 FAM",
        "D 2-0 NAT",
        "V 2-1",
        "E 0-0",
        "V 1-0"
      ],
      "sequencia": "1E"
    }
  },
  "Estrela-Amadora": {
    "id": "ESTA",
    "cor": "#CC0000",
    "pais": "POR",
    "casa": {
      "gpg": 4.56,
      "gsg": 4.3
    },
    "fora": {
      "gpg": 3.2,
      "gsg": 5.8
    },
    "primeira-liga": {
      "jogos": 1,
      "posicao": 12,
      "pontos": 3,
      "golsPorJogo": 4.0,
      "golsSofridosPorJogo": 5.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 SCP",
        "D 0-1 ALV",
        "V 2-1",
        "E 1-1",
        "D 0-1"
      ],
      "sequencia": "1E"
    }
  },
  "Nacional": {
    "id": "NAT",
    "cor": "#006600",
    "pais": "POR",
    "casa": {
      "gpg": 3.42,
      "gsg": 3.44
    },
    "fora": {
      "gpg": 2.4,
      "gsg": 4.64
    },
    "primeira-liga": {
      "jogos": 1,
      "posicao": 13,
      "pontos": 2,
      "golsPorJogo": 3.0,
      "golsSofridosPorJogo": 4.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 SCL",
        "V 2-0 EST",
        "D 0-1",
        "E 1-1",
        "V 1-0"
      ],
      "sequencia": "1E"
    }
  },
  "Santa-Clara": {
    "id": "SCL",
    "cor": "#CC0000",
    "pais": "POR",
    "casa": {
      "gpg": 4.56,
      "gsg": 4.3
    },
    "fora": {
      "gpg": 3.2,
      "gsg": 5.8
    },
    "primeira-liga": {
      "jogos": 1,
      "posicao": 14,
      "pontos": 2,
      "golsPorJogo": 4.0,
      "golsSofridosPorJogo": 5.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "E 2-2 NAT",
        "V 2-0 ACV",
        "D 0-1",
        "E 0-0",
        "V 2-1"
      ],
      "sequencia": "1E"
    }
  },
  "Alverca": {
    "id": "ALV",
    "cor": "#0066CC",
    "pais": "POR",
    "casa": {
      "gpg": 2.28,
      "gsg": 3.44
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 4.64
    },
    "primeira-liga": {
      "jogos": 1,
      "posicao": 15,
      "pontos": 2,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 4.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-2 POR",
        "V 1-0 ESTA",
        "D 0-0",
        "E 1-1",
        "D 0-2"
      ],
      "sequencia": "1D"
    }
  },
  "Casa-Pia": {
    "id": "CPI",
    "cor": "#FFD700",
    "pais": "POR",
    "casa": {
      "gpg": 1.14,
      "gsg": 6.88
    },
    "fora": {
      "gpg": 0.8,
      "gsg": 9.28
    },
    "primeira-liga": {
      "jogos": 1,
      "posicao": 16,
      "pontos": 1,
      "golsPorJogo": 1.0,
      "golsSofridosPorJogo": 8.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-1 MAR",
        "D 0-7 BEN",
        "E 1-1",
        "D 0-2",
        "V 1-0"
      ],
      "sequencia": "2D"
    }
  },
  "Rio-Ave": {
    "id": "RIO",
    "cor": "#006633",
    "pais": "POR",
    "casa": {
      "gpg": 2.28,
      "gsg": 4.3
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 5.8
    },
    "primeira-liga": {
      "jogos": 1,
      "posicao": 17,
      "pontos": 1,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 5.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-1 GIL",
        "D 0-2 POR",
        "E 1-1",
        "V 2-0",
        "D 1-2"
      ],
      "sequencia": "2D"
    }
  },
  "Vitoria-Guimaraes": {
    "id": "VSC",
    "cor": "#FFFFFF",
    "pais": "POR",
    "casa": {
      "gpg": 2.28,
      "gsg": 4.3
    },
    "fora": {
      "gpg": 1.6,
      "gsg": 5.8
    },
    "primeira-liga": {
      "jogos": 1,
      "posicao": 18,
      "pontos": 1,
      "golsPorJogo": 2.0,
      "golsSofridosPorJogo": 5.0,
      "over25Pct": 48,
      "bttsPct": 50,
      "cleanSheetPct": 30,
      "cartoesPorJogo": 2.2,
      "escanteiosPorJogo": 5.4,
      "chutesNoGolPorJogo": 4.6,
      "ultimos5": [
        "D 0-1 ARO",
        "V 2-1 SCP",
        "D 0-2",
        "E 1-1",
        "V 1-0"
      ],
      "sequencia": "1D"
    }
  }
}
};
