// --- 전역 변수 ---
let animationFrameId = null;
let isPaused = false;
let currentRate = 1.0;
let currentLetterIndex = 0;
let letters = [];

// --- 페이지 로드 및 초기화 ---
window.onload = function() {
  const intro = document.getElementById('intro');
  const letterScreen = document.getElementById('letter-screen');
  
  letters = document.querySelectorAll('.letter-content');
  const prevLetterBtn = document.getElementById('prev-letter');
  const nextLetterBtn = document.getElementById('next-letter');

  // 1. 인트로 시작
  launchConfetti();
  typeText("사랑하는 아빠 생일 축하해 🎉", "typing-text", 150, () => {
    setTimeout(() => {
      intro.classList.add('hidden');
      letterScreen.classList.remove('hidden');
      showLetter(0);
    }, 2000);
  });

  // 2. 편지 넘김 버튼 이벤트
  nextLetterBtn.addEventListener('click', () => {
    if (currentLetterIndex < letters.length - 1) {
      currentLetterIndex++;
      showLetter(currentLetterIndex);
    } else {
      startFilmSequence();
    }
  });

  prevLetterBtn.addEventListener('click', () => {
    if (currentLetterIndex > 0) {
      currentLetterIndex--;
      showLetter(currentLetterIndex);
    }
  });
};

// --- 핵심 기능 함수 ---

// 지정된 번호의 편지를 보여주는 함수
function showLetter(index) {
  document.getElementById('letter-navigation').classList.remove('hidden');
  const pagination = document.getElementById('letter-pagination');
  const prevBtn = document.getElementById('prev-letter');
  const nextBtn = document.getElementById('next-letter');

  letters.forEach(letter => letter.classList.add('hidden'));
  letters[index].classList.remove('hidden');

  pagination.textContent = `${index + 1} / ${letters.length}`;
  prevBtn.style.visibility = (index === 0) ? 'hidden' : 'visible';
  nextBtn.textContent = (index === letters.length - 1) ? '필름 보기 →' : '다음 →';
}

// 필름 시퀀스 시작
function startFilmSequence() {
  document.getElementById('letter-screen').classList.add('hidden');
  document.getElementById('letter-navigation').classList.add('hidden');
  document.getElementById('film-container').classList.remove('hidden');
  document.getElementById('speed-controls').classList.remove('hidden');
  
  const filmContainer = document.getElementById('film-container');
  filmContainer.addEventListener('click', togglePause);
  
  // ✅ 모든 필름 이미지가 로드될 때까지 기다렸다가 애니메이션 시작!
  waitForImages('#film-container', () => {
    filmContainer.scrollTop = 0;
    const music = document.getElementById('background-music');
    music.currentTime = 67;
    music.play().catch(e => console.log("음악 재생 오류:", e));
    setSpeed(1.0);
  });
}

// ✅ 이미지 로딩을 기다리는 함수 (새로 추가됨)
function waitForImages(containerSelector, callback) {
  const container = document.querySelector(containerSelector);
  const images = container.querySelectorAll('img');
  let loadedCount = 0;
  const totalImages = images.length;

  if (totalImages === 0) {
    callback();
    return;
  }

  images.forEach(image => {
    if (image.complete) {
      loadedCount++;
    } else {
      image.addEventListener('load', () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          callback();
        }
      });
      image.addEventListener('error', () => { // 이미지 로드 실패 시에도 카운트
        loadedCount++;
        if (loadedCount === totalImages) {
          callback();
        }
      });
    }
  });

  if (loadedCount === totalImages) {
    callback();
  }
}


// 일시정지 / 재시작 토글 함수
function togglePause() {
  isPaused = !isPaused;
  const pauseIndicator = document.getElementById('pause-indicator');
  if (isPaused) {
    cancelAnimationFrame(animationFrameId);
    pauseIndicator.classList.remove('hidden');
  } else {
    pauseIndicator.classList.add('hidden');
    playAnimation(currentRate);
  }
}

// 배속 설정 함수
function setSpeed(rate) {
  isPaused = false;
  document.getElementById('pause-indicator').classList.add('hidden');
  currentRate = rate;
  playAnimation(rate);
}

// 애니메이션 실행 함수
function playAnimation(rate) {
  if (animationFrameId) { cancelAnimationFrame(animationFrameId); }

  const buttons = document.querySelectorAll('#speed-controls button');
  buttons.forEach(button => button.classList.remove('active'));
  const activeButton = [...buttons].find(btn => btn.textContent.includes(rate));
  if (activeButton) { activeButton.classList.add('active'); }

  const filmContainer = document.getElementById("film-container");
  const filmStrip = filmContainer.querySelector('.film-strip');
  const startScrollTop = filmContainer.scrollTop;

  const totalDistance = filmStrip.scrollHeight - filmContainer.clientHeight;
  const remainingDistance = totalDistance - startScrollTop;
  if (remainingDistance <= 0) return;

  const BASE_DURATION = 85000;
  const currentProgress = totalDistance > 0 ? (startScrollTop / totalDistance) : 0;
  const remainingBaseDuration = (1 - currentProgress) * BASE_DURATION;
  const newAnimationDuration = remainingBaseDuration / rate;
  let startTime = null;

  function animationStep(currentTime) {
    if (isPaused) return;
    if (!startTime) startTime = currentTime;
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / newAnimationDuration, 1);
    filmContainer.scrollTop = startScrollTop + (progress * remainingDistance);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animationStep);
    } else {
      filmContainer.scrollTop = totalDistance;
    }
  }
  animationFrameId = requestAnimationFrame(animationStep);
}

// --- 유틸리티 함수 ---
function launchConfetti() { const canvas = document.getElementById("confettiCanvas"); confetti.create(canvas, { resize: true })({ particleCount: 200, spread: 160 }); }
function typeText(text, targetId, speed, callback) { const target = document.getElementById(targetId); let i = 0; const interval = setInterval(() => { if (i < text.length) { target.textContent += text[i++]; } else { clearInterval(interval); if (callback) callback(); } }, speed); }