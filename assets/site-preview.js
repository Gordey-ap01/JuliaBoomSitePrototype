(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')];
  const themeNote = document.querySelector('[data-theme-note]');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  const themes = {
    boom: {
      note: 'Плакатный ритм, бумажные слои и максимум цвета.',
      color: '#ffd800',
    },
    aurora: {
      note: 'Воздушная типографика, переливы света и мягкие градиенты.',
      color: '#e9e0ff',
    },
    midnight: {
      note: 'Тёмный вечерний фон, золото, неон и свет софитов.',
      color: '#070e1d',
    },
  };

  const readSavedTheme = () => {
    try {
      return localStorage.getItem('julia-boomm-preview-theme');
    } catch (_error) {
      return null;
    }
  };

  const applyTheme = (themeName, save = true) => {
    const nextTheme = themes[themeName] ? themeName : 'boom';
    document.body.dataset.theme = nextTheme;
    themeButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === nextTheme));
    });
    if (themeNote) themeNote.textContent = themes[nextTheme].note;
    if (themeColor) themeColor.content = themes[nextTheme].color;
    if (!save) return;
    try {
      localStorage.setItem('julia-boomm-preview-theme', nextTheme);
    } catch (_error) {
      // Тема всё равно меняется; сохранение — необязательное улучшение.
    }
  };

  applyTheme(readSavedTheme() || document.body.dataset.theme, false);
  themeButtons.forEach((button) => {
    button.addEventListener('click', () => applyTheme(button.dataset.themeChoice));
  });

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const willOpen = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('menu-open', willOpen);
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });

  const partyContent = {
    kids: {
      tab: 'tab-kids',
      kicker: 'Для детей и подростков',
      title: 'Герой приходит — комната меняется',
      text: 'Подберём образ и программу под возраст, пространство и темперамент компании. В отзывах особенно вспоминают энергичную программу с Соником и появление Бамблби.',
      items: ['аниматор и персонаж', 'игровой сценарий', 'фото живых эмоций'],
      image: 'assets/images/feature-catalogs-programs.webp',
      alt: 'Три сказочные сцены праздничных программ для детей',
      sticker: 'Вау с первой минуты',
    },
    adults: {
      tab: 'tab-adults',
      kicker: 'Для взрослых',
      title: 'Ваши люди. Ваш повод. Никакой неловкости',
      text: 'Юбилей, день рождения или встреча, где важны не формальные конкурсы, а общая атмосфера. Юлия помогает связать ведущего, оформление и развлечения в одну историю.',
      items: ['ведущий', 'фотозона', 'артисты на встречу'],
      image: 'assets/images/feature-trust-people.webp',
      alt: 'Иллюстративная сцена команды артистов и организаторов взрослого события',
      sticker: 'Гости включаются сами',
    },
    wedding: {
      tab: 'tab-wedding',
      kicker: 'Для двоих и семьи',
      title: 'Свадьба, где вы не работаете организатором',
      text: 'От идеи и референсов до выездной регистрации и деталей дня. В отзыве клиент отдельно отмечает, что мог не переживать: Юлия собрала свадьбу с нуля.',
      items: ['организация с нуля', 'выездная регистрация', 'единый сценарий дня'],
      image: 'assets/images/feature-trust.webp',
      alt: 'Праздничный коллаж с фотографиями, светом и свадебной атмосферой',
      sticker: 'Вы проживаете свой день',
    },
  };

  const panel = document.querySelector('#party-panel');
  const partyImage = document.querySelector('[data-party-image]');
  const partyKicker = document.querySelector('[data-party-kicker]');
  const partyTitle = document.querySelector('[data-party-title]');
  const partyText = document.querySelector('[data-party-text]');
  const partyList = document.querySelector('[data-party-list]');
  const partySticker = document.querySelector('[data-party-sticker]');

  const updateParty = (key) => {
    const content = partyContent[key];
    if (!content || !panel || !partyImage) return;

    document.querySelectorAll('[data-party]').forEach((button) => {
      button.setAttribute('aria-selected', String(button.dataset.party === key));
    });
    panel.setAttribute('aria-labelledby', content.tab);
    partyImage.classList.add('is-switching');

    window.setTimeout(() => {
      partyImage.src = content.image;
      partyImage.alt = content.alt;
      partyKicker.textContent = content.kicker;
      partyTitle.textContent = content.title;
      partyText.textContent = content.text;
      partyList.replaceChildren(...content.items.map((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        return li;
      }));
      partySticker.textContent = content.sticker;
      partyImage.classList.remove('is-switching');
    }, reducedMotion.matches ? 0 : 180);
  };

  document.querySelectorAll('[data-party]').forEach((button) => {
    button.addEventListener('click', () => updateParty(button.dataset.party));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...document.querySelectorAll('[data-party]')];
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const current = buttons.indexOf(button);
      const next = buttons[(current + direction + buttons.length) % buttons.length];
      next.focus();
      updateParty(next.dataset.party);
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const fireConfetti = (originX = window.innerWidth / 2, originY = window.innerHeight / 2) => {
    if (reducedMotion.matches) return;
    const styles = getComputedStyle(document.body);
    const colors = ['--yellow', '--pink', '--red', '--blue', '--cyan', '--white'].map((token) => styles.getPropertyValue(token).trim());
    for (let index = 0; index < 34; index += 1) {
      const piece = document.createElement('i');
      piece.className = 'fly-confetti';
      const angle = (Math.PI * 2 * index) / 34 + Math.random() * 0.3;
      const distance = 110 + Math.random() * 330;
      piece.style.setProperty('--start-x', `${originX}px`);
      piece.style.setProperty('--start-y', `${originY}px`);
      piece.style.setProperty('--fly-x', `${Math.cos(angle) * distance}px`);
      piece.style.setProperty('--fly-y', `${Math.sin(angle) * distance - 170}px`);
      piece.style.setProperty('--size', `${6 + Math.random() * 9}px`);
      piece.style.setProperty('--confetti-color', colors[index % colors.length]);
      piece.style.animationDelay = `${Math.random() * 90}ms`;
      document.body.append(piece);
      window.setTimeout(() => piece.remove(), 1800);
    }
  };

  document.querySelector('[data-confetti]')?.addEventListener('click', (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
    window.addEventListener('pointermove', (event) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });

    document.querySelectorAll('.tilt').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `perspective(1000px) rotateX(${-y * 3.5}deg) rotateY(${x * 3.5}deg)`;
      });
      element.addEventListener('pointerleave', () => {
        element.style.transform = '';
      });
    });
  }

  const form = document.querySelector('[data-request-form]');
  const dialog = document.querySelector('[data-success-dialog]');
  const successText = document.querySelector('[data-success-text]');
  const dateInput = document.querySelector('#request-date');
  if (dateInput) {
    const today = new Date();
    const localYear = today.getFullYear();
    const localMonth = String(today.getMonth() + 1).padStart(2, '0');
    const localDay = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${localYear}-${localMonth}-${localDay}`;
  }

  const closeDialog = () => {
    if (dialog?.open) dialog.close();
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const date = new Date(`${data.get('date')}T12:00:00`);
    const readableDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    successText.textContent = `${data.get('name')}, Юлия увидит: «${data.get('event')}, ${readableDate}». И ответит по контакту: ${data.get('contact')}.`;
    if (typeof dialog?.showModal === 'function') {
      dialog.showModal();
      fireConfetti(window.innerWidth / 2, window.innerHeight / 2);
    }
  });

  document.querySelector('[data-dialog-close]')?.addEventListener('click', closeDialog);
  document.querySelector('[data-dialog-done]')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  const prototypeDialog = document.querySelector('[data-prototype-dialog]');
  const openPrototypeDialog = () => {
    if (typeof prototypeDialog?.showModal === 'function' && !prototypeDialog.open) {
      prototypeDialog.showModal();
    }
  };
  const closePrototypeDialog = () => {
    if (prototypeDialog?.open) prototypeDialog.close();
  };

  document.querySelectorAll('[data-prototype-open]').forEach((button) => button.addEventListener('click', openPrototypeDialog));
  document.querySelector('[data-prototype-close]')?.addEventListener('click', closePrototypeDialog);
  document.querySelector('[data-prototype-continue]')?.addEventListener('click', closePrototypeDialog);
  prototypeDialog?.addEventListener('click', (event) => {
    if (event.target === prototypeDialog) closePrototypeDialog();
  });

  try {
    if (!sessionStorage.getItem('julia-boomm-prototype-intro-seen')) {
      window.setTimeout(() => {
        openPrototypeDialog();
        sessionStorage.setItem('julia-boomm-prototype-intro-seen', 'true');
      }, reducedMotion.matches ? 0 : 650);
    }
  } catch (_error) {
    // В приватном режиме постоянная верхняя лента остаётся доступной.
  }

  window.addEventListener('scroll', () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 30);
  }, { passive: true });
})();
