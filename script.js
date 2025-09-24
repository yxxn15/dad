// --- 전역 변수 ---
let animationFrameId = null;
let isPaused = false; // 일시정지 상태를 기억하는 변수
let currentRate = 1.0; // 현재 배속을 기억하는 변수

// --- 페이지 로드 및 초기화 ---
window.onload = function() {
  // (이 부분은 이전과 동일)
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

// --- 이벤트 및 컨트롤 함수 ---

// 영상 닫기
function closeVideo() {
  document.getElementById('video-fullscreen').classList.add('hidden');
  document.getElementById('speed-controls').classList.remove('hidden');
  const filmContainer = document.getElementById('film-container');
  filmContainer.classList.remove('hidden');
  
  // ✅ 필름 컨테이너에 클릭 이벤트 추가!
  filmContainer.addEventListener('click', togglePause);

  const music = document.getElementById('background-music');
  music.currentTime = 66;
  music.play().catch(e => console.log("음악 재생 오류:", e));

  setSpeed(1.0);
}

// ✅ 일시정지 / 재시작 토글 함수
function togglePause() {
  isPaused = !isPaused; // 상태 뒤집기 (false -> true, true -> false)
  const pauseIndicator = document.getElementById('pause-indicator');

  if (isPaused) {
    // 일시정지 상태일 때
    cancelAnimationFrame(animationFrameId); // 애니메이션 중단
    pauseIndicator.classList.remove('hidden'); // 일시정지 아이콘 보이기
  } else {
    // 다시 시작할 때
    pauseIndicator.classList.add('hidden'); // 일시정지 아이콘 숨기기
    playAnimation(currentRate); // 현재 배속과 위치에서 애니메이션 재시작
  }
}

// 배속 설정 (내부적으로 playAnimation 호출)
function setSpeed(rate) {
  isPaused = false; // 배속 바꾸면 일시정지 해제
  document.getElementById('pause-indicator').classList.add('hidden');
  currentRate = rate; // 현재 배속 업데이트
  playAnimation(rate);
}

// ✅ 핵심 애니메이션 실행 함수 (수정됨)
function playAnimation(rate) {
  if (animationFrameId) { cancelAnimationFrame(animationFrameId); }

  const buttons = document.querySelectorAll('#speed-controls button');
  buttons.forEach(button => button.classList.remove('active'));
  const activeButton = [...buttons].find(btn => btn.textContent.includes(rate));
  if (activeButton) { activeButton.classList.add('active'); }

  const filmContainer = document.getElementById("film-container");
  const letter = document.getElementById("letter-container");
  
  // ✅ 재시작 시, 현재 위치에서부터 시작하도록 수정
  const startScrollTop = filmContainer.scrollTop; 

  setTimeout(() => {
    const totalDistance = letter.offsetTop - (window.innerHeight / 2) + (letter.offsetHeight / 2);
    const remainingDistance = totalDistance - startScrollTop;
    if (remainingDistance <= 0) return;

    const BASE_DURATION = 85000;
    const currentProgress = startScrollTop / totalDistance;
    const remainingBaseDuration = (1 - currentProgress) * BASE_DURATION;
    const newAnimationDuration = remainingBaseDuration / rate;
    let startTime = null;

    function animationStep(currentTime) {
      if (isPaused) return; // 일시정지 상태면 더 이상 진행 안 함
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
  }, 100);
}

// --- 유틸리티 함수 (기존과 동일) ---
function launchConfetti() { /* ... */ }
function typeText(text, targetId, speed, callback) { /* ... */ }
function launchConfetti(){const canvas=document.getElementById("confettiCanvas");confetti.create(canvas,{resize:!0})({particleCount:200,spread:160})}function typeText(e,t,n,o){const i=document.getElementById(t);let a=0;const l=setInterval(()=>{a<e.length?i.textContent+=e[a++]:(clearInterval(l),o&&o())},n)}