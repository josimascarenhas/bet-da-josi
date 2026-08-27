/* Motor matematico Bet da Josi - Poisson / Bradley-Terry / Normal */
(function (global) {
  "use strict";

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function round1(n) { return Math.round(n * 10) / 10; }
  function round0(n) { return Math.round(n); }
  function fact(n) {
    var f = 1, i;
    for (i = 2; i <= n; i++) f *= i;
    return f;
  }
  function poissonPmf(k, lambda) {
    if (lambda <= 0) return k === 0 ? 1 : 0;
    return Math.exp(-lambda) * Math.pow(lambda, k) / fact(k);
  }
  function normalCdf(x, mu, sigma) {
    var z = (x - mu) / (sigma * Math.SQRT2);
    var t = 1 / (1 + 0.3275911 * Math.abs(z));
    var a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    var erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    var sign = z < 0 ? -1 : 1;
    return 0.5 * (1 + sign * erf);
  }
  function toOdd(probPct, margin) {
    margin = margin == null ? 1.05 : margin;
    var p = clamp(probPct, 3, 92) / 100;
    return round1(clamp(margin / p, 1.05, 26));
  }
  function confLabel(p) {
    if (p >= 66) return { cls: "alta", txt: "Alta" };
    if (p >= 54) return { cls: "media", txt: "Media" };
    return { cls: "baixa", txt: "Baixa" };
  }

  /* --- Futebol: Poisson + ajuste Dixon-Coles leve --- */
  function footballAnalyze(teamStats, advStats, liga, ctx) {
    var t = teamStats || {};
    var a = advStats || {};
    liga = liga || {};
    var home = !!ctx.isMandante;
    var avg = Math.max(0.9, liga.mediaGols || 2.4);

    var attT = (t.golsPorJogo || 1.2) / (avg / 2);
    var defT = (t.golsSofridosPorJogo || 1.2) / (avg / 2);
    var attA = (a.golsPorJogo || 1.2) / (avg / 2);
    var defA = (a.golsSofridosPorJogo || 1.2) / (avg / 2);

    var lambdaHome = clamp(attT * defA * (avg / 2) * 1.05, 0.45, 3.1);
    var lambdaAway = clamp(attA * defT * (avg / 2) * 0.95, 0.4, 2.9);
    // Se o time focado e visitante, ainda calculamos placar mandante/visitante do jogo
    if (!home) {
      lambdaHome = clamp(attA * defT * (avg / 2) * 1.05, 0.45, 3.1);
      lambdaAway = clamp(attT * defA * (avg / 2) * 0.95, 0.4, 2.9);
    }

    var rho = -0.08; // Dixon-Coles low-score corr
    function joint(i, j) {
      var p = poissonPmf(i, lambdaHome) * poissonPmf(j, lambdaAway);
      if (i === 0 && j === 0) p *= (1 - lambdaHome * lambdaAway * rho);
      else if (i === 0 && j === 1) p *= (1 + lambdaHome * rho);
      else if (i === 1 && j === 0) p *= (1 + lambdaAway * rho);
      else if (i === 1 && j === 1) p *= (1 - rho);
      return Math.max(0, p);
    }

    var pHome = 0, pDraw = 0, pAway = 0, pBtts = 0, pOver25 = 0, pOver15 = 0, pOver35 = 0, pOver05 = 0;
    var maxG = 8;
    var i, j, p, totalProb = 0;
    var csMap = {};
    for (i = 0; i <= maxG; i++) {
      for (j = 0; j <= maxG; j++) {
        p = joint(i, j);
        totalProb += p;
        if (i > j) pHome += p;
        else if (i === j) pDraw += p;
        else pAway += p;
        if (i > 0 && j > 0) pBtts += p;
        var tg = i + j;
        if (tg >= 1) pOver05 += p;
        if (tg >= 2) pOver15 += p;
        if (tg >= 3) pOver25 += p;
        if (tg >= 4) pOver35 += p;
        if (i <= 3 && j <= 3) {
          var key = i + "-" + j;
          csMap[key] = (csMap[key] || 0) + p;
        }
      }
    }
    // normalize
    pHome = round0(pHome / totalProb * 100);
    pDraw = round0(pDraw / totalProb * 100);
    pAway = 100 - pHome - pDraw;
    // Suavizacao para faixa tipica de casas (evita extremos)
    pHome = clamp(pHome, 18, 72);
    pDraw = clamp(pDraw, 15, 36);
    pAway = clamp(pAway, 12, 68);
    var s3 = pHome + pDraw + pAway;
    pHome = round0(pHome / s3 * 100);
    pDraw = round0(pDraw / s3 * 100);
    pAway = 100 - pHome - pDraw;
    var bttsSim = clamp(round0(pBtts / totalProb * 100), 18, 82);
    var over05 = clamp(round0(pOver05 / totalProb * 100), 55, 95);
    var over15 = clamp(round0(pOver15 / totalProb * 100), 35, 90);
    var over25 = clamp(round0(pOver25 / totalProb * 100), 20, 82);
    var over35 = clamp(round0(pOver35 / totalProb * 100), 10, 70);
    var under25 = 100 - over25;
    var expTotal = lambdaHome + lambdaAway;
    var expTeam = home ? lambdaHome : lambdaAway;
    var expAdv = home ? lambdaAway : lambdaHome;
    var teamWin = home ? pHome : pAway;
    var teamLose = home ? pAway : pHome;

    // Escanteios / cartoes como Poisson de medias
    var escExp = (t.escanteiosPorJogo || 5) + (a.escanteiosPorJogo || 5);
    function poissonOver(lambda, line) {
      var cdf = 0, k, lim = Math.floor(line);
      for (k = 0; k <= lim; k++) cdf += poissonPmf(k, lambda);
      return clamp(round0((1 - cdf) * 100), 15, 85);
    }
    var over85Esc = poissonOver(escExp, 8.5);
    var over95Esc = poissonOver(escExp, 9.5);
    var over105Esc = poissonOver(escExp, 10.5);
    var cartTotal = (liga.mediaCartoesAmarelos || 5.2) * (((t.cartoesPorJogo || 2.2) + (a.cartoesPorJogo || 2.2)) / 4.4);
    var over45Cart = poissonOver(cartTotal, 4.5);
    var over35Cart = poissonOver(cartTotal, 3.5);

    var ahFav = teamWin >= teamLose;
    var ahProb = clamp(teamWin + (ahFav ? -3 : 5), 30, 74);
    var ahMinus1 = clamp(teamWin - 16, 14, 55);
    var dnbWin = round0(teamWin / Math.max(1, teamWin + teamLose) * 100);
    var htHome = clamp(round0(pHome * 0.7 + 10), 22, 60);
    var over05HT = clamp(round0(1 - Math.exp(-(expTotal * 0.45)) * 100), 40, 78);
    // fix HT over calc
    over05HT = clamp(round0((1 - Math.exp(-(expTotal * 0.45))) * 100), 40, 78);

    var csList = Object.keys(csMap).map(function (k) {
      return { m: k, p: clamp(round0(csMap[k] / totalProb * 100), 1, 20) };
    }).sort(function (x, y) { return y.p - x.p; }).slice(0, 5);

    var markets = [];
    function add(grupo, mercado, prob, motivo) {
      markets.push({ grupo: grupo, mercado: mercado, prob: prob, odd: toOdd(prob), conf: confLabel(prob), motivo: motivo });
    }
    add("Resultado Final", ctx.mandanteLabel + " (1)", pHome, "Poisson mandante vs visitante");
    add("Resultado Final", "Empate (X)", pDraw, "P(i=j) no modelo Poisson");
    add("Resultado Final", ctx.visitanteLabel + " (2)", pAway, "Poisson visitante");
    add("Dupla Chance", ctx.mandanteLabel + " ou Empate (1X)", clamp(pHome + pDraw, 42, 88), "1X = 1 + X");
    add("Dupla Chance", ctx.visitanteLabel + " ou Empate (X2)", clamp(pAway + pDraw, 42, 88), "X2 = X + 2");
    add("Ambas Marcam", "Sim (BTTS)", bttsSim, "P(casa>=1 e fora>=1)");
    add("Ambas Marcam", "Nao", 100 - bttsSim, "Pelo menos um no zero");
    add("Gols", "Over 0.5", over05, "lambda total " + expTotal.toFixed(2));
    add("Gols", "Over 1.5", over15, "Soma das P(total>=2)");
    add("Gols", "Over 2.5", over25, "Linha principal O/U");
    add("Gols", "Under 2.5", under25, "P(total<=2)");
    add("Gols", "Over 3.5", over35, "P(total>=4)");
    add("Handicap Asiatico", ctx.teamLabel + " " + (ahFav ? "-0.5" : "+0.5"), ahProb, "Derivado do 1X2");
    add("Handicap Asiatico", ctx.teamLabel + " " + (ahFav ? "-1.0" : "+1.0"), ahMinus1, "AH alternativo");
    add("Empate Anula", "DNB " + ctx.teamLabel, dnbWin, "Condicional sem empate");
    add("Escanteios", "Over 8.5", over85Esc, "Poisson esc. lambda=" + escExp.toFixed(1));
    add("Escanteios", "Over 9.5", over95Esc, "Linha classica");
    add("Escanteios", "Over 10.5", over105Esc, "Pressao ofensiva");
    add("Cartoes", "Over 3.5", over35Cart, "Poisson cartoes");
    add("Cartoes", "Over 4.5", over45Cart, "Media da competicao");
    add("1o Tempo", "Over 0.5 gols HT", over05HT, "Fator 45% do lambda total");
    add("1o Tempo", "Mandante vence HT", htHome, "Estimativa intervalo");
    csList.forEach(function (c) { add("Placar Correto", c.m, c.p, "Massa de probabilidade Poisson"); });
    if (ctx.mataMata) {
      var avanca = clamp(teamWin + (ctx.tipo === "volta" && ctx.golsTimeIda > ctx.golsAdvIda ? 12 : 0), 30, 80);
      add("Classificacao", ctx.teamLabel + " avanca", avanca, "Inclui prorrogacao/penaltis");
    }

    markets.sort(function (x, y) { return y.prob - x.prob; });
    function isUseful(m) {
      if (m.prob < 50 || m.prob > 76) return false;
      if (/Over 0\.5|1X\)|X2\)/.test(m.mercado)) return false;
      return true;
    }
    var top = markets.filter(isUseful).filter(function (m) {
      return ["Resultado Final", "Ambas Marcam", "Gols", "Handicap Asiatico", "Empate Anula", "Escanteios", "Cartoes", "Classificacao"].indexOf(m.grupo) >= 0;
    }).slice(0, 6);
    if (top.length < 3) top = markets.filter(function (m) { return m.prob >= 52 && m.prob <= 74; }).slice(0, 5);

    return {
      expGols: expTotal.toFixed(2),
      lambdaHome: lambdaHome.toFixed(2),
      lambdaAway: lambdaAway.toFixed(2),
      modelo: "Poisson + Dixon-Coles",
      x1: { mandante: pHome, empate: pDraw, visitante: pAway, teamWin: teamWin, teamLose: teamLose },
      markets: markets,
      topPicks: top,
      implied: { home: toOdd(pHome), draw: toOdd(pDraw), away: toOdd(pAway) }
    };
  }

  /* --- Tenis: Bradley-Terry / Elo --- */
  function tennisAnalyze(p1, p2, ctx) {
    p1 = p1 || { nome: "A", rating: 75, holdPct: 75, breakPct: 22, acePct: 8, avgGames: 22 };
    p2 = p2 || { nome: "B", rating: 75, holdPct: 75, breakPct: 22, acePct: 8, avgGames: 22 };
    var diff = (p1.rating - p2.rating) + ((p1.holdPct - p2.holdPct) * 0.08) + ((p1.breakPct - p2.breakPct) * 0.12);
    if (ctx.superficie === "Grass") diff += (p1.acePct - p2.acePct) * 0.15;
    if (ctx.superficie === "Clay") diff += ((p1.breakPct || 22) - (p2.breakPct || 22)) * 0.2;
    // Bradley-Terry
    var win1 = clamp(round0(100 / (1 + Math.pow(10, -diff / 18))), 28, 82);
    var win2 = 100 - win1;
    var pSet = win1 / 100;
    // Best of 3: P(2-0)=p^2, P(2-1)=2p^2(1-p) roughly with indep sets (pSet)
    var sets20 = clamp(round0(pSet * pSet * 100), 18, 58);
    var sets21 = clamp(round0(2 * pSet * pSet * (1 - pSet) * 100 / Math.max(0.01, pSet)), 18, 42);
    // better: P(2-1)=2 * p^2 * (1-p)
    sets21 = clamp(round0(2 * Math.pow(pSet, 2) * (1 - pSet) * 100), 16, 42);
    var totalGames = ((p1.avgGames || 22) + (p2.avgGames || 22)) / 2 + Math.abs(diff) * 0.08;
    function ouGames(line) {
      return clamp(round0((1 - normalCdf(line + 0.5, totalGames, 3.2)) * 100), 25, 78);
    }
    var over22 = ouGames(22.5);
    var over21 = ouGames(21.5);
    var firstSet = clamp(round0(win1 * 0.9 + 5), 30, 75);
    var tb = clamp(round0(32 + Math.abs(diff) * -0.5 + ((p1.acePct + p2.acePct) / 2) * 0.25), 18, 48);

    var markets = [];
    function add(grupo, mercado, prob, motivo) {
      markets.push({ grupo: grupo, mercado: mercado, prob: prob, odd: toOdd(prob), conf: confLabel(prob), motivo: motivo });
    }
    add("Vencedor da Partida", p1.nome + " vence", win1, "Bradley-Terry (rating + serve)");
    add("Vencedor da Partida", p2.nome + " vence", win2, "Bradley-Terry");
    add("Handicap de Games", p1.nome + " -2.5", clamp(win1 - 9, 24, 62), "Game handicap");
    add("Handicap de Games", p2.nome + " +2.5", clamp(100 - (win1 - 9), 32, 76), "Recebe games");
    add("Total de Games", "Over 21.5", over21, "Normal(mu=" + totalGames.toFixed(1) + ", sigma=3.2)");
    add("Total de Games", "Over 22.5", over22, "Linha principal");
    add("Total de Games", "Under 22.5", 100 - over22, "Jogo curto");
    add("Placar em Sets", p1.nome + " 2-0", sets20, "P(set)^2 independente");
    add("Placar em Sets", p1.nome + " 2-1", sets21, "2 * p^2 * (1-p)");
    add("1o Set", p1.nome + " vence o 1o set", firstSet, "Correlacionado ao moneyline");
    add("Especiais", "Havera tie-break", tb, "Aces + equilibrio de rating");
    add("Especiais", p1.nome + " break no 1o set", clamp(round0((p1.breakPct || 22) * 1.55), 28, 70), "Break % historico");

    markets.sort(function (a, b) { return b.prob - a.prob; });
    var top = markets.filter(function (m) { return m.prob >= 54 && m.prob <= 78; }).slice(0, 5);
    if (top.length < 3) top = markets.slice(0, 5);
    return { markets: markets, topPicks: top, win1: win1, win2: win2, modelo: "Bradley-Terry + Normal games" };
  }

  /* --- Basquete: Normal para margem e totais --- */
  function basketballAnalyze(home, away, ctx) {
    home = home || { rating: 80, ppg: 110, opp: 110, pace: 100, homeAdv: 3, nome: "Casa" };
    away = away || { rating: 80, ppg: 110, opp: 110, pace: 100, homeAdv: 3, nome: "Fora" };
    var pace = ((home.pace || 100) + (away.pace || 100)) / 2 / 100;
    var expHome = clamp(((home.ppg + (220 - away.opp)) / 2) * pace + (home.homeAdv || 3) + (home.rating - away.rating) * 0.25, 95, 135);
    var expAway = clamp(((away.ppg + (220 - home.opp)) / 2) * pace + (away.rating - home.rating) * 0.2, 95, 132);
    var total = expHome + expAway;
    var margin = expHome - expAway;
    var sigmaMargin = 11.5;
    var sigmaTotal = 14.5;

    var winHome = clamp(round0((1 - normalCdf(0.0, margin, sigmaMargin)) * 100), 24, 80);
    var winAway = 100 - winHome;
    var line = margin >= 8 ? -8.5 : margin >= 4 ? -5.5 : margin >= 0 ? -2.5 : margin > -4 ? 2.5 : margin > -8 ? 5.5 : 8.5;
    var coverHome = clamp(round0((1 - normalCdf(line + 0.0, margin, sigmaMargin)) * 100), 32, 70);
    // For negative line (favorite -5.5), cover means margin > 5.5
    if (line < 0) coverHome = clamp(round0((1 - normalCdf(-line, margin, sigmaMargin)) * 100), 32, 70);
    else coverHome = clamp(round0(normalCdf(line, margin, sigmaMargin) * 100), 32, 70);

    var lineTotal = Math.round(total * 2) / 2;
    var over = clamp(round0((1 - normalCdf(lineTotal, total, sigmaTotal)) * 100), 28, 74);
    var teamOverHome = clamp(round0((1 - normalCdf(expHome - 0.5, expHome, 9)) * 100), 38, 68);
    var q1Over = clamp(round0(over * 0.92 + 4), 36, 68);
    var race20 = clamp(round0(winHome * 0.82 + 10), 32, 70);

    var markets = [];
    function add(grupo, mercado, prob, motivo) {
      markets.push({ grupo: grupo, mercado: mercado, prob: prob, odd: toOdd(prob), conf: confLabel(prob), motivo: motivo });
    }
    var hN = home.nome || ctx.homeLabel || "Casa";
    var aN = away.nome || ctx.awayLabel || "Fora";
    add("Moneyline", hN + " vence", winHome, "P(margem>0) Normal");
    add("Moneyline", aN + " vence", winAway, "Complementar");
    add("Handicap (Spread)", hN + " " + line, coverHome, "P(margem cobre linha)");
    add("Handicap (Spread)", aN + " " + (-line), 100 - coverHome, "Lado oposto");
    add("Total de Pontos", "Over " + lineTotal, over, "Normal(mu=" + total.toFixed(1) + ")");
    add("Total de Pontos", "Under " + lineTotal, 100 - over, "Complementar do total");
    add("Total do Time", hN + " Over " + (Math.round(expHome) - 0.5), teamOverHome, "Team total");
    add("Total do Time", aN + " Over " + (Math.round(expAway) - 0.5), clamp(100 - teamOverHome + 4, 36, 68), "Team total visitante");
    add("1o Quarto", "Over 52.5 pts Q1", q1Over, "Pace do 1o periodo");
    add("Especiais", hN + " chega a 20 pts primeiro", race20, "Race to 20");
    add("Meio-tempo", hN + " vence HT", clamp(round0(winHome * 0.88 + 4), 30, 70), "Vencedor do 1o tempo");

    markets.sort(function (a, b) { return b.prob - a.prob; });
    var top = markets.filter(function (m) { return m.prob >= 52 && m.prob <= 74; }).slice(0, 5);
    if (top.length < 3) top = markets.slice(0, 5);
    return {
      markets: markets, topPicks: top,
      expHome: expHome.toFixed(1), expAway: expAway.toFixed(1),
      total: total.toFixed(1), spread: line, modelo: "Normal (margem/total)"
    };
  }

  /* --- UFC/MMA: Bradley-Terry + método de vitória --- */
  function mmaAnalyze(f1, f2, ctx) {
    f1 = f1 || { nome: "A", rating: 80, koPct: 30, subPct: 20, decisionPct: 50, reach: 70 };
    f2 = f2 || { nome: "B", rating: 80, koPct: 30, subPct: 20, decisionPct: 50, reach: 70 };
    var reachDiff = ((f1.reach || 70) - (f2.reach || 70)) * 0.35;
    var finishBias = ((f1.koPct + f1.subPct) - (f2.koPct + f2.subPct)) * 0.08;
    var diff = (f1.rating - f2.rating) + reachDiff + finishBias;
    var win1 = clamp(round0(100 / (1 + Math.pow(10, -diff / 16))), 28, 82);
    var win2 = 100 - win1;

    var finishPool1 = (f1.koPct || 30) + (f1.subPct || 20);
    var finishPool2 = (f2.koPct || 30) + (f2.subPct || 20);
    var goDistance = clamp(round0(((f1.decisionPct || 50) + (f2.decisionPct || 50)) / 2 * 0.92 + Math.abs(diff) * -0.4), 28, 68);
    var finishFight = 100 - goDistance;

    var koShare = ((f1.koPct || 30) + (f2.koPct || 30)) / Math.max(1, finishPool1 + finishPool2);
    var koFight = clamp(round0(finishFight * koShare), 18, 55);
    var subFight = clamp(round0(finishFight - koFight), 12, 40);

    var f1Ko = clamp(round0(win1 * ((f1.koPct || 30) / 100) * 1.15), 8, 48);
    var f1Sub = clamp(round0(win1 * ((f1.subPct || 20) / 100) * 1.15), 6, 40);
    var f1Dec = clamp(win1 - f1Ko - f1Sub, 8, 50);
    var f2Ko = clamp(round0(win2 * ((f2.koPct || 30) / 100) * 1.15), 8, 48);
    var f2Sub = clamp(round0(win2 * ((f2.subPct || 20) / 100) * 1.15), 6, 40);
    var f2Dec = clamp(win2 - f2Ko - f2Sub, 8, 50);

    var round1 = clamp(round0(finishFight * 0.38), 14, 42);
    var round2 = clamp(round0(finishFight * 0.28), 12, 32);
    var overRounds = clamp(round0(goDistance + 8), 36, 72);

    var markets = [];
    function add(grupo, mercado, prob, motivo) {
      markets.push({ grupo: grupo, mercado: mercado, prob: prob, odd: toOdd(prob), conf: confLabel(prob), motivo: motivo });
    }
    var n1 = f1.nome || "Lutador 1";
    var n2 = f2.nome || "Lutador 2";
    add("Vencedor da Luta", n1 + " vence", win1, "Bradley-Terry (rating + alcance + finish)");
    add("Vencedor da Luta", n2 + " vence", win2, "Bradley-Terry");
    add("Método de Vitória", n1 + " por KO/TKO", f1Ko, "KO% histórico × P(vitória)");
    add("Método de Vitória", n1 + " por finalização", f1Sub, "SUB% histórico × P(vitória)");
    add("Método de Vitória", n1 + " por decisão", f1Dec, "DEC% histórico × P(vitória)");
    add("Método de Vitória", n2 + " por KO/TKO", f2Ko, "KO% histórico × P(vitória)");
    add("Método de Vitória", n2 + " por finalização", f2Sub, "SUB% histórico × P(vitória)");
    add("Método de Vitória", n2 + " por decisão", f2Dec, "DEC% histórico × P(vitória)");
    add("Duração", "Vai à decisão", goDistance, "Média de decision% do confronto");
    add("Duração", "Termina antes do limite", finishFight, "Complementar da decisão");
    add("Duração", "Over 2.5 rounds", overRounds, "Proxy de luta longa");
    add("Round Betting", "Termina no round 1", round1, "Finish precoce");
    add("Round Betting", "Termina no round 2", round2, "Finish médio");
    add("Especiais", "Haverá KO/TKO na luta", koFight, "Mix de KO% dos lutadores");
    add("Especiais", "Haverá finalização na luta", subFight, "Mix de SUB% dos lutadores");
    if (ctx && ctx.weightClass) {
      add("Contexto", "Categoria: " + ctx.weightClass, clamp(round0(55 + Math.abs(diff) * 0.3), 50, 70), "Info do card");
    }

    markets.sort(function (a, b) { return b.prob - a.prob; });
    var top = markets.filter(function (m) {
      return m.grupo !== "Contexto" && m.prob >= 52 && m.prob <= 78;
    }).slice(0, 5);
    if (top.length < 3) top = markets.filter(function (m) { return m.grupo !== "Contexto"; }).slice(0, 5);
    return { markets: markets, topPicks: top, win1: win1, win2: win2, modelo: "Bradley-Terry MMA + método" };
  }

  global.BET_MARKETS = {
    clamp: clamp, toOdd: toOdd, confLabel: confLabel,
    football: footballAnalyze, tennis: tennisAnalyze, basketball: basketballAnalyze, mma: mmaAnalyze
  };
})(window);
