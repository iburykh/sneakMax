//? Параметры:
//* triggerSelector - кнопка открытия модального окна
//* modalSelector - модальное окно внутри фона modal
//* closeSelector - крестик, закрывающий окно
//* speed - время выполнения, ставится в соответствии с $transition-time

//TODO Добавить классы:
//* data-modal - добавить всем модальным окнам (modal-name) (если их несколько)
//* tab-last - добавить класс для последнего интерактивного элемента в форме
//* lock - добавить класс для блоков с position: absolute или fixed (добавится padding)
//* small-lock - добавить класс для маленьких блоков с position: absolute или fixed (добавится margin)


bindModal('.modal-btn', '.modal-name', '.modal-name__close', 500);

function bindModal(triggerSelector, modalSelector, closeSelector, speed) {
    const trigger = document.querySelectorAll(triggerSelector),
            modal = document.querySelector('.overlay'),
            modalContent = document.querySelector(modalSelector),
            close = document.querySelector(closeSelector),
            windows = document.querySelectorAll('[data-modal]'),
            fixScroll = document.querySelectorAll('.lock'),
            smallFix = document.querySelectorAll('.small-lock'),
            tabLast = modal.querySelector('.tab-last'),
            speedTime = (speed),
            scroll = calcScroll();
    let modalOpen = false;
    let lastFocus;

    trigger.forEach(function(item) {
        item.addEventListener('click', function(e) {
            let target = e.target
            if (target) {
                e.preventDefault();
            }
            modalOpen = true;
            windows.forEach(item => {
                item.classList.remove('modal-open');
            });

            modal.classList.add('is-open');
            document.body.classList.add('scroll-lock');

            document.body.style.paddingRight = `${scroll}px`;
            if (fixScroll.length > 0) {
                fixScroll.forEach(item => {
                    item.style.paddingRight = `${scroll}px`;
                })
            }
            if (smallFix.length > 0) {
                smallFix.forEach(item => {
                    item.style.marginRight = `${scroll}px`;
                })
            }

            modalContent.classList.add('modal-open');
            lastFocus = document.activeElement;
            modal.setAttribute('tabindex', '0');

            setTimeout(() => {
                modal.focus();
            }, speedTime);
        });
    });

    tabLast.addEventListener('keydown', (e) => {
        if (e.code === 'Tab' && modalOpen) {
            modal.focus();
        }
    });

    function popapClose() {
        modalOpen = false;
        windows.forEach(item => {
            item.classList.remove('modal-open');
        });
        modal.classList.remove('is-open');
        document.body.classList.remove('scroll-lock');
        document.body.style.paddingRight = `0px`;
        if (fixScroll.length > 0) {
            fixScroll.forEach(item => {
                item.style.paddingRight = `0px`;
            })
        }
        if (smallFix.length > 0) {
            smallFix.forEach(item => {
                item.style.marginRight = `0px`;
            })
        }
        modal.classList.remove('is-open');
        modal.setAttribute('tabindex', '-1');
    }

    close.addEventListener('click', () => {
        popapClose();
        lastFocus.focus();
    });

    modal.addEventListener('click', (e) => {
        if (e.target == modal) {
            popapClose(); 
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalOpen) {
            popapClose();
            lastFocus.focus();
        }
    });

    function calcScroll() {
        let div = document.createElement('div');

        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';

        document.body.appendChild(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        return scrollWidth;
    }
};