let menuBody = document.querySelector('.menu');
let menuItem = document.querySelectorAll('.menu__link');
let hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {    
    hamburger.classList.toggle('active');
    menuBody.classList.toggle('active');

    if (hamburger.classList.contains('active')) {
        hamburger.setAttribute('aria-label', 'закрыть навигацию');
        disableScrollBurger();
    } else {
        hamburger.setAttribute('aria-label', 'открыть навигацию');
        enableScrollBurger();
    }

    setTimeout(() => {
        menuBody.focus();
    }, 600);
});

menuItem.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            menuBody.classList.remove('active');
            hamburger.setAttribute('aria-label', 'открыть навигацию');
            enableScrollBurger();
        }
    })
})

function disableScrollBurger() {
    let pagePosition = window.scrollY;
    document.body.classList.add('scroll-lock');
    document.body.dataset.position = pagePosition;
    document.body.style.top = -pagePosition + 'px';
}

function enableScrollBurger() {
    let pagePosition = parseInt(document.body.dataset.position, 10);
    document.body.style.top = '';
    document.body.classList.remove('scroll-lock');
    window.scroll({ top: pagePosition, left: 0 });
    document.body.removeAttribute('data-position');
}

let filter = document.querySelector('.catalog__filters');
let filterBtn = document.querySelector('.catalog__btn');
let filterBurger = document.querySelector('.catalog-hamburger');

filterBurger.addEventListener('click', () => {    
    filterBurger.classList.toggle('active');
    filter.classList.toggle('active');
    if (filterBurger.classList.contains('active')) {
        filterBurger.setAttribute('aria-label', 'закрыть фильтр');
    } else {
        filterBurger.setAttribute('aria-label', 'открыть фильтр');
    }
    setTimeout(() => {
        filter.focus();
    }, 600);
});

filterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (filterBurger.classList.contains('active')) {
        filterBurger.classList.remove('active');
        filter.classList.remove('active');
        filterBurger.setAttribute('aria-label', 'открыть фильтр'); 
    }
})
