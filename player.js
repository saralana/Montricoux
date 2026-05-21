// Elementos
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const volume = document.getElementById('volume');
const seek = document.getElementById('seek');
const currentEl = document.getElementById('current');
const durationEl = document.getElementById('duration');
const subtitleEl = document.getElementById('subtitle')

let rafId = null;
let isSeeking = false;

// formata tempo mm:ss
function formatTime(sec){
  if (!isFinite(sec)) return '0:00';
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2,'0');
  return `${m}:${s}`;
}

// carregar metadados
audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
  // inicializa seek para 0
  seek.value = 0;
});

// Atualiza a UI do tempo e do seek
function updateUI(){
  if (!isSeeking && isFinite(audio.duration) && audio.duration > 0){
    const pct = (audio.currentTime / audio.duration) * 100;
    seek.value = pct;
  }
  currentEl.textContent = formatTime(audio.currentTime);
  // atualizar visual do track (apenas para WebKit: usamos background gradient)
  updateSeekTrack();
  updateVolumeTrack();
}

// visual do seek: pinta a parte esquerda com marron
function updateSeekTrack(){
  const pct = seek.value;
  // usa gradient para simular progresso (funciona bem em WebKit browsers)
  seek.style.background = `linear-gradient(90deg, ${getComputedStyle(document.documentElement).getPropertyValue('--marron').trim()} ${pct}%, ${getComputedStyle(document.documentElement).getPropertyValue('--marron-light').trim()} ${pct}%)`;
}

function updateVolumeTrack(){
  const pct = volume.value * 100;
  // usa gradient para simular progresso
  volume.style.background = `linear-gradient(
    90deg,
    ${getComputedStyle(document.documentElement).getPropertyValue('--marron').trim()} ${pct}%,
    ${getComputedStyle(document.documentElement).getPropertyValue('--marron-light').trim()} ${pct}%
  )`;
}

// controle play/pause
playBtn.addEventListener('click', async () => {
  try {
    if (audio.paused) {
      await audio.play();
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      console.log('playing')
      startRaf();
    } else {
      audio.pause();
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
      stopRaf();
    }
  } catch (err) {
    console.warn('Playback prevented:', err);
  }
});

// mute toggle
muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  muteBtn.innerHTML = audio.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

// volume control
volume.addEventListener('input', () => {
  audio.volume = parseFloat(volume.value);
});

// when user interacts with the seek (dragging)
seek.addEventListener('pointerdown', () => { isSeeking = true; stopRaf(); });
seek.addEventListener('input', () => {
  // enquanto arrasta, mostra o tempo correspondente
  const pct = parseFloat(seek.value);
  if (isFinite(audio.duration) && audio.duration > 0){
    const t = (pct/100) * audio.duration;
    currentEl.textContent = formatTime(t);
    updateSeekTrack();
    updateVolumeTrack();
  }
});
seek.addEventListener('pointerup', () => {
  // aplicar seek ao soltar
  if (isFinite(audio.duration) && audio.duration > 0){
    audio.currentTime = (parseFloat(seek.value)/100) * audio.duration;
  }
  isSeeking = false;
  if (!audio.paused) startRaf();
});

// also support keyboard change (change event)
seek.addEventListener('change', () => {
  if (isFinite(audio.duration) && audio.duration > 0){
    audio.currentTime = (parseFloat(seek.value)/100) * audio.duration;
  }
  updateSeekTrack();
  updateVolumeTrack();
});

// RAF loop para atualização mais suave durante reprodução
function rafLoop(){
  updateUI();
  if (!audio.paused && !audio.ended) {
    rafId = requestAnimationFrame(rafLoop);
  } else {
    stopRaf();
  }
}

function startRaf(){
  if (rafId) return;
  rafId = requestAnimationFrame(rafLoop);
}

function stopRaf(){
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  // garantir atualização final
  updateUI();
}

// eventos nativos do audio
audio.addEventListener('play', () => { playBtn.innerHTML = '<i class="fas fa-pause"></i>'; startRaf(); });
audio.addEventListener('pause', () => { playBtn.innerHTML = '<i class="fas fa-play"></i>'; stopRaf(); });
audio.addEventListener('ended', () => { playBtn.innerHTML = '<i class="fas fa-play"></i>'; stopRaf(); });

//atualizacao legenda
audio.addEventListener('timeupdate', () => {

  if (!window.subtitles) return

  const current =
  audio.currentTime

  const sub =
  window.subtitles.find(s =>
    current >= s.start &&
    current <= s.end
  )

  subtitleEl.textContent =
  sub ? sub.text : ''

})

// inicialização visual
durationEl.textContent = formatTime(audio.duration || 0);
updateSeekTrack();
updateVolumeTrack();

// ========================================
// LOAD TRACK
// ========================================

async function loadTrack(data) {

  // AUDIO
  audio.src = data.audio
  audio.load()

  // RESET SUBTITLE
  subtitleEl.textContent = ''


  // LOAD SRT
  const response = await fetch(data.subtitle)
  const srtText = await response.text()

    try {

  window.subtitles =
  window.parseSRT(srtText)

} catch(err){
  console.log(err)
}
  // RESET PLAYER
  seek.value = 0
  currentEl.textContent = '0:00'

  // PLAY
  audio.play()
}
