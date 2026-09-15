const heroImage = document.querySelector(".hero__image");
const heroLines = document.querySelectorAll(".hero__line");
const GIF_DURATION = 1200;
const LAST_FRAME_SRC = "./assets/images/cat-hello-last.png";
const TYPE_DELAY = 80;
const LINE_PAUSE = 300;

function typeLine(element, text) {
  return new Promise((resolve) => {
    let index = 0;
    element.classList.add("hero__line--typing");

    const tick = () => {
      element.textContent = text.slice(0, index);

      if (index >= text.length) {
        element.classList.remove("hero__line--typing");
        resolve();
        return;
      }

      index += 1;
      window.setTimeout(tick, TYPE_DELAY);
    };

    tick();
  });
}

async function typeHeroText() {
  for (const line of heroLines) {
    const text = line.dataset.text || "";
    await typeLine(line, text);
    await new Promise((resolve) => {
      window.setTimeout(resolve, LINE_PAUSE);
    });
  }
}

function freezeHeroGif() {
  if (!heroImage) {
    return;
  }

  const lastFrame = new Image();
  lastFrame.src = LAST_FRAME_SRC;

  const freeze = () => {
    heroImage.src = LAST_FRAME_SRC;
    typeHeroText();
  };

  const start = () => {
    window.setTimeout(freeze, GIF_DURATION - 80);
  };

  if (heroImage.complete) {
    start();
    return;
  }

  heroImage.addEventListener("load", start, { once: true });
}

freezeHeroGif();
