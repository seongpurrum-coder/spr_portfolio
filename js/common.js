$(document).ready(function () {//시작

  /*menu*/
  $(".menu_btn").click(function(){
    $(".menu-wrap").animate({ right: '0' }, 600);
  });
    $(".menu-close").click(function(){
    $(".menu-wrap").animate({ right: '-100%' }, 600);
  });
  /*home 타이핑 효과*/
  const homeTitle = document.querySelector(".home-title");
  const scrollDown = document.querySelector(".scrolldown");

  if (homeTitle) {
    const lines = homeTitle.querySelectorAll(".line");

    let isTyping = false;
    let hasLeftView = true;

    function resetTyping() {
      lines.forEach((line) => {
        line.textContent = "";
        line.classList.remove("typing");
      });

      if (scrollDown) {
        scrollDown.classList.remove("show");
      }
    }

    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function typeLine(line, minSpeed = 90, maxSpeed = 170) {
      return new Promise((resolve) => {
        const text = line.dataset.text;
        let i = 0;

        line.textContent = "";
        line.classList.add("typing");

        function typing() {
          if (i < text.length) {
            line.textContent += text.charAt(i);
            i++;

            const randomSpeed =
              Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;

            setTimeout(typing, randomSpeed);
          } else {
            setTimeout(() => {
              line.classList.remove("typing");
              resolve();
            }, 250);
          }
        }

        setTimeout(typing, 150);
      });
    }

    async function startTyping() {
      if (isTyping) return;
      isTyping = true;

      resetTyping();

      await typeLine(lines[0], 100, 180);
      await wait(350);

      if (lines[1]) {
        await typeLine(lines[1], 110, 190);
      }

      await wait(200);

      if (scrollDown) {
        scrollDown.classList.add("show");
      }

      isTyping = false;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasLeftView && !isTyping) {
            startTyping();
            hasLeftView = false;
          }

          if (!entry.isIntersecting) {
            hasLeftView = true;
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    observer.observe(homeTitle);
  }


  /*프로젝트 필터*/
  const projectList = document.querySelector('.project-list');

function changeProjectPage(callback) {
  if (!projectList) return;

  projectList.classList.add('is-changing');

  setTimeout(() => {
    callback();

    requestAnimationFrame(() => {
      projectList.classList.remove('is-changing');
    });
  }, 280);
}

  const lenis = new Lenis({
    duration: 1.2,
    smooth: true
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const currentPage = document.querySelector('.current-page');
  const totalPage = document.querySelector('.total-page');
  const projectPrevBtn = document.querySelector('.project-prev');
  const projectNextBtn = document.querySelector('.project-next');
  const projectNav = document.querySelector('.project-nav');

  let currentFilter = 'all';
  let allToggleState = 0; // 0 = 6장, 1 = 1장

  function hideAllCards() {
    projectCards.forEach((card) => {
      card.classList.remove('is-show');
    });
  }

  function showCardsByIndex(indexArray) {
    hideAllCards();
    indexArray.forEach((index) => {
      if (projectCards[index]) {
        projectCards[index].classList.add('is-show');
      }
    });
  }

  function setActiveButton(targetFilter) {
    filterButtons.forEach((btn) => {
      btn.classList.remove('is-active');
      if (btn.dataset.filter === targetFilter) {
        btn.classList.add('is-active');
      }
    });
  }

  /*프로젝트 반응형*/
  function renderAllDesktop() {
    if (window.innerWidth <= 1024) {
      // 태블릿/모바일에서는 전부 펼침
      projectCards.forEach((card) => card.classList.add('is-show'));
      if (projectNav) {
        projectNav.classList.add('is-hidden');
      }
      return;
    }

    if (allToggleState === 0) {
      // 처음 1~6번
      showCardsByIndex([0, 1, 2, 3, 4, 5]);
      currentPage.textContent = '1';
      totalPage.textContent = '2';
    } else {
      // 다음 7번만
      showCardsByIndex([6]);
      currentPage.textContent = '2';
      totalPage.textContent = '2';
    }

    if (projectNav) {
      projectNav.classList.remove('is-hidden');
    }
  }

  function renderFilter(filter) {
    currentFilter = filter;
    setActiveButton(filter);

    if (window.innerWidth <= 1024) {

      // 태블릿,모바일에서 필터, 네비 숨기기
      hideAllCards();

      if (filter === 'all') {
        projectCards.forEach((card) => card.classList.add('is-show'));
      } else {
        projectCards.forEach((card) => {
          if (card.dataset.category === filter) {
            card.classList.add('is-show');
          }
        });
      }

      if (projectNav) {
        projectNav.classList.add('is-hidden');
      }
      return;
    }

    // 데스크탑
    if (filter === 'all') {
      renderAllDesktop();
      projectNav.classList.remove('is-hidden');
    } else if (filter === 'uxui') {
      showCardsByIndex([0, 1, 2]);
      projectNav.classList.add('is-hidden');
    } else if (filter === 'bx') {
      showCardsByIndex([3]);
      projectNav.classList.add('is-hidden');
    } else if (filter === 'graphic') {
      showCardsByIndex([4, 5, 6]);
      projectNav.classList.add('is-hidden');
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // ALL 다시 누르면 초기 6장부터 시작
      if (button.dataset.filter === 'all') {
        allToggleState = 0;
      }
      renderFilter(button.dataset.filter);
    });
  });
  if (projectNextBtn) {
    projectNextBtn.addEventListener('click', () => {

      if (currentFilter !== 'all') return;
      if (window.innerWidth <= 1024) return;

      changeProjectPage(() => {
    allToggleState = allToggleState === 0 ? 1 : 0;
    renderAllDesktop();
  });
    });
  }
  if (projectPrevBtn) {
    projectPrevBtn.addEventListener('click', () => {

      if (currentFilter !== 'all') return;
      if (window.innerWidth <= 1024) return;

changeProjectPage(() => {
    allToggleState = allToggleState === 1 ? 0 : 1;
    renderAllDesktop();
  });
    });
  }
  window.addEventListener('resize', () => {
    renderFilter(currentFilter);
  });

  // 초기 실행
  renderFilter('all');

  /*커서*/
  const links = document.querySelectorAll("a, button");

  links.forEach(link => {
    link.addEventListener("mouseenter", () => {
      cursor.classList.add("active");
    });

    link.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
    });
  });
  const cursor = document.querySelector(".cursor");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });


  AOS.init();
});//끝