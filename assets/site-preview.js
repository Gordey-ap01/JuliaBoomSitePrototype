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
      items: ['день рождения', 'выпускной', 'день именинника', 'тематическая вечеринка'],
      modules: [
        ['program-catalog', 'Каталог программ'],
        ['artist-catalog', 'Каталог артистов'],
        ['costume-catalog', 'Каталог костюмов'],
      ],
      image: 'assets/images/feature-catalogs-programs.webp',
      alt: 'Три сказочные сцены праздничных программ для детей',
      sticker: 'Вау с первой минуты',
    },
    adults: {
      tab: 'tab-adults',
      kicker: 'Для взрослых',
      title: 'Ваши люди. Ваш повод. Никакой неловкости',
      text: 'Юбилей, день рождения или встреча, где важны не формальные конкурсы, а общая атмосфера. Юлия помогает связать ведущего, оформление и развлечения в одну историю.',
      items: ['тематическая вечеринка', 'welcome zone', 'ведущая и диджей', 'оригинальные номера'],
      modules: [
        ['partner-services', 'Фотограф, видео, торт'],
        ['artist-catalog', 'Артисты welcome zone'],
        ['decor-catalog', 'Оформление и декор'],
      ],
      image: 'assets/images/event-partners.webp',
      alt: 'Организатор, фотограф, видеограф и кондитер готовят взрослое событие',
      sticker: 'Гости включаются сами',
    },
    wedding: {
      tab: 'tab-wedding',
      kicker: 'Для двоих и семьи',
      title: 'Свадьба, где вы не работаете организатором',
      text: 'От идеи и референсов до выездной регистрации и деталей дня. В отзыве клиент отдельно отмечает, что мог не переживать: Юлия собрала свадьбу с нуля.',
      items: ['организация и координация', 'выездная регистрация', 'выкуп', 'ведущая и диджей', 'номера артистов'],
      modules: [
        ['decor-catalog', 'Оформление и декор'],
        ['partner-services', 'Фото, видео, торт'],
        ['artist-catalog', 'Артисты оригинального жанра'],
      ],
      image: 'assets/images/feature-trust.webp',
      alt: 'Праздничный коллаж с фотографиями, светом и свадебной атмосферой',
      sticker: 'Вы проживаете свой день',
    },
    anniversary: {
      tab: 'tab-anniversary',
      kicker: 'Для важной круглой даты',
      title: 'Юбилей, который похож на человека, а не на шаблон',
      text: 'Берём характер героя вечера, знакомые истории и состав гостей. Юлия связывает ведущую, съёмку, поздравления и оформление в один тёплый сценарий.',
      items: ['ведущая', 'фотограф', 'экспресс-поздравление', 'оформление и декор'],
      modules: [
        ['partner-services', 'Фотограф, видео, торт'],
        ['express-greeting', 'Экспресс-поздравления'],
        ['decor-catalog', 'Оформление и декор'],
      ],
      image: 'assets/images/event-anniversary.webp',
      alt: 'Яркий юбилей с гостями, праздничным столом, декором и фотографом',
      sticker: 'Истории становятся сценарием',
    },
    'new-year': {
      tab: 'tab-new-year',
      kicker: 'Для семьи, школы или компании',
      title: 'Новый год входит не по календарю, а со светом и героями',
      text: 'Соберём камерное поздравление, детскую программу или большой корпоратив: с оригинальными зимними образами, ведущей, музыкой, декором и таймингом.',
      items: ['детская программа', 'корпоратив', 'ведущая и диджей', 'новогодний декор'],
      modules: [
        ['program-catalog', 'Новогодние программы'],
        ['costume-catalog', 'Зимние образы'],
        ['live-calendar', 'Свободные даты'],
      ],
      image: 'assets/images/event-new-year.webp',
      alt: 'Современный новогодний праздник с детьми, взрослыми, светом и зимними артистами',
      sticker: 'Сезон бронируют заранее',
    },
  };

  const panel = document.querySelector('#party-panel');
  const partyImage = document.querySelector('[data-party-image]');
  const partyKicker = document.querySelector('[data-party-kicker]');
  const partyTitle = document.querySelector('[data-party-title]');
  const partyText = document.querySelector('[data-party-text]');
  const partyList = document.querySelector('[data-party-list]');
  const partySticker = document.querySelector('[data-party-sticker]');
  const partyModules = document.querySelector('[data-party-modules]');

  const updateParty = (key) => {
    const content = partyContent[key];
    if (!content || !panel || !partyImage) return;

    document.querySelectorAll('[data-party]').forEach((button) => {
      const selected = button.dataset.party === key;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
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
      partyModules?.replaceChildren(...content.modules.map(([moduleKey, label]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.modulePreview = moduleKey;
        button.textContent = label;
        return button;
      }));
      partySticker.textContent = content.sticker;
      partyImage.classList.remove('is-switching');
    }, reducedMotion.matches ? 0 : 180);
  };

  document.querySelectorAll('[data-party]').forEach((button) => {
    button.tabIndex = button.dataset.party === 'kids' ? 0 : -1;
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

  const moduleDefinitions = {
    'artist-catalog': {
      title: 'Каталог артистов',
      lead: 'Посетитель сможет выбрать не обезличенную услугу, а конкретного человека по жанру, опыту и формату праздника.',
      time: '3–5 недель',
      complexity: 'Высокая',
      client: ['список собственных и приглашённых артистов', 'по 8–12 сильных фото и короткое видео', 'жанры, опыт, города и ограничения', 'решение: показывать цену или запрашивать её'],
      build: ['спроектировать базу артистов и категории', 'создать карточку и страницу профиля', 'добавить фильтры, поиск и понятные пустые состояния', 'сделать управление профилями и проверить мобильную версию'],
      underhood: 'Нужны структура базы данных, связи с программами и датами, единый шаблон профиля, оптимизация медиа и права доступа для редактора.',
    },
    'costume-catalog': {
      title: 'Каталог костюмов',
      lead: 'Клиент увидит реальные образы, а Юлия — где находится костюм, кому подходит и свободен ли он на нужную дату.',
      time: '3–4 недели',
      complexity: 'Высокая',
      client: ['фото каждого костюма спереди, сзади и в работе', 'размеры, состав комплекта и состояние', 'правила чистки, переодевания и выдачи', 'список персонажей без спорных чужих брендов'],
      build: ['создать карточки и фильтры по размеру и событию', 'связать костюм с артистами и программами', 'добавить статусы: свободен, на чистке, в ремонте', 'подготовить редактор и контроль обязательных полей'],
      underhood: 'Это учётный ресурс: одной фотогалереи мало. Нужны база, статусы, связи с заказами и защита от одновременного бронирования.',
    },
    'program-catalog': {
      title: 'Каталог программ',
      lead: 'Вместо длинного прайса — понятный выбор по возрасту, поводу, длительности, числу гостей и бюджету.',
      time: '4–6 недель',
      complexity: 'Высокая',
      client: ['полный перечень программ и форматов', 'фото, видео и краткий сценарий каждой', 'возраст, длительность, состав и цена', 'технические требования к площадке'],
      build: ['спроектировать каталог, фильтры и поиск', 'создать полную карточку программы', 'связать программы с артистами, костюмами и реквизитом', 'подключить редактор, SEO-поля и заявку из карточки'],
      underhood: 'Каждая программа состоит из связанных ресурсов. Архитектура должна понимать не только текст и фото, но и состав, занятость, сезонность и условия площадки.',
    },
    'decor-catalog': {
      title: 'Оформление, декор и реквизит',
      lead: 'Посетитель увидит не абстрактное «оформим красиво», а реальные наборы, масштабы и примеры в пространстве.',
      time: '2–4 недели',
      complexity: 'Средняя',
      client: ['фото готовых оформлений без сильных фильтров', 'размеры и состав каждого комплекта', 'что своё, что арендуется у партнёров', 'срок монтажа, демонтажа и доставки'],
      build: ['собрать понятные категории и карточки', 'добавить галерею реальных мероприятий', 'связать комплекты с поводами и заявкой', 'предусмотреть статусы доступности и сезонность'],
      underhood: 'Декор занимает время и место. В базе понадобятся комплектация, габариты, логистика и связи с датой — иначе сайт будет обещать то, чего физически нет.',
    },
    'partner-services': {
      title: 'Фотограф, видеограф и кондитер',
      lead: 'Проверенных партнёров можно предложить одним аккуратным блоком, не превращая сайт в маркетплейс подрядчиков.',
      time: '2–3 недели',
      complexity: 'Средняя',
      client: ['список постоянных партнёров и согласие на публикацию', 'портфолио и короткое описание каждого', 'варианты пакетов и порядок расчёта', 'кто отвечает клиенту и принимает оплату'],
      build: ['создать единый шаблон партнёрской услуги', 'связать дополнения с поводами и программами', 'добавить выбор в заявку без лишних полей', 'настроить обновление портфолио и доступности'],
      underhood: 'Главное — заранее определить ответственность и поток заявки. Сайт должен передать партнёру ровно нужные данные и не создавать двойное обещание клиенту.',
    },
    'express-greeting': {
      title: 'Экспресс-поздравления',
      lead: 'Быстрый продукт для тех, кому нужен яркий визит без полного сценария праздника: формат легко понять и заказать.',
      time: '1–2 недели',
      complexity: 'Средняя',
      client: ['варианты поздравлений и длительность', 'доступные герои и артисты', 'география выезда и доплата за дорогу', 'фото и точный состав каждого варианта'],
      build: ['создать отдельную посадочную и тарифы', 'добавить быстрый выбор даты и адреса', 'проверять связь с артистом и костюмом', 'собрать короткую заявку для менеджера'],
      underhood: 'Даже короткое поздравление резервирует артиста, костюм и дорогу. Для честного обещания нужны связанные остатки времени и ресурсов.',
    },
    'live-calendar': {
      title: 'Живой календарь занятости',
      lead: 'Посетитель видит только свободно или занято, а Юлия внутри — артистов, костюмы, дорогу, монтаж и оплату.',
      time: '5–8 недель',
      complexity: 'Очень высокая',
      client: ['правила брони и предварительного резерва', 'список ресурсов и ответственных менеджеров', 'буферы на дорогу, монтаж и переодевание', 'решение, с каким календарём или CRM связываемся'],
      build: ['разделить публичное и закрытое представление', 'создать события, статусы и права доступа', 'настроить поиск конфликтов ресурсов и времени', 'подключить уведомления и журнал изменений'],
      underhood: 'Это уже рабочая система, а не календарная картинка. Ей нужны сервер, авторизация, база событий, проверки конфликтов и резервные сценарии при сбое интеграций.',
    },
    'bonus-wheel': {
      title: 'Колесо праздничных бонусов',
      lead: 'Яркий первый контакт может подтолкнуть к заявке, если подарок настоящий, правила прозрачны, а механика не раздражает.',
      time: '1–2 недели',
      complexity: 'Средняя',
      client: ['список реальных бонусов и их себестоимость', 'срок действия и ограничения', 'как часто человек может крутить колесо', 'нужен ли промокод или подтверждение менеджером'],
      build: ['настроить вероятности и правила выпадения', 'запоминать получение и ограничивать повторные попытки', 'создавать уникальный промокод или запись в заявке', 'добавить аналитику, мобильную проверку и защиту от накрутки'],
      underhood: 'У демо результат живёт только на экране. Настоящая версия требует серверной проверки, хранения выдач и связи промокода с заявкой, иначе бонус легко получить бесконечно.',
    },
  };

  const moduleDialog = document.querySelector('[data-module-dialog]');
  const moduleTitle = document.querySelector('[data-module-title]');
  const moduleLead = document.querySelector('[data-module-lead]');
  const moduleTime = document.querySelector('[data-module-time]');
  const moduleComplexity = document.querySelector('[data-module-complexity]');
  const moduleClient = document.querySelector('[data-module-client]');
  const moduleBuild = document.querySelector('[data-module-build]');
  const moduleUnderhood = document.querySelector('[data-module-underhood]');

  const makeListItems = (items) => items.map((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    return listItem;
  });

  const closeModuleDialog = () => {
    if (moduleDialog?.open) moduleDialog.close();
  };

  const openModuleDialog = (key) => {
    const definition = moduleDefinitions[key];
    if (!definition || typeof moduleDialog?.showModal !== 'function') return;
    const bonusDialog = document.querySelector('[data-bonus-dialog]');
    if (bonusDialog?.open) bonusDialog.close();
    moduleTitle.textContent = definition.title;
    moduleLead.textContent = definition.lead;
    moduleTime.textContent = definition.time;
    moduleComplexity.textContent = definition.complexity;
    moduleClient.replaceChildren(...makeListItems(definition.client));
    moduleBuild.replaceChildren(...makeListItems(definition.build));
    moduleUnderhood.textContent = definition.underhood;
    if (!moduleDialog.open) moduleDialog.showModal();
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-module-preview]');
    if (trigger) openModuleDialog(trigger.dataset.modulePreview);
  });
  document.querySelector('[data-module-close]')?.addEventListener('click', closeModuleDialog);
  document.querySelector('[data-module-done]')?.addEventListener('click', closeModuleDialog);
  moduleDialog?.addEventListener('click', (event) => {
    if (event.target === moduleDialog) closeModuleDialog();
  });

  const bonusDialog = document.querySelector('[data-bonus-dialog]');
  const bonusWheel = document.querySelector('[data-bonus-wheel]');
  const bonusResult = document.querySelector('[data-bonus-result]');
  const bonusSpin = document.querySelector('[data-bonus-spin]');
  const bonusExamples = ['+15 минут к программе', 'Мини-фотозона', 'Сюрприз имениннику', 'Праздничный реквизит', 'Фото для приглашения', 'Комплимент от кондитера'];
  let wheelRotation = 0;

  const closeBonusDialog = () => {
    if (bonusDialog?.open) bonusDialog.close();
  };

  document.querySelector('[data-bonus-open]')?.addEventListener('click', () => {
    if (typeof bonusDialog?.showModal === 'function' && !bonusDialog.open) bonusDialog.showModal();
  });
  document.querySelector('[data-bonus-close]')?.addEventListener('click', closeBonusDialog);
  bonusDialog?.addEventListener('click', (event) => {
    if (event.target === bonusDialog) closeBonusDialog();
  });

  bonusSpin?.addEventListener('click', () => {
    const index = Math.floor(Math.random() * bonusExamples.length);
    wheelRotation += 1440 + (360 - index * 55);
    bonusSpin.disabled = true;
    bonusResult.textContent = 'Колесо летит…';
    bonusWheel.style.transform = `rotate(${wheelRotation}deg)`;
    window.setTimeout(() => {
      bonusResult.textContent = `Пример бонуса: «${bonusExamples[index]}». Юлия утвердит реальные подарки отдельно.`;
      bonusSpin.disabled = false;
      fireConfetti(window.innerWidth / 2, window.innerHeight / 2);
    }, reducedMotion.matches ? 0 : 2900);
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
