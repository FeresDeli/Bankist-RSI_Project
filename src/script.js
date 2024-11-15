'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const operationsCont = document.querySelector('.operations__tab-container');
const operationsTabs = document.querySelectorAll('.operations__tab');
const opertationContents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

// const smoothScrollNav = function (e) {
//   e.preventDefault();
//   const id = this.getAttribute('href');
//   document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
// };

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', smoothScrollNav);
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

operationsCont.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  operationsTabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  opertationContents.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.3);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
/////////////////////////////////////////////

// Sticky Nav

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

const navHeight = nav.getBoundingClientRect().height;

const observerCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const observerOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const navObserver = new IntersectionObserver(observerCallback, observerOptions);
navObserver.observe(header);

// Reveal on Scroll

const sectionCallback = function (entries, observer) {
  const [section] = entries;

  if (!section.isIntersecting) return;

  section.target.classList.remove('section--hidden');
  observer.unobserve(section.target);
};
const sectionOptions = {
  root: null,
  threshold: 0.15,
};

const revealSection = new IntersectionObserver(sectionCallback, sectionOptions);
sections.forEach(section => {
  revealSection.observe(section);
  section.classList.add('section--hidden');
});

/////////////////////////////////////////////////////////
// Lazy Loading Images

const imgs = document.querySelectorAll('img[data-src]');
const lazyLoad = function (entries, observer) {
  const [img] = entries;
  console.log(img);

  if (!img.isIntersecting) return;

  img.target.src = img.target.dataset.src;
  img.target.addEventListener('load', () => img.target.classList.remove('lazy-img'));

  observer.unobserve(img.target);
};

const lazyOptions = {
  root: null,
  threshold: 0,
  rootMargin: '500px',
};

const imgObserver = new IntersectionObserver(lazyLoad, lazyOptions);
imgs.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////////////
// Slider

// Variables and constants
let currSlide = 0;
const slides = document.querySelectorAll('.slide');
const sliderBtnPrevious = document.querySelector('.slider__btn--left');
const sliderBtnNext = document.querySelector('.slider__btn--right');
const dotsCont = document.querySelector('.dots');

// Functions
const updateDots = function () {
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));
  dots[currSlide].classList.add('dots__dot--active');
};

const slideNext = function () {
  if (currSlide === slides.length - 1) {
    currSlide = -1;
  }
  currSlide++;
  slides.forEach((s, i) => (s.style.transform = `translateX(${(i - currSlide) * 100}%)`));
  updateDots();
};

const slidePrevious = function () {
  if (currSlide === 0) {
    currSlide = slides.length;
  }
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - currSlide) * 100 + 100}%)`)
  );
  currSlide--;
  updateDots();
};

// Execution
slides.forEach((s, i) => {
  s.style.transform = `translateX(${i * 100}%)`;
  const html = `<div class='dots__dot' data-num='${i}'></div>`;
  dotsCont.insertAdjacentHTML('beforeend', html);
});

const dots = document.querySelectorAll('.dots__dot');
dots[currSlide].classList.add('dots__dot--active');

sliderBtnNext.addEventListener('click', slideNext);
sliderBtnPrevious.addEventListener('click', slidePrevious);
dotsCont.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;

  if (+e.target.dataset.num >= currSlide) {
    currSlide = +e.target.dataset.num + 1;
    slidePrevious();
  } else {
    currSlide = +e.target.dataset.num - 1;
    slideNext();
  }
});

/////////////////////////////////
document.addEventListener('DOMContentLoaded', () => console.log('Loaded'));
