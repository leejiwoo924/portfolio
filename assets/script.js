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

let resizeRefreshTimer = 0;
let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function refreshScroll() {
  ScrollTrigger.refresh();
}

function scrollToSection(section) {
  const header = document.querySelector(".header");
  const offset = header ? header.offsetHeight + 16 : 80;
  const top = section.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

function initScrollTrigger() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return false;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (typeof SplitText !== "undefined") {
    gsap.registerPlugin(SplitText);
  }

  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
  });

  return true;
}

function initProjectScroll() {
  const section = document.querySelector("#project");
  const track = document.querySelector(".project__track");
  const viewport = document.querySelector(".project__viewport");

  if (!section || !track || !viewport) {
    return;
  }

  let scrollDistance = 0;

  const measure = () => {
    scrollDistance = Math.max(track.scrollWidth - viewport.clientWidth, 0);
  };

  measure();

  gsap.to(track, {
    x: () => -scrollDistance,
    ease: "none",
    force3D: true,
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(scrollDistance, 1)}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: measure,
    },
  });
}

function initContactReveal() {
  const section = document.querySelector(".contact");
  const message = section?.querySelector(".contact__message");
  const image = section?.querySelector(".contact__image");
  const email = section?.querySelector(".contact__email");

  if (!section) {
    return;
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      once: true,
    },
  });

  if (message) {
    timeline.from(
      message,
      {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      },
      0
    );
  }

  if (image) {
    timeline.fromTo(
      image,
      {
        scale: 0.45,
        opacity: 0.35,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "power2.out",
        force3D: true,
      },
      0.1
    );
  }

  if (email) {
    timeline.from(
      email,
      {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      },
      0.35
    );
  }
}

function initHeaderNav() {
  const links = Array.from(document.querySelectorAll(".header__link"));
  const intro = document.querySelector("#intro");

  if (!links.length) {
    return;
  }

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

    link.addEventListener("click", (event) => {
      event.preventDefault();
      setActive(id);
      scrollToSection(section);
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
  const section = document.querySelector("#profile");
  const title = section?.querySelector(".about__title");
  const media = section?.querySelector(".about__media");
  const introText = section?.querySelector(".about__intro");
  const link = section?.querySelector(".about__link");
  const heading = section?.querySelector(".about__heading");
  const skills = section?.querySelectorAll(".about__skill");

  if (!section) {
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      once: true,
    },
  });

  if (media) {
    tl.from(
      media,
      {
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
      },
      0
    );
  }

  const revealItems = [title, link, heading].filter(Boolean);

  if (revealItems.length) {
    tl.from(
      revealItems,
      {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      },
      0.05
    );
  }

  if (skills?.length) {
    tl.from(
      skills,
      {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
      },
      0.2
    );
  }

  if (!introText || typeof SplitText === "undefined") {
    return;
  }

  SplitText.create(introText, {
    type: "lines",
    mask: "lines",
    autoSplit: false,
    linesClass: "about__intro-line",
    onSplit(self) {
      tl.from(
        self.lines,
        {
          yPercent: 100,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        },
        0.1
      );
    },
  });
}

function initProjectIntroReveal() {
  const revealTargets = document.querySelectorAll(".project__title.text-reveal, .project__intro.text-reveal");

  if (!revealTargets.length || typeof SplitText === "undefined") {
    return;
  }

  revealTargets.forEach((element) => {
    const linesClass = element.classList.contains("project__title")
      ? "project__title-line"
      : "project__intro-line";

    SplitText.create(element, {
      type: "lines",
      mask: "lines",
      autoSplit: false,
      linesClass,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 20,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            once: true,
          },
        });
      },
    });
  });
}

function bootAnimations() {
  if (!initScrollTrigger()) {
    return;
  }

  initIllustrationModal();
  initHeaderNav();
  initAboutIntroReveal();
  initProjectIntroReveal();
  initProjectScroll();
  initContactReveal();

  const finish = () => {
    refreshScroll();
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(finish);
  }

  window.addEventListener("load", finish, { once: true });

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeRefreshTimer);
    resizeRefreshTimer = window.setTimeout(refreshScroll, 200);
  });
}

bootAnimations();
