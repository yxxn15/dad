// 전역 변수로 애니메이션 ID를 관리
let animationFrameId = null;

// 페이지 로드 시 실행
window.onload = function() {
  const intro = document.getElementById('intro');
  const videoFullscreen = document.getElementById('video-fullscreen');
  const video = document.getElementById('birthday-video');
  const videoCloseBtn = document.getElementById('video-close');

  launchConfetti();
  typeText("사랑하는 아빠 생일 축하해 🎉", "typing-text", 150, () => {
    setTimeout(() => {
      intro.classList.add('hidden');
      videoFullscreen.classList.remove('hidden');
      video.play();
    }, 2000);
  });

  video.onended = () => {
    videoCloseBtn.classList.remove('hidden');
  };
};

// ✅ 영상 닫기 버튼 (수정된 부분)
function closeVideo() {
  document.getElementById('video-fullscreen').classList.add('hidden');
  const filmContainer = document.getElementById('film-container');
  filmContainer.classList.remove('hidden');
  
  // ✅ 버튼을 여기서 보이게 합니다. (필름이 시작될 때 바로 보임)
  document.getElementById('speed-controls').classList.remove('hidden');

  // 기본 속도(1x)로 애니메이션 시작
  setSpeed(1.0);
}

// 배속 설정 및 애니메이션 실행 함수
function setSpeed(rate) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  const buttons = document.querySelectorAll('#speed-controls button');
  buttons.forEach(button => button.classList.remove('active'));
  const activeButton = [...buttons].find(btn => btn.textContent.includes(rate));
  if (activeButton) {
    activeButton.classList.add('active');
  }

  const filmContainer = document.getElementById("film-container");
  const letter = document.getElementById("letter-container");
  
  filmContainer.style.transform = 'translateY(0)';
  letter.classList.remove('show');

  setTimeout(() => {
    const distanceToScroll = letter.offsetTop - (window.innerHeight / 2) + (letter.offsetHeight / 2);
    let startTime = null;
    
    const BASE_DURATION = 85000; // 1x 기준 시간 (85초)
    const animationDuration = BASE_DURATION / rate;

    function animationStep(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const currentY = progress * distanceToScroll;
      filmContainer.style.transform = `translateY(-${currentY}px)`;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animationStep);
      } else {
        filmContainer.style.transform = `translateY(-${distanceToScroll}px)`;
      }
    }
    animationFrameId = requestAnimationFrame(animationStep);

    setTimeout(() => {
      letter.classList.add("show");
    }, animationDuration / 2);
  }, 100);
}


// --- 유틸리티 함수 (기존과 동일) ---
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  confetti.create(canvas, { resize: true })({ particleCount: 200, spread: 160 });
}

function typeText(text, targetId, speed, callback) {
  const target = document.getElementById(targetId);
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      target.textContent += text[i++];
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}