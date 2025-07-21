const photos = [
  { src: "1.png", text: "추억사진1" },
  { src: "2.png", text: "추억사진2" },
  { src: "3.png", text: "추억사진3" },
];

window.onload = () => {
  setTimeout(() => {
    launchConfetti();

    typeText("사랑하는 아빠 생일 축하해 🎉", "typing-text", 150, () => {
      // 타자효과 끝난 뒤 2초 대기 후 전환
      setTimeout(() => {
        document.getElementById("intro").classList.add("hidden");
        document.getElementById("video-fullscreen").classList.remove("hidden");

        const video = document.getElementById("birthday-video");
        video.onended = () => {
          //document.getElementById("video-close").classList.remove("hidden");
          closeVideo();
        };
      }, 2000);
    });
  }, 500); // 페이지 로드 후 1초 기다림
};



// 폭죽 효과
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

// 타자 효과
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


// 영상 종료 후 닫기 버튼 → 본 콘텐츠로 전환
function closeVideo() {
  document.getElementById("video-fullscreen").classList.add("hidden");
  document.getElementById("content-area").classList.remove("hidden");
}

// 사진 확대
function openViewer(index) {
  document.getElementById("viewer").classList.remove("hidden");
  document.getElementById("viewer-img").src = photos[index].src;
  document.getElementById("viewer-text").innerText = photos[index].text;
}

function closeViewer() {
  document.getElementById("viewer").classList.add("hidden");
}

// 편지 보기/닫기
function showLetter() {
  document.getElementById("letter-popup").classList.remove("hidden");
}

function hideLetter() {
  document.getElementById("letter-popup").classList.add("hidden");
}
