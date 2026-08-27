(function () {
  "use strict";

  var M = window.BET_MARKETS;
  var FOOT = window.BET_DATA;
  var FCAL = window.CALENDARIO_2026;
  var TENIS = window.TENIS_DATA;
  var BASQ = window.BASQUETE_DATA;

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

  function currentGames() {
    if (sport === "futebol") return FCAL.jogos || [];
    if (sport === "tenis") return TENIS.jogos || [];
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
      if (sport === "tenis") return g.jogador1 === selectedEntity || g.jogador2 === selectedEntity;
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
    if (sport === "tenis") return Object.keys(TENIS.atletas).sort();
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
    return M.football(t, a, liga, {
      isMandante: isHome,
      mataMata: g.comp === "copa",
      tipo: String(g.fase || "").indexOf("volta") >= 0 ? "volta" : "ida",
      mandanteLabel: label(g.mandante),
      visitanteLabel: label(g.visitante),
      teamLabel: label(team)
    });
  }

  function analyzeTennisGame(g) {
    if (!g.jogador1 || !g.jogador2) {
      return { insuficientes: true, nota: "Confrontos ainda n\u00e3o definidos na chave." };
    }
    var p1 = TENIS.atletas[g.jogador1];
    var p2 = TENIS.atletas[g.jogador2];
    if (!p1 || !p2) return { insuficientes: true, nota: "Sem informa\u00e7\u00f5es suficientes dos atletas." };
    return M.tennis(p1, p2, { superficie: g.superficie || "Hard" });
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
        if (dayGames.some(function (g) { return g.comp === "copa" || g.comp === "usopen"; })) classes.push("has-copa");
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
    if (sport === "tenis") return { a: g.jogador1, b: g.jogador2, aL: label(g.jogador1), bL: label(g.jogador2) };
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
      if (!sides.a || !sides.b) {
        return '<div class="day-game day-game-tbd"><div class="day-game-meta"><span class="comp-badge comp-' + g.comp + '">' +
          (g.torneio || g.liga || g.comp) + "</span> " + (g.fase || "") + "</div>" +
          '<div class="day-game-tbd-msg">' + (g.nota || "Chave a definir") + "</div></div>";
      }
      var status = g.placar
        ? '<span class="day-score">' + String(g.placar).replace(/-/g, " \u00d7 ") + "</span>"
        : '<span class="day-kick">' + (g.horario || "") + "</span>";
      var cls = g.placar ? "played" : (g.data === todayISO ? "live-day" : "upcoming");
      return '<button type="button" class="day-game ' + cls + '" data-id="' + g.id + '">' +
        '<div class="day-game-meta"><span class="comp-badge comp-' + g.comp + '">' +
        (g.torneio || g.liga || g.comp) + "</span><span>" + (g.fase || "") + "</span></div>" +
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
        if (sport === "tenis") return g.jogador1 === selectedEntity || g.jogador2 === selectedEntity;
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
        : analyzeBasketGame(g);
      var blocks = renderMarketsBlock(an);
      if (typeof blocks === "string") {
        return '<article class="fixture-card"><div class="proximo-meta">' + blocks + "</div></article>";
      }
      var meta = fmtData(g.data) + " \u00b7 " + (g.horario || "") + " \u00b7 " + (g.estadio || g.local || g.torneio || "");
      var modelNote = an.modelo ? (" \u00b7 Modelo: " + an.modelo) : "";
      if (an.lambdaHome) modelNote += " (\u03bb " + an.lambdaHome + "/" + an.lambdaAway + ")";
      return '<article class="fixture-card">' +
        '<div class="fixture-head"><span class="comp-badge comp-' + g.comp + '">' +
        (g.torneio || g.liga || g.comp) + '</span><span class="fixture-rotulo">' + (g.fase || "") + "</span></div>" +
        '<div class="proximo-match"><div class="proximo-team"><div class="name">' + sides.aL +
        '</div><div class="role">' + (sport === "tenis" ? "Jogador 1" : "Mandante") +
        '</div></div><div class="proximo-vs">VS</div><div class="proximo-team"><div class="name">' +
        sides.bL + '</div><div class="role">' + (sport === "tenis" ? "Jogador 2" : "Visitante") +
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
      items = t ? [
        { label: "Gols/J", value: t.golsPorJogo, hl: true },
        { label: "Sofridos", value: t.golsSofridosPorJogo },
        { label: "Over 2.5", value: pct(t.over25Pct) },
        { label: "Ambas", value: pct(t.bttsPct) },
        { label: "Esc/J", value: t.escanteiosPorJogo },
        { label: "Posi\u00e7\u00e3o", value: t.posicao || "\u2014" }
      ] : [
        { label: "M\u00e9dia gols", value: liga.mediaGols, hl: true },
        { label: "Over 2.5", value: pct(liga.over25) },
        { label: "BTTS", value: pct(liga.btts) },
        { label: "Casa vence", value: pct(liga.vitoriaMandante) }
      ];
    } else if (sport === "tenis") {
      var p = selectedEntity ? TENIS.atletas[selectedEntity] : null;
      items = p ? [
        { label: "Rating", value: p.rating, hl: true },
        { label: "Hold %", value: pct(p.holdPct) },
        { label: "Break %", value: pct(p.breakPct) },
        { label: "Ace %", value: pct(p.acePct) }
      ] : [
        { label: "Atletas", value: Object.keys(TENIS.atletas).length, hl: true },
        { label: "Eventos", value: TENIS.jogos.length },
        { label: "Torneio", value: "US Open" }
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
      document.getElementById("tableTitle").textContent = "Tabela / stats";
      head.innerHTML = "<tr><th>Time</th><th>Pos</th><th>Gols/J</th><th>Sofr</th><th>O2.5</th><th>Ambas</th></tr>";
      body.innerHTML = entitiesForSport().map(function (name) {
        var s = getFootStats(name, selectedComp === "copa" ? "copa" : "brasileirao");
        if (!s) return "";
        return '<tr data-ent="' + name + '" class="' + (selectedEntity === name ? "selected-row" : "") + '">' +
          "<td>" + label(name) + '</td><td class="num">' + (s.posicao || "\u2014") +
          '</td><td class="num">' + s.golsPorJogo + '</td><td class="num">' + s.golsSofridosPorJogo +
          '</td><td class="num">' + pct(s.over25Pct) + '</td><td class="num">' + pct(s.bttsPct) + "</td></tr>";
      }).join("");
    } else if (sport === "tenis") {
      document.getElementById("tableTitle").textContent = "Atletas";
      head.innerHTML = "<tr><th>Atleta</th><th>Pa\u00eds</th><th>Rating</th><th>Hold</th><th>Break</th><th>Ace</th></tr>";
      body.innerHTML = entitiesForSport().map(function (name) {
        var p = TENIS.atletas[name];
        return '<tr data-ent="' + name + '" class="' + (selectedEntity === name ? "selected-row" : "") + '">' +
          "<td>" + name + "</td><td>" + p.pais + '</td><td class="num">' + p.rating +
          '</td><td class="num">' + pct(p.holdPct) + '</td><td class="num">' + pct(p.breakPct) +
          '</td><td class="num">' + pct(p.acePct) + "</td></tr>";
      }).join("");
    } else {
      document.getElementById("tableTitle").textContent = "Times";
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
      if (sport === "tenis") return g.jogador1 === selectedEntity || g.jogador2 === selectedEntity;
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
      el.innerHTML = "<strong>Modelo matem\u00e1tico \u2014 Futebol</strong><p>Poisson independente para gols de mandante/visitante, com ajuste Dixon-Coles nos placares baixos. Gera 1X2, BTTS, Over/Under, handicap, escanteios e placar correto com odds decimais.</p>";
    } else if (sport === "tenis") {
      el.innerHTML = "<strong>Modelo matem\u00e1tico \u2014 T\u00eanis</strong><p>Bradley-Terry/Elo com rating, hold%, break% e superf\u00edcie. Totais de games via Normal. Sets estimados por probabilidade independente de set.</p>";
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

  function renderAll(resetTarget) {
    if (resetTarget) analyzeTarget = null;
    var titles = {
      futebol: "Futebol 2026",
      tenis: "T\u00eanis 2026",
      basquete: "Basquete 2026"
    };
    document.getElementById("pageTitle").textContent = "Bet da Josi \u2014 " + titles[sport];
    document.getElementById("headerBadge").textContent = selectedEntity ? label(selectedEntity) : "Bet da Josi";
    document.getElementById("metaInfo").textContent =
      titles[sport] + " \u00b7 Hoje " + fmtData(todayISO) + " \u00b7 " + currentGames().length + " eventos no calend\u00e1rio";

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
        analyzeTarget = null;
        renderAll(true);
      };
    });

    document.getElementById("compFilter").onchange = function (e) {
      selectedComp = e.target.value;
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

    renderAll(true);
    setInterval(renderTodayClock, 30000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
