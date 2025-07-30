window.onload = () => {
  setTimeout(() => {
    launchConfetti();

    typeText("사랑하는 아빠 생일 축하해 🎉", "typing-text", 150, () => {
      setTimeout(() => {
        document.getElementById("intro").classList.add("hidden");
        document.getElementById("video-fullscreen").classList.remove("hidden");

        const video = document.getElementById("birthday-video");
        video.onended = () => {
          document.getElementById("video-close").classList.remove("hidden");
        };
      }, 2000);
    });
  }, 500);
};

// 🎉 폭죽 효과
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const confettiEffect = confetti.create(canvas, { resize: true });

  confettiEffect({
    particleCount: 300,
    spread: 200,
    origin: { y: 0.6 },
  });
}

// ⌨️ 타자 효과
function typeText(text, targetId, speed = 150, callback = null) {
  const target = document.getElementById(targetId);
  let i = 0;
  const interval = setInterval(() => {
    target.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

// 영상 닫고 필름 시작
function closeVideo() {
  document.getElementById("video-fullscreen").classList.add("hidden");
  const filmContainer = document.getElementById("film-container");
  filmContainer.classList.remove("hidden");

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    startScrollingUntilLetterVisible();
  });
}

// 🔽 필름 스크롤 애니메이션 (JS 기반)
function startScrollingUntilLetterVisible() {
  const filmContainer = document.getElementById("film-container");
  const letter = document.getElementById("letter-container");

  let start = null;
  const duration = 200000; // 전체 스크롤 시간 (200초 = 기존과 동일)
  const totalDistance = 60000; // 전체 스크롤 거리 (px)

  function step(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    const progress = Math.min(elapsed / duration, 1);
    const currentY = progress * totalDistance;

    filmContainer.style.transform = `translateY(-${currentY}px)`;

    // 편지가 화면 중앙에 오면 멈춤
    const rect = letter.getBoundingClientRect();
    const inCenter = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;

    if (!inCenter && progress < 1) {
      requestAnimationFrame(step);
    } else {
      // 정중앙에 도달 시 고정
      console.log("✅ 편지가 중앙에 도달, 스크롤 정지");
    }
  }

  requestAnimationFrame(step);

  // 편지는 5초 후 보여지도록
  setTimeout(() => {
    letter.classList.add("show");
    letter.style.display = "block";
  }, 5000); // 5초 후
}
