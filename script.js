const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const projectFilterStatus = document.getElementById('projectFilterStatus');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
      const filter = button.dataset.filter;
      const count = [...projectCards].filter(card => filter === 'todos' || card.dataset.category.split(' ').includes(filter)).length;
      const badge = document.createElement('span');
      badge.className = 'filter-count';
      badge.textContent = count;
      badge.setAttribute('aria-hidden', 'true');
      button.appendChild(badge);
    });

    projectCards.forEach(card => {
      const name = card.querySelector('h3').textContent;
      const links = card.querySelectorAll('.project-actions a');
      links[0].setAttribute('aria-label', `Ver projeto ${name} (abre em nova aba)`);
      links[1].textContent = 'Código no GitHub ↗';
      links[1].setAttribute('aria-label', `Código de ${name} no GitHub (abre em nova aba)`);
    });

    const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
    updateNavbar();

    const closeMenu = () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menu');
      menuBtn.textContent = '☰';
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });

    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menuBtn.textContent = open ? '×' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
        menuBtn.focus();
      }
    });

    const searchInput = document.getElementById('projectSearch');
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    let activeFilter = 'todos';
    const updateProjects = () => {
      const query = normalize(searchInput.value.trim());
      let visible = 0;
      projectCards.forEach(card => {
        const matches = (activeFilter === 'todos' || card.dataset.category.split(' ').includes(activeFilter)) && normalize(card.textContent).includes(query);
        card.hidden = !matches;
        if (matches) visible++;
      });
      projectFilterStatus.textContent = `Mostrando ${visible} de ${projectCards.length} projetos.`;
      document.getElementById('emptyState').hidden = visible !== 0;
    };
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach(btn => {
          const active = btn === button;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-pressed', String(active));
        });
        updateProjects();
      });
    });
    searchInput.addEventListener('input', updateProjects);
    document.querySelectorAll('[data-project-total]').forEach(el => el.textContent = projectCards.length);
    projectCards.forEach((card, index) => {
      card.querySelector('.project-number').textContent = `${String(index + 1).padStart(2, '0')} / ${projectCards.length}`;
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
    updateProjects();

    document.getElementById('year').textContent = new Date().getFullYear();
