const heroImage = document.querySelector(".hero__image");
const heroLines = document.querySelectorAll(".hero__line");
const GIF_DURATION = 1200;
const LAST_FRAME_SRC = "./assets/images/cat-hello-last.png";
const TYPE_DELAY = 80;
const LINE_PAUSE = 300;
const TYPE_START_DELAY = 450;

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
  };

  const start = () => {
    window.setTimeout(freeze, GIF_DURATION - 80);
    window.setTimeout(typeHeroText, TYPE_START_DELAY);
  };

  if (heroImage.complete) {
    start();
    return;
  }

  heroImage.addEventListener("load", start, { once: true });
}

freezeHeroGif();

function initHeroTransition() {
  const intro = document.querySelector("#intro");

  if (!intro || typeof gsap === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: intro,
    start: "top top",
    end: "+=100%",
    pin: true,
    pinSpacing: false,
    scrub: true,
    anticipatePin: 1,
  });
}

function initProjectScroll() {
  const section = document.querySelector("#project");
  const track = document.querySelector(".project__track");
  const viewport = document.querySelector(".project__viewport");
  const spacer = document.querySelector(".project__spacer");

  if (!section || !track || !viewport || typeof gsap === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const getScrollDistance = () => {
    const distance = track.scrollWidth - viewport.clientWidth;
    return distance > 0 ? distance : 0;
  };

  const getHoldDistance = () => Math.round(window.innerHeight * 1.25);

  const syncSpacer = () => {
    if (!spacer) {
      return;
    }

    spacer.style.height = `${getScrollDistance() + getHoldDistance()}px`;
  };

  syncSpacer();

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${getScrollDistance() + getHoldDistance() + window.innerHeight}`,
      pin: true,
      scrub: 1,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: syncSpacer,
    },
  });

  timeline.to(track, {
    x: () => -getScrollDistance(),
    ease: "none",
    duration: 1,
  });

  timeline.to({}, {
    duration: () => {
      const distance = getScrollDistance();
      return distance > 0 ? (getHoldDistance() + window.innerHeight) / distance : 1;
    },
  });

  window.addEventListener("load", () => {
    syncSpacer();
    ScrollTrigger.refresh();
  });
}

initHeroTransition();
initAboutIntroReveal();
initProjectIntroReveal();
initProjectScroll();
initIllustrationModal();
initHeaderNav();

function initHeaderNav() {
  const links = Array.from(document.querySelectorAll(".header__link"));
  const intro = document.querySelector("#intro");

  if (!links.length || typeof gsap === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const clearActive = () => {
    links.forEach((link) => link.classList.remove("header__link--active"));
  };

  const setActive = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("header__link--active", isActive);
    });
  };

  clearActive();

  if (intro) {
    ScrollTrigger.create({
      trigger: intro,
      start: "top bottom",
      end: "bottom 40%",
      onEnter: clearActive,
      onEnterBack: clearActive,
      onLeaveBack: clearActive,
    });
  }

  links.forEach((link) => {
    const id = link.getAttribute("href")?.slice(1);
    const section = id ? document.getElementById(id) : null;

    if (!section) {
      return;
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top 40%",
      end: "bottom 40%",
      onEnter: () => setActive(id),
      onEnterBack: () => setActive(id),
    });

    link.addEventListener("click", () => {
      setActive(id);
    });
  });
}

function initIllustrationModal() {
  const modal = document.querySelector("#illustration-modal");
  const triggers = document.querySelectorAll(".illustration__trigger");
  const closeButton = modal?.querySelector(".illustration-modal__close");
  const image = modal?.querySelector(".illustration-modal__image");
  const title = modal?.querySelector(".illustration-modal__name");
  const time = modal?.querySelector(".illustration-modal__time");
  const desc = modal?.querySelector(".illustration-modal__desc");
  const tools = modal?.querySelector(".illustration-modal__tools");

  if (!modal || !closeButton || !image || !title || !time || !desc || !tools) {
    return;
  }

  const toolIcons = {
    clip: {
      src: "./assets/images/icons/clip.png",
      alt: "Clip Studio",
    },
    ps: {
      src: "./assets/images/icons/ps.png",
      alt: "Photoshop",
    },
  };

  const illustrations = {
    1: {
      title: "SUMMER",
      time: "작업시간: 3시간",
      desc: "바다에 간 남자",
      tools: ["clip"],
      image: "./assets/images/illustration01.jpg",
    },
    2: {
      title: "ICECREAM",
      time: "작업시간: 6시간",
      desc: "여름에 아이스크림 먹으며\n하교하는 학생들",
      tools: ["clip", "ps"],
      image: "./assets/images/illustration02.jpg",
    },
    3: {
      title: "PINK CAT",
      time: "작업시간: 4시간",
      desc: "고양이 꼬리 달고 있는\nY2K 스타일 소녀",
      tools: ["clip", "ps"],
      image: "./assets/images/illustration03.jpg",
    },
    4: {
      title: "WINTER",
      time: "작업시간: 4시간",
      desc: "겨울를 즐기는 남자",
      tools: ["clip"],
      image: "./assets/images/illustration04.jpg",
    },
    5: {
      title: "RAIN",
      time: "작업시간: 5시간",
      desc: "우산쓰고 우비입은 소년",
      tools: ["clip", "ps"],
      image: "./assets/images/illustration05.png",
    },
    6: {
      title: "SUNFLOWER",
      time: "작업시간: 6시간",
      desc: "해바라기밭에 있는 남자",
      tools: ["clip", "ps"],
      image: "./assets/images/illustration06.png",
    },
  };

  const openModal = (id) => {
    const data = illustrations[id];

    if (!data) {
      return;
    }

    image.src = data.image;
    image.alt = data.title;
    title.textContent = data.title;
    time.textContent = data.time;
    desc.textContent = data.desc;
    tools.innerHTML = data.tools
      .map((tool) => {
        const icon = toolIcons[tool];
        return `<li class="illustration-modal__tool"><img src="${icon.src}" alt="${icon.alt}" class="illustration-modal__tool-icon"></li>`;
      })
      .join("");

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
    image.removeAttribute("src");
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openModal(trigger.dataset.illustration);
    });
  });

  closeButton.addEventListener("click", closeModal);
}

function initAboutIntroReveal() {
  const introText = document.querySelector(".about__intro");

  if (!introText || typeof gsap === "undefined" || typeof SplitText === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);

  SplitText.create(introText, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    linesClass: "about__intro-line",
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 100,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: introText,
          start: "top 80%",
          once: true,
        },
      });
    },
  });
}

function initProjectIntroReveal() {
  const introText = document.querySelector(".project__intro.text-reveal");

  if (!introText || typeof gsap === "undefined" || typeof SplitText === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);

  SplitText.create(introText, {
    type: "words, lines",
    mask: "lines",
    autoSplit: true,
    linesClass: "project__intro-line",
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 20,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: introText,
          start: "top 80%",
          once: true,
        },
      });
    },
  });
}
