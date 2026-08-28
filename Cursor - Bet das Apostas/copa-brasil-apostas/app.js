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
    Ceara: "Cear\u00e1", Sport: "Sport", "America-MG": "Am\u00e9rica-MG",
    Fortaleza: "Fortaleza", Goias: "Goi\u00e1s", Cuiaba: "Cuiab\u00e1",
    Juventude: "Juventude", Avai: "Ava\u00ed", Criciuma: "Crici\u00fama",
    CRB: "CRB", Novorizontino: "Novorizontino", "Vila-Nova": "Vila Nova",
    "Ponte-Preta": "Ponte Preta", "Operario-PR": "Oper\u00e1rio-PR",
    "Athletic-PR": "Athletic", "Sao-Bernardo": "S\u00e3o Bernardo",
    "Botafogo-SP": "Botafogo-SP", "Atletico-GO": "Atl\u00e9tico-GO",
    Nautico: "N\u00e1utico", Londrina: "Londrina",
    "River-Plate": "River Plate", "Boca-Juniors": "Boca Juniors",
    Penarol: "Pe\u00f1arol", "Nacional-URU": "Nacional (URU)",
    "Colo-Colo": "Colo-Colo", "LDU-Quito": "LDU Quito",
    "Cerro-Porteno": "Cerro Porte\u00f1o", Olimpia: "Ol\u00edmpia",
    "The-Strongest": "The Strongest", Blooming: "Blooming",
    Universitario: "Universitario", "Racing-ARG": "Racing (ARG)",
    "Flamengo-Basq": "Flamengo", "Corinthians-Basq": "Corinthians", "Sao-Jose": "S\u00e3o Jos\u00e9",
    Brasilia: "Bras\u00edlia", Franca: "Franca", Minas: "Minas", Paulistano: "Paulistano",
    Bauru: "Bauru", Pinheiros: "Pinheiros", Unifacisa: "Unifacisa",
    Lakers: "Lakers", Celtics: "Celtics", Nuggets: "Nuggets", Thunder: "Thunder",
    Knicks: "Knicks", "76ers": "76ers", Warriors: "Warriors", Bucks: "Bucks",
    Mavs: "Mavericks", Heat: "Heat", Spurs: "Spurs", Pistons: "Pistons",
    Timberwolves: "Timberwolves", Cavaliers: "Cavaliers", Suns: "Suns", Magic: "Magic",
    "Real Madrid": "Real Madrid", Panathinaikos: "Panathinaikos", Fenerbahce: "Fenerbah\u00e7e",
    Olympiacos: "Olympiacos", Barcelona: "Barcelona", Maccabi: "Maccabi",
    "Bayern-Munich": "Bayern Munich", "Borussia-Dortmund": "Borussia Dortmund",
    "Manchester-City": "Man City", "Manchester-United": "Man United",
    "Arsenal": "Arsenal", "Liverpool": "Liverpool", "Chelsea": "Chelsea",
    "Tottenham": "Tottenham", "Newcastle-United": "Newcastle",
    "Brighton": "Brighton", "Aston-Villa": "Aston Villa", "Brentford": "Brentford",
    "Atletico-Madrid": "Atl\u00e9tico Madrid", "Sevilla": "Sevilla", "Real-Betis": "Betis",
    "Villarreal": "Villarreal", Alaves: "Alav\u00e9s", Benfica: "Benfica", Porto: "Porto",
    "Sporting-CP": "Sporting CP", Braga: "Braga", "VfB-Stuttgart": "Stuttgart"
  };

  var TEAM_LOGOS = {
    Palmeiras: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/64px-Palmeiras_logo.svg.png",
    Flamengo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/64px-Flamengo_braz_logo.svg.png",
    "Athletico-PR": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Club_Athletico_Paranaense_logo.svg/64px-Club_Athletico_Paranaense_logo.svg.png",
    Fluminense: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Fluminense_FC_logo.svg/64px-Fluminense_FC_logo.svg.png",
    Cruzeiro: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Cruzeiro_Esporte_Clube_logo.svg/64px-Cruzeiro_Esporte_Clube_logo.svg.png",
    Bahia: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Esporte_Clube_Bahia_logo.svg/64px-Esporte_Clube_Bahia_logo.svg.png",
    Bragantino: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Red_Bull_Bragantino_logo.svg/64px-Red_Bull_Bragantino_logo.svg.png",
    Coritiba: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Coritiba_Foot_Ball_Club_logo.svg/64px-Coritiba_Foot_Ball_Club_logo.svg.png",
    "Atletico-MG": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Clube_Atl%C3%A9tico_Mineiro_logo.svg/64px-Clube_Atl%C3%A9tico_Mineiro_logo.svg.png",
    Corinthians: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sport_Club_Corinthians_Paulista_logo.svg/64px-Sport_Club_Corinthians_Paulista_logo.svg.png",
    Botafogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg/64px-Botafogo_de_Futebol_e_Regatas_logo.svg.png",
    Vitoria: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Esporte_Clube_Vit%C3%B3ria_logo.svg/64px-Esporte_Clube_Vit%C3%B3ria_logo.svg.png",
    "Sao-Paulo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/S%C3%A3o_Paulo_Futebol_Clube_logo.svg/64px-S%C3%A3o_Paulo_Futebol_Clube_logo.svg.png",
    Santos: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Santos_FC_logo.svg/64px-Santos_FC_logo.svg.png",
    Gremio: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Gremio_logo.svg/64px-Gremio_logo.svg.png",
    Internacional: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Sport_Club_Internacional_logo.svg/64px-Sport_Club_Internacional_logo.svg.png",
    Mirassol: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Mirassol_Futebol_Clube_logo.svg/64px-Mirassol_Futebol_Clube_logo.svg.png",
    Remo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Clube_do_Remo_logo.svg/64px-Clube_do_Remo_logo.svg.png",
    Vasco: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/CR_Vasco_da_Gama_logo.svg/64px-CR_Vasco_da_Gama_logo.svg.png",
    Chapecoense: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Associa%C3%A7%C3%A3o_Chapecoense_de_Futebol_logo.svg/64px-Associa%C3%A7%C3%A3o_Chapecoense_de_Futebol_logo.svg.png",
    Ceara: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Cear%C3%A1_Sporting_Club_logo.svg/64px-Cear%C3%A1_Sporting_Club_logo.svg.png",
    Sport: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Sport_Club_do_Recife_logo.svg/64px-Sport_Club_do_Recife_logo.svg.png",
    Fortaleza: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Fortaleza_Esporte_Clube_logo.svg/64px-Fortaleza_Esporte_Clube_logo.svg.png",
    Goias: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Goi%C3%A1s_Esporte_Clube_logo.svg/64px-Goi%C3%A1s_Esporte_Clube_logo.svg.png",
    Cuiaba: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Cuiaba_Esporte_Clube_logo.svg/64px-Cuiaba_Esporte_Clube_logo.svg.png",
    "River-Plate": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Club_Atl%C3%A9tico_River_Plate_logo.svg/64px-Club_Atl%C3%A9tico_River_Plate_logo.svg.png",
    "Boca-Juniors": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/CABJ70.png/64px-CABJ70.png"
  };

  var currentView = "painel";
  var diaProbMin = 70;
  var diaValueOnly = false;

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

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function teamMeta(key) {
    var t = FOOT.times[key];
    if (t) return { id: t.id, cor: t.cor || "#555" };
    return { id: String(key || "???").slice(0, 3).toUpperCase(), cor: "#555" };
  }

  function footCompId(g) {
    return g.comp || "brasileirao";
  }

  function compDisplayName(comp, g) {
    if (g && g.torneio) return g.torneio;
    var map = {
      brasileirao: "Série A", serieb: "Série B", libertadores: "Libertadores", copa: "Copa do Brasil",
      "premier-league": "Premier League", "la-liga": "La Liga", bundesliga: "Bundesliga",
      "primeira-liga": "Primeira Liga"
    };
    return map[comp] || comp || "";
  }

  function footCompList() {
    return ["brasileirao", "serieb", "libertadores", "copa",
      "premier-league", "la-liga", "bundesliga", "primeira-liga"];
  }

  function isForeignTeam(key) {
    var t = FOOT.times[key];
    return !!(t && t.pais && t.pais !== "BRA");
  }

  function teamCrestHtml(key, sizeClass) {
    if (!key || sport !== "futebol") return "";
    if (isForeignTeam(key)) {
      var meta = teamMeta(key);
      return '<span class="team-crest-fb' + (sizeClass ? " " + sizeClass : "") +
        '" style="background:' + meta.cor + '">' + (FOOT.times[key].pais || meta.id) + "</span>";
    }
    sizeClass = sizeClass || "";
    var meta = teamMeta(key);
    var fbCls = "team-crest-fb" + (sizeClass ? " " + sizeClass : "");
    var imgCls = "team-crest" + (sizeClass ? " " + sizeClass : "");
    var url = TEAM_LOGOS[key];
    if (!url) {
      return '<span class="' + fbCls + '" style="background:' + meta.cor + '">' + meta.id + "</span>";
    }
    return '<span class="crest-wrap-inline">' +
      '<img class="' + imgCls + '" src="' + url + '" alt="" loading="lazy" ' +
      'onerror="this.style.display=\'none\';var n=this.nextElementSibling;if(n)n.style.display=\'inline-grid\'">' +
      '<span class="' + fbCls + '" style="display:none;background:' + meta.cor + '">' + meta.id + "</span></span>";
  }

  function teamCellHtml(key) {
    var crest = teamCrestHtml(key, "sm");
    return '<span class="team-cell">' + (crest || "") + "<span>" + esc(label(key)) + "</span></span>";
  }

  function parseFormItem(s) {
    var m = String(s).match(/^([VDE])\s*(.*)$/i);
    if (!m) return { letter: "?", score: s, cls: "form-draw" };
    var letter = m[1].toUpperCase();
    var cls = letter === "V" ? "form-win" : letter === "D" ? "form-loss" : "form-draw";
    return { letter: letter, score: m[2] || "", cls: cls };
  }

  function renderFormBadges(ultimos5) {
    if (!ultimos5 || !ultimos5.length) return '<span style="color:var(--muted)">\u2014</span>';
    return '<div class="form-strip">' + ultimos5.map(function (s) {
      var p = parseFormItem(s);
      return '<span class="form-badge ' + p.cls + '" title="' + esc(s) + '">' +
        '<span class="form-letter">' + p.letter + "</span>" +
        (p.score ? '<span class="form-score">' + esc(p.score) + "</span>" : "") +
        "</span>";
    }).join("") + "</div>";
  }

  function infoChip(lbl, val, wide) {
    return '<div class="info-chip' + (wide ? " wide" : "") + '">' +
      '<span class="chip-label">' + esc(lbl) + '</span><span class="chip-value">' + val + "</span></div>";
  }

  function renderInjuryHtml(teamKey, desfalques, retornando) {
    var parts = [];
    if (desfalques && desfalques.length) {
      parts.push('<div class="injury-list"><strong>' + esc(label(teamKey)) + ":</strong> " +
        desfalques.map(function (d) {
          return '<span class="out">' + esc(d.jogador || d) + "</span>";
        }).join(", ") + " fora</div>");
    }
    if (retornando && retornando.length) {
      parts.push('<div class="injury-list"><span class="in">Retornam: ' +
        retornando.map(function (r) { return esc(r.jogador || r); }).join(", ") + "</span></div>");
    }
    return parts.join("");
  }

  function renderFixtureInfo(g, an, sides) {
    var html = '<div class="fixture-info">';
    html += '<div class="fixture-info-row">' +
      infoChip("Data", fmtData(g.data)) +
      infoChip("Hor\u00e1rio", esc(g.horario || "\u2014")) +
      infoChip("Local", esc(g.estadio || g.local || g.torneio || "\u2014")) +
      "</div>";

    if (sport === "futebol" && an && !an.insuficientes) {
      var comp = footCompId(g);
      var statsM = getFootStats(g.mandante, comp);
      var statsV = getFootStats(g.visitante, comp);
      var infoM = getFootTeamInfo(g.mandante);
      var infoV = getFootTeamInfo(g.visitante);
      var ctx = an.contexto || {};

      html += '<div class="fixture-info-row">' +
        infoChip("Mando", esc(ctx.local || "\u2014")) +
        infoChip("Exp. gols", esc(an.expGols || "\u2014")) +
        (an.modelo ? infoChip("Modelo", esc(an.modelo + (an.lambdaHome ? " (\u03bb " + an.lambdaHome + "/" + an.lambdaAway + ")" : ""))) : "") +
        "</div>";

      html += '<div class="fixture-info-row">' +
        '<div class="info-chip wide"><span class="chip-label">Forma ' + teamCellHtml(g.mandante) +
        " \u00b7 " + (ctx.formT != null ? ctx.formT + "%" : "\u2014") + '</span>' +
        '<div class="chip-value">' + renderFormBadges(statsM && statsM.ultimos5) + "</div></div>" +
        '<div class="info-chip wide"><span class="chip-label">Forma ' + teamCellHtml(g.visitante) +
        " \u00b7 " + (ctx.formA != null ? ctx.formA + "%" : "\u2014") + '</span>' +
        '<div class="chip-value">' + renderFormBadges(statsV && statsV.ultimos5) + "</div></div>" +
        "</div>";

      html += '<div class="fixture-info-row">' +
        infoChip("Seq. " + label(g.mandante), esc((statsM && statsM.sequencia) || "\u2014")) +
        infoChip("Seq. " + label(g.visitante), esc((statsV && statsV.sequencia) || "\u2014")) +
        "</div>";

      var inj = renderInjuryHtml(g.mandante, infoM.desfalques, infoM.retornando) +
        renderInjuryHtml(g.visitante, infoV.desfalques, infoV.retornando);
      if (inj) html += '<div class="info-chip wide">' + inj + "</div>";

      if (an.implied) {
        html += '<div class="fixture-info-row"><div class="info-chip wide"><span class="chip-label">Odds 1X2 (impl\u00edcitas)</span>' +
          '<div class="odds-row">' +
          '<div class="odd-box"><div class="odd-lbl">1</div><div class="odd-val">' + an.implied.home + "</div></div>" +
          '<div class="odd-box"><div class="odd-lbl">X</div><div class="odd-val">' + an.implied.draw + "</div></div>" +
          '<div class="odd-box"><div class="odd-lbl">2</div><div class="odd-val">' + an.implied.away + "</div></div>" +
          "</div></div></div>";
      }
    } else if (sport === "tenis") {
      var extra = "";
      if (g.superficie) extra += infoChip("Quadra", esc(g.superficie));
      if (an.rankP1 && an.rankP2) extra += infoChip("Ranking", "#" + an.rankP1 + " vs #" + an.rankP2);
      if (extra) html += '<div class="fixture-info-row">' + extra + "</div>";
    } else if (sport === "ufc" && g.weightClass) {
      html += '<div class="fixture-info-row">' + infoChip("Categoria", esc(g.weightClass)) + "</div>";
    } else if (an && an.total) {
      html += '<div class="fixture-info-row">' + infoChip("Exp. pontos", esc(an.total)) + "</div>";
    }

    html += "</div>";
    return html;
  }

  function renderHeaderSelected() {
    var el = document.getElementById("headerSelected");
    if (!el) return;
    if (!selectedEntity || sport !== "futebol") {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }
    var s = getFootStats(selectedEntity, activeFootComp());
    el.hidden = false;
    el.innerHTML = teamCrestHtml(selectedEntity, "lg") +
      '<div><div class="team-name-lg">' + esc(label(selectedEntity)) + "</div>" +
      (s && s.posicao ? '<div class="team-pos">#' + s.posicao + " \u00b7 " + (s.pontos || 0) + " pts</div>" : "") +
      "</div>";
  }

  function switchView(view) {
    currentView = view;
    document.querySelectorAll(".view-tab").forEach(function (tab) {
      tab.classList.toggle("active", tab.getAttribute("data-view") === view);
    });
    document.getElementById("viewPainel").hidden = view !== "painel";
    document.getElementById("viewDia").hidden = view !== "dia";
    document.getElementById("viewModelo").hidden = view !== "modelo";
    document.getElementById("viewNoticias").hidden = view !== "noticias";
    var search = document.getElementById("searchInput");
    if (search) {
      search.placeholder = view === "noticias" ? "Buscar not\u00edcias\u2026" : "Filtrar tabela\u2026";
      if (view === "noticias") renderNews();
      if (view === "dia") renderDia();
    }
  }

  function newsUpdatedLabel() {
    if (!window.LIVE_SYNC || !LIVE_SYNC.newsAtualizadoEm) return "";
    var d = new Date(LIVE_SYNC.newsAtualizadoEm);
    if (isNaN(d.getTime())) return "";
    return "Atualizado " + pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + " " +
      pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  }

  function newsForCurrentFilter() {
    var data = window.NEWS_DATA;
    if (!data) return [];
    var q = (document.getElementById("searchInput").value || "").toLowerCase().trim();
    var items = [];

    if (sport === "futebol") {
      var foot = data.futebol || {};
      if (selectedEntity && foot.times && foot.times[selectedEntity]) {
        items = foot.times[selectedEntity].slice();
      } else {
        items = (foot.geral || []).slice();
      }
    } else if (sport === "tenis") {
      items = ((data.tenis && data.tenis.geral) || []).slice();
      if (selectedEntity) {
        var name = (TENIS.atletas[selectedEntity] && TENIS.atletas[selectedEntity].nome) || selectedEntity;
        var nl = name.toLowerCase();
        items = items.filter(function (n) {
          return n.titulo.toLowerCase().indexOf(nl) >= 0 ||
            (n.resumo && n.resumo.toLowerCase().indexOf(nl) >= 0);
        });
      }
    } else if (sport === "ufc") {
      items = ((data.ufc && data.ufc.geral) || []).slice();
      if (selectedEntity) {
        var fl = selectedEntity.toLowerCase();
        items = items.filter(function (n) {
          return n.titulo.toLowerCase().indexOf(fl) >= 0 ||
            (n.resumo && n.resumo.toLowerCase().indexOf(fl) >= 0);
        });
      }
    } else {
      items = ((data.basquete && data.basquete.geral) || []).slice();
      if (selectedEntity) {
        var bl = label(selectedEntity).toLowerCase();
        items = items.filter(function (n) {
          return n.titulo.toLowerCase().indexOf(bl) >= 0 ||
            (n.resumo && n.resumo.toLowerCase().indexOf(bl) >= 0);
        });
      }
    }

    if (q) {
      items = items.filter(function (n) {
        return n.titulo.toLowerCase().indexOf(q) >= 0 ||
          (n.resumo && n.resumo.toLowerCase().indexOf(q) >= 0);
      });
    }
    return items;
  }

  function renderNews() {
    var body = document.getElementById("newsBody");
    var sub = document.getElementById("newsSub");
    var meta = document.getElementById("newsMeta");
    if (!body) return;

    var sportLabels = {
      futebol: "Futebol", tenis: "T\u00eanis", basquete: "Basquete", ufc: "UFC"
    };
    var filterLabel = selectedEntity ? label(selectedEntity) : "Todos";
    if (sub) {
      sub.innerHTML = sportLabels[sport] + " \u00b7 " + filterLabel +
        ' \u00b7 Fonte: <a href="https://ge.globo.com/" target="_blank" rel="noopener noreferrer">ge.globo.com</a>';
    }
    if (meta) {
      var lbl = newsUpdatedLabel();
      meta.textContent = lbl || "Sincronizando\u2026";
    }

    if (!window.NEWS_DATA) {
      body.innerHTML = '<div class="empty">Carregando not\u00edcias do ge.globo.com\u2026</div>';
      return;
    }

    var items = newsForCurrentFilter();
    if (!items.length) {
      body.innerHTML = '<div class="empty">Nenhuma not\u00edcia encontrada para o filtro atual. Tente outro time ou aguarde a pr\u00f3xima atualiza\u00e7\u00e3o.</div>';
      return;
    }

    body.innerHTML = '<div class="news-list">' + items.map(function (n) {
      var img = n.imagem
        ? '<img class="news-thumb" src="' + esc(n.imagem) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
        : '<div class="news-thumb news-thumb-fallback">\ud83d\udcf0</div>';
      var crest = "";
      if (sport === "futebol" && selectedEntity) {
        crest = teamCrestHtml(selectedEntity, "sm");
      }
      return '<a class="news-card" href="' + esc(n.url) + '" target="_blank" rel="noopener noreferrer">' +
        img +
        '<div class="news-content">' +
        (crest ? '<div class="news-team">' + crest + "<span>" + esc(label(selectedEntity)) + "</span></div>" : "") +
        '<h3 class="news-title">' + esc(n.titulo) + "</h3>" +
        (n.resumo ? '<p class="news-resumo">' + esc(n.resumo) + "</p>" : "") +
        '<div class="news-footer"><span class="news-date">' + esc(n.dataFmt || "") +
        '</span><span class="news-link">Ler no ge \u2192</span></div>' +
        "</div></a>";
    }).join("") + "</div>";
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
        { id: "serieb", nome: "Brasileir\u00e3o S\u00e9rie B" },
        { id: "libertadores", nome: "Copa Libertadores" },
        { id: "copa", nome: "Copa do Brasil" },
        { id: "premier-league", nome: "Premier League" },
        { id: "la-liga", nome: "La Liga" },
        { id: "bundesliga", nome: "Bundesliga" },
        { id: "primeira-liga", nome: "Primeira Liga" }
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
      var compMap = {
        copa: "copa",
        brasileirao: "brasileirao",
        serieb: "serieb",
        libertadores: "libertadores",
        "premier-league": "premier-league",
        "la-liga": "la-liga",
        bundesliga: "bundesliga",
        "primeira-liga": "primeira-liga"
      };
      if (selectedComp !== "todos" && compMap[selectedComp]) {
        var compKey = compMap[selectedComp];
        var list = (FOOT.competicoes[compKey] && FOOT.competicoes[compKey].timesAtivos) || [];
        return list.slice().sort(function (a, b) {
          var sa = getFootStats(a, compKey);
          var sb = getFootStats(b, compKey);
          var pa = (sa && (sa.posicao || sa.posicaoGrupo)) || 99;
          var pb = (sb && (sb.posicao || sb.posicaoGrupo)) || 99;
          if (compKey === "libertadores") {
            pa = (sa && sa.coeficiente) ? 100 - sa.coeficiente : 99;
            pb = (sb && sb.coeficiente) ? 100 - sb.coeficiente : 99;
          }
          return pa - pb;
        });
      }
      var all = [];
      footCompList().forEach(function (c) {
        var arr = FOOT.competicoes[c] && FOOT.competicoes[c].timesAtivos;
        if (arr) arr.forEach(function (n) { if (all.indexOf(n) < 0) all.push(n); });
      });
      return all.sort(function (a, b) { return label(a).localeCompare(label(b), "pt"); });
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
    if (comp && t[comp]) return t[comp];
    var order = comp === "copa" ? ["copa", "brasileirao", "libertadores", "serieb"]
      : comp === "serieb" ? ["serieb", "brasileirao"]
      : comp === "libertadores" ? ["libertadores", "brasileirao", "serieb"]
      : comp === "premier-league" ? ["premier-league"]
      : comp === "la-liga" ? ["la-liga"]
      : comp === "bundesliga" ? ["bundesliga"]
      : comp === "primeira-liga" ? ["primeira-liga"]
      : ["brasileirao", "libertadores", "serieb", "copa"];
    for (var i = 0; i < order.length; i++) {
      if (t[order[i]]) return t[order[i]];
    }
    return null;
  }

  function activeFootComp() {
    var known = ["copa", "serieb", "libertadores", "premier-league", "la-liga", "bundesliga", "primeira-liga"];
    if (known.indexOf(selectedComp) >= 0) return selectedComp;
    return "brasileirao";
  }

  function h2hGoalDiff(team, adv) {
    var diff = 0, n = 0;
    (FCAL.jogos || []).forEach(function (g) {
      if (!g.placar) return;
      var parts = String(g.placar).split("-").map(Number);
      if (parts.length !== 2 || isNaN(parts[0])) return;
      var isMatch = (g.mandante === team && g.visitante === adv) ||
        (g.mandante === adv && g.visitante === team);
      if (!isMatch) return;
      n++;
      if (g.mandante === team) diff += parts[0] - parts[1];
      else diff += parts[1] - parts[0];
    });
    return n ? diff / n : 0;
  }

  function getFootTeamInfo(key) {
    return FOOT.times[key] || {};
  }

  function getGameIntel(g) {
    var intel = window.INTEL_DATA;
    if (!intel || !intel.jogos) return null;
    return intel.jogos[g.id] || null;
  }

  function getBookOddsForGame(g) {
    var odds = window.ODDS_DATA;
    if (!odds || !odds.jogos) return null;
    return odds.jogos[g.id] || null;
  }

  function marketGroupKey(mercado) {
    if (/Empate|\(1\)|\(2\)|\(X\)/.test(mercado)) return "resultado";
    if (/Escanteio|Corner/i.test(mercado)) return "escanteios";
    if (/Cart/i.test(mercado)) return "cartoes";
    if (/Over|Under|BTTS|Sim|Nao/.test(mercado)) return "gols";
    return "outros";
  }

  function pickScore(p) {
    var edge = p.market.valueEdge || 0;
    return p.market.prob + (p.market.hasValue ? 8 : 0) + edge * 0.6;
  }

  function buildFootballContext(g, team, adv, comp) {
    var tInfo = getFootTeamInfo(team);
    var aInfo = getFootTeamInfo(adv);
    var tStats = getFootStats(team, comp);
    var aStats = getFootStats(adv, comp);
    var isHome = g.mandante === team;
    var totalMap = {
      serieb: 20, brasileirao: 20, "premier-league": 20, "la-liga": 20,
      bundesliga: 18, "primeira-liga": 18
    };
    var totalTimes = totalMap[comp] || 0;
    var ctx = {
      isMandante: isHome,
      competicao: comp,
      mataMata: g.comp === "copa" || g.comp === "libertadores",
      tipo: String(g.fase || "").indexOf("volta") >= 0 ? "volta" : "ida",
      mandanteLabel: label(g.mandante),
      visitanteLabel: label(g.visitante),
      teamLabel: label(team),
      teamForm: tStats && tStats.ultimos5,
      advForm: aStats && aStats.ultimos5,
      teamSequencia: tStats && tStats.sequencia,
      advSequencia: aStats && aStats.sequencia,
      teamPosicao: tStats && (tStats.posicao || tStats.posicaoGrupo),
      advPosicao: aStats && (aStats.posicao || aStats.posicaoGrupo),
      totalTimes: totalTimes,
      teamDesfalques: tInfo.desfalques || [],
      advDesfalques: aInfo.desfalques || [],
      teamRetornando: tInfo.retornando || [],
      advRetornando: aInfo.retornando || [],
      teamCasa: tInfo.casa,
      teamFora: tInfo.fora,
      advCasa: aInfo.casa,
      advFora: aInfo.fora,
      advPais: aInfo.pais || (comp.indexOf("premier") >= 0 ? "ENG" : comp.indexOf("la-liga") >= 0 ? "ESP" : comp.indexOf("bundesliga") >= 0 ? "GER" : comp.indexOf("primeira") >= 0 ? "POR" : "BRA"),
      mandanteCasa: getFootTeamInfo(g.mandante).casa,
      visitanteFora: getFootTeamInfo(g.visitante).fora,
      h2hGoalDiff: h2hGoalDiff(team, adv)
    };
    var intel = getGameIntel(g);
    if (intel) {
      ctx.restDaysHome = intel.restMandante;
      ctx.restDaysAway = intel.restVisitante;
      ctx.games7Home = intel.games7Mandante;
      ctx.games7Away = intel.games7Visitante;
      if (intel.arbitro) {
        ctx.refereeNome = intel.arbitro;
        ctx.refereeCards = intel.cartoesArbitro;
      }
    }
    var book = getBookOddsForGame(g);
    if (book) ctx.bookOdds = book;
    return ctx;
  }

  function analyzeFootballGame(g, focusTeam) {
    var team = focusTeam || g.mandante;
    var isHome = g.mandante === team;
    var adv = isHome ? g.visitante : g.mandante;
    var comp = footCompId(g);
    var t = getFootStats(team, comp);
    var a = getFootStats(adv, comp) || {
      golsPorJogo: 1.1, golsSofridosPorJogo: 1.1, over25Pct: 40, bttsPct: 42,
      escanteiosPorJogo: 5, cartoesPorJogo: 2.2
    };
    if (!t) return { insuficientes: true, nota: "Sem informa\u00e7\u00f5es suficientes para este confronto." };
    if (!FOOT.competicoes[comp]) return { insuficientes: true, nota: "Competi\u00e7\u00e3o n\u00e3o configurada." };
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
        if (dayGames.some(function (g) {
          return g.comp === "copa" || g.comp === "libertadores" || g.comp === "usopen" || g.comp === "ppv" || g.comp === "noche";
        })) classes.push("has-copa");
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
      var badgeLabel = sport === "tenis" ? (g.genero === "F" ? "WTA" : "ATP") : compDisplayName(g.comp, g);
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
        return '<article class="fixture-card"><div class="fixture-info"><div class="empty">' + blocks + "</div></div></article>";
      }
      var roleA = sport === "tenis"
        ? (TENIS.atletas[sides.a] ? TENIS.atletas[sides.a].idade + " anos" : "Jogador 1")
        : sport === "ufc" ? "Lutador 1" : "Mandante";
      var roleB = sport === "tenis"
        ? (TENIS.atletas[sides.b] ? TENIS.atletas[sides.b].idade + " anos" : "Jogador 2")
        : sport === "ufc" ? "Lutador 2" : "Visitante";
      var circuitoBadge = sport === "tenis" ? (g.genero === "F" ? "wta" : "atp") : g.comp;
      var crestA = sport === "futebol" ? '<div class="crest-wrap">' + teamCrestHtml(sides.a, "lg") + "</div>" : "";
      var crestB = sport === "futebol" ? '<div class="crest-wrap">' + teamCrestHtml(sides.b, "lg") + "</div>" : "";
      return '<article class="fixture-card">' +
        '<div class="fixture-head"><span class="comp-badge comp-' + circuitoBadge + '">' +
        (sport === "tenis" ? (g.genero === "F" ? "WTA" : "ATP") : compDisplayName(g.comp, g)) +
        '</span><span class="fixture-rotulo">' + (g.fase || "") +
        (g.weightClass ? " \u00b7 " + g.weightClass : "") +
        (g.superficie ? " \u00b7 " + g.superficie : "") + "</span></div>" +
        '<div class="proximo-match"><div class="proximo-team">' + crestA +
        '<div class="name">' + esc(sides.aL) +
        '</div><div class="role">' + roleA +
        '</div></div><div class="proximo-vs">VS</div><div class="proximo-team">' + crestB +
        '<div class="name">' + esc(sides.bL) +
        '</div><div class="role">' + roleB +
        "</div></div></div>" +
        renderFixtureInfo(g, an, sides) +
        '<div class="fixture-body"><div class="fixture-col"><h3>Melhores entradas</h3>' +
        '<div class="top-picks">' + blocks.topHtml + '</div></div>' +
        '<div class="fixture-col"><h3>Todos os mercados</h3>' + blocks.marketsHtml +
        "</div></div></article>";
    }).join("");
  }

  function renderKpis() {
    var items = [];
    if (sport === "futebol") {
      var compKey = activeFootComp();
      var ligaComp = FOOT.competicoes[compKey] || FOOT.competicoes.brasileirao;
      var liga = ligaComp.liga;
      var t = selectedEntity ? getFootStats(selectedEntity, compKey) : null;
      var tInfo = selectedEntity ? getFootTeamInfo(selectedEntity) : null;
      items = t ? [
        { label: compKey === "libertadores" ? "Grupo/Coef." : "Posição",
          value: compKey === "libertadores"
            ? ("#" + (t.posicaoGrupo || "\u2014") + " \u00b7 " + (t.coeficiente || "\u2014"))
            : ("#" + (t.posicao || "\u2014")), hl: true },
        { label: compKey === "libertadores" ? "Coeficiente" : "Pontos",
          value: compKey === "libertadores" ? (t.coeficiente || "\u2014") : (t.pontos || "\u2014") },
        { label: "Sequ\u00eancia", value: t.sequencia || "\u2014" },
        { label: "\u00daltimos 5", value: renderFormBadges(t.ultimos5), html: true, formKpi: true },
        { label: "Desfalques", value: (tInfo.desfalques || []).length || "0" },
        { label: "Retornando", value: (tInfo.retornando || []).length || "0" }
      ] : [
        { label: "M\u00e9dia gols", value: liga.mediaGols, hl: true },
        { label: "Over 2.5", value: pct(liga.over25) },
        { label: "BTTS", value: pct(liga.btts) },
        { label: "Fase", value: ligaComp.fase || "\u2014" }
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
      return '<div class="kpi' + (i.hl ? " highlight" : "") + (i.formKpi ? " kpi-form" : "") +
        '"><div class="label">' + i.label + '</div><div class="value">' +
        (i.html ? i.value : esc(i.value)) + "</div></div>";
    }).join("");
  }

  function renderTable() {
    var head = document.getElementById("teamsTableHead");
    var body = document.getElementById("teamsTableBody");
    if (sport === "futebol") {
      var compKey = activeFootComp();
      var compInfo = FOOT.competicoes[compKey] || FOOT.competicoes.brasileirao;
      var titles = {
        brasileirao: "Classificação — Série A",
        serieb: "Classificação — Série B",
        libertadores: "Libertadores — Times",
        copa: "Copa do Brasil — Participantes",
        "premier-league": "Premier League",
        "la-liga": "La Liga",
        "bundesliga": "Bundesliga",
        "primeira-liga": "Primeira Liga"
      };
      document.getElementById("tableTitle").textContent = titles[compKey] || "Classificação";
      document.getElementById("tableSub").textContent = (compInfo.nome || "") + " \u00b7 clique para filtrar";
      if (compKey === "libertadores") {
        head.innerHTML = "<tr><th>Coef</th><th>Time</th><th>Grp</th><th>Seq</th><th>\u00daltimos 5</th><th>G/J</th></tr>";
        body.innerHTML = entitiesForSport().map(function (name) {
          var s = getFootStats(name, compKey);
          var info = getFootTeamInfo(name);
          if (!s) return "";
          return '<tr data-ent="' + name + '" class="' + (selectedEntity === name ? "selected-row" : "") + '">' +
            '<td class="num">' + (s.coeficiente || "\u2014") + "</td><td>" + teamCellHtml(name) +
            '</td><td class="num">' + (s.posicaoGrupo || "\u2014") +
            '</td><td class="num">' + (s.sequencia || "\u2014") +
            '</td><td class="table-form-col">' + renderFormBadges(s.ultimos5) +
            '</td><td class="num">' + (s.jogos || "\u2014") + "</td></tr>";
        }).join("");
      } else {
        head.innerHTML = "<tr><th>Pos</th><th>Time</th><th>Pts</th><th>Seq</th><th>\u00daltimos 5</th><th>Desf</th></tr>";
        body.innerHTML = entitiesForSport().map(function (name) {
          var s = getFootStats(name, compKey);
          var info = getFootTeamInfo(name);
          if (!s) return "";
          return '<tr data-ent="' + name + '" class="' + (selectedEntity === name ? "selected-row" : "") + '">' +
            '<td class="num">' + (s.posicao || "\u2014") + "</td><td>" + teamCellHtml(name) +
            '</td><td class="num">' + (s.pontos || "\u2014") +
            '</td><td class="num">' + (s.sequencia || "\u2014") +
            '</td><td class="table-form-col">' + renderFormBadges(s.ultimos5) +
            '</td><td class="num">' + ((info.desfalques || []).length) + "</td></tr>";
        }).join("");
      }
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
    var sub = document.getElementById("modeloSub");
    if (!el) return;
    if (sport === "futebol") {
      if (sub) sub.textContent = "Poisson + Dixon-Coles com contexto de jogo";
      el.innerHTML = "<h3>Distribui\u00e7\u00e3o de gols (Poisson)</h3>" +
        "<p>Cada time recebe um <strong>\u03bb</strong> (taxa esperada de gols) a partir de m\u00e9dia de gols marcados/sofridos, ajustada por:</p>" +
        "<ul><li><strong>Forma recente</strong> \u2014 \u00faltimos 5 jogos (V/D/E com placar)</li>" +
        "<li><strong>Sequ\u00eancia</strong> \u2014 momento atual (ex.: 1V, 3D)</li>" +
        "<li><strong>Casa/fora</strong> \u2014 desempenho como mandante ou visitante</li>" +
        "<li><strong>Desfalques e retornos</strong> \u2014 impacto por jogador fora ou voltando</li></ul>" +
        "<h3>Corre\u00e7\u00e3o Dixon-Coles</h3>" +
        "<p>Ajuste na matriz de placares para empates baixos (0\u20130, 1\u20131) mais realistas que Poisson puro.</p>" +
        "<h3>Mercados derivados</h3>" +
        "<p>1X2, over/under, BTTS, handicap, escanteios e cart\u00f5es s\u00e3o calculados a partir da massa de probabilidade dos placares.</p>" +
        "<p><em>Odds exibidas s\u00e3o decimais impl\u00edcitas (1/probabilidade), n\u00e3o cota\u00e7\u00f5es de casa de aposta.</em></p>";
    } else if (sport === "tenis") {
      if (sub) sub.textContent = "Bradley-Terry com ranking, idade e superf\u00edcie";
      el.innerHTML = "<h3>Modelo Bradley-Terry</h3>" +
        "<p>Probabilidade de vit\u00f3ria estimada pela diferen\u00e7a de for\u00e7a entre atletas, combinando:</p>" +
        "<ul><li><strong>Ranking ATP/WTA</strong> (atualizado via live-sync)</li>" +
        "<li><strong>Idade</strong> \u2014 pico de performance entre 24\u201328 anos</li>" +
        "<li><strong>Superf\u00edcie</strong> \u2014 % de vit\u00f3rias em hard, saibro ou grama</li>" +
        "<li><strong>Hold/break</strong> e rating interno</li></ul>" +
        "<h3>Mercados</h3><p>Vencedor, sets, games totais e handicap derivados da probabilidade base.</p>";
    } else if (sport === "ufc") {
      if (sub) sub.textContent = "Bradley-Terry com perfil de finish";
      el.innerHTML = "<h3>Modelo de luta (MMA)</h3>" +
        "<p>Rating + alcance + perfil de finaliza\u00e7\u00e3o (KO/SUB/DEC) para estimar vencedor e mercados de m\u00e9todo/dura\u00e7\u00e3o.</p>" +
        "<h3>Mercados</h3><p>Vencedor, m\u00e9todo, dura\u00e7\u00e3o, round betting e props derivados.</p>";
    } else {
      if (sub) sub.textContent = "Distribui\u00e7\u00e3o Normal para pontos";
      el.innerHTML = "<h3>Modelo Normal (basquete)</h3>" +
        "<p>Margem e total de pontos modelados com PPG, pace, rating e fator casa. Moneyline, spread e team totals via CDF normal.</p>";
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

  function gamesTodayFootball() {
    return (FCAL.jogos || []).filter(function (g) {
      if (g.data !== todayISO || !g.mandante || !g.visitante || g.placar) return false;
      if (selectedComp !== "todos" && g.comp !== selectedComp) return false;
      return true;
    }).sort(function (a, b) {
      return (a.horario || "").localeCompare(b.horario || "");
    });
  }

  function collectDayPicks(minProb, valueOnly) {
    var picks = [];
    var skipGroups = ["Placar Exato", "Contexto"];
    gamesTodayFootball().forEach(function (g) {
      var an = analyzeFootballGame(g, g.mandante);
      if (an.insuficientes) return;
      (an.markets || []).forEach(function (m) {
        if (m.prob < minProb || skipGroups.indexOf(m.grupo) >= 0) return;
        if (/Over 0\.5|Under 0\.5/.test(m.mercado)) return;
        if (valueOnly && !m.hasValue) return;
        picks.push({ game: g, market: m, groupKey: marketGroupKey(m.mercado) });
      });
    });
    return picks.sort(function (a, b) { return pickScore(b) - pickScore(a); });
  }

  function buildCombinada(picks, maxLegs) {
    maxLegs = Math.min(maxLegs || 3, 3);
    var byGame = {};
    picks.forEach(function (p) {
      if (!p.groupKey) p.groupKey = marketGroupKey(p.market.mercado);
      if (!byGame[p.game.id]) byGame[p.game.id] = [];
      byGame[p.game.id].push(p);
    });

    var candidates = [];
    Object.keys(byGame).forEach(function (id) {
      var bestByGroup = {};
      byGame[id].forEach(function (p) {
        var gk = p.groupKey;
        if (!bestByGroup[gk] || pickScore(p) > pickScore(bestByGroup[gk])) bestByGroup[gk] = p;
      });
      Object.keys(bestByGroup).forEach(function (gk) { candidates.push(bestByGroup[gk]); });
    });
    candidates.sort(function (a, b) { return pickScore(b) - pickScore(a); });

    var legs = [];
    var usedGames = {};
    var usedGroups = {};
    candidates.forEach(function (p) {
      if (legs.length >= maxLegs) return;
      if (usedGames[p.game.id]) return;
      if (usedGroups[p.groupKey] && Object.keys(usedGroups).length < maxLegs) return;
      legs.push(p);
      usedGames[p.game.id] = true;
      usedGroups[p.groupKey] = true;
    });

    if (!legs.length) return null;
    var combinedProb = legs.reduce(function (acc, leg) {
      return acc * (leg.market.prob / 100);
    }, 1) * 100;
    var combinedOdd = M.toOdd(combinedProb);
    var bookOdds = legs.map(function (leg) { return leg.market.bookOdd; }).filter(Boolean);
    var combinedBookOdd = bookOdds.length === legs.length
      ? round2(bookOdds.reduce(function (a, o) { return a * o; }, 1))
      : null;
    return {
      legs: legs,
      combinedProb: Math.round(combinedProb * 10) / 10,
      combinedOdd: combinedOdd,
      combinedBookOdd: combinedBookOdd
    };
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  function formatCombiLegDetail(leg) {
    var g = leg.game;
    var m = leg.market;
    var intel = getGameIntel(g);
    var book = m.bookOdd ? m.bookOdd.toFixed(2) : "—";
    var edge = m.valueEdge != null
      ? (m.valueEdge > 0 ? "+" : "") + m.valueEdge + "pp vs mercado"
      : "";
    return '<div class="dia-combi-detail-inner">' +
      '<div class="dia-combi-bet-title">Apostar em: <strong>' + esc(m.mercado) + "</strong></div>" +
      '<div class="dia-combi-bet-meta">' +
      '<span class="dia-combi-tag">' + esc(m.grupo) + "</span>" +
      '<span>Prob. modelo: <strong>' + m.prob + "%</strong></span>" +
      '<span>Odd modelo: <strong>' + (m.odd || M.toOdd(m.prob)).toFixed(2) + "</strong></span>" +
      '<span>Odd mercado: <strong>' + book + "</strong></span>" +
      (m.hasValue ? '<span class="dia-value-badge dia-value-badge-light">Valor ' + edge + "</span>" : "") +
      "</div>" +
      '<p class="dia-combi-motivo"><strong>Por qu\u00ea:</strong> ' + esc(m.motivo || "Mercado com maior confian\u00e7a do modelo para este duelo.") + "</p>" +
      '<p class="dia-combi-context">' + label(g.mandante) + " x " + label(g.visitante) +
      " \u00b7 " + (g.horario || "hor\u00e1rio a definir") +
      (intel && intel.restMandante != null
        ? " \u00b7 Descanso " + intel.restMandante + "d vs " + intel.restVisitante + "d"
        : "") +
      (intel && intel.arbitro ? " \u00b7 \u00c1rbitro: " + esc(intel.arbitro) : "") +
      "</p>" +
      '<button type="button" class="dia-combi-goto" data-game-id="' + g.id + '">Ver todos os mercados deste jogo \u2193</button>' +
      "</div>";
  }

  function renderCombiLeg(leg, idx) {
    var g = leg.game;
    var val = leg.market.hasValue ? ' <span class="dia-value-badge dia-value-badge-light">Valor</span>' : "";
    return '<div class="dia-combi-leg-wrap">' +
      '<button type="button" class="dia-combi-leg" data-leg-idx="' + idx + '" aria-expanded="false">' +
      '<span class="comp-badge comp-' + g.comp + '">' + compDisplayName(g.comp, g) + "</span>" +
      '<span class="dia-combi-match">' + label(g.mandante) + " x " + label(g.visitante) + "</span>" +
      '<span class="dia-combi-market-preview">' + esc(leg.market.mercado) + val + "</span>" +
      '<span class="prob">' + leg.market.prob + "%</span>" +
      '<span class="dia-combi-chevron" aria-hidden="true">\u25b8</span>' +
      "</button>" +
      '<div class="dia-combi-detail" id="diaCombiDetail' + idx + '" hidden>' +
      formatCombiLegDetail(leg) +
      "</div></div>";
  }

  function bindCombiLegClicks(container) {
    if (!container) return;
    container.querySelectorAll(".dia-combi-leg").forEach(function (btn) {
      btn.onclick = function () {
        var idx = Number(btn.getAttribute("data-leg-idx"));
        var detail = document.getElementById("diaCombiDetail" + idx);
        if (!detail) return;
        var isOpen = !detail.hidden;
        container.querySelectorAll(".dia-combi-detail").forEach(function (d) { d.hidden = true; });
        container.querySelectorAll(".dia-combi-leg").forEach(function (b) {
          b.classList.remove("open");
          b.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          detail.hidden = false;
          btn.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      };
    });
    container.querySelectorAll(".dia-combi-goto").forEach(function (btn) {
      btn.onclick = function (e) {
        e.stopPropagation();
        var gid = btn.getAttribute("data-game-id");
        var block = document.querySelector('.dia-game-block[data-game-id="' + gid + '"]');
        if (!block) return;
        block.scrollIntoView({ behavior: "smooth", block: "center" });
        block.classList.add("dia-game-highlight");
        setTimeout(function () { block.classList.remove("dia-game-highlight"); }, 2200);
      };
    });
  }

  function formatMarketRow(m) {
    var book = m.bookOdd ? m.bookOdd.toFixed(2) : "—";
    var edge = m.valueEdge != null
      ? '<span class="edge ' + (m.valueEdge >= 3 ? "positive" : "") + '">' +
        (m.valueEdge > 0 ? "+" : "") + m.valueEdge + "pp</span>"
      : '<span class="edge">—</span>';
    var badge = m.hasValue ? '<span class="dia-value-badge">Valor</span>' : "";
    return '<div class="dia-pick-row ' + probClass(m.prob) + (m.hasValue ? " has-value" : "") + '">' +
      '<span class="mercado">' + esc(m.mercado) + badge + '</span>' +
      '<span class="grupo">' + esc(m.grupo) + '</span>' +
      '<span class="prob">' + m.prob + '%</span>' +
      '<span class="odd">' + (m.odd || M.toOdd(m.prob)).toFixed(2) + "</span>" +
      '<span class="book">' + book + "</span>" + edge + "</div>";
  }

  function renderDia() {
    var sub = document.getElementById("diaSub");
    var combEl = document.getElementById("diaCombinada");
    var body = document.getElementById("diaPicksBody");
    if (!body) return;

    document.querySelectorAll(".dia-thresh").forEach(function (btn) {
      btn.classList.toggle("active", Number(btn.getAttribute("data-min")) === diaProbMin);
    });
    var valueEl = document.getElementById("diaValueOnly");
    if (valueEl) valueEl.checked = diaValueOnly;

    if (sport !== "futebol") {
      sub.textContent = "Selecione Futebol para ver os jogos do dia.";
      combEl.innerHTML = "";
      body.innerHTML = '<div class="empty">Aba dispon\u00edvel apenas para futebol.</div>';
      return;
    }

    var games = gamesTodayFootball();
    var filterNote = diaValueOnly ? " \u00b7 s\u00f3 com valor" : "";
    sub.textContent = fmtData(todayISO) + " \u00b7 " + games.length + " jogos \u00b7 filtro \u2265" + diaProbMin + "%" + filterNote;
    var picks = collectDayPicks(diaProbMin, diaValueOnly);
    var combi = buildCombinada(picks, 3);

    if (combi && combi.legs.length >= 2) {
      combEl.innerHTML = '<h3>Combinada inteligente (' + combi.legs.length + " pernas \u00b7 clique no duelo para ver a aposta)</h3>" +
        '<div class="dia-combi-legs">' + combi.legs.map(renderCombiLeg).join("") + "</div>" +
        '<div class="dia-combi-summary"><span>Prob. combinada: <strong>' + combi.combinedProb +
        "%</strong></span><span>Odd modelo: <strong>" + combi.combinedOdd.toFixed(2) + "</strong></span>" +
        (combi.combinedBookOdd
          ? '<span>Odd mercado: <strong>' + combi.combinedBookOdd.toFixed(2) + "</strong></span>"
          : "") + "</div>";
      bindCombiLegClicks(combEl);
    } else if (combi && combi.legs.length === 1) {
      combEl.innerHTML = '<h3>Melhor aposta do dia (clique para ver detalhes)</h3><div class="dia-combi-legs">' +
        renderCombiLeg(combi.legs[0], 0) + "</div>";
      bindCombiLegClicks(combEl);
    } else {
      combEl.innerHTML = '<div class="dia-warn">Nenhuma combinada com 2+ jogos' +
        (diaValueOnly ? " com valor" : "") + " acima de " + diaProbMin +
        "%. Tente um filtro menor ou desative \u00abS\u00f3 com valor\u00bb.</div>";
    }

    if (!games.length) {
      body.innerHTML = '<div class="empty">Nenhum jogo futuro para hoje no filtro atual.</div>';
      return;
    }

    var byGame = {};
    picks.forEach(function (p) {
      if (!byGame[p.game.id]) byGame[p.game.id] = { game: p.game, markets: [] };
      byGame[p.game.id].markets.push(p.market);
    });

    body.innerHTML = games.map(function (g) {
      var entry = byGame[g.id];
      var an = analyzeFootballGame(g, g.mandante);
      var intel = getGameIntel(g);
      var intelNote = intel && intel.restMandante != null
        ? '<div class="dia-intel">Descanso: ' + intel.restMandante + "d vs " + intel.restVisitante +
          "d" + (intel.arbitro ? " \u00b7 \u00c1rbitro: " + esc(intel.arbitro) : "") + "</div>"
        : "";
      var head = '<div class="dia-game-head"><span class="comp-badge comp-' + g.comp + '">' +
        compDisplayName(g.comp, g) + '</span><span class="dia-game-head teams">' +
        teamCellHtml(g.mandante) + " vs " + teamCellHtml(g.visitante) +
        '</span><span class="day-kick">' + (g.horario || "") + "</span></div>" + intelNote;
      if (!entry || !entry.markets.length) {
        var note = an.insuficientes ? an.nota : "Nenhum mercado" +
          (diaValueOnly ? " com valor" : "") + " acima de " + diaProbMin + "%.";
        return '<div class="dia-game-block" data-game-id="' + g.id + '">' + head + '<div class="dia-picks"><div class="empty">' + esc(note) + "</div></div></div>";
      }
      var rows = entry.markets.slice(0, 8).map(formatMarketRow).join("");
      return '<div class="dia-game-block" data-game-id="' + g.id + '">' + head + '<div class="dia-picks">' + rows + "</div></div>";
    }).join("") + '<p class="dia-warn">Probabilidades estimadas pelo modelo Poisson (Dixon-Coles) com xG, descanso e desfalques. Odd mercado quando dispon\u00edvel. Valor = modelo \u2212 implied da odd (+3pp m\u00edn.). Combine mercados de grupos diferentes (resultado/gols/escanteios).</p>';
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
    renderHeaderSelected();
    renderTodayClock();
    renderCalendar();
    renderDayGames();
    renderFixtures();
    renderKpis();
    renderTable();
    renderMatches();
    if (currentView === "noticias") renderNews();
    if (currentView === "dia") renderDia();
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
      if (currentView === "noticias") {
        renderNews();
        return;
      }
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

    document.querySelectorAll(".view-tab").forEach(function (tab) {
      tab.onclick = function () {
        switchView(tab.getAttribute("data-view"));
      };
    });
    document.querySelectorAll(".dia-thresh").forEach(function (btn) {
      btn.onclick = function () {
        diaProbMin = Number(btn.getAttribute("data-min")) || 70;
        renderDia();
      };
    });
    var diaValueEl = document.getElementById("diaValueOnly");
    if (diaValueEl) {
      diaValueEl.onchange = function () {
        diaValueOnly = diaValueEl.checked;
        renderDia();
      };
    }
    switchView(currentView);

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
