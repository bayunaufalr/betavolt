/*
 * SILENT SIGNAL — personal mystery surprise
 * Personalisasi utama ada di objek CONFIG di bagian paling atas.
 * Website ini berjalan sepenuhnya di browser dan tidak memakai server/database.
 */

const CONFIG = {
  recipientName: "Kamu yang istimewa", // Ganti dengan nama panggilan temanmu.
  senderName: "Seseorang yang mendoakanmu", // Ganti dengan namamu atau panggilanmu.
  birthdayIntro: "Hari ini, semesta punya satu alasan lagi untuk merayakan keberadaanmu.",
  letterGreeting: "Untuk kamu,",
  letterParagraphs: [
    "Selamat ulang tahun! Hari ini bukan cuma tentang bertambahnya usia, tetapi juga tentang semua hal yang sudah kamu lewati untuk sampai di titik ini. Semoga kamu bisa melihat dirimu dengan bangga, termasuk pada hal-hal kecil yang mungkin selama ini kamu anggap biasa saja.",
    "Aku berharap kamu selalu diberi kesehatan, hati yang tenang, langkah yang dimudahkan, dan orang-orang tulus yang membuatmu merasa dihargai. Semoga setiap doa baik yang kamu simpan diam-diam menemukan jalannya, satu per satu, pada waktu yang tepat.",
    "Kalau suatu hari semuanya terasa melelahkan, semoga kamu ingat bahwa kamu tidak harus selalu kuat setiap saat. Kamu boleh beristirahat, mengubah rencana, belajar lagi, dan tumbuh dengan caramu sendiri. Tidak semua hal harus selesai hari ini.",
    "Terima kasih sudah menjadi dirimu sendiri. Semoga tahun yang baru ini membawa cerita yang lebih hangat, kesempatan yang baik, serta banyak alasan sederhana untuk tertawa. Tetap jadi seseorang yang punya ruang untuk bermimpi dan keberanian untuk menjalaninya."
  ],
  wishes: [
    { symbol: "✧", title: "Untuk hatimu", text: "Semoga kamu dikelilingi ketenangan, kasih sayang yang tulus, dan orang-orang yang menghargaimu." },
    { symbol: "⌁", title: "Untuk langkahmu", text: "Semoga jalan yang kamu pilih dimudahkan, usahamu membuahkan hasil, dan kamu berani mencoba hal baru." },
    { symbol: "☼", title: "Untuk hari-harimu", text: "Semoga selalu ada hal kecil yang membuatmu tersenyum, bahkan di hari yang tidak berjalan sesuai rencana." }
  ],
  memories: [
    { title: "Momen yang berkesan", caption: "Satu potongan cerita yang layak disimpan lebih lama.", image: "", label: "MOMENT 01" },
    { title: "Cerita kecil kita", caption: "Kadang hal sederhana justru menjadi kenangan yang paling hangat.", image: "", label: "MOMENT 02" },
    { title: "Untuk dikenang", caption: "Semoga masih banyak hal baik yang bisa dirayakan ke depannya.", image: "", label: "MOMENT 03" }
  ]
};

const PUZZLES = [
  {
    type: "riddle",
    number: "RINTANGAN 01 / OBSERVASI",
    title: "Aku selalu mengikuti.",
    description: "Petunjuk pertama tidak butuh teknologi canggih. Cukup perhatikan sesuatu yang mungkin pernah kamu lihat setiap hari.",
    question: "Aku mengikutimu saat ada cahaya, meniru setiap gerakanmu, tetapi tak bisa disentuh. Saat gelap datang, aku menghilang. Siapakah aku?",
    placeholder: "Tulis jawabanmu di sini...",
    hint: "Petunjuk: benda ini sering terlihat di tanah atau dinding ketika ada cahaya.",
    answers: ["bayangan", "bayang bayang", "shadow"]
  },
  {
    type: "cipher",
    number: "RINTANGAN 02 / DEKRIPSI",
    title: "Sinyal yang bergeser.",
    description: "Seseorang menggeser setiap huruf tiga langkah ke depan dalam alfabet. Untuk membaca pesan aslinya, geser tiap huruf tiga langkah ke belakang.",
    question: "UDKDVLD",
    placeholder: "Apa kata aslinya?",
    hint: "Petunjuk: U menjadi R, D menjadi A. Terapkan aturan yang sama ke semua huruf.",
    answers: ["rahasia", "rahasia."]
  },
  {
    type: "choice",
    number: "RINTANGAN 03 / PILIHAN CERDAS",
    title: "Pilih jalan yang aman.",
    description: "Kamu menemukan tiga pintu untuk mencapai ruang terakhir. Hanya satu yang masuk akal untuk dipilih.",
    question: "Pintu pertama dipenuhi api. Pintu kedua dijaga robot yang langsung menangkap penyusup. Pintu ketiga menyimpan singa yang tidak makan selama tiga tahun. Pintu mana yang paling aman?",
    choices: [
      { key: "A", text: "Pintu pertama, karena bisa berlari melewati api.", correct: false },
      { key: "B", text: "Pintu kedua, karena mungkin robotnya sedang tidur.", correct: false },
      { key: "C", text: "Pintu ketiga, karena singanya sudah lama tidak makan.", correct: true }
    ],
    hint: "Petunjuk: gunakan logika, bukan keberanian. Pikirkan apakah sesuatu bisa bertahan selama itu tanpa makan."
  }
];

const state = {
  stage: 0,
  busy: false,
  giftOpened: false,
  toastTimer: null,
  confettiFrame: null,
  confetti: [],
  audioContext: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const landingView = $("#landingView");
const gameView = $("#gameView");
const vaultView = $("#vaultView");
const birthdayView = $("#birthdayView");
const puzzleCard = $("#puzzleCard");
const toast = $("#toast");
const toastMessage = $("#toastMessage");
const statusText = $("#systemStatus");
const confettiCanvas = $("#confettiCanvas");
const confettiContext = confettiCanvas.getContext("2d");

function init() {
  createStarfield();
  renderPersonalContent();
  bindEvents();
  updateProgress(0);
}

function createStarfield() {
  const starfield = $("#starfield");
  const count = window.matchMedia("(max-width: 680px)").matches ? 45 : 85;
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < count; index += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--duration", `${2.5 + Math.random() * 4.5}s`);
    star.style.animationDelay = `${Math.random() * -5}s`;
    if (Math.random() > 0.82) {
      star.style.width = "3px";
      star.style.height = "3px";
      star.style.boxShadow = "0 0 7px rgba(190, 216, 255, .6)";
    }
    fragment.appendChild(star);
  }
  starfield.appendChild(fragment);
}

function bindEvents() {
  $("#beginBtn").addEventListener("click", startJourney);
  $("#openVaultBtn").addEventListener("click", revealBirthday);
  $("#giftBoxBtn").addEventListener("click", openGift);
  $("#readLetterBtn").addEventListener("click", () => {
    $("#birthdayContent").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#replayBtn").addEventListener("click", replayJourney);
  $("#closeMemoryModal").addEventListener("click", closeMemoryModal);
  $("#memoryModal").addEventListener("click", (event) => {
    if (event.target === $("#memoryModal")) closeMemoryModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMemoryModal();
    if (event.key === "Enter" && !gameView.classList.contains("hidden")) {
      const input = $("#answerInput");
      if (input && document.activeElement === input) checkTextAnswer();
    }
  });
  window.addEventListener("resize", resizeConfettiCanvas);
}

function showScreen(screenToShow) {
  [landingView, gameView, vaultView, birthdayView].forEach((screen) => screen.classList.add("hidden"));
  screenToShow.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startJourney() {
  state.stage = 0;
  state.busy = false;
  statusText.textContent = "SIGNAL CONNECTED";
  updateProgress(0);
  renderPuzzle();
  showScreen(gameView);
  playTone(420, 0.07, 0.025);
}

function renderPuzzle() {
  const puzzle = PUZZLES[state.stage];
  if (!puzzle) return;
  const card = document.createElement("div");
  card.innerHTML = `
    <p class="puzzle-number">${escapeHTML(puzzle.number)}</p>
    <h3 class="puzzle-title">${escapeHTML(puzzle.title)}</h3>
    <p class="puzzle-description">${escapeHTML(puzzle.description)}</p>
    ${puzzle.type === "cipher" ? `<div class="riddle-quote cipher-quote" aria-label="Kode rahasia"><span class="cipher-prefix">DECODE //</span><br><strong>${escapeHTML(puzzle.question)}</strong><span class="cipher-caption">CAESAR SHIFT · −3</span></div>` : `<blockquote class="riddle-quote">${escapeHTML(puzzle.question)}</blockquote>`}
    ${puzzle.type === "choice" ? renderChoices(puzzle) : renderAnswerForm(puzzle)}
    <div class="hint-row"><button class="hint-button" id="hintBtn" type="button"><span aria-hidden="true">✦</span> Minta satu petunjuk</button><p class="hint-text hidden" id="hintText">${escapeHTML(puzzle.hint)}</p></div>
  `;
  puzzleCard.replaceChildren(...Array.from(card.children));
  $("#hintBtn", puzzleCard).addEventListener("click", toggleHint);
  if (puzzle.type !== "choice") {
    $("#answerForm", puzzleCard).addEventListener("submit", (event) => {
      event.preventDefault();
      checkTextAnswer();
    });
    $("#answerInput", puzzleCard).focus({ preventScroll: true });
  } else {
    $$(".choice-button", puzzleCard).forEach((button) => {
      button.addEventListener("click", () => checkChoice(button.dataset.correct === "true", button));
    });
  }
}

function renderAnswerForm(puzzle) {
  return `
    <form class="answer-row" id="answerForm" autocomplete="off">
      <input class="answer-input" id="answerInput" name="answer" type="text" placeholder="${escapeHTML(puzzle.placeholder)}" aria-label="Jawaban teka-teki" required>
      <button class="button button-primary answer-button" type="submit"><span>Periksa jawaban</span><span class="button-arrow" aria-hidden="true">↗</span></button>
    </form>
  `;
}

function renderChoices(puzzle) {
  return `<div class="choice-list">${puzzle.choices.map((choice) => `
    <button class="choice-button" type="button" data-correct="${choice.correct}">
      <span class="choice-key">${escapeHTML(choice.key)}</span><span>${escapeHTML(choice.text)}</span>
    </button>
  `).join("")}</div>`;
}

function checkTextAnswer() {
  if (state.busy) return;
  const input = $("#answerInput");
  if (!input) return;
  const answer = normalizeAnswer(input.value);
  if (!answer) {
    showToast("Isi jawabanmu dulu. Sinyalnya belum bisa membaca pikiran.");
    input.focus();
    return;
  }
  const puzzle = PUZZLES[state.stage];
  const isCorrect = puzzle.answers.some((possibleAnswer) => normalizeAnswer(possibleAnswer) === answer);
  if (isCorrect) {
    completeStage();
  } else {
    input.value = "";
    input.focus();
    puzzleCard.classList.remove("shake");
    void puzzleCard.offsetWidth;
    puzzleCard.classList.add("shake");
    showToast(state.stage === 0 ? "Belum tepat. Coba pikirkan benda yang mengikuti gerakanmu." : "Kode belum cocok. Ingat, tiap huruf bergeser tiga langkah ke belakang.");
    playTone(190, 0.11, 0.022);
  }
}

function checkChoice(isCorrect, selectedButton) {
  if (state.busy) return;
  if (isCorrect) {
    selectedButton.classList.add("correct");
    completeStage();
  } else {
    selectedButton.classList.remove("shake");
    void selectedButton.offsetWidth;
    selectedButton.classList.add("shake");
    showToast("Jalur ini belum meyakinkan. Pikirkan apa yang mungkin terjadi setelah tiga tahun.");
    playTone(190, 0.11, 0.022);
  }
}

function toggleHint() {
  const hintText = $("#hintText");
  const hintButton = $("#hintBtn");
  const isHidden = hintText.classList.contains("hidden");
  hintText.classList.toggle("hidden", !isHidden);
  hintButton.innerHTML = isHidden ? "<span aria-hidden=\"true\">✦</span> Sembunyikan petunjuk" : "<span aria-hidden=\"true\">✦</span> Minta satu petunjuk";
}

function completeStage() {
  if (state.busy) return;
  state.busy = true;
  showToast(["Jejak pertama ditemukan. Sinyal makin jelas.", "Kode berhasil dibaca. Kamu mulai memahami polanya.", "Pilihan tepat. Semua potongan kini terhubung."][state.stage]);
  playTone(660, 0.08, 0.035);
  window.setTimeout(() => {
    state.stage += 1;
    state.busy = false;
    updateProgress(state.stage);
    if (state.stage < PUZZLES.length) {
      renderPuzzle();
    } else {
      updateProgress(PUZZLES.length);
      statusText.textContent = "FINAL SIGNAL FOUND";
      showScreen(vaultView);
      playTone(780, 0.12, 0.03);
    }
  }, 750);
}

function updateProgress(completedCount) {
  const total = PUZZLES.length;
  const percent = Math.round((completedCount / total) * 100);
  $("#progressBar").style.width = `${percent}%`;
  $("#progressPercent").textContent = `${String(percent).padStart(2, "0")}%`;
  const currentNumber = Math.min(completedCount + 1, total);
  $("#progressLabel").textContent = completedCount >= total ? "SEMUA RINTANGAN SELESAI" : `RINTANGAN ${String(currentNumber).padStart(2, "0")} / 0${total}`;
  $$(".step-dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === Math.min(completedCount, total - 1) && completedCount < total);
    dot.classList.toggle("complete", index < completedCount);
  });
}

function revealBirthday() {
  showScreen(birthdayView);
  document.title = `Selamat Ulang Tahun, ${CONFIG.recipientName} — Silent Signal`;
  statusText.textContent = "MESSAGE DELIVERED";
  renderPersonalContent();
  launchConfetti(170);
  playTone(523, 0.12, 0.03);
  window.setTimeout(() => playTone(659, 0.12, 0.03), 100);
  window.setTimeout(() => playTone(784, 0.2, 0.035), 210);
}

function openGift() {
  const giftScene = $("#giftScene");
  if (state.giftOpened) {
    showToast("Hadiah kecil ini sudah terbuka. Pesannya masih boleh dibaca lagi.");
    return;
  }
  state.giftOpened = true;
  giftScene.classList.add("opened");
  $("#giftHint").textContent = "ADA DOA BAIK DI DALAMNYA";
  launchConfetti(75);
  playTone(720, 0.13, 0.025);
}

function renderPersonalContent() {
  $("#revealPretitle").textContent = `Untuk ${CONFIG.recipientName}`;
  $("#birthdayIntro").textContent = CONFIG.birthdayIntro;
  $("#letterGreeting").textContent = CONFIG.letterGreeting;
  $("#senderName").textContent = CONFIG.senderName;
  $("#letterBody").textContent = CONFIG.letterParagraphs.join("\n\n");

  const wishGrid = $("#wishGrid");
  wishGrid.replaceChildren();
  CONFIG.wishes.forEach((wish) => {
    const card = document.createElement("article");
    card.className = "wish-card";
    const symbol = document.createElement("span");
    symbol.className = "wish-symbol";
    symbol.textContent = wish.symbol;
    const title = document.createElement("h3");
    title.textContent = wish.title;
    const text = document.createElement("p");
    text.textContent = wish.text;
    card.append(symbol, title, text);
    wishGrid.appendChild(card);
  });

  const memoryGrid = $("#memoryGrid");
  memoryGrid.replaceChildren();
  CONFIG.memories.forEach((memory, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.setAttribute("aria-label", `Buka kenangan: ${memory.title}`);
    const visual = document.createElement("div");
    visual.className = "memory-visual";
    const placeholder = document.createElement("div");
    placeholder.className = "memory-placeholder";
    const camera = document.createElement("span");
    camera.className = "camera-symbol";
    camera.textContent = "✧";
    const hint = document.createElement("span");
    hint.textContent = memory.image ? "KENANGAN TERSIMPAN" : "TAMBAHKAN FOTO DI CONFIG";
    placeholder.append(camera, hint);
    visual.appendChild(placeholder);
    if (memory.image && memory.image.trim()) {
      const image = document.createElement("img");
      image.src = memory.image;
      image.alt = memory.title;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.remove();
        hint.textContent = "FILE FOTO TIDAK DITEMUKAN";
      });
      image.addEventListener("load", () => placeholder.classList.add("hidden"));
      visual.appendChild(image);
    }
    const meta = document.createElement("div");
    meta.className = "memory-meta";
    const label = document.createElement("span");
    label.textContent = memory.label || `MOMENT ${String(index + 1).padStart(2, "0")}`;
    const title = document.createElement("h3");
    title.textContent = memory.title;
    const caption = document.createElement("p");
    caption.textContent = memory.caption;
    meta.append(label, title, caption);
    card.append(visual, meta);
    card.addEventListener("click", () => openMemoryModal(memory, index));
    memoryGrid.appendChild(card);
  });
}

function openMemoryModal(memory, index) {
  const wrap = $("#modalImageWrap");
  wrap.replaceChildren();
  if (memory.image && memory.image.trim()) {
    const image = document.createElement("img");
    image.src = memory.image;
    image.alt = memory.title;
    image.addEventListener("error", () => {
      wrap.replaceChildren(createModalPlaceholder(index));
    });
    wrap.appendChild(image);
  } else {
    wrap.appendChild(createModalPlaceholder(index));
  }
  $("#memoryModalTitle").textContent = memory.title;
  $("#memoryModalCaption").textContent = memory.caption;
  $("#memoryModal").classList.remove("hidden");
  $("#closeMemoryModal").focus();
}

function createModalPlaceholder(index) {
  const visual = document.createElement("div");
  visual.className = "memory-visual";
  const placeholder = document.createElement("div");
  placeholder.className = "memory-placeholder";
  const symbol = document.createElement("span");
  symbol.className = "camera-symbol";
  symbol.textContent = "✧";
  const label = document.createElement("span");
  label.textContent = `RUANG FOTO ${String(index + 1).padStart(2, "0")}`;
  placeholder.append(symbol, label);
  visual.appendChild(placeholder);
  return visual;
}

function closeMemoryModal() {
  $("#memoryModal").classList.add("hidden");
}

function replayJourney() {
  state.stage = 0;
  state.busy = false;
  state.giftOpened = false;
  $("#giftScene").classList.remove("opened");
  $("#giftHint").textContent = "KETUK HADIAHNYA";
  document.title = "Silent Signal — Pesan Tersembunyi";
  statusText.textContent = "SIGNAL STANDBY";
  stopConfetti();
  updateProgress(0);
  showScreen(landingView);
}

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3000);
}

function normalizeAnswer(value) {
  return value.toLocaleLowerCase("id-ID").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function resizeConfettiCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  confettiCanvas.height = Math.floor(window.innerHeight * dpr);
  confettiContext.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function launchConfetti(amount = 100) {
  resizeConfettiCanvas();
  const colors = ["#8be8f3", "#b9b2ff", "#f1cc8b", "#f2f4ff", "#8ad9b8", "#ec9ecf"];
  for (let index = 0; index < amount; index += 1) {
    state.confetti.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * .45,
      vx: (Math.random() - .5) * 3.8,
      vy: 1.7 + Math.random() * 3.6,
      size: 3 + Math.random() * 5,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - .5) * .16,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 170 + Math.random() * 100
    });
  }
  if (state.confettiFrame === null) animateConfetti();
}

function animateConfetti() {
  confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  state.confetti = state.confetti.filter((piece) => piece.life > 0 && piece.y < window.innerHeight + 30);
  state.confetti.forEach((piece) => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += .018;
    piece.vx *= .995;
    piece.rotation += piece.spin;
    piece.life -= 1;
    confettiContext.save();
    confettiContext.translate(piece.x, piece.y);
    confettiContext.rotate(piece.rotation);
    confettiContext.globalAlpha = Math.min(1, piece.life / 40);
    confettiContext.fillStyle = piece.color;
    confettiContext.fillRect(-piece.size / 2, -piece.size * .35, piece.size, piece.size * .7);
    confettiContext.restore();
  });
  if (state.confetti.length > 0) {
    state.confettiFrame = window.requestAnimationFrame(animateConfetti);
  } else {
    state.confettiFrame = null;
    confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function stopConfetti() {
  if (state.confettiFrame !== null) window.cancelAnimationFrame(state.confettiFrame);
  state.confettiFrame = null;
  state.confetti = [];
  confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function playTone(frequency, duration = 0.1, volume = 0.02) {
  // Bunyi synthesize kecil, aktif hanya setelah interaksi pengguna dan tidak memuat audio eksternal.
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!state.audioContext) state.audioContext = new AudioContextClass();
    if (state.audioContext.state === "suspended") state.audioContext.resume();
    const oscillator = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, state.audioContext.currentTime);
    gain.gain.setValueAtTime(volume, state.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, state.audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(state.audioContext.destination);
    oscillator.start();
    oscillator.stop(state.audioContext.currentTime + duration);
  } catch (error) {
    // Audio hanyalah bonus; kegagalannya tidak mengganggu permainan.
  }
}

init();
