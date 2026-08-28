/* Busca dados atualizados a cada carregamento da página (cache-bust) */
(function (global) {
  "use strict";

  function mergeDeep(target, source) {
    if (!source || typeof source !== "object") return target;
    Object.keys(source).forEach(function (key) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== "object") target[key] = {};
        mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
    return target;
  }

  function fetchJson(path) {
    return fetch(path + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function mergeFootball(data) {
    if (!data || !global.BET_DATA) return;
    if (data.meta && data.meta.atualizadoEm) {
      global.BET_DATA.meta.atualizadoEm = data.meta.atualizadoEm;
    }
    if (data.competicoes) mergeDeep(global.BET_DATA.competicoes, data.competicoes);
    if (!data.times) return;
    Object.keys(data.times).forEach(function (team) {
      if (!global.BET_DATA.times[team]) global.BET_DATA.times[team] = {};
      var patch = data.times[team];
      mergeDeep(global.BET_DATA.times[team], patch);
      if (patch.brasileirao && global.BET_DATA.times[team].brasileirao) {
        mergeDeep(global.BET_DATA.times[team].brasileirao, patch.brasileirao);
      }
      if (patch.serieb && global.BET_DATA.times[team].serieb) {
        mergeDeep(global.BET_DATA.times[team].serieb, patch.serieb);
      }
      if (patch.libertadores && global.BET_DATA.times[team].libertadores) {
        mergeDeep(global.BET_DATA.times[team].libertadores, patch.libertadores);
      }
      ["premier-league", "la-liga", "bundesliga", "primeira-liga"].forEach(function (ck) {
        if (patch[ck] && global.BET_DATA.times[team][ck]) {
          mergeDeep(global.BET_DATA.times[team][ck], patch[ck]);
        }
      });
      if (patch.copa && global.BET_DATA.times[team].copa) {
        mergeDeep(global.BET_DATA.times[team].copa, patch.copa);
      }
    });
  }

  function mergeTenis(data) {
    if (!data || !global.TENIS_DATA) return;
    if (data.meta && data.meta.atualizadoEm) {
      global.TENIS_DATA.meta.atualizadoEm = data.meta.atualizadoEm;
    }
    ["atp", "wta"].forEach(function (circuit) {
      if (!data[circuit]) return;
      Object.keys(data[circuit]).forEach(function (name) {
        if (!global.TENIS_DATA.atletas[name]) return;
        mergeDeep(global.TENIS_DATA.atletas[name], data[circuit][name]);
      });
    });
  }

  function mergeIntel(data) {
    if (!data) return;
    global.INTEL_DATA = data;
    if (!data.times || !global.BET_DATA) return;
    Object.keys(data.times).forEach(function (team) {
      if (!global.BET_DATA.times[team]) global.BET_DATA.times[team] = {};
      var patch = data.times[team];
      mergeDeep(global.BET_DATA.times[team], patch);
      Object.keys(patch).forEach(function (comp) {
        if (patch[comp] && typeof patch[comp] === "object" && global.BET_DATA.times[team][comp]) {
          mergeDeep(global.BET_DATA.times[team][comp], patch[comp]);
        }
      });
    });
  }

  function mergeScores(data) {
    if (!data) return;
    global.LIVE_SCORES = data;
    if (!data.jogos || !global.CALENDARIO_2026 || !global.CALENDARIO_2026.jogos) return;
    global.CALENDARIO_2026.jogos.forEach(function (g) {
      var patch = data.jogos[g.id];
      if (!patch) return;
      if (patch.placar) g.placar = patch.placar;
      if (patch.status === "live") g._live = patch;
      else if (patch.status === "finished") {
        g.placar = patch.placar || g.placar;
        delete g._live;
      }
    });
  }

  function mergeResults(data) {
    if (!data) return;
    global.RESULTS_DATA = data;
  }

  global.LIVE_SYNC = {
    atualizadoEm: null,
    newsAtualizadoEm: null,
    intelAtualizadoEm: null,
    oddsAtualizadoEm: null,
    scoresAtualizadoEm: null,
    statsAtualizadoEm: null,
    resultsAtualizadoEm: null,
    status: "pendente",
    fetchAll: function () {
      global.LIVE_SYNC.status = "carregando";
      return Promise.all([
        fetchJson("live/football.json"),
        fetchJson("live/tenis.json"),
        fetchJson("live/news.json"),
        fetchJson("live/intel.json"),
        fetchJson("live/odds.json"),
        fetchJson("live/scores.json"),
        fetchJson("live/results.json")
      ]).then(function (results) {
        if (results[0]) {
          mergeFootball(results[0]);
          global.LIVE_SYNC.atualizadoEm = results[0].meta && results[0].meta.atualizadoEm;
          global.LIVE_SYNC.statsAtualizadoEm = results[0].meta && results[0].meta.atualizadoEm;
        }
        if (results[1]) {
          mergeTenis(results[1]);
          if (!global.LIVE_SYNC.atualizadoEm && results[1].meta) {
            global.LIVE_SYNC.atualizadoEm = results[1].meta.atualizadoEm;
          }
        }
        if (results[2]) {
          global.NEWS_DATA = results[2];
          global.LIVE_SYNC.newsAtualizadoEm = results[2].meta && results[2].meta.atualizadoEm;
        }
        if (results[3]) {
          mergeIntel(results[3]);
          global.LIVE_SYNC.intelAtualizadoEm = results[3].meta && results[3].meta.atualizadoEm;
        }
        if (results[4]) {
          global.ODDS_DATA = results[4];
          global.LIVE_SYNC.oddsAtualizadoEm = results[4].meta && results[4].meta.atualizadoEm;
        }
        if (results[5]) {
          mergeScores(results[5]);
          global.LIVE_SYNC.scoresAtualizadoEm = results[5].meta && results[5].meta.atualizadoEm;
        }
        if (results[6]) {
          mergeResults(results[6]);
          global.LIVE_SYNC.resultsAtualizadoEm = results[6].meta && results[6].meta.atualizadoEm;
        }
        global.LIVE_SYNC.status = results.some(function (r) { return !!r; }) ? "ok" : "offline";
      }).catch(function () {
        global.LIVE_SYNC.status = "offline";
      });
    }
  };
})(window);
