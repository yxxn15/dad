// 전역 변수
let animationFrameId = null;

// 페이지 로드
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
  video.onended = () => { videoCloseBtn.classList.remove('hidden'); };
};

// 영상 닫기
function closeVideo() {
  document.getElementById('video-fullscreen').classList.add('hidden');
  document.getElementById('film-container').classList.remove('hidden');
  document.getElementById('speed-controls').classList.remove('hidden');
  setSpeed(1.0);
}

// ✅ 배속 설정 및 스크롤 애니메이션 (현재 위치에서 속도 변경 버전)
function setSpeed(rate) {
  // 1. 기존 애니메이션이 있다면 중단
  if (animationFrameId) { cancelAnimationFrame(animationFrameId); }

  // 2. 버튼 활성화 스타일 변경
  const buttons = document.querySelectorAll('#speed-controls button');
  buttons.forEach(button => button.classList.remove('active'));
  const activeButton = [...buttons].find(btn => btn.textContent.includes(rate));
  if (activeButton) { activeButton.classList.add('active'); }

  // 3. 필요한 요소 및 현재 스크롤 위치 가져오기
  const filmContainer = document.getElementById("film-container");
  const letter = document.getElementById("letter-container");
  const currentScrollTop = filmContainer.scrollTop; // ✅ 현재 스크롤 위치를 기억!

  setTimeout(() => {
    // 4. 스크롤 할 전체 거리 및 남은 거리 계산
    const totalDistance = letter.offsetTop - (window.innerHeight / 2) + (letter.offsetHeight / 2);
    const remainingDistance = totalDistance - currentScrollTop;

    // 스크롤이 끝났으면 더 이상 실행하지 않음
    if (remainingDistance <= 0) return;

    // 5. 남은 거리를 새로운 속도에 맞춰 스크롤할 시간 계산
    const BASE_DURATION = 85000; // 1x 기준 전체 시간
    const currentProgress = currentScrollTop / totalDistance; // 현재까지의 진행률
    const remainingBaseDuration = (1 - currentProgress) * BASE_DURATION; // 1x 기준 남은 시간
    const newAnimationDuration = remainingBaseDuration / rate; // 새로운 배속을 적용한 남은 시간

    let startTime = null;

    function animationStep(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / newAnimationDuration, 1);
      
      // ✅ 현재 위치에서부터 남은 거리를 새로운 진행률에 맞춰 스크롤
      filmContainer.scrollTop = currentScrollTop + (progress * remainingDistance);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animationStep);
      } else {
        filmContainer.scrollTop = totalDistance; // 최종 위치에 고정
      }
    }
    animationFrameId = requestAnimationFrame(animationStep);
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