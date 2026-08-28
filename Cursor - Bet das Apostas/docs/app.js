(function () {
  "use strict";

  var M = window.BET_MARKETS;
  var FOOT = window.BET_DATA;
  var FCAL = window.CALENDARIO_2026;
  var TENIS = window.TENIS_DATA;
  var BASQ = window.BASQUETE_DATA;
  var UFC = window.UFC_DATA;

  var DISPLAY = {
    Palmeiras: "Palmeiras", Flamengo: "Flamengo", "Athletico-PR": "Athletico-PR",
    Fluminense: "Fluminense", Cruzeiro: "Cruzeiro", Bahia: "Bahia",
    Bragantino: "Bragantino", Coritiba: "Coritiba", "Atletico-MG": "Atl\u00e9tico-MG",
    Corinthians: "Corinthians", Botafogo: "Botafogo", Vitoria: "Vit\u00f3ria",
    "Sao-Paulo": "S\u00e3o Paulo", Santos: "Santos", Gremio: "Gr\u00eamio",
    Internacional: "Internacional", Mirassol: "Mirassol", Remo: "Remo",
    Vasco: "Vasco", Chapecoense: "Chapecoense",
    "Flamengo-Basq": "Flamengo", "Corinthians-Basq": "Corinthians", "Sao-Jose": "S\u00e3o Jos\u00e9",
    Brasilia: "Bras\u00edlia", Franca: "Franca", Minas: "Minas", Paulistano: "Paulistano",
    Bauru: "Bauru", Pinheiros: "Pinheiros", Unifacisa: "Unifacisa",
    Lakers: "Lakers", Celtics: "Celtics", Nuggets: "Nuggets", Thunder: "Thunder",
    Knicks: "Knicks", "76ers": "76ers", Warriors: "Warriors", Bucks: "Bucks",
    Mavs: "Mavericks", Heat: "Heat", Spurs: "Spurs", Pistons: "Pistons",
    Timberwolves: "Timberwolves", Cavaliers: "Cavaliers", Suns: "Suns", Magic: "Magic",
    "Real Madrid": "Real Madrid", Panathinaikos: "Panathinaikos", Fenerbahce: "Fenerbah\u00e7e",
    Olympiacos: "Olympiacos", Barcelona: "Barcelona", Maccabi: "Maccabi"
  };

  var MONTHS = [
    "Janeiro", "Fevereiro", "Mar\u00e7o", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  var sport = "futebol";
  var tenisGenero = "M";
  var selectedComp = "todos";
  var selectedEntity = "";
  var selectedDate = "";
  var calYear = 2026;
  var calMonth = 7;
  var todayISO = "";
  var analyzeTarget = null;

  function pad2(n) { return String(n).padStart(2, "0"); }
  function getTodayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }
  function isoFromParts(y, m0, day) { return y + "-" + pad2(m0 + 1) + "-" + pad2(day); }
  function fmtData(iso) { return iso.split("-").reverse().join("/"); }
  function label(k) { return DISPLAY[k] || k; }
  function pct(n) { return n + "%"; }
  function probClass(p) {
    if (p >= 62) return "alta";
    if (p >= 52) return "media";
    return "baixa";
  }

  function isDuel() { return sport === "tenis" || sport === "ufc"; }

  function tenisAtletas() {
    return Object.keys(TENIS.atletas).filter(function (name) {
      return TENIS.atletas[name].genero === tenisGenero;
    });
  }

  function matchesTenisGenero(g) {
    if (sport !== "tenis") return true;
    return g.genero === tenisGenero;
  }

  function currentGames() {
    if (sport === "futebol") return FCAL.jogos || [];
    if (sport === "tenis") return (TENIS.jogos || []).filter(matchesTenisGenero);
    if (sport === "ufc") return UFC.jogos || [];
    return BASQ.jogos || [];
  }

  function gamesByDateMap() {
    var map = {};
    currentGames().forEach(function (g) {
      if (!map[g.data]) map[g.data] = [];
      map[g.data].push(g);
    });
    return map;
  }

  function filterGames(list) {
    return list.filter(function (g) {
      if (selectedComp !== "todos" && g.comp !== selectedComp) return false;
      if (!selectedEntity) return true;
      if (isDuel()) return g.jogador1 === selectedEntity || g.jogador2 === selectedEntity;
      return g.mandante === selectedEntity || g.visitante === selectedEntity;
    });
  }

  function gamesOnDate(iso) {
    var map = gamesByDateMap();
    return filterGames(map[iso] || []).slice().sort(function (a, b) {
      return (a.horario || "").localeCompare(b.horario || "");
    });
  }

  function compsForSport() {
    if (sport === "futebol") {
      return [
        { id: "todos", nome: "Todos" },
        { id: "brasileirao", nome: "Brasileir\u00e3o S\u00e9rie A" },
        { id: "copa", nome: "Copa do Brasil" }
      ];
    }
    if (sport === "tenis") {
      return [
        { id: "todos", nome: "Todos" },
        { id: "usopen", nome: "US Open 2026" },
        { id: "grandslam", nome: "Grand Slams" },
        { id: "atp1000", nome: "ATP/WTA 1000" }
      ];
    }
    if (sport === "ufc") {
      return [
        { id: "todos", nome: "Todos" },
        { id: "fightnight", nome: "UFC Fight Night" },
        { id: "ppv", nome: "UFC PPV (numerados)" },
        { id: "noche", nome: "Noche UFC" }
      ];
    }
    return [
      { id: "todos", nome: "Todos" },
      { id: "nba", nome: "NBA" },
      { id: "nbb", nome: "NBB (Brasil)" },
      { id: "euroleague", nome: "EuroLeague" }
    ];
  }

  function basketCompOfTeam(name) {
    var t = BASQ.times[name];
    if (!t) return null;
    if (t.comp) return t.comp;
    if (t.conf) return "nba";
    var nbb = {
      "Flamengo-Basq": 1, Franca: 1, Minas: 1, Paulistano: 1, Bauru: 1,
      Pinheiros: 1, Unifacisa: 1, Brasilia: 1, "Sao-Jose": 1, "Corinthians-Basq": 1
    };
    if (nbb[name]) return "nbb";
    return "euroleague";
  }

  function entitiesForSport() {
    if (sport === "futebol") {
      var list = selectedComp === "copa"
        ? FOOT.competicoes.copa.timesAtivos.slice()
        : FOOT.competicoes.brasileirao.timesAtivos.slice();
      return list.sort(function (a, b) {
        var pa = (FOOT.times[a] && FOOT.times[a].brasileirao && FOOT.times[a].brasileirao.posicao) || 99;
        var pb = (FOOT.times[b] && FOOT.times[b].brasileirao && FOOT.times[b].brasileirao.posicao) || 99;
        return pa - pb;
      });
    }
    if (sport === "tenis") {
      return tenisAtletas().sort(function (a, b) {
        return (TENIS.atletas[a].ranking || 99) - (TENIS.atletas[b].ranking || 99);
      });
    }
    if (sport === "ufc") {
      return Object.keys(UFC.atletas).sort(function (a, b) {
        return (UFC.atletas[b].rating || 0) - (UFC.atletas[a].rating || 0);
      });
    }
    return Object.keys(BASQ.times).filter(function (name) {
      if (selectedComp === "todos") return true;
      return basketCompOfTeam(name) === selectedComp;
    }).sort(function (a, b) {
      return (BASQ.times[b].rating || 0) - (BASQ.times[a].rating || 0);
    });
  }

  function getFootStats(key, comp) {
    var t = FOOT.times[key];
    if (!t) return null;
    if (comp === "copa") return t.copa || t.brasileirao;
    return t.brasileirao || t.copa;
  }

  function getFootTeamInfo(key) {
    return FOOT.times[key] || {};
  }

  function buildFootballContext(g, team, adv, comp) {
    var tInfo = getFootTeamInfo(team);
    var aInfo = getFootTeamInfo(adv);
    var tStats = getFootStats(team, comp);
    var aStats = getFootStats(adv, comp);
    var isHome = g.mandante === team;
    return {
      isMandante: isHome,
      mataMata: g.comp === "copa",
      tipo: String(g.fase || "").indexOf("volta") >= 0 ? "volta" : "ida",
      mandanteLabel: label(g.mandante),
      visitanteLabel: label(g.visitante),
      teamLabel: label(team),
      teamForm: tStats && tStats.ultimos5,
      advForm: aStats && aStats.ultimos5,
      teamSequencia: tStats && tStats.sequencia,
      advSequencia: aStats && aStats.sequencia,
      teamDesfalques: tInfo.desfalques || [],
      advDesfalques: aInfo.desfalques || [],
      teamRetornando: tInfo.retornando || [],
      advRetornando: aInfo.retornando || [],
      teamCasa: tInfo.casa,
      teamFora: tInfo.fora,
      advCasa: aInfo.casa,
      advFora: aInfo.fora,
      mandanteCasa: getFootTeamInfo(g.mandante).casa,
      visitanteFora: getFootTeamInfo(g.visitante).fora
    };
  }

  function analyzeFootballGame(g, focusTeam) {
    var team = focusTeam || g.mandante;
    var isHome = g.mandante === team;
    var adv = isHome ? g.visitante : g.mandante;
    var comp = g.comp === "copa" ? "copa" : "brasileirao";
    var t = getFootStats(team, comp);
    var a = getFootStats(adv, comp) || {
      golsPorJogo: 1.1, golsSofridosPorJogo: 1.1, over25Pct: 40, bttsPct: 42,
      escanteiosPorJogo: 5, cartoesPorJogo: 2.2
    };
    if (!t) return { insuficientes: true, nota: "Sem informa\u00e7\u00f5es suficientes para este confronto." };
    var liga = FOOT.competicoes[comp].liga;
    return M.football(t, a, liga, buildFootballContext(g, team, adv, comp));
  }

  function analyzeTennisGame(g) {
    if (!g.jogador1 || !g.jogador2) {
      return { insuficientes: true, nota: "Confrontos ainda n\u00e3o definidos na chave." };
    }
    var p1 = TENIS.atletas[g.jogador1];
    var p2 = TENIS.atletas[g.jogador2];
    if (!p1 || !p2) return { insuficientes: true, nota: "Sem informa\u00e7\u00f5es suficientes dos atletas." };
    return M.tennis(p1, p2, {
      superficie: g.superficie || "Hard",
      genero: g.genero || p1.genero
    });
  }

  function analyzeUfcGame(g) {
    if (!g.jogador1 || !g.jogador2) {
      return { insuficientes: true, nota: "Luta ainda n\u00e3o definida no card." };
    }
    var f1 = UFC.atletas[g.jogador1];
    var f2 = UFC.atletas[g.jogador2];
    if (!f1 || !f2) return { insuficientes: true, nota: "Sem informa\u00e7\u00f5es suficientes dos lutadores." };
    return M.mma(f1, f2, { weightClass: g.weightClass || f1.weightClass });
  }

  function analyzeBasketGame(g) {
    if (!g.mandante || !g.visitante) return { insuficientes: true };
    var h = BASQ.times[g.mandante];
    var a = BASQ.times[g.visitante];
    if (!h || !a) return { insuficientes: true, nota: "Sem informa\u00e7\u00f5es suficientes dos times." };
    h = Object.assign({ nome: label(g.mandante) }, h);
    a = Object.assign({ nome: label(g.visitante) }, a);
    return M.basketball(h, a, { homeLabel: label(g.mandante), awayLabel: label(g.visitante) });
  }

  function renderTodayClock() {
    var now = new Date();
    document.getElementById("todayClock").innerHTML =
      '<div class="today-label">Hoje</div><div class="today-date">' + fmtData(todayISO) +
      '</div><div class="today-time">' + pad2(now.getHours()) + ":" + pad2(now.getMinutes()) + "</div>";
  }

  function populateFilters() {
    document.body.className = "sport-" + sport;
    var generoGroup = document.getElementById("tenisGeneroGroup");
    if (generoGroup) generoGroup.hidden = sport !== "tenis";
    if (sport === "tenis") {
      document.getElementById("tenisGeneroFilter").value = tenisGenero;
      document.getElementById("teamFilterLabel").textContent = "Atleta";
    } else {
      document.getElementById("teamFilterLabel").textContent = "Time / Atleta";
    }

    var comps = compsForSport();
    if (!comps.some(function (c) { return c.id === selectedComp; })) selectedComp = "todos";
    document.getElementById("compFilter").innerHTML = comps.map(function (c) {
      return '<option value="' + c.id + '"' + (selectedComp === c.id ? " selected" : "") + ">" + c.nome + "</option>";
    }).join("");

    var ents = entitiesForSport();
    if (selectedEntity && ents.indexOf(selectedEntity) < 0) selectedEntity = "";
    document.getElementById("teamFilter").innerHTML = '<option value="">Todos</option>' +
      ents.map(function (e) {
        return '<option value="' + e + '"' + (selectedEntity === e ? " selected" : "") + ">" + label(e) + "</option>";
      }).join("");
    document.getElementById("teamsCount").textContent = ents.length + " op\u00e7\u00f5es";
  }

  function renderCalendar() {
    document.getElementById("calMonthLabel").textContent = MONTHS[calMonth] + " " + calYear;
    var startPad = new Date(calYear, calMonth, 1).getDay();
    var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    var html = "";
    var i;
    for (i = 0; i < startPad; i++) html += '<button type="button" class="cal-day empty-day" disabled></button>';
    for (var day = 1; day <= daysInMonth; day++) {
      var iso = isoFromParts(calYear, calMonth, day);
      var dayGames = gamesOnDate(iso);
      var count = dayGames.length;
      var classes = ["cal-day"];
      if (iso === todayISO) classes.push("is-today");
      if (iso === selectedDate) classes.push("is-selected");
      if (count > 0) {
        classes.push("has-games");
        var allDone = dayGames.every(function (g) { return g.placar != null || (!g.mandante && !g.jogador1); });
        if (allDone && dayGames.some(function (g) { return g.placar; })) classes.push("is-past");
        else if (iso > todayISO) classes.push("is-future");
        if (dayGames.some(function (g) { return g.comp === "copa" || g.comp === "usopen" || g.comp === "ppv" || g.comp === "noche"; })) classes.push("has-copa");
      }
      html += '<button type="button" class="' + classes.join(" ") + '" data-date="' + iso + '">' +
        '<span class="cal-day-num">' + day + "</span>" +
        (count ? '<span class="cal-day-count">' + count + "</span>" : "") + "</button>";
    }
    document.getElementById("calendarGrid").innerHTML = html;
    document.querySelectorAll("#calendarGrid .cal-day[data-date]").forEach(function (btn) {
      btn.onclick = function () {
        selectedDate = btn.getAttribute("data-date");
        renderCalendar();
        renderDayGames();
      };
    });
  }

  function sideNames(g) {
    if (sport === "tenis") {
      var p1 = TENIS.atletas[g.jogador1];
      var p2 = TENIS.atletas[g.jogador2];
      return {
        a: g.jogador1, b: g.jogador2,
        aL: p1 ? ("#" + p1.ranking + " " + p1.nome) : label(g.jogador1),
        bL: p2 ? ("#" + p2.ranking + " " + p2.nome) : label(g.jogador2)
      };
    }
    if (isDuel()) return { a: g.jogador1, b: g.jogador2, aL: label(g.jogador1), bL: label(g.jogador2) };
    return { a: g.mandante, b: g.visitante, aL: label(g.mandante), bL: label(g.visitante) };
  }

  function renderDayGames() {
    var games = gamesOnDate(selectedDate);
    var isToday = selectedDate === todayISO;
    document.getElementById("dayTitle").textContent = isToday ? "Jogos de hoje" : "Jogos do dia";
    document.getElementById("daySubtitle").textContent = fmtData(selectedDate) + " \u2014 " + games.length + " evento(s)";
    var body = document.getElementById("dayGamesBody");
    if (!games.length) {
      body.innerHTML = '<div class="empty">Nenhum evento nesta data para o filtro atual.</div>';
      return;
    }
    body.innerHTML = games.map(function (g) {
      var sides = sideNames(g);
      var badgeClass = sport === "tenis" ? (g.genero === "F" ? "wta" : "atp") : g.comp;
      var badgeLabel = sport === "tenis" ? (g.genero === "F" ? "WTA" : "ATP") : (g.torneio || g.liga || g.comp);
      if (!sides.a || !sides.b) {
        return '<div class="day-game day-game-tbd"><div class="day-game-meta"><span class="comp-badge comp-' + badgeClass + '">' +
          badgeLabel + "</span> " + (g.fase || "") + (g.superficie ? " \u00b7 " + g.superficie : "") + "</div>" +
          '<div class="day-game-tbd-msg">' + (g.nota || "Chave a definir") + "</div></div>";
      }
      var status = g.placar
        ? '<span class="day-score">' + String(g.placar).replace(/-/g, " \u00d7 ") + "</span>"
        : '<span class="day-kick">' + (g.horario || "") + "</span>";
      var cls = g.placar ? "played" : (g.data === todayISO ? "live-day" : "upcoming");
      return '<button type="button" class="day-game ' + cls + '" data-id="' + g.id + '">' +
        '<div class="day-game-meta"><span class="comp-badge comp-' + badgeClass + '">' +
        badgeLabel + "</span><span>" + (g.fase || "") + (g.superficie ? " \u00b7 " + g.superficie : "") + "</span></div>" +
        '<div class="day-game-row"><span class="day-team">' + sides.aL + "</span>" + status +
        '<span class="day-team right">' + sides.bL + "</span></div>" +
        (g.placar ? "" : '<div class="day-game-cta">Abrir an\u00e1lise \u2192</div>') +
        "</button>";
    }).join("");

    body.querySelectorAll(".day-game[data-id]").forEach(function (btn) {
      btn.onclick = function () {
        var g = currentGames().find(function (x) { return x.id === btn.getAttribute("data-id"); });
        if (!g) return;
        analyzeTarget = g;
        var sides = sideNames(g);
        selectedEntity = sides.a || selectedEntity;
        document.getElementById("teamFilter").value = selectedEntity;
        renderAll(false);
        document.getElementById("fixturesContainer").scrollIntoView({ behavior: "smooth" });
      };
    });
  }

  function renderMarketsBlock(an) {
    if (!an || an.insuficientes) {
      return '<div class="empty">' + (an && an.nota ? an.nota : "Sem informa\u00e7\u00f5es suficientes para este mercado.") + "</div>";
    }
    var topHtml = (an.topPicks || []).map(function (p, i) {
      return '<div class="pick-card' + (i === 0 ? " destaque" : "") + '">' +
        '<div class="pick-rank">' + (i + 1) + "</div>" +
        '<div class="pick-info"><div class="pick-mercado">' + p.mercado + "</div>" +
        '<div class="pick-motivo">' + p.grupo + " \u2014 " + p.motivo + "</div></div>" +
        '<div class="pick-side"><div class="pick-prob ' + probClass(p.prob) + '">' + p.prob +
        '%</div><div class="pick-odd">odd ~' + p.odd + "</div></div></div>";
    }).join("");

    var groups = {};
    (an.markets || []).forEach(function (m) {
      if (!groups[m.grupo]) groups[m.grupo] = [];
      groups[m.grupo].push(m);
    });
    var marketsHtml = Object.keys(groups).map(function (g) {
      return '<div class="mercado-grupo"><div class="mercado-grupo-title">' + g + "</div>" +
        groups[g].map(function (it) {
          return '<div class="mercado-row"><span class="mercado-nome">' + it.mercado + "</span>" +
            '<div class="mercado-bar-wrap"><div class="mercado-bar" style="width:' + it.prob + '%"></div></div>' +
            '<span class="mercado-pct ' + probClass(it.prob) + '">' + it.prob + "%</span>" +
            '<span class="mercado-odd">' + it.odd + "</span></div>";
        }).join("") + "</div>";
    }).join("");

    return { topHtml: topHtml, marketsHtml: marketsHtml };
  }

  function renderFixtures() {
    var container = document.getElementById("fixturesContainer");
    var hint = document.getElementById("hintBox");
    var games = [];

    if (analyzeTarget) {
      games = [analyzeTarget];
    } else if (selectedEntity) {
      games = currentGames().filter(function (g) {
        if (g.placar) return false;
        if (g.data < todayISO) return false;
        if (selectedComp !== "todos" && g.comp !== selectedComp) return false;
        if (isDuel()) return g.jogador1 === selectedEntity || g.jogador2 === selectedEntity;
        return g.mandante === selectedEntity || g.visitante === selectedEntity;
      }).sort(function (a, b) { return a.data.localeCompare(b.data); }).slice(0, 3);
    }

    if (!games.length) {
      container.innerHTML = "";
      hint.style.display = "block";
      return;
    }
    hint.style.display = "none";

    container.innerHTML = games.map(function (g) {
      var sides = sideNames(g);
      var an = sport === "futebol" ? analyzeFootballGame(g, selectedEntity || sides.a)
        : sport === "tenis" ? analyzeTennisGame(g)
        : sport === "ufc" ? analyzeUfcGame(g)
        : analyzeBasketGame(g);
      var blocks = renderMarketsBlock(an);
      if (typeof blocks === "string") {
        return '<article class="fixture-card"><div class="proximo-meta">' + blocks + "</div></article>";
      }
      var meta = fmtData(g.data) + " \u00b7 " + (g.horario || "") + " \u00b7 " + (g.estadio || g.local || g.torneio || "");
      if (sport === "futebol" && an.contexto) {
        meta += " \u00b7 " + an.contexto.local + " \u00b7 Forma " + an.contexto.formT + "%/" + an.contexto.formA + "%";
        if (an.contexto.sequencia) meta += " \u00b7 " + an.contexto.sequencia;
        if (an.contexto.desfalques) meta += " \u00b7 " + an.contexto.desfalques;
      }
      if (sport === "tenis" && g.superficie) meta += " \u00b7 Quadra " + g.superficie;
      if (sport === "tenis" && an.rankP1 && an.rankP2) meta += " \u00b7 Ranking #" + an.rankP1 + " vs #" + an.rankP2;
      var modelNote = an.modelo ? (" \u00b7 Modelo: " + an.modelo) : "";
      if (an.lambdaHome) modelNote += " (\u03bb " + an.lambdaHome + "/" + an.lambdaAway + ")";
      var roleA = sport === "tenis"
        ? (TENIS.atletas[sides.a] ? TENIS.atletas[sides.a].idade + " anos" : "Jogador 1")
        : sport === "ufc" ? "Lutador 1" : "Mandante";
      var roleB = sport === "tenis"
        ? (TENIS.atletas[sides.b] ? TENIS.atletas[sides.b].idade + " anos" : "Jogador 2")
        : sport === "ufc" ? "Lutador 2" : "Visitante";
      var circuitoBadge = sport === "tenis" ? (g.genero === "F" ? "wta" : "atp") : g.comp;
      return '<article class="fixture-card">' +
        '<div class="fixture-head"><span class="comp-badge comp-' + circuitoBadge + '">' +
        (sport === "tenis" ? (g.genero === "F" ? "WTA" : "ATP") : (g.torneio || g.liga || g.comp)) +
        '</span><span class="fixture-rotulo">' + (g.fase || "") +
        (g.weightClass ? " \u00b7 " + g.weightClass : "") +
        (g.superficie ? " \u00b7 " + g.superficie : "") + "</span></div>" +
        '<div class="proximo-match"><div class="proximo-team"><div class="name">' + sides.aL +
        '</div><div class="role">' + roleA +
        '</div></div><div class="proximo-vs">VS</div><div class="proximo-team"><div class="name">' +
        sides.bL + '</div><div class="role">' + roleB +
        "</div></div></div>" +
        '<div class="proximo-meta">' + meta +
        (an.expGols ? " \u00b7 Exp. gols " + an.expGols : "") +
        (an.total ? " \u00b7 Exp. pts " + an.total : "") +
        (an.implied ? " \u00b7 Odds 1X2 ~ " + an.implied.home + " / " + an.implied.draw + " / " + an.implied.away : "") +
        modelNote +
        "</div>" +
        '<div class="fixture-body"><div class="fixture-col"><h3>Melhores entradas</h3>' +
        '<div class="top-picks">' + blocks.topHtml + '</div></div>' +
        '<div class="fixture-col"><h3>Todos os mercados</h3>' + blocks.marketsHtml +
        "</div></div></article>";
    }).join("");
  }

  function renderKpis() {
    var items = [];
    if (sport === "futebol") {
      var liga = FOOT.competicoes.brasileirao.liga;
      var t = selectedEntity ? getFootStats(selectedEntity, selectedComp === "copa" ? "copa" : "brasileirao") : null;
      var tInfo = selectedEntity ? getFootTeamInfo(selectedEntity) : null;
      items = t ? [
        { label: "Posição", value: "#" + (t.posicao || "\u2014"), hl: true },
        { label: "Pontos", value: t.pontos || "\u2014" },
        { label: "Sequência", value: t.sequencia || "\u2014" },
        { label: "Forma (5)", value: (t.ultimos5 || []).join(" ") },
        { label: "Desfalques", value: (tInfo.desfalques || []).length || "0" },
        { label: "Retornando", value: (tInfo.retornando || []).length || "0" }
      ] : [
        { label: "M\u00e9dia gols", value: liga.mediaGols, hl: true },
        { label: "Over 2.5", value: pct(liga.over25) },
        { label: "BTTS", value: pct(liga.btts) },
        { label: "Rodada", value: FOOT.competicoes.brasileirao.fase || "\u2014" }
      ];
    } else if (sport === "tenis") {
      var p = selectedEntity ? TENIS.atletas[selectedEntity] : null;
      items = p ? [
        { label: "Ranking", value: "#" + p.ranking, hl: true },
        { label: "Idade", value: p.idade + "a" },
        { label: "Hard", value: pct(p.hardPct) },
        { label: "Saibro", value: pct(p.clayPct) },
        { label: "Grama", value: pct(p.grassPct) }
      ] : [
        { label: tenisGenero === "M" ? "ATP" : "WTA", value: tenisAtletas().length + " atletas", hl: true },
        { label: "Eventos", value: currentGames().length },
        { label: "Torneio", value: "US Open" }
      ];
    } else if (sport === "ufc") {
      var f = selectedEntity ? UFC.atletas[selectedEntity] : null;
      items = f ? [
        { label: "Rating", value: f.rating, hl: true },
        { label: "KO %", value: pct(f.koPct) },
        { label: "SUB %", value: pct(f.subPct) },
        { label: "DEC %", value: pct(f.decisionPct) },
        { label: "Reach", value: f.reach + '"' }
      ] : [
        { label: "Lutadores", value: Object.keys(UFC.atletas).length, hl: true },
        { label: "Lutas", value: UFC.jogos.length },
        { label: "Próximo", value: "Shanghai 29/08" }
      ];
    } else {
      var tm = selectedEntity ? BASQ.times[selectedEntity] : null;
      items = tm ? [
        { label: "Rating", value: tm.rating, hl: true },
        { label: "PPG", value: tm.ppg },
        { label: "OPP", value: tm.opp },
        { label: "Pace", value: tm.pace || "\u2014" }
      ] : [
        { label: "Times", value: entitiesForSport().length, hl: true },
        { label: "Jogos", value: currentGames().filter(function (g) {
          return selectedComp === "todos" || g.comp === selectedComp;
        }).length },
        { label: "Liga", value: selectedComp === "todos" ? "NBA \u00b7 NBB \u00b7 EL" : (selectedComp || "").toUpperCase() }
      ];
    }
    document.getElementById("kpiGrid").innerHTML = items.map(function (i) {
      return '<div class="kpi' + (i.hl ? " highlight" : "") + '"><div class="label">' + i.label +
        '</div><div class="value">' + i.value + "</div></div>";
    }).join("");
  }

  function renderTable() {
    var head = document.getElementById("teamsTableHead");
    var body = document.getElementById("teamsTableBody");
    if (sport === "futebol") {
      document.getElementById("tableTitle").textContent = "Classificação";
      document.getElementById("tableSub").textContent = "Brasileir\u00e3o atualizado \u00b7 clique para filtrar";
      head.innerHTML = "<tr><th>Pos</th><th>Time</th><th>Pts</th><th>Seq</th><th>\u00daltimos 5</th><th>Desf</th></tr>";
      body.innerHTML = entitiesForSport().map(function (name) {
        var s = getFootStats(name, selectedComp === "copa" ? "copa" : "brasileirao");
        var info = getFootTeamInfo(name);
        if (!s) return "";
        return '<tr data-ent="' + name + '" class="' + (selectedEntity === name ? "selected-row" : "") + '">' +
          '<td class="num">' + (s.posicao || "\u2014") + "</td><td>" + label(name) +
          '</td><td class="num">' + (s.pontos || "\u2014") +
          '</td><td class="num">' + (s.sequencia || "\u2014") +
          '</td><td>' + ((s.ultimos5 || []).join(" ")) +
          '</td><td class="num">' + ((info.desfalques || []).length) + "</td></tr>";
      }).join("");
    } else if (sport === "tenis") {
      document.getElementById("tableTitle").textContent = tenisGenero === "M" ? "Ranking ATP" : "Ranking WTA";
      document.getElementById("tableSub").textContent = "Classificação atual \u00b7 clique para filtrar";
      head.innerHTML = "<tr><th>#</th><th>Atleta</th><th>Pa\u00eds</th><th>Idade</th><th>Hard</th><th>Saibro</th><th>Grama</th></tr>";
      body.innerHTML = entitiesForSport().map(function (name) {
        var p = TENIS.atletas[name];
        return '<tr data-ent="' + name + '" class="' + (selectedEntity === name ? "selected-row" : "") + '">' +
          '<td class="num">' + p.ranking + "</td><td>" + p.nome + "</td><td>" + p.pais +
          '</td><td class="num">' + p.idade +
          '</td><td class="num">' + pct(p.hardPct) + '</td><td class="num">' + pct(p.clayPct) +
          '</td><td class="num">' + pct(p.grassPct) + "</td></tr>";
      }).join("");
    } else if (sport === "ufc") {
      document.getElementById("tableTitle").textContent = "Lutadores";
      document.getElementById("tableSub").textContent = "Estat\u00edsticas do filtro atual";
      head.innerHTML = "<tr><th>Lutador</th><th>Pa\u00eds</th><th>Categoria</th><th>Rating</th><th>KO</th><th>SUB</th><th>DEC</th></tr>";
      body.innerHTML = entitiesForSport().map(function (name) {
        var f = UFC.atletas[name];
        return '<tr data-ent="' + name + '" class="' + (selectedEntity === name ? "selected-row" : "") + '">' +
          "<td>" + name + "</td><td>" + f.pais + "</td><td>" + (f.weightClass || "\u2014") +
          '</td><td class="num">' + f.rating +
          '</td><td class="num">' + pct(f.koPct) + '</td><td class="num">' + pct(f.subPct) +
          '</td><td class="num">' + pct(f.decisionPct) + "</td></tr>";
      }).join("");
    } else {
      document.getElementById("tableTitle").textContent = "Times";
      document.getElementById("tableSub").textContent = "Estat\u00edsticas do filtro atual";
      head.innerHTML = "<tr><th>Time</th><th>Rating</th><th>PPG</th><th>OPP</th><th>Pace</th></tr>";
      body.innerHTML = entitiesForSport().map(function (name) {
        var t = BASQ.times[name];
        return '<tr data-ent="' + name + '" class="' + (selectedEntity === name ? "selected-row" : "") + '">' +
          "<td>" + label(name) + '</td><td class="num">' + t.rating +
          '</td><td class="num">' + t.ppg + '</td><td class="num">' + t.opp +
          '</td><td class="num">' + (t.pace || "\u2014") + "</td></tr>";
      }).join("");
    }
    body.querySelectorAll("tr[data-ent]").forEach(function (tr) {
      tr.style.cursor = "pointer";
      tr.onclick = function () {
        selectedEntity = tr.getAttribute("data-ent");
        analyzeTarget = null;
        document.getElementById("teamFilter").value = selectedEntity;
        renderAll(false);
      };
    });
  }

  function renderMatches() {
    var rows = currentGames().filter(function (g) {
      if (!g.placar) return false;
      if (selectedComp !== "todos" && g.comp !== selectedComp) return false;
      if (!selectedEntity) return true;
      if (isDuel()) return g.jogador1 === selectedEntity || g.jogador2 === selectedEntity;
      return g.mandante === selectedEntity || g.visitante === selectedEntity;
    }).sort(function (a, b) { return b.data.localeCompare(a.data); }).slice(0, 20);

    if (!rows.length) {
      document.getElementById("matchesTableBody").innerHTML = "";
      document.getElementById("matchesEmpty").style.display = "block";
      return;
    }
    document.getElementById("matchesEmpty").style.display = "none";
    document.getElementById("matchesTableBody").innerHTML = rows.map(function (g) {
      var sides = sideNames(g);
      return "<tr><td>" + fmtData(g.data) + "</td><td>" + (g.torneio || g.liga || g.comp) +
        "</td><td>" + sides.aL + " \u00d7 " + sides.bL + '</td><td class="num">' + g.placar + "</td></tr>";
    }).join("");
  }

  function updateGlossario() {
    var el = document.getElementById("glossarioText");
    if (sport === "futebol") {
      el.innerHTML = "<strong>Modelo matem\u00e1tico \u2014 Futebol</strong><p>Poisson + Dixon-Coles com <strong>forma recente</strong> (\u00faltimos 5), <strong>sequ\u00eancia</strong>, <strong>casa/fora</strong>, <strong>desfalques</strong> e <strong>retornos</strong>. Dados atualizados a cada recarga da p\u00e1gina.</p>";
    } else if (sport === "tenis") {
      el.innerHTML = "<strong>Modelo matem\u00e1tico \u2014 T\u00eanis</strong><p>Bradley-Terry com <strong>ranking ATP/WTA atualizado</strong>, idade e % por superf\u00edcie. Rankings sincronizados a cada recarga.</p>";
    } else if (sport === "ufc") {
      el.innerHTML = "<strong>Modelo matem\u00e1tico \u2014 UFC</strong><p>Bradley-Terry com rating, alcance e perfil de finish (KO/SUB/DEC). Mercados de vencedor, m\u00e9todo, dura\u00e7\u00e3o e round betting.</p>";
    } else {
      el.innerHTML = "<strong>Modelo matem\u00e1tico \u2014 Basquete</strong><p>Distribui\u00e7\u00e3o Normal para margem e total de pontos (PPG, pace, rating e fator casa). Moneyline, spread e team totals derivados da CDF.</p>";
    }
  }

  function goToToday() {
    todayISO = getTodayISO();
    selectedDate = todayISO;
    var parts = todayISO.split("-").map(Number);
    if (parts[0] === 2026) {
      calYear = 2026;
      calMonth = parts[1] - 1;
    } else {
      calYear = 2026;
      calMonth = 7;
    }
  }

  function syncLabel() {
    if (!window.LIVE_SYNC || LIVE_SYNC.status !== "ok" || !LIVE_SYNC.atualizadoEm) return "";
    var d = new Date(LIVE_SYNC.atualizadoEm);
    if (isNaN(d.getTime())) return " \u00b7 Dados ao vivo";
    return " \u00b7 Atualizado " + pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  }

  function renderAll(resetTarget) {
    if (resetTarget) analyzeTarget = null;
    var titles = {
      futebol: "Futebol 2026",
      tenis: "T\u00eanis 2026",
      basquete: "Basquete 2026",
      ufc: "UFC 2026"
    };
    document.getElementById("pageTitle").textContent = "Bet da Josi \u2014 " + titles[sport];
    document.getElementById("headerBadge").textContent = selectedEntity ? label(selectedEntity) : "Bet da Josi";
    document.getElementById("metaInfo").textContent =
      titles[sport] + (sport === "tenis" ? (" \u00b7 " + (tenisGenero === "M" ? "ATP" : "WTA")) : "") +
      " \u00b7 Hoje " + fmtData(todayISO) + " \u00b7 " + currentGames().length + " eventos" + syncLabel();

    populateFilters();
    updateGlossario();
    renderTodayClock();
    renderCalendar();
    renderDayGames();
    renderFixtures();
    renderKpis();
    renderTable();
    renderMatches();
  }

  function init() {
    goToToday();

    document.querySelectorAll(".sport-tab").forEach(function (tab) {
      tab.onclick = function () {
        document.querySelectorAll(".sport-tab").forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        sport = tab.getAttribute("data-sport");
        selectedComp = "todos";
        selectedEntity = "";
        if (sport === "tenis") tenisGenero = "M";
        analyzeTarget = null;
        renderAll(true);
      };
    });

    document.getElementById("compFilter").onchange = function (e) {
      selectedComp = e.target.value;
      analyzeTarget = null;
      renderAll(false);
    };
    document.getElementById("tenisGeneroFilter").onchange = function (e) {
      tenisGenero = e.target.value;
      selectedEntity = "";
      analyzeTarget = null;
      renderAll(false);
    };
    document.getElementById("teamFilter").onchange = function (e) {
      selectedEntity = e.target.value;
      analyzeTarget = null;
      renderAll(false);
    };
    document.getElementById("searchInput").oninput = function (e) {
      var q = e.target.value.toLowerCase();
      document.querySelectorAll("#teamsTableBody tr").forEach(function (tr) {
        tr.style.display = tr.textContent.toLowerCase().indexOf(q) >= 0 ? "" : "none";
      });
    };
    document.getElementById("btnPrevMonth").onclick = function () {
      if (calMonth === 0) return;
      calMonth--;
      renderCalendar();
    };
    document.getElementById("btnNextMonth").onclick = function () {
      if (calMonth === 11) return;
      calMonth++;
      renderCalendar();
    };
    document.getElementById("btnToday").onclick = function () {
      goToToday();
      renderAll(false);
    };

    var boot = function () {
      if (window.LIVE_SYNC) {
        LIVE_SYNC.fetchAll().finally(function () { renderAll(true); });
      } else {
        renderAll(true);
      }
    };
    boot();
    setInterval(renderTodayClock, 30000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
