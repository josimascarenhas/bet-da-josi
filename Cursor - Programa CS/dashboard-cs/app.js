/* Dashboard CS - Pos IA - Doutores do Excel */

const FIELD_PATTERNS = {
  curso: [/nome do curso/, /^curso$/],
  matriculaId: [/matricula.*id/, /^id$/],
  nome: [/^aluno/, /^nome/],
  email: [/e-?mail/],
  celular: [/celular/, /telefone/, /whats/],
  statusMatricula: [/status.*matricula/],
  statusContrato: [/status.*contrato/, /^contrato$/],
  ultimoAcesso: [/ultimo.*acesso/, /last.*access/],
  dataInicio: [/data.*inicio/, /data de inicio/],
  dataFinal: [/data final/],
  diasIntegralizacao: [/dias.*integralizacao/, /dias que faltam/],
  turma: [/^turma$/],
};

const KPI_CONFIG = {
  total: { label: "Todos os alunos", matricula: "ativas", contrato: "", acesso: "", avaliacao: "", prioridade: "" },
  semContrato: { label: "Sem assinar contrato", matricula: "ativas", contrato: "Pendente", acesso: "", avaliacao: "", prioridade: "" },
  semAcesso: { label: "Sem acessar", matricula: "ativas", contrato: "", acesso: "nunca", avaliacao: "", prioridade: "" },
  inativos: { label: "Inativos +30 dias", matricula: "ativas", contrato: "", acesso: "30plus", avaliacao: "", prioridade: "" },
  fezAvaliacao: { label: "Fizeram avaliacoes", matricula: "ativas", contrato: "", acesso: "", avaliacao: "fez", prioridade: "" },
  pendenteAvaliacao: { label: "Sem nenhuma avaliacao", matricula: "ativas", contrato: "", acesso: "", avaliacao: "pendente", prioridade: "" },
  preConfirmada: { label: "Pre-confirmadas", matricula: "Pré-confirmada", contrato: "", acesso: "", avaliacao: "", prioridade: "" },
  criticos: { label: "Prioridade critica", matricula: "ativas", contrato: "", acesso: "", avaliacao: "", prioridade: "critica" },
};

const state = {
  meta: {},
  alunosRaw: [],
  avaliacoes: [],
  disciplinasResumo: [],
  csatResumo: {},
  csatPorDisciplina: [],
  csatRespostas: [],
  students: [],
  charts: { acesso: null, prioridade: null },
  activeKpi: null,
  filterFromKpi: false,
  refDate: null,
  calMonth: null,
  selectedStudentId: null,
};

const els = {};

function bindElements() {
  els.fileInput = document.getElementById("fileInput");
  els.btnExport = document.getElementById("btnExport");
  els.courseLine = document.getElementById("courseLine");
  els.statusBanner = document.getElementById("statusBanner");
  els.kpiGrid = document.getElementById("kpiGrid");
  els.actionQueues = document.getElementById("actionQueues");
  els.studentsTable = document.querySelector("#studentsTable tbody");
  els.tableSummary = document.getElementById("tableSummary");
  els.searchInput = document.getElementById("searchInput");
  els.turmaFilter = document.getElementById("turmaFilter");
  els.matriculaFilter = document.getElementById("matriculaFilter");
  els.contratoFilter = document.getElementById("contratoFilter");
  els.acessoFilter = document.getElementById("acessoFilter");
  els.avaliacaoFilter = document.getElementById("avaliacaoFilter");
  els.prioridadeFilter = document.getElementById("prioridadeFilter");
  els.disciplinaCards = document.getElementById("disciplinaCards");
  els.csatBlock = document.getElementById("csatBlock");
  els.refDateInput = document.getElementById("refDateInput");
  els.btnToday = document.getElementById("btnToday");
  els.refDateHint = document.getElementById("refDateHint");
  els.calendarGrid = document.getElementById("calendarGrid");
  els.calTitle = document.getElementById("calTitle");
  els.calPrev = document.getElementById("calPrev");
  els.calNext = document.getElementById("calNext");
  els.journeyKpis = document.getElementById("journeyKpis");
  els.journeyTable = document.querySelector("#journeyTable tbody");
  els.journeySummary = document.getElementById("journeySummary");
  els.journeySearch = document.getElementById("journeySearch");
  els.journeyMateriaFilter = document.getElementById("journeyMateriaFilter");
  els.journeyProvaFilter = document.getElementById("journeyProvaFilter");
  els.journeyTimeline = document.getElementById("journeyTimeline");
  els.journeyDetailSub = document.getElementById("journeyDetailSub");
  els.commentsScores = document.getElementById("commentsScores");
  els.commentsList = document.getElementById("commentsList");
  els.commentSearch = document.getElementById("commentSearch");
  els.commentDiscFilter = document.getElementById("commentDiscFilter");
  els.commentOnlyText = document.getElementById("commentOnlyText");
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toISODate(d) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizeStatus(value) {
  return normalize(value).replace(/\s+/g, " ");
}

function pickByPatterns(row, fieldKey) {
  const patterns = FIELD_PATTERNS[fieldKey] || [];
  for (const [key, val] of Object.entries(row)) {
    const nk = normalize(key);
    if (patterns.some((p) => p.test(nk))) return val;
  }
  return "";
}

function cell(row, index) {
  return row && row[index] !== undefined ? row[index] : "";
}

function hasValue(value) {
  return value !== "" && value != null;
}

function parseDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return startOfDay(value);
  if (typeof value === "number" && value > 20000) {
    return startOfDay(new Date((value - 25569) * 86400000));
  }
  const str = String(value).trim();
  if (!str || /^(nunca|n.?a|-|sem acesso)$/i.test(str)) return null;

  const br = str.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (br) {
    const year = br[3].length === 2 ? "20" + br[3] : br[3];
    return startOfDay(new Date(+year, +br[2] - 1, +br[1]));
  }

  const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return startOfDay(new Date(+iso[1], +iso[2] - 1, +iso[3]));

  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
}

function daysBetween(a, b) {
  if (!a || !b) return null;
  return Math.floor((startOfDay(b) - startOfDay(a)) / 86400000);
}

function daysSince(date, ref) {
  if (!date) return Infinity;
  return daysBetween(date, ref || state.refDate || new Date());
}

function formatDate(date) {
  if (!date) return "—";
  return date.toLocaleDateString("pt-BR");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

function pct(n) {
  if (n == null || n === "" || Number.isNaN(Number(n))) return "—";
  const value = Number(n) <= 1 ? Number(n) * 100 : Number(n);
  return Math.round(value) + "%";
}

function labelPrioridade(p) {
  return { critica: "Critica", alta: "Alta", media: "Media", ok: "Em dia" }[p] || p;
}

function setStatus(message, type) {
  type = type || "ok";
  if (!els.statusBanner) return;
  if (!message) {
    els.statusBanner.classList.add("hidden");
    els.statusBanner.textContent = "";
    return;
  }
  els.statusBanner.textContent = message;
  els.statusBanner.className = "status-banner " + type;
}

function curriculo() {
  return window.CURRICULO || [];
}

function diasPorMateria() {
  return window.DIAS_POR_MATERIA || 30;
}

function matchMateria(disciplinaNome) {
  const n = normalize(disciplinaNome);
  if (!n) return null;
  for (const m of curriculo()) {
    if (normalize(m.nome) === n || normalize(m.curto) === n) return m;
    if (m.aliases && m.aliases.some((a) => n.includes(a) || a.includes(n))) return m;
    if (n.includes(normalize(m.curto)) || normalize(m.nome).includes(n)) return m;
  }
  return null;
}

function findSheet(workbook, patterns) {
  return workbook.SheetNames.find((name) => {
    const n = normalize(name);
    return patterns.some((p) => p.test(n));
  });
}

function parseBaseSheet(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });
  if (!rows.length) return [];
  return rows
    .map((row) => ({
      curso: pickByPatterns(row, "curso"),
      matriculaId: pickByPatterns(row, "matriculaId"),
      nome: String(pickByPatterns(row, "nome") || "").trim(),
      email: String(pickByPatterns(row, "email") || "").trim(),
      celular: String(pickByPatterns(row, "celular") || "").trim(),
      statusMatricula: String(pickByPatterns(row, "statusMatricula") || "").trim(),
      statusContrato: String(pickByPatterns(row, "statusContrato") || "").trim(),
      ultimoAcesso: pickByPatterns(row, "ultimoAcesso"),
      dataInicio: pickByPatterns(row, "dataInicio"),
      dataFinal: pickByPatterns(row, "dataFinal"),
      diasIntegralizacao: pickByPatterns(row, "diasIntegralizacao"),
      turma: String(pickByPatterns(row, "turma") || "Sem turma").trim() || "Sem turma",
    }))
    .filter((a) => a.nome || a.matriculaId || a.email);
}

function parseDesempenhoSheet(sheet) {
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true });
  const avaliacoes = [];
  const disciplinasResumo = [];
  const seenResumo = new Set();

  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];
    const matriculaId = cell(row, 0);
    const disciplina = cell(row, 3);
    if (hasValue(matriculaId) && hasValue(disciplina)) {
      avaliacoes.push({
        matriculaId: matriculaId,
        nome: cell(row, 1),
        sequencia: cell(row, 2),
        disciplina: disciplina,
        tentativas: cell(row, 4),
        notaFinal: cell(row, 5),
        turma: cell(row, 6),
      });
    }
    const resumoDisc = cell(row, 8);
    if (hasValue(resumoDisc) && !seenResumo.has(String(resumoDisc))) {
      seenResumo.add(String(resumoDisc));
      disciplinasResumo.push({
        disciplina: resumoDisc,
        sequencia: cell(row, 9),
        mediaTentativas: cell(row, 10),
        notaMedia: cell(row, 11),
        consumo: cell(row, 12),
        reprovadas: cell(row, 13),
        aprovadas: cell(row, 14),
        naoRealizadas: cell(row, 15),
        turma: cell(row, 16),
      });
    }
  }
  return { avaliacoes: avaliacoes, disciplinasResumo: disciplinasResumo };
}

function parseCsatSheet(sheet) {
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true });
  const csatRespostas = [];
  const csatPorDisciplina = [];
  const seenDisc = new Set();

  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];
    const disciplina = cell(row, 0);
    const csatVideo = cell(row, 1);
    if (hasValue(disciplina) && hasValue(csatVideo)) {
      csatRespostas.push({
        disciplina: disciplina,
        csatVideo: csatVideo,
        csatMaterial: cell(row, 2),
        comentario: String(cell(row, 3) || "").trim(),
        turma: cell(row, 4),
      });
    }
    const discResumo = cell(row, 10);
    if (hasValue(discResumo) && !seenDisc.has(String(discResumo))) {
      seenDisc.add(String(discResumo));
      csatPorDisciplina.push({
        disciplina: discResumo,
        mediaVideo: cell(row, 11),
        mediaMaterial: cell(row, 12),
        csatDisciplina: cell(row, 13),
        quantidade: cell(row, 14),
      });
    }
  }

  const firstData = raw[1] || [];
  return {
    csatRespostas: csatRespostas,
    csatPorDisciplina: csatPorDisciplina,
    csatResumo: {
      csatVideo: firstData[6] || null,
      csatMaterial: firstData[7] || null,
      csatCurso: firstData[8] || null,
    },
  };
}

function ensureXlsx() {
  if (typeof XLSX === "undefined") {
    throw new Error("Biblioteca Excel (XLSX) nao carregou. Verifique a internet e recarregue a pagina.");
  }
}

function parseWorkbook(workbook) {
  ensureXlsx();
  if (!workbook || !workbook.SheetNames || !workbook.SheetNames.length) {
    throw new Error("Arquivo Excel vazio ou invalido.");
  }

  const baseName = findSheet(workbook, [/base.*aluno/, /alunos/]) || workbook.SheetNames[0];
  const perfName = findSheet(workbook, [/desempenho/]);
  const csatName = findSheet(workbook, [/csat/]);

  if (!workbook.Sheets[baseName]) {
    throw new Error('Aba "' + baseName + '" nao encontrada no arquivo.');
  }

  const alunos = parseBaseSheet(workbook.Sheets[baseName]);
  if (!alunos.length) {
    throw new Error('Nenhum aluno encontrado na aba "' + baseName + '".');
  }

  let avaliacoes = [];
  let disciplinasResumo = [];
  if (perfName && workbook.Sheets[perfName]) {
    const perf = parseDesempenhoSheet(workbook.Sheets[perfName]);
    avaliacoes = perf.avaliacoes;
    disciplinasResumo = perf.disciplinasResumo;
  }

  let csatResumo = {};
  let csatPorDisciplina = [];
  let csatRespostas = [];
  if (csatName && workbook.Sheets[csatName]) {
    const csat = parseCsatSheet(workbook.Sheets[csatName]);
    csatResumo = csat.csatResumo;
    csatPorDisciplina = csat.csatPorDisciplina;
    csatRespostas = csat.csatRespostas;
  }

  ingest({
    meta: { fonte: "planilha importada", curso: (alunos[0] && alunos[0].curso) || "" },
    alunos: alunos,
    avaliacoes: avaliacoes,
    disciplinasResumo: disciplinasResumo,
    csatResumo: csatResumo,
    csatPorDisciplina: csatPorDisciplina,
    csatRespostas: csatRespostas,
  });

  setStatus(
    "Importacao concluida: " + alunos.length + " alunos · " + avaliacoes.length + " avaliacoes · aba \"" + baseName + "\".",
    "ok"
  );
}

function handleFileImport(file) {
  try {
    ensureXlsx();
  } catch (err) {
    setStatus(err.message, "error");
    alert(err.message);
    return;
  }

  setStatus("Lendo " + file.name + "...", "loading");

  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const data = new Uint8Array(ev.target.result);
      const workbook = XLSX.read(data, { type: "array", cellDates: true });
      parseWorkbook(workbook);
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Erro ao ler planilha.", "error");
      alert("Nao foi possivel importar a planilha.\n\n" + (err.message || err));
    }
  };
  reader.onerror = function () {
    setStatus("Erro ao ler o arquivo.", "error");
    alert("Erro ao ler o arquivo selecionado.");
  };
  reader.readAsArrayBuffer(file);
}

function buildAvaliacoesById(avaliacoes) {
  const byId = new Map();
  (avaliacoes || []).forEach((a) => {
    const id = String(a.matriculaId);
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id).push(a);
  });
  return byId;
}

function materiasConcluidas(avaliacoesAluno) {
  const done = new Set();
  (avaliacoesAluno || []).forEach((a) => {
    const m = matchMateria(a.disciplina);
    if (m) done.add(m.ordem);
  });
  return done;
}

function isTurmaLiberacaoAtrasada(dataInicio) {
  return Boolean(dataInicio && dataInicio.getDate() === 1 && dataInicio.getMonth() === 6);
}

function firstUnlockOffset(dataInicio) {
  return isTurmaLiberacaoAtrasada(dataInicio) ? 1 : 0;
}

function unlockSchedule(dataInicio) {
  const grade = curriculo();
  const step = diasPorMateria();
  if (!dataInicio) return [];
  const offset = firstUnlockOffset(dataInicio);
  return grade.map((m, idx) => Object.assign({}, m, {
    liberacao: addDays(dataInicio, offset + idx * step),
  }));
}

function journeyForStudent(student, refDate) {
  refDate = refDate || state.refDate;
  const start = student.dataInicio;
  const schedule = unlockSchedule(start);
  const done = student.materiasFeitas || new Set();

  if (!start || !schedule.length) {
    return {
      liberadas: 0, atual: null, provaAtual: "sem-matricula",
      proximaLiberacao: null, diasAteProxima: null, schedule: [], statusRef: "sem-inicio",
    };
  }

  const days = daysBetween(start, refDate);
  const firstUnlock = schedule[0].liberacao;

  if (firstUnlock && daysBetween(firstUnlock, refDate) < 0) {
    return {
      liberadas: 0, atual: null, provaAtual: "nao-iniciado",
      proximaLiberacao: firstUnlock,
      diasAteProxima: daysBetween(refDate, firstUnlock),
      schedule: schedule,
      statusRef: days < 0 ? "antes-matricula" : "aguardando-primeira",
      diasDesdeMatricula: days,
      liberacaoAtrasada: isTurmaLiberacaoAtrasada(start),
    };
  }

  const liberadas = schedule.filter((m) => daysBetween(m.liberacao, refDate) >= 0).length;
  const atual = schedule[liberadas - 1] || null;
  const proxima = liberadas < schedule.length ? schedule[liberadas] : null;
  const provaAtual = atual ? (done.has(atual.ordem) ? "concluida" : "pendente") : "—";

  return {
    liberadas: liberadas,
    atual: atual,
    provaAtual: provaAtual,
    proximaLiberacao: proxima ? proxima.liberacao : null,
    diasAteProxima: proxima ? daysBetween(refDate, proxima.liberacao) : null,
    schedule: schedule,
    statusRef: "ativo",
    diasDesdeMatricula: days,
    liberacaoAtrasada: isTurmaLiberacaoAtrasada(start),
  };
}

function classifyStudent(raw, avaliacoes) {
  const ultimoAcessoDate = parseDate(raw.ultimoAcesso);
  const diasSemAcesso = daysSince(ultimoAcessoDate, new Date());
  const contrato = String(raw.statusContrato || "").trim() || "Pendente";
  const statusMatricula = String(raw.statusMatricula || "").trim();
  const qtdAvaliacoes = avaliacoes.length;
  const disciplinasFeitas = [...new Set(avaliacoes.map((a) => a.disciplina))];
  const mediaNotas = qtdAvaliacoes
    ? avaliacoes.reduce((sum, a) => sum + (Number(a.notaFinal) || 0), 0) / qtdAvaliacoes
    : null;
  const materiasFeitas = materiasConcluidas(avaliacoes);

  let faixaAcesso = "nunca";
  if (ultimoAcessoDate) {
    if (diasSemAcesso <= 7) faixaAcesso = "7";
    else if (diasSemAcesso <= 15) faixaAcesso = "15";
    else if (diasSemAcesso <= 30) faixaAcesso = "30";
    else if (diasSemAcesso <= 60) faixaAcesso = "30plus";
    else faixaAcesso = "60plus";
  }

  const motivos = [];
  if (contrato === "Pendente") motivos.push("Contrato pendente");
  if (!ultimoAcessoDate) motivos.push("Nunca acessou");
  else if (diasSemAcesso > 60) motivos.push("Inativo ha " + diasSemAcesso + " dias");
  else if (diasSemAcesso > 30) motivos.push("Sem acesso ha " + diasSemAcesso + " dias");
  if (qtdAvaliacoes === 0) motivos.push("Sem avaliacoes");
  else if (disciplinasFeitas.length === 1) motivos.push("So 1 disciplina avaliada");
  if (normalizeStatus(statusMatricula) === "pre-confirmada" && contrato === "Pendente") {
    motivos.push("Pre-confirmada sem contrato");
  }

  let score = 0;
  if (contrato === "Pendente") score += 3;
  if (!ultimoAcessoDate) score += 4;
  else if (diasSemAcesso > 60) score += 4;
  else if (diasSemAcesso > 30) score += 3;
  else if (diasSemAcesso > 15) score += 1;
  if (qtdAvaliacoes === 0) score += 2;

  const inactive = ["cancelada", "indeferida"].includes(normalizeStatus(statusMatricula));
  if (inactive) score = 0;

  let prioridade = "ok";
  if (!inactive) {
    if (score >= 6) prioridade = "critica";
    else if (score >= 4) prioridade = "alta";
    else if (score >= 2) prioridade = "media";
  }

  return {
    matriculaId: raw.matriculaId,
    nome: raw.nome || "Sem nome",
    email: raw.email || "",
    celular: raw.celular || "",
    turma: raw.turma || "Sem turma",
    statusMatricula: statusMatricula,
    contrato: contrato,
    ultimoAcessoDate: ultimoAcessoDate,
    diasSemAcesso: diasSemAcesso,
    faixaAcesso: faixaAcesso,
    qtdAvaliacoes: qtdAvaliacoes,
    disciplinasFeitas: disciplinasFeitas,
    materiasFeitas: materiasFeitas,
    avaliacoes: avaliacoes,
    mediaNotas: mediaNotas,
    diasIntegralizacao: raw.diasIntegralizacao,
    dataInicio: parseDate(raw.dataInicio),
    dataFinal: parseDate(raw.dataFinal),
    prioridade: prioridade,
    motivos: motivos,
    motivoTexto: motivos.length ? motivos.join(" · ") : "Sem pendencias criticas",
    avaliacaoStatus: qtdAvaliacoes === 0 ? "pendente" : disciplinasFeitas.length === 1 ? "parcial" : "completo",
  };
}

function ingest(payload) {
  state.meta = payload.meta || {};
  state.alunosRaw = payload.alunos || [];
  state.avaliacoes = payload.avaliacoes || [];
  state.disciplinasResumo = payload.disciplinasResumo || [];
  state.csatResumo = payload.csatResumo || {};
  state.csatPorDisciplina = payload.csatPorDisciplina || [];
  state.csatRespostas = payload.csatRespostas || [];
  state.activeKpi = null;
  state.selectedStudentId = null;
  state.refDate = startOfDay(new Date());
  state.calMonth = startOfDay(new Date(state.refDate.getFullYear(), state.refDate.getMonth(), 1));

  if (state.charts.acesso) { state.charts.acesso.destroy(); state.charts.acesso = null; }
  if (state.charts.prioridade) { state.charts.prioridade.destroy(); state.charts.prioridade = null; }

  const byId = buildAvaliacoesById(state.avaliacoes);
  state.students = state.alunosRaw.map((a) => classifyStudent(a, byId.get(String(a.matriculaId)) || []));
  state.students.sort((x, y) => {
    const order = { critica: 0, alta: 1, media: 2, ok: 3 };
    return order[x.prioridade] - order[y.prioridade] || x.nome.localeCompare(y.nome, "pt-BR");
  });

  if (els.courseLine) {
    els.courseLine.textContent = (state.meta.curso || "Pos-Graduacao") + " · " + state.students.length + " alunos na base";
  }
  fillTurmaFilter();
  fillJourneyMateriaFilter();
  fillCommentDiscFilter();
  renderAll();
  renderJourney();
  renderComments();
  if (els.btnExport) els.btnExport.disabled = state.students.length === 0;
}

function resetFilters() {
  els.matriculaFilter.value = "ativas";
  els.contratoFilter.value = "";
  els.acessoFilter.value = "";
  els.avaliacaoFilter.value = "";
  els.prioridadeFilter.value = "";
  els.turmaFilter.value = "";
  els.searchInput.value = "";
}

function applyKpiFilter(kpiId) {
  const cfg = KPI_CONFIG[kpiId];
  if (!cfg) return;
  state.filterFromKpi = true;
  els.matriculaFilter.value = cfg.matricula || "ativas";
  els.contratoFilter.value = cfg.contrato || "";
  els.acessoFilter.value = cfg.acesso || "";
  els.avaliacaoFilter.value = cfg.avaliacao || "";
  els.prioridadeFilter.value = cfg.prioridade || "";
  state.activeKpi = kpiId;
  state.filterFromKpi = false;
}

function toggleKpi(kpiId) {
  if (state.activeKpi === kpiId) {
    state.activeKpi = null;
    resetFilters();
  } else {
    applyKpiFilter(kpiId);
  }
  renderAll();
  const panel = document.querySelector("#tab-cs .table-panel");
  if (panel) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hasActiveFilters() {
  return Boolean(
    els.searchInput.value.trim() ||
      els.turmaFilter.value ||
      els.contratoFilter.value ||
      els.acessoFilter.value ||
      els.avaliacaoFilter.value ||
      els.prioridadeFilter.value ||
      (els.matriculaFilter.value && els.matriculaFilter.value !== "ativas") ||
      state.activeKpi
  );
}

function getFilterDescription() {
  if (state.activeKpi && KPI_CONFIG[state.activeKpi]) return KPI_CONFIG[state.activeKpi].label;
  const parts = [];
  if (els.matriculaFilter.value && els.matriculaFilter.value !== "ativas") parts.push(els.matriculaFilter.value);
  if (els.contratoFilter.value) parts.push("Contrato " + els.contratoFilter.value);
  if (els.acessoFilter.value) parts.push("Acesso " + els.acessoFilter.value);
  if (els.avaliacaoFilter.value) parts.push("Avaliacao " + els.avaliacaoFilter.value);
  if (els.prioridadeFilter.value) parts.push("Prioridade " + els.prioridadeFilter.value);
  if (els.turmaFilter.value) parts.push(els.turmaFilter.value);
  if (els.searchInput.value.trim()) parts.push('Busca "' + els.searchInput.value.trim() + '"');
  return parts.length ? parts.join(" | ") : "Base operacional";
}

function basePopulation(list) {
  list = list || state.students;
  const mode = els.matriculaFilter.value;
  if (mode === "ativas") {
    return list.filter((s) => {
      const st = normalizeStatus(s.statusMatricula);
      return st === "ativa" || st === "pre-confirmada";
    });
  }
  if (mode) {
    return list.filter((s) => normalizeStatus(s.statusMatricula) === normalizeStatus(mode));
  }
  return list;
}

function getFilteredStudents() {
  const q = normalize(els.searchInput.value);
  const turma = els.turmaFilter.value;
  const contrato = els.contratoFilter.value;
  const acesso = els.acessoFilter.value;
  const avaliacao = els.avaliacaoFilter.value;
  const prioridade = els.prioridadeFilter.value;

  return basePopulation().filter((s) => {
    if (turma && s.turma !== turma) return false;
    if (contrato && s.contrato !== contrato) return false;
    if (prioridade && s.prioridade !== prioridade) return false;
    if (avaliacao === "fez" && s.qtdAvaliacoes === 0) return false;
    if (avaliacao === "pendente" && s.qtdAvaliacoes !== 0) return false;
    if (avaliacao === "parcial" && s.avaliacaoStatus !== "parcial") return false;
    if (avaliacao === "completo" && s.avaliacaoStatus !== "completo") return false;
    if (acesso) {
      if (acesso === "nunca" && s.faixaAcesso !== "nunca") return false;
      if (acesso === "7" && s.faixaAcesso !== "7") return false;
      if (acesso === "15" && ["7", "15"].indexOf(s.faixaAcesso) < 0) return false;
      if (acesso === "30" && ["7", "15", "30"].indexOf(s.faixaAcesso) < 0) return false;
      if (acesso === "30plus" && ["30plus", "60plus"].indexOf(s.faixaAcesso) < 0) return false;
      if (acesso === "60plus" && s.faixaAcesso !== "60plus") return false;
    }
    if (q) {
      const hay = normalize(s.nome + " " + s.email + " " + s.celular + " " + s.matriculaId + " " + s.turma);
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function getChartPopulation() {
  return hasActiveFilters() ? getFilteredStudents() : basePopulation();
}

function journeyBase() {
  return state.students.filter((s) => {
    const st = normalizeStatus(s.statusMatricula);
    return st === "ativa" || st === "pre-confirmada";
  });
}

function getJourneyRows() {
  const q = normalize(els.journeySearch.value);
  const mat = els.journeyMateriaFilter.value;
  const prova = els.journeyProvaFilter.value;

  return journeyBase()
    .map((s) => ({ student: s, journey: journeyForStudent(s, state.refDate) }))
    .filter(function (row) {
      const student = row.student;
      const journey = row.journey;
      if (q) {
        const hay = normalize(student.nome + " " + student.matriculaId + " " + student.email);
        if (!hay.includes(q)) return false;
      }
      if (mat && String((journey.atual && journey.atual.ordem) || "") !== mat) return false;
      if (prova && journey.provaAtual !== prova) return false;
      return true;
    })
    .sort(function (a, b) {
      const ao = (a.journey.atual && a.journey.atual.ordem) || 0;
      const bo = (b.journey.atual && b.journey.atual.ordem) || 0;
      if (ao !== bo) return ao - bo;
      return a.student.nome.localeCompare(b.student.nome, "pt-BR");
    });
}

function computeStats() {
  const list = basePopulation();
  const total = list.length || 1;
  const semContrato = list.filter((s) => s.contrato === "Pendente").length;
  const semAcesso = list.filter((s) => s.faixaAcesso === "nunca").length;
  const inativos = list.filter((s) => s.faixaAcesso === "30plus" || s.faixaAcesso === "60plus").length;
  const fezAvaliacao = list.filter((s) => s.qtdAvaliacoes > 0).length;
  const pendenteAvaliacao = list.filter((s) => s.qtdAvaliacoes === 0).length;
  const criticos = list.filter((s) => s.prioridade === "critica").length;
  const preConfirmada = list.filter((s) => normalizeStatus(s.statusMatricula) === "pre-confirmada").length;
  return {
    total: list.length,
    semContrato: semContrato,
    semAcesso: semAcesso,
    inativos: inativos,
    fezAvaliacao: fezAvaliacao,
    pendenteAvaliacao: pendenteAvaliacao,
    criticos: criticos,
    preConfirmada: preConfirmada,
    pctContrato: Math.round(((list.length - semContrato) / total) * 100),
    pctAcesso: Math.round(((list.length - semAcesso) / total) * 100),
    pctAvaliacao: Math.round((fezAvaliacao / total) * 100),
  };
}

function renderKpis() {
  const s = computeStats();
  const cards = [
    { id: "total", label: "Alunos no filtro", value: s.total, hint: "Base operacional CS", tone: "" },
    { id: "semContrato", label: "Sem assinar contrato", value: s.semContrato, hint: s.pctContrato + "% aceitaram", tone: "warn" },
    { id: "semAcesso", label: "Sem acessar", value: s.semAcesso, hint: s.pctAcesso + "% ja acessaram", tone: "danger" },
    { id: "inativos", label: "Inativos +30 dias", value: s.inativos, hint: "Risco de evasao", tone: "warn" },
    { id: "fezAvaliacao", label: "Fizeram avaliacoes", value: s.fezAvaliacao, hint: s.pctAvaliacao + "% da base", tone: "info" },
    { id: "pendenteAvaliacao", label: "Sem nenhuma avaliacao", value: s.pendenteAvaliacao, hint: "Cobrar progresso", tone: "warn" },
    { id: "preConfirmada", label: "Pre-confirmadas", value: s.preConfirmada, hint: "Onboarding / ativacao", tone: "info" },
    { id: "criticos", label: "Prioridade critica", value: s.criticos, hint: "Acao imediata", tone: "danger" },
  ];
  els.kpiGrid.innerHTML = cards.map(function (c) {
    return '<button type="button" class="kpi ' + c.tone + (state.activeKpi === c.id ? " active" : "") + '" data-kpi="' + c.id + '">' +
      '<p class="label">' + c.label + '</p><p class="value">' + c.value + '</p><p class="hint">' + c.hint + '</p></button>';
  }).join("");
}

function renderActionQueues() {
  const base = basePopulation();
  const queues = [
    { title: "Cobrar assinatura de contrato", desc: "Status do contrato = Pendente", count: base.filter((s) => s.contrato === "Pendente").length },
    { title: "Onboarding / primeiro acesso", desc: "Nunca acessaram a plataforma", count: base.filter((s) => s.faixaAcesso === "nunca").length },
    { title: "Reativacao de inativos", desc: "Sem acesso ha mais de 30 dias", count: base.filter((s) => s.faixaAcesso === "30plus" || s.faixaAcesso === "60plus").length },
    { title: "Cobrar avaliacoes", desc: "Ainda nao fizeram nenhuma disciplina", count: base.filter((s) => s.qtdAvaliacoes === 0).length },
    { title: "Lista critica do dia", desc: "Maior risco / travamento", count: base.filter((s) => s.prioridade === "critica").length },
  ];
  els.actionQueues.innerHTML = queues.map(function (q, i) {
    return '<button type="button" class="queue-btn" data-queue="' + i + '"><div><strong>' + q.title +
      '</strong><span>' + q.desc + '</span></div><div class="count">' + q.count + '</div></button>';
  }).join("");
}

function fillTurmaFilter() {
  const turmas = [...new Set(state.students.map((s) => s.turma))].sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
  const current = els.turmaFilter.value;
  els.turmaFilter.innerHTML = '<option value="">Todas</option>' +
    turmas.map(function (t) { return '<option value="' + escapeAttr(t) + '">' + escapeHtml(t) + '</option>'; }).join("");
  if (turmas.indexOf(current) >= 0) els.turmaFilter.value = current;
}

function fillJourneyMateriaFilter() {
  const current = els.journeyMateriaFilter.value;
  els.journeyMateriaFilter.innerHTML = '<option value="">Todas</option>' +
    curriculo().map(function (m) {
      return '<option value="' + m.ordem + '">M' + m.ordem + ' — ' + escapeHtml(m.curto) + '</option>';
    }).join("");
  if (current) els.journeyMateriaFilter.value = current;
}

function fillCommentDiscFilter() {
  const discs = [...new Set(state.csatRespostas.map((c) => c.disciplina).filter(Boolean))].sort(function (a, b) {
    return a.localeCompare(b, "pt-BR");
  });
  const current = els.commentDiscFilter.value;
  els.commentDiscFilter.innerHTML = '<option value="">Todas</option>' +
    discs.map(function (d) { return '<option value="' + escapeAttr(d) + '">' + escapeHtml(d) + '</option>'; }).join("");
  if (discs.indexOf(current) >= 0) els.commentDiscFilter.value = current;
}

function renderTable() {
  const list = getFilteredStudents();
  const baseCount = basePopulation().length;
  els.tableSummary.textContent = list.length + " aluno(s) exibidos · Filtro: " + getFilterDescription() + " · Base " + baseCount;
  els.btnExport.disabled = list.length === 0;
  if (!list.length) {
    els.studentsTable.innerHTML = '<tr><td colspan="9">Nenhum aluno com esses filtros.</td></tr>';
    return;
  }
  els.studentsTable.innerHTML = list.map(function (s) {
    const acessoLabel = s.faixaAcesso === "nunca" ? "Nunca acessou" : formatDate(s.ultimoAcessoDate) + " · " + s.diasSemAcesso + "d";
    const avLabel = s.qtdAvaliacoes === 0 ? "Nenhuma" : s.qtdAvaliacoes + " · media " + Math.round(s.mediaNotas);
    return '<tr><td><span class="tag tag-' + s.prioridade + '">' + labelPrioridade(s.prioridade) + '</span></td>' +
      '<td><div class="student-name">' + escapeHtml(s.nome) + '</div><div class="student-meta">' +
      escapeHtml(s.email || "—") + " · " + escapeHtml(s.statusMatricula) + '</div></td>' +
      '<td>' + escapeHtml(s.matriculaId) + '</td><td>' + escapeHtml(s.turma) + '</td><td>' + escapeHtml(s.contrato) + '</td>' +
      '<td>' + acessoLabel + '</td><td>' + avLabel + '</td><td>' + escapeHtml(s.celular || "—") + '</td>' +
      '<td>' + escapeHtml(s.motivoTexto) + '</td></tr>';
  }).join("");
}

function renderCharts() {
  if (typeof Chart === "undefined") return;
  const list = getChartPopulation();
  const acessoCounts = {
    "Nunca": list.filter((s) => s.faixaAcesso === "nunca").length,
    "<= 7 dias": list.filter((s) => s.faixaAcesso === "7").length,
    "8-15 dias": list.filter((s) => s.faixaAcesso === "15").length,
    "16-30 dias": list.filter((s) => s.faixaAcesso === "30").length,
    "31-60 dias": list.filter((s) => s.faixaAcesso === "30plus").length,
    "+60 dias": list.filter((s) => s.faixaAcesso === "60plus").length,
  };
  const prioridadeCounts = {
    "Critica": list.filter((s) => s.prioridade === "critica").length,
    "Alta": list.filter((s) => s.prioridade === "alta").length,
    "Media": list.filter((s) => s.prioridade === "media").length,
    "Em dia": list.filter((s) => s.prioridade === "ok").length,
  };
  const acessoLabels = Object.keys(acessoCounts);
  const acessoValues = Object.values(acessoCounts);
  const prioLabels = Object.keys(prioridadeCounts);
  const prioValues = Object.values(prioridadeCounts);
  const chartColors = ["#0891b2", "#0d9488", "#06b6d4", "#f59e0b", "#ea580c", "#e11d48"];
  const prioColors = ["#e11d48", "#ea580c", "#0284c7", "#0d9488"];

  if (state.charts.acesso) {
    state.charts.acesso.data.labels = acessoLabels;
    state.charts.acesso.data.datasets[0].data = acessoValues;
    state.charts.acesso.update();
  } else {
    state.charts.acesso = new Chart(document.getElementById("acessoChart"), {
      type: "bar",
      data: { labels: acessoLabels, datasets: [{ data: acessoValues, backgroundColor: chartColors, borderRadius: 8 }] },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: "Outfit", size: 11 } } },
          y: { beginAtZero: true, ticks: { precision: 0, font: { family: "Outfit", size: 11 } }, grid: { color: "rgba(8, 145, 178, 0.12)" } },
        },
      },
    });
  }

  if (state.charts.prioridade) {
    state.charts.prioridade.data.labels = prioLabels;
    state.charts.prioridade.data.datasets[0].data = prioValues;
    state.charts.prioridade.update();
  } else {
    state.charts.prioridade = new Chart(document.getElementById("prioridadeChart"), {
      type: "doughnut",
      data: { labels: prioLabels, datasets: [{ data: prioValues, backgroundColor: prioColors, borderWidth: 0 }] },
      options: {
        plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { family: "Outfit" } } } },
        cutout: "62%",
      },
    });
  }
}

function renderDisciplinas() {
  if (!state.disciplinasResumo.length) {
    const counts = {};
    state.avaliacoes.forEach((a) => { counts[a.disciplina] = (counts[a.disciplina] || 0) + 1; });
    const entries = Object.entries(counts);
    els.disciplinaCards.innerHTML = entries.length
      ? entries.map(function (pair) {
          return '<div class="disciplina-card"><h3>' + escapeHtml(pair[0]) + '</h3><div class="disciplina-meta">' +
            '<span>Alunos que fizeram<strong>' + pair[1] + '</strong></span>' +
            '<span>Base ativa<strong>' + basePopulation().length + '</strong></span>' +
            '<span>Pendentes<strong>' + Math.max(basePopulation().length - pair[1], 0) + '</strong></span></div></div>';
        }).join("")
      : '<p class="student-meta">Sem dados de desempenho na planilha.</p>';
    return;
  }
  const base = basePopulation().length || 1;
  els.disciplinaCards.innerHTML = state.disciplinasResumo.map(function (d) {
    const feitas = state.avaliacoes.filter((a) => a.disciplina === d.disciplina).length;
    return '<div class="disciplina-card"><h3>' + escapeHtml(d.disciplina) + '</h3><div class="disciplina-meta">' +
      '<span>Fizeram avaliacao<strong>' + feitas + '</strong></span>' +
      '<span>Nota media<strong>' + (d.notaMedia != null ? d.notaMedia : "—") + '</strong></span>' +
      '<span>Nao realizadas<strong>' + pct(d.naoRealizadas) + '</strong></span>' +
      '<span>Aprovadas<strong>' + pct(d.aprovadas) + '</strong></span>' +
      '<span>Consumo<strong>' + pct(d.consumo) + '</strong></span>' +
      '<span>% da base<strong>' + Math.round((feitas / base) * 100) + '%</strong></span></div></div>';
  }).join("");
}

function renderCsat() {
  const r = state.csatResumo;
  els.csatBlock.innerHTML =
    '<div class="csat-scores">' +
    '<div class="csat-score"><p class="value">' + pct(r.csatCurso) + '</p><p class="label">CSAT Curso</p></div>' +
    '<div class="csat-score"><p class="value">' + pct(r.csatVideo) + '</p><p class="label">Videoaulas</p></div>' +
    '<div class="csat-score"><p class="value">' + pct(r.csatMaterial) + '</p><p class="label">Material</p></div></div>' +
    '<p class="student-meta">Veja todos os comentarios na aba <strong>Comentarios CSAT</strong>.</p>';
}

function renderAll() {
  renderKpis();
  renderActionQueues();
  renderTable();
  renderCharts();
  renderDisciplinas();
  renderCsat();
}

function syncRefDateUI() {
  if (!els.refDateInput) return;
  els.refDateInput.value = toISODate(state.refDate);
  const today = startOfDay(new Date());
  const diff = daysBetween(today, state.refDate);
  let hint = "Hoje no sistema: " + formatDate(today) + ".";
  if (diff === 0) hint += " Analisando o dia de hoje.";
  else if (diff > 0) hint += " Projetando " + diff + " dia(s) no futuro.";
  else hint += " Vendo historico de " + Math.abs(diff) + " dia(s) atras.";
  els.refDateHint.textContent = hint;
}

function setRefDate(date) {
  state.refDate = startOfDay(date);
  state.calMonth = startOfDay(new Date(state.refDate.getFullYear(), state.refDate.getMonth(), 1));
  syncRefDateUI();
  renderJourney();
}

function unlockDatesInMonth(year, month) {
  const counts = new Map();
  journeyBase().forEach(function (s) {
    unlockSchedule(s.dataInicio).forEach(function (m) {
      if (m.liberacao.getFullYear() === year && m.liberacao.getMonth() === month) {
        const key = toISODate(m.liberacao);
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    });
  });
  return counts;
}

function renderCalendar() {
  const year = state.calMonth.getFullYear();
  const month = state.calMonth.getMonth();
  const monthName = state.calMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  els.calTitle.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const unlocks = unlockDatesInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayISO = toISODate(startOfDay(new Date()));
  const refISO = toISODate(state.refDate);
  const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];
  let html = weekdays.map(function (w) { return '<div class="cal-weekday">' + w + '</div>'; }).join("");
  for (let i = 0; i < firstDow; i++) html += '<div class="cal-day empty"></div>';
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const iso = toISODate(date);
    const classes = ["cal-day"];
    if (iso === todayISO) classes.push("today");
    if (iso === refISO) classes.push("selected");
    if (unlocks.has(iso)) classes.push("has-unlock");
    const badge = unlocks.get(iso) ? '<span class="cal-badge">' + unlocks.get(iso) + '</span>' : "";
    html += '<button type="button" class="' + classes.join(" ") + '" data-date="' + iso + '"><span>' + day + '</span>' + badge + '</button>';
  }
  els.calendarGrid.innerHTML = html;
}

function renderJourneyKpis() {
  const rows = journeyBase().map(function (s) { return journeyForStudent(s, state.refDate); });
  const total = rows.length || 1;
  const pendenteProva = rows.filter((j) => j.provaAtual === "pendente").length;
  const concluidaProva = rows.filter((j) => j.provaAtual === "concluida").length;
  const liberacao7 = rows.filter((j) => j.diasAteProxima != null && j.diasAteProxima >= 0 && j.diasAteProxima <= 7).length;
  const mat1 = rows.filter((j) => j.atual && j.atual.ordem === 1).length;
  const mat2plus = rows.filter((j) => j.atual && j.atual.ordem >= 2).length;
  const cards = [
    { label: "Alunos na jornada", value: rows.length, hint: "Ref. " + formatDate(state.refDate) },
    { label: "Prova atual pendente", value: pendenteProva, hint: Math.round((pendenteProva / total) * 100) + "% da base", tone: "warn" },
    { label: "Prova atual concluida", value: concluidaProva, hint: Math.round((concluidaProva / total) * 100) + "% da base", tone: "info" },
    { label: "Proxima liberacao <= 7d", value: liberacao7, hint: "Contato preventivo", tone: "warn" },
    { label: "Na Materia 1", value: mat1, hint: "Primeira liberacao" },
    { label: "Materia 2+", value: mat2plus, hint: "Ja avancaram no ciclo" },
  ];
  els.journeyKpis.innerHTML = cards.map(function (c) {
    return '<div class="kpi ' + (c.tone || "") + '"><p class="label">' + c.label + '</p><p class="value">' + c.value +
      '</p><p class="hint">' + c.hint + '</p></div>';
  }).join("");
}

function renderJourneyTable() {
  const rows = getJourneyRows();
  els.journeySummary.textContent = rows.length + " aluno(s) · referencia " + formatDate(state.refDate);
  if (!rows.length) {
    els.journeyTable.innerHTML = '<tr><td colspan="7">Nenhum aluno com esses filtros na data selecionada.</td></tr>';
    return;
  }
  els.journeyTable.innerHTML = rows.map(function (row) {
    const s = row.student;
    const j = row.journey;
    const atualLabel = j.atual ? ("M" + j.atual.ordem + " — " + j.atual.curto) : (j.statusRef === "antes-matricula" ? "Ainda nao iniciou" : "—");
    const provaTag = j.provaAtual === "concluida"
      ? '<span class="tag tag-ok">Concluida</span>'
      : j.provaAtual === "pendente"
        ? '<span class="tag tag-alta">Pendente</span>'
        : '<span class="tag tag-media">—</span>';
    const prox = j.proximaLiberacao
      ? formatDate(j.proximaLiberacao) + (j.atual && j.liberadas < curriculo().length ? " · M" + (j.liberadas + 1) : "")
      : "Grade completa";
    const dias = j.diasAteProxima == null ? "—" : j.diasAteProxima === 0 ? "Hoje" : j.diasAteProxima > 0 ? j.diasAteProxima + "d" : "—";
    const selected = String(state.selectedStudentId) === String(s.matriculaId) ? "selected-row" : "";
    return '<tr class="journey-row ' + selected + '" data-id="' + escapeAttr(s.matriculaId) + '">' +
      '<td><div class="student-name">' + escapeHtml(s.nome) + '</div><div class="student-meta">' + escapeHtml(s.email || "—") + '</div></td>' +
      '<td><div>' + escapeHtml(s.matriculaId) + '</div><div class="student-meta">Inicio ' + formatDate(s.dataInicio) +
      (j.liberacaoAtrasada ? " · 1a liberacao +1 dia" : "") + '</div></td>' +
      '<td>' + escapeHtml(atualLabel) + '</td><td>' + j.liberadas + '/' + curriculo().length + '</td><td>' + provaTag +
      '</td><td>' + escapeHtml(prox) + '</td><td>' + dias + '</td></tr>';
  }).join("");
}

function renderJourneyTimeline() {
  const student = state.students.find((s) => String(s.matriculaId) === String(state.selectedStudentId));
  if (!student) {
    els.journeyDetailSub.textContent = "Selecione um aluno na tabela para ver historico e projecoes.";
    els.journeyTimeline.innerHTML = '<p class="student-meta">Nenhum aluno selecionado.</p>';
    return;
  }
  const j = journeyForStudent(student, state.refDate);
  els.journeyDetailSub.textContent = student.nome + " · matricula " + formatDate(student.dataInicio) + " · referencia " + formatDate(state.refDate);
  if (!j.schedule.length) {
    els.journeyTimeline.innerHTML = '<p class="student-meta">Aluno sem data de inicio de matricula.</p>';
    return;
  }
  els.journeyTimeline.innerHTML = j.schedule.map(function (m) {
    const done = student.materiasFeitas && student.materiasFeitas.has(m.ordem);
    const unlocked = daysBetween(m.liberacao, state.refDate) >= 0;
    const isCurrent = j.atual && j.atual.ordem === m.ordem;
    let status = "Futura";
    let tone = "future";
    if (unlocked && done) { status = "Liberada · prova concluida"; tone = "done"; }
    else if (unlocked && isCurrent) { status = "Materia atual · prova pendente"; tone = "current"; }
    else if (unlocked) { status = "Liberada · prova pendente"; tone = "unlocked"; }
    const relative = daysBetween(state.refDate, m.liberacao);
    const relLabel = relative === 0 ? "na data de referencia" : relative > 0 ? ("em " + relative + " dia(s)") : ("ha " + Math.abs(relative) + " dia(s)");
    const tagClass = tone === "done" ? "tag-ok" : tone === "current" ? "tag-alta" : "tag-media";
    return '<div class="timeline-item ' + tone + (isCurrent ? " is-current" : "") + '">' +
      '<div class="timeline-marker"></div><div class="timeline-body"><div class="timeline-top">' +
      '<strong>M' + m.ordem + ' — ' + escapeHtml(m.curto) + '</strong><span class="tag ' + tagClass + '">' + status + '</span></div>' +
      '<p class="student-meta">' + escapeHtml(m.nome) + '</p>' +
      '<p class="timeline-meta">Liberacao: <strong>' + formatDate(m.liberacao) + '</strong> · ' + relLabel + '</p></div></div>';
  }).join("");
}

function renderJourney() {
  if (!els.journeyTable) return;
  syncRefDateUI();
  renderCalendar();
  renderJourneyKpis();
  renderJourneyTable();
  renderJourneyTimeline();
}

function renderComments() {
  if (!els.commentsList) return;
  const r = state.csatResumo;
  els.commentsScores.innerHTML =
    '<div class="csat-score"><p class="value">' + pct(r.csatCurso) + '</p><p class="label">CSAT Curso</p></div>' +
    '<div class="csat-score"><p class="value">' + pct(r.csatVideo) + '</p><p class="label">Videoaulas</p></div>' +
    '<div class="csat-score"><p class="value">' + pct(r.csatMaterial) + '</p><p class="label">Material</p></div>' +
    '<div class="csat-score"><p class="value">' + state.csatRespostas.length + '</p><p class="label">Respostas</p></div>';

  const q = normalize(els.commentSearch.value);
  const disc = els.commentDiscFilter.value;
  const onlyText = els.commentOnlyText.value === "com";
  const list = state.csatRespostas.filter(function (c) {
    if (onlyText && !c.comentario) return false;
    if (disc && c.disciplina !== disc) return false;
    if (q) {
      const hay = normalize(c.comentario + " " + c.disciplina);
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (!list.length) {
    els.commentsList.innerHTML = '<div class="panel"><p class="student-meta">Nenhum comentario com esses filtros.</p></div>';
    return;
  }
  els.commentsList.innerHTML = list.map(function (c) {
    return '<article class="panel comment-card"><div class="comment-head"><strong>' + escapeHtml(c.disciplina) +
      '</strong><span class="student-meta">Video ' + c.csatVideo + ' · Material ' + c.csatMaterial +
      (c.turma ? ' · ' + escapeHtml(c.turma) : '') + '</span></div><p>' +
      (c.comentario ? escapeHtml(c.comentario) : '<em>Sem comentario textual.</em>') + '</p></article>';
  }).join("");
}

function exportFiltered() {
  try { ensureXlsx(); } catch (err) { alert(err.message); return; }
  const activeTab = (document.querySelector(".tab.active") && document.querySelector(".tab.active").dataset.tab) || "cs";

  if (activeTab === "jornada") {
    const rows = getJourneyRows().map(function (row) {
      const s = row.student;
      const j = row.journey;
      return {
        Nome: s.nome,
        "Matricula / ID": s.matriculaId,
        Email: s.email,
        "Data matricula": formatDate(s.dataInicio),
        "Data referencia": formatDate(state.refDate),
        "Materia atual": j.atual ? ("M" + j.atual.ordem + " — " + j.atual.nome) : "—",
        Liberadas: j.liberadas + "/" + curriculo().length,
        "Prova atual": j.provaAtual,
        "Proxima liberacao": j.proximaLiberacao ? formatDate(j.proximaLiberacao) : "Grade completa",
        "Dias ate proxima": j.diasAteProxima != null ? j.diasAteProxima : "",
      };
    });
    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Jornada");
    XLSX.writeFile(book, "jornada-pos-ia-" + toISODate(state.refDate) + ".xlsx");
    return;
  }

  const list = getFilteredStudents();
  const rows = list.map(function (s) {
    return {
      Prioridade: labelPrioridade(s.prioridade),
      Nome: s.nome,
      "Matricula / ID": s.matriculaId,
      Email: s.email,
      Celular: s.celular,
      Turma: s.turma,
      "Status Matricula": s.statusMatricula,
      Contrato: s.contrato,
      "Ultimo acesso": s.ultimoAcessoDate ? formatDate(s.ultimoAcessoDate) : "Nunca",
      "Dias sem acesso": Number.isFinite(s.diasSemAcesso) ? s.diasSemAcesso : "",
      Avaliacoes: s.qtdAvaliacoes,
      "Media notas": s.mediaNotas != null ? Math.round(s.mediaNotas) : "",
      "Motivo CS": s.motivoTexto,
    };
  });
  const sheet = XLSX.utils.json_to_sheet(rows);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Lista CS");
  XLSX.writeFile(book, "lista-cs-pos-ia-" + toISODate(new Date()) + ".xlsx");
}

async function loadDefaultData() {
  if (window.location.protocol === "file:") {
    els.courseLine.textContent = "Abra via servidor local ou importe a planilha.";
    setStatus("Modo arquivo local: clique em Importar planilha para carregar os dados.", "loading");
    syncRefDateUI();
    renderCalendar();
    return;
  }
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (!res.ok) throw new Error("data.json nao encontrado");
    const payload = await res.json();
    ingest(payload);
    setStatus("Dados carregados automaticamente: " + (payload.alunos ? payload.alunos.length : 0) + " alunos · referencia " + formatDate(state.refDate) + ".", "ok");
  } catch (err) {
    console.warn(err);
    els.courseLine.textContent = "Importe a planilha para comecar.";
    setStatus("Nenhum dado pre-carregado. Clique em Importar planilha.", "loading");
    syncRefDateUI();
    renderCalendar();
  }
}

function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach(function (btn) {
    const active = btn.dataset.tab === tabId;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
  document.querySelectorAll(".tab-panel").forEach(function (panel) {
    const active = panel.id === "tab-" + tabId;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
  if (tabId === "jornada") {
    syncRefDateUI();
    renderJourney();
  }
  if (tabId === "comentarios") renderComments();
}

function wireEvents() {
  els.fileInput.addEventListener("change", function (e) {
    const file = e.target.files && e.target.files[0];
    if (file) handleFileImport(file);
    e.target.value = "";
  });

  els.btnExport.addEventListener("click", exportFiltered);

  document.querySelectorAll(".tab").forEach(function (btn) {
    btn.addEventListener("click", function () { switchTab(btn.dataset.tab); });
  });

  [
    els.searchInput, els.turmaFilter, els.matriculaFilter, els.contratoFilter,
    els.acessoFilter, els.avaliacaoFilter, els.prioridadeFilter,
  ].forEach(function (el) {
    if (!el) return;
    const onFilterChange = function () {
      if (!state.filterFromKpi) state.activeKpi = null;
      renderAll();
    };
    el.addEventListener("input", onFilterChange);
    el.addEventListener("change", onFilterChange);
  });

  const QUEUE_ACTIONS = [
    function () { applyKpiFilter("semContrato"); },
    function () { applyKpiFilter("semAcesso"); },
    function () { applyKpiFilter("inativos"); },
    function () { applyKpiFilter("pendenteAvaliacao"); },
    function () { applyKpiFilter("criticos"); },
  ];

  els.kpiGrid.addEventListener("click", function (e) {
    const btn = e.target.closest(".kpi");
    if (!btn || !btn.dataset.kpi) return;
    toggleKpi(btn.dataset.kpi);
  });

  els.actionQueues.addEventListener("click", function (e) {
    const btn = e.target.closest(".queue-btn");
    if (!btn) return;
    const index = Number(btn.dataset.queue);
    if (QUEUE_ACTIONS[index]) {
      QUEUE_ACTIONS[index]();
      renderAll();
      const panel = document.querySelector("#tab-cs .table-panel");
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  els.btnToday.addEventListener("click", function () { setRefDate(new Date()); });
  els.refDateInput.addEventListener("change", function () {
    if (!els.refDateInput.value) return;
    const parts = els.refDateInput.value.split("-").map(Number);
    setRefDate(new Date(parts[0], parts[1] - 1, parts[2]));
  });

  els.calPrev.addEventListener("click", function () {
    state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  els.calNext.addEventListener("click", function () {
    state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  els.calendarGrid.addEventListener("click", function (e) {
    const day = e.target.closest(".cal-day[data-date]");
    if (!day) return;
    const parts = day.dataset.date.split("-").map(Number);
    setRefDate(new Date(parts[0], parts[1] - 1, parts[2]));
  });

  [els.journeySearch, els.journeyMateriaFilter, els.journeyProvaFilter].forEach(function (el) {
    el.addEventListener("input", renderJourney);
    el.addEventListener("change", renderJourney);
  });

  els.journeyTable.addEventListener("click", function (e) {
    const row = e.target.closest("tr[data-id]");
    if (!row) return;
    state.selectedStudentId = row.dataset.id;
    renderJourneyTable();
    renderJourneyTimeline();
  });

  [els.commentSearch, els.commentDiscFilter, els.commentOnlyText].forEach(function (el) {
    el.addEventListener("input", renderComments);
    el.addEventListener("change", renderComments);
  });
}

function boot() {
  bindElements();
  if (typeof XLSX === "undefined") {
    setStatus("Carregando bibliotecas... Aguarde ou recarregue a pagina.", "loading");
    setTimeout(boot, 250);
    return;
  }
  state.refDate = startOfDay(new Date());
  state.calMonth = startOfDay(new Date(state.refDate.getFullYear(), state.refDate.getMonth(), 1));
  wireEvents();
  syncRefDateUI();
  loadDefaultData();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
