/* Dados para painel de apostas - Copa do Brasil + Brasileirao 2026 */
window.BET_DATA = {
  meta: {
    atualizadoEm: "2026-08-27",
    fontes: ["CBF", "GE/Globo", "MakeYourStats", "ESPN", "Flashscore", "Exame", "Folha"]
  },

  competicoes: {
    copa: {
      id: "copa",
      nome: "Copa do Brasil",
      fase: "Quartas de final",
      timesAtivos: ["Palmeiras", "Santos", "Vasco", "Vitoria", "Cruzeiro", "Atletico-MG", "Gremio", "Internacional"],
      liga: {
        jogos: 142, mediaGols: 2.14, over25: 35, btts: 39,
        mediaEscanteios: 9.48, over85Escanteios: 58, over95Escanteios: 51,
        mediaCartoesAmarelos: 5.1, over35Cartoes: 72, over45Cartoes: 57,
        mediaChutesNoGol: 7.96, vitoriaMandante: 44, vitoriaVisitante: 25, empate: 31
      }
    },

    serieb: {
      id: "serieb",
      nome: "Brasileir\u00e3o S\u00e9rie B",
      fase: "25\u00aa rodada",
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
      fase: "Quartas de final",
      timesAtivos: [],
      liga: {
        jogos: 125, mediaGols: 2.35, over25: 46, btts: 44,
        mediaEscanteios: 9.6, over85Escanteios: 60, over95Escanteios: 52,
        mediaCartoesAmarelos: 5.4, over35Cartoes: 72, over45Cartoes: 58,
        mediaChutesNoGol: 8.0, vitoriaMandante: 50, vitoriaVisitante: 27, empate: 23
      }
    },

    "premier-league": {
      id: "premier-league",
      nome: "Premier League",
      fase: "2ª rodada",
      timesAtivos: [],
      liga: {"jogos": 380, "mediaGols": 2.85, "over25": 52, "btts": 54, "mediaEscanteios": 10.2, "over85Escanteios": 62, "over95Escanteios": 54, "mediaCartoesAmarelos": 4.2, "over35Cartoes": 68, "over45Cartoes": 52, "mediaChutesNoGol": 8.5, "vitoriaMandante": 46, "vitoriaVisitante": 28, "empate": 26}
    },

    "la-liga": {
      id: "la-liga",
      nome: "La Liga",
      fase: "3ª jornada",
      timesAtivos: [],
      liga: {"jogos": 380, "mediaGols": 2.55, "over25": 48, "btts": 50, "mediaEscanteios": 9.8, "over85Escanteios": 60, "over95Escanteios": 52, "mediaCartoesAmarelos": 4.8, "over35Cartoes": 70, "over45Cartoes": 55, "mediaChutesNoGol": 8.0, "vitoriaMandante": 48, "vitoriaVisitante": 26, "empate": 26}
    },

    bundesliga: {
      id: "bundesliga",
      nome: "Bundesliga",
      fase: "1ª rodada",
      timesAtivos: [],
      liga: {"jogos": 306, "mediaGols": 3.05, "over25": 58, "btts": 56, "mediaEscanteios": 9.5, "over85Escanteios": 58, "over95Escanteios": 50, "mediaCartoesAmarelos": 3.8, "over35Cartoes": 65, "over45Cartoes": 50, "mediaChutesNoGol": 8.8, "vitoriaMandante": 44, "vitoriaVisitante": 30, "empate": 26}
    },

    "primeira-liga": {
      id: "primeira-liga",
      nome: "Primeira Liga",
      fase: "4ª jornada",
      timesAtivos: [],
      liga: {"jogos": 306, "mediaGols": 2.45, "over25": 46, "btts": 48, "mediaEscanteios": 9.0, "over85Escanteios": 55, "over95Escanteios": 48, "mediaCartoesAmarelos": 5.2, "over35Cartoes": 72, "over45Cartoes": 58, "mediaChutesNoGol": 7.8, "vitoriaMandante": 47, "vitoriaVisitante": 27, "empate": 26}
    },
    brasileirao: {
      id: "brasileirao",
      nome: "Brasileir\u00e3o S\u00e9rie A",
      fase: "25\u00aa rodada",
      timesAtivos: [
        "Palmeiras", "Flamengo", "Athletico-PR", "Fluminense", "Cruzeiro", "Bahia",
        "Bragantino", "Coritiba", "Atletico-MG", "Corinthians", "Botafogo", "Vitoria",
        "Sao-Paulo", "Santos", "Gremio", "Internacional", "Mirassol", "Remo", "Vasco", "Chapecoense"
      ],
      liga: {
        jogos: 240, mediaGols: 2.48, over25: 48, btts: 52,
        mediaEscanteios: 9.85, over85Escanteios: 62, over95Escanteios: 54,
        mediaCartoesAmarelos: 5.3, over35Cartoes: 74, over45Cartoes: 59,
        mediaChutesNoGol: 8.2, vitoriaMandante: 46, vitoriaVisitante: 28, empate: 26
      }
    }
  },

  quartas: [
    { id: "pal-san", mandante: "Palmeiras", visitante: "Santos", ida: "2026-08-26", volta: "2026-09-02", horario: "21:30", estadioIda: "Nubank Parque", estadioVolta: "Vila Belmiro", placarIda: "3-0" },
    { id: "vas-vit", mandante: "Vasco", visitante: "Vitoria", ida: "2026-08-26", volta: "2026-09-02", horario: "21:30", estadioIda: "Sao Januario", estadioVolta: "Barradao", placarIda: "1-0" },
    { id: "cru-cam", mandante: "Cruzeiro", visitante: "Atletico-MG", ida: "2026-08-25", volta: "2026-09-01", horario: "21:00", estadioIda: "Mineirao", estadioVolta: "Arena MRV", placarIda: "1-1" },
    { id: "int-gre", mandante: "Internacional", visitante: "Gremio", ida: "2026-08-27", volta: "2026-09-03", horario: "20:00", estadioIda: "Beira-Rio", estadioVolta: "Arena do Gremio", placarIda: null }
  ],

  brasileiraoR25: [
    { data: "2026-08-29", horario: "18:30", mandante: "Atletico-MG", visitante: "Vitoria", estadio: "Arena MRV", rodada: 25 },
    { data: "2026-08-29", horario: "20:00", mandante: "Sao-Paulo", visitante: "Bragantino", estadio: "Morumbi", rodada: 25 },
    { data: "2026-08-29", horario: "21:20", mandante: "Vasco", visitante: "Cruzeiro", estadio: "Sao Januario", rodada: 25 },
    { data: "2026-08-30", horario: "11:00", mandante: "Athletico-PR", visitante: "Fluminense", estadio: "Arena da Baixada", rodada: 25 },
    { data: "2026-08-30", horario: "16:00", mandante: "Flamengo", visitante: "Botafogo", estadio: "Maracana", rodada: 25 },
    { data: "2026-08-30", horario: "16:00", mandante: "Corinthians", visitante: "Santos", estadio: "Neo Quimica Arena", rodada: 25 },
    { data: "2026-08-30", horario: "18:30", mandante: "Mirassol", visitante: "Palmeiras", estadio: "Maihao", rodada: 25 },
    { data: "2026-08-30", horario: "18:30", mandante: "Gremio", visitante: "Chapecoense", estadio: "Arena do Gremio", rodada: 25 },
    { data: "2026-08-30", horario: "19:30", mandante: "Bahia", visitante: "Internacional", estadio: "Arena Fonte Nova", rodada: 25 },
    { data: "2026-08-31", horario: "20:00", mandante: "Remo", visitante: "Coritiba", estadio: "Mangueirao", rodada: 25 }
  ],

  times: {
    Palmeiras: {
      id: "PAL", cor: "#006437",
      copa: { jogos: 4, golsPorJogo: 3.0, golsSofridosPorJogo: 1.0, over25Pct: 50, bttsPct: 25, cleanSheetPct: 50, cartoesPorJogo: 0.5, escanteiosPorJogo: 5.5, chutesNoGolPorJogo: 6.5,
        partidas: [
          { data: "2026-08-02", fase: "Oitavas", mandante: true, adversario: "Fortaleza", placar: "3-0", over25: true, btts: false, escanteios: 7, chutes: 18, cartoes: 2 },
          { data: "2026-08-05", fase: "Oitavas", mandante: false, adversario: "Fortaleza", placar: "2-3", over25: true, btts: true, escanteios: 4, chutes: 14, cartoes: 0 }
        ]
      },
      brasileirao: { jogos: 24, posicao: 1, pontos: 51, golsPorJogo: 1.83, golsSofridosPorJogo: 0.83, over25Pct: 42, bttsPct: 38, cleanSheetPct: 42, cartoesPorJogo: 2.1, escanteiosPorJogo: 5.0, chutesNoGolPorJogo: 5.5,
        ultimos5: ["V 4-1 VAS", "D 2-3 FLU", "E 0-0 INT", "V 4-0 VIT", "D 1-2 CAM"] }
    },
    Flamengo: {
      id: "FLA", cor: "#c62828",
      brasileirao: { jogos: 23, posicao: 2, pontos: 45, golsPorJogo: 1.96, golsSofridosPorJogo: 0.91, over25Pct: 52, bttsPct: 48, cleanSheetPct: 35, cartoesPorJogo: 2.0, escanteiosPorJogo: 6.5, chutesNoGolPorJogo: 6.0,
        ultimos5: ["D 1-2 CRU", "V 2-0 VIT", "V 3-1 INT", "E 1-1 MIR", "V 2-0 BAH"] }
    },
    "Athletico-PR": {
      id: "CAP", cor: "#cc0000",
      brasileirao: { jogos: 23, posicao: 3, pontos: 41, golsPorJogo: 1.35, golsSofridosPorJogo: 0.87, over25Pct: 38, bttsPct: 40, cleanSheetPct: 38, cartoesPorJogo: 2.3, escanteiosPorJogo: 5.5, chutesNoGolPorJogo: 4.8,
        ultimos5: ["V 2-1 BOT", "E 1-1 REM", "V 2-0 CHA", "D 0-1 FLU", "V 1-0 COR"] }
    },
    Fluminense: {
      id: "FLU", cor: "#7b0044",
      brasileirao: { jogos: 24, posicao: 4, pontos: 41, golsPorJogo: 1.50, golsSofridosPorJogo: 1.21, over25Pct: 46, bttsPct: 50, cleanSheetPct: 28, cartoesPorJogo: 2.9, escanteiosPorJogo: 5.5, chutesNoGolPorJogo: 5.0,
        ultimos5: ["V 3-2 PAL", "E 1-1 GRE", "V 2-0 CAP", "D 0-2 BAH", "E 2-2 REM"] }
    },
    Cruzeiro: {
      id: "CRU", cor: "#003366",
      copa: { jogos: 5, golsPorJogo: 1.2, golsSofridosPorJogo: 0.4, over25Pct: 20, bttsPct: 20, cleanSheetPct: 60, cartoesPorJogo: 1.4, escanteiosPorJogo: 4.0, chutesNoGolPorJogo: 4.0,
        partidas: [{ data: "2026-08-25", fase: "Quartas", mandante: true, adversario: "Atletico-MG", placar: "1-1", over25: false, btts: true, escanteios: 4, chutes: 12, cartoes: 1 }]
      },
      brasileirao: { jogos: 24, posicao: 5, pontos: 39, golsPorJogo: 1.42, golsSofridosPorJogo: 1.38, over25Pct: 45, bttsPct: 48, cleanSheetPct: 30, cartoesPorJogo: 2.6, escanteiosPorJogo: 4.8, chutesNoGolPorJogo: 4.5,
        ultimos5: ["V 2-1 FLA", "V 2-1 COR", "V 3-1 MIR", "V 1-0 COR-C", "D 0-1 BOT"] }
    },
    Bahia: {
      id: "BAH", cor: "#004aad",
      brasileirao: { jogos: 24, posicao: 6, pontos: 37, golsPorJogo: 1.42, golsSofridosPorJogo: 1.17, over25Pct: 45, bttsPct: 50, cleanSheetPct: 32, cartoesPorJogo: 2.5, escanteiosPorJogo: 6.0, chutesNoGolPorJogo: 5.2,
        ultimos5: ["V 2-0 VIT", "E 0-0 VAS", "V 2-0 FLU", "E 1-1 CAM", "D 0-1 RBB"] }
    },
    Bragantino: {
      id: "RBB", cor: "#cc0000",
      brasileirao: { jogos: 23, posicao: 7, pontos: 35, golsPorJogo: 1.22, golsSofridosPorJogo: 1.00, over25Pct: 40, bttsPct: 44, cleanSheetPct: 34, cartoesPorJogo: 2.8, escanteiosPorJogo: 5.8, chutesNoGolPorJogo: 4.5,
        ultimos5: ["D 1-2 CAP", "V 2-0 BAH", "E 1-1 INT", "D 0-2 FLA", "V 1-0 CHA"] }
    },
    Coritiba: {
      id: "CFC", cor: "#006633",
      brasileirao: { jogos: 24, posicao: 8, pontos: 34, golsPorJogo: 1.25, golsSofridosPorJogo: 1.29, over25Pct: 42, bttsPct: 46, cleanSheetPct: 26, cartoesPorJogo: 1.8, escanteiosPorJogo: 4.6, chutesNoGolPorJogo: 4.0,
        ultimos5: ["V 2-1 REM", "E 1-1 MIR", "D 0-2 BOT", "V 1-0 CHA", "E 2-2 FLU"] }
    },
    "Atletico-MG": {
      id: "CAM", cor: "#2d2d2d",
      copa: { jogos: 5, golsPorJogo: 1.0, golsSofridosPorJogo: 0.8, over25Pct: 40, bttsPct: 40, cleanSheetPct: 40, cartoesPorJogo: 2.0, escanteiosPorJogo: 5.0, chutesNoGolPorJogo: 3.5,
        partidas: [{ data: "2026-08-25", fase: "Quartas", mandante: false, adversario: "Cruzeiro", placar: "1-1", over25: false, btts: true, escanteios: 6, chutes: 10, cartoes: 2 }]
      },
      brasileirao: { jogos: 23, posicao: 9, pontos: 33, golsPorJogo: 1.30, golsSofridosPorJogo: 1.17, over25Pct: 40, bttsPct: 42, cleanSheetPct: 32, cartoesPorJogo: 1.7, escanteiosPorJogo: 5.2, chutesNoGolPorJogo: 4.0,
        ultimos5: ["E 0-0 INT", "V 3-0 GRE", "E 2-2 REM", "V 2-1 PAL", "E 1-1 BAH"] }
    },
    Corinthians: {
      id: "COR", cor: "#000000",
      brasileirao: { jogos: 24, posicao: 10, pontos: 32, golsPorJogo: 1.08, golsSofridosPorJogo: 1.00, over25Pct: 35, bttsPct: 42, cleanSheetPct: 35, cartoesPorJogo: 2.7, escanteiosPorJogo: 5.8, chutesNoGolPorJogo: 4.2,
        ultimos5: ["V 2-1 CRU", "D 1-2 INT", "E 1-1 RBB", "D 0-1 CAP", "V 1-0 CHA"] }
    },
    Botafogo: {
      id: "BOT", cor: "#000000",
      brasileirao: { jogos: 22, posicao: 11, pontos: 30, golsPorJogo: 1.59, golsSofridosPorJogo: 1.55, over25Pct: 55, bttsPct: 58, cleanSheetPct: 22, cartoesPorJogo: 3.2, escanteiosPorJogo: 5.5, chutesNoGolPorJogo: 5.5,
        ultimos5: ["D 1-2 CAP", "V 2-0 CFC", "E 2-2 FLU", "D 1-2 REM", "V 1-0 MIR"] }
    },
    Vitoria: {
      id: "VIT", cor: "#cc0000",
      copa: { jogos: 4, golsPorJogo: 1.5, golsSofridosPorJogo: 1.25, over25Pct: 50, bttsPct: 50, cleanSheetPct: 25, cartoesPorJogo: 2.25, escanteiosPorJogo: 6.0, chutesNoGolPorJogo: 5.0,
        partidas: [{ data: "2026-08-06", fase: "Oitavas", mandante: true, adversario: "Athletico-PR", placar: "4-0", over25: true, btts: false }]
      },
      brasileirao: { jogos: 24, posicao: 12, pontos: 29, golsPorJogo: 0.96, golsSofridosPorJogo: 1.46, over25Pct: 38, bttsPct: 40, cleanSheetPct: 28, cartoesPorJogo: 2.4, escanteiosPorJogo: 5.5, chutesNoGolPorJogo: 4.2,
        ultimos5: ["D 0-2 FLA", "D 0-2 BAH", "V 1-0 BOT", "D 0-4 PAL", "V 2-0 SAO"] }
    },
    "Sao-Paulo": {
      id: "SAO", cor: "#cc0000",
      brasileirao: { jogos: 23, posicao: 13, pontos: 27, golsPorJogo: 1.17, golsSofridosPorJogo: 1.17, over25Pct: 38, bttsPct: 44, cleanSheetPct: 30, cartoesPorJogo: 2.3, escanteiosPorJogo: 5.2, chutesNoGolPorJogo: 4.5,
        ultimos5: ["D 0-1 CHA", "E 1-1 REM", "V 2-1 GRE", "D 0-2 VIT", "E 0-0 FLU"] }
    },
    Santos: {
      id: "SAN", cor: "#1a1a1a",
      copa: { jogos: 4, golsPorJogo: 0.75, golsSofridosPorJogo: 0, over25Pct: 0, bttsPct: 0, cleanSheetPct: 100, cartoesPorJogo: 3.75, escanteiosPorJogo: 7.3, chutesNoGolPorJogo: 4.7,
        partidas: [{ data: "2026-08-04", fase: "Oitavas", mandante: false, adversario: "Remo", placar: "1-0", over25: false, btts: false }]
      },
      brasileirao: { jogos: 23, posicao: 14, pontos: 26, golsPorJogo: 1.43, golsSofridosPorJogo: 1.57, over25Pct: 35, bttsPct: 45, cleanSheetPct: 22, cartoesPorJogo: 2.8, escanteiosPorJogo: 7.3, chutesNoGolPorJogo: 4.7,
        ultimos5: ["E 1-1 MIR", "V 3-0 VAS", "D 0-2 CAP", "E 2-2 CHA", "D 1-2 BOT"] }
    },
    Gremio: {
      id: "GRE", cor: "#0072bc",
      copa: { jogos: 4, golsPorJogo: 1.5, golsSofridosPorJogo: 0.25, over25Pct: 25, bttsPct: 25, cleanSheetPct: 75, cartoesPorJogo: 1.5, escanteiosPorJogo: 5.5, chutesNoGolPorJogo: 4.5,
        partidas: [{ data: "2026-08-05", fase: "Oitavas", mandante: true, adversario: "Mirassol", placar: "1-0", over25: false, btts: false }]
      },
      brasileirao: { jogos: 23, posicao: 15, pontos: 25, golsPorJogo: 1.04, golsSofridosPorJogo: 1.35, over25Pct: 35, bttsPct: 40, cleanSheetPct: 30, cartoesPorJogo: 2.5, escanteiosPorJogo: 5.5, chutesNoGolPorJogo: 4.0,
        ultimos5: ["D 0-1 RBB", "D 0-3 CAM", "V 2-1 SAO", "E 1-1 FLU", "D 1-2 MIR"] }
    },
    Internacional: {
      id: "INT", cor: "#cc0000",
      copa: { jogos: 4, golsPorJogo: 1.5, golsSofridosPorJogo: 1.75, over25Pct: 75, bttsPct: 75, cleanSheetPct: 25, cartoesPorJogo: 1.75, escanteiosPorJogo: 6.0, chutesNoGolPorJogo: 5.0,
        partidas: [{ data: "2026-08-06", fase: "Oitavas", mandante: false, adversario: "Corinthians", placar: "1-2", over25: true, btts: true }]
      },
      brasileirao: { jogos: 24, posicao: 16, pontos: 25, golsPorJogo: 1.00, golsSofridosPorJogo: 1.17, over25Pct: 42, bttsPct: 50, cleanSheetPct: 28, cartoesPorJogo: 2.5, escanteiosPorJogo: 6.0, chutesNoGolPorJogo: 4.8,
        ultimos5: ["E 0-0 CAM", "E 1-1 REM", "E 0-0 PAL", "E 1-1 FLA", "D 0-2 CAP"] }
    },
    Mirassol: {
      id: "MIR", cor: "#FFD700",
      brasileirao: { jogos: 23, posicao: 17, pontos: 24, golsPorJogo: 1.13, golsSofridosPorJogo: 1.57, over25Pct: 42, bttsPct: 48, cleanSheetPct: 26, cartoesPorJogo: 2.7, escanteiosPorJogo: 5.2, chutesNoGolPorJogo: 4.0,
        ultimos5: ["E 1-1 SAN", "E 1-1 FLA", "D 1-3 CRU", "E 1-1 CFC", "V 2-1 GRE"] }
    },
    Remo: {
      id: "REM", cor: "#003087",
      brasileirao: { jogos: 24, posicao: 18, pontos: 23, golsPorJogo: 1.17, golsSofridosPorJogo: 1.63, over25Pct: 40, bttsPct: 44, cleanSheetPct: 24, cartoesPorJogo: 2.0, escanteiosPorJogo: 4.8, chutesNoGolPorJogo: 4.2,
        ultimos5: ["D 1-2 CFC", "E 1-1 INT", "E 2-2 FLU", "V 2-1 BOT", "E 1-1 CAP"] }
    },
    Vasco: {
      id: "VAS", cor: "#000000",
      copa: { jogos: 4, golsPorJogo: 1.25, golsSofridosPorJogo: 0.75, over25Pct: 25, bttsPct: 25, cleanSheetPct: 50, cartoesPorJogo: 2.5, escanteiosPorJogo: 5.0, chutesNoGolPorJogo: 4.0,
        partidas: [{ data: "2026-08-05", fase: "Oitavas", mandante: false, adversario: "Fluminense", placar: "3-1", over25: true, btts: true }]
      },
      brasileirao: { jogos: 23, posicao: 19, pontos: 22, golsPorJogo: 1.04, golsSofridosPorJogo: 1.65, over25Pct: 38, bttsPct: 42, cleanSheetPct: 25, cartoesPorJogo: 2.1, escanteiosPorJogo: 4.8, chutesNoGolPorJogo: 3.5,
        ultimos5: ["D 1-4 PAL", "E 0-0 BAH", "D 0-2 FLU", "D 0-3 SAN", "E 1-1 MIR"] }
    },
    Chapecoense: {
      id: "CHA", cor: "#006633",
      brasileirao: { jogos: 23, posicao: 20, pontos: 14, golsPorJogo: 1.04, golsSofridosPorJogo: 2.00, over25Pct: 48, bttsPct: 52, cleanSheetPct: 18, cartoesPorJogo: 2.1, escanteiosPorJogo: 4.5, chutesNoGolPorJogo: 3.8,
        ultimos5: ["V 1-0 SAO", "D 0-2 CAP", "E 2-2 SAN", "D 0-1 CFC", "D 1-3 RBB"] }
    }
  }
};

window.COPA_DATA = window.BET_DATA;
