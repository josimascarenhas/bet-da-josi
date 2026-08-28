/* Mescla Serie B e Libertadores em BET_DATA */
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

  function mergeFootballExtensions() {
    var base = global.BET_DATA;
    if (!base) return;

    if (global.SERIE_B_DATA) {
      if (global.SERIE_B_DATA.competicao) {
        mergeDeep(base.competicoes.serieb, global.SERIE_B_DATA.competicao);
      }
      Object.keys(global.SERIE_B_DATA.times || {}).forEach(function (key) {
        if (!base.times[key]) base.times[key] = {};
        mergeDeep(base.times[key], global.SERIE_B_DATA.times[key]);
      });
    }

    if (global.LIBERTADORES_DATA) {
      if (global.LIBERTADORES_DATA.competicao) {
        mergeDeep(base.competicoes.libertadores, global.LIBERTADORES_DATA.competicao);
      }
      Object.keys(global.LIBERTADORES_DATA.times || {}).forEach(function (key) {
        if (!base.times[key]) base.times[key] = {};
        mergeDeep(base.times[key], global.LIBERTADORES_DATA.times[key]);
      });
      var brLib = global.LIBERTADORES_DATA.brLibertadores || {};
      Object.keys(brLib).forEach(function (key) {
        if (!base.times[key]) return;
        if (!base.times[key].libertadores) base.times[key].libertadores = {};
        var br = base.times[key].brasileirao || base.times[key].copa;
        if (br) {
          base.times[key].libertadores = Object.assign({}, br, base.times[key].libertadores, brLib[key]);
        } else {
          mergeDeep(base.times[key].libertadores, brLib[key]);
        }
      });
    }
  }

  global.mergeFootballExtensions = mergeFootballExtensions;
  mergeFootballExtensions();
})(window);
