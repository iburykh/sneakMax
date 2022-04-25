// triggerSelector - кнопка открытия модального окна
// modalSelector - модальное окно, которое открывается при нажатии на кнопку
// closeSelector - крестик, закрывающий окно
// time (в функции showModalByTime) - время, через которое появится окно
// data-modal - добавить всем модальным окнам (если их несколько)
// lock - добавить класс для блоков с position: absolute или fixed (добавится padding)
// small-lock - добавить класс для маленьких блоков с position: absolute или fixed (добавится margin)
// tabLast - добавить класс для последнего интерактивного элемента в форме
function bindModal(triggerSelector, modalSelector, closeSelector) {
    const trigger = document.querySelectorAll(triggerSelector),
            modal = document.querySelector(modalSelector),
            close = document.querySelector(closeSelector),
            windows = document.querySelectorAll('[data-modal]'),
            fixScroll = document.querySelectorAll('.lock'),
            smallFix = document.querySelectorAll('.small-lock'),
            tabLast = modal.querySelector('.tab-last'),
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
                item.classList.remove('active');
            });

            modal.classList.add('active');
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

            lastFocus = document.activeElement;
            modal.setAttribute('tabindex', '0');
            // время выполнения ставится в соответствии с transition
            setTimeout(() => {
                modal.focus();
            }, 500);
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
            item.classList.remove('active');
        });

        modal.classList.remove('active');
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

bindModal('.popup-btn', '.popup', '.popup__close');
// showModalByTime('.popup', 60000);

//*функция запрета табов за пределами модального окна (если не отмечен последний интерактивный элемент)

// function focusRestrict() {
//     document.addEventListener('focus', function(event) {
//         if (modalOpen && !modal.contains(event.target)) {
//             event.stopPropagation();
//             modal.focus();
//         }
//     }, true);
// }
// focusRestrict();

//*функция показа окна через промежуток времени
// function showModalByTime(selector, time) {
//     setTimeout(() => {
//         let display;
//         // проверка - если открыто какое-либо окно, то окно, которое должно всплыть не показывается       
//         // пребираем все окна, если какое-то открыто (!== 'none'), то в переменную display записываем block (у неё появляется значение)
//         document.querySelectorAll('[data-modal]').forEach(item => {
//             if (getComputedStyle(item).display !== 'none') {
//                 display = 'block';
//             }
//         });
//         // если в переменную ничего не записано, значит ни одно окно не открыто и можно открыть всплывающие окно
//         if (!display) {
//             document.querySelector(selector).style.display = 'block';
//             document.body.style.overflow = 'hidden';
//         }
//     }, time);
// }

//*================================================

//*При клике на подложку окно не будет закрываться, 
//для этого создаем аргумент closeClickOverlay и добавляем его в условие
// closeClickOverlay - по умолчанию модальное окно закрывается при клике на подложку (если передаем false - окно не будет закрываться при клике на подложку)

// function bindModal(triggerSelector, modalSelector, closeSelector, closeClickOverlay = true) { 
//     //при клике на подлжку окно закрывается
//     modal.addEventListener('click', (e) => {
//         if (e.target == modal && closeClickOverlay) {
//             windows.forEach(item => {
//                 item.style.display = 'none';
//             });
//             modal.style.display = 'none';
//             document.body.style.overflow = '';
//             document.body.style.marginRight = `0px`;
//         }
//     });
// }
// //пример вызова (с аргументом false) 
// bindModal('.popup_calc_button', '.popup_calc_profile', '.popup_calc_profile_close', false);
// bindModal('.popup_calc_profile_button', '.popup_calc_end', '.popup_calc_end_close', false);
// // showModalByTime('.popup', 60000);


//*================================================

//* Удаляем кнопку после нажатия (добавляем аргумент destroy и если предаем true, кнопка удалится)
//* Проверяем, если не нажаты кнопки и страница прокручена до конца

// создаем переменную нажатия кнопок (по умолчанию не нажаты)
// let btnPressed = false;
// function bindModal(triggerSelector, modalSelector, closeSelector, destroy = false) {
//     trigger.forEach(function(item) {
//         item.addEventListener('click', function(e) {
//             let target = e.target
//             if (target) {
//                 e.preventDefault();
//             }
//             // если кнопку нажали, то переменная btnPressed становится в true
//             btnPressed = true;		    
//             //если предаем true, то кнопка удаляется
//             if (destroy) {
//                 item.remove();
//             }
//             windows.forEach(item => {
//                 item.style.display = 'none';
//                 item.classList.add('animated', 'fadeIn')
//             });

//             modal.style.display = 'block';
//             document.body.style.overflow = 'hidden';
//             document.body.style.marginRight = `${scroll}px`;
//         });
//     });
// }
//* функция открывает окно, если пользователь не нажал ни одну кнопку и прокрутил сайт до конца
// selector - кнопка, при нажатии на которую открывается окно
// function openByScroll(selector) {
//     window.addEventListener('scroll', () => {
//         // проверяем, если не нажата ни одна кнопка и пользователь долистал страницу до конца или нет (сколько пользователь отлистал сверху + окно видимости больше или равно общей высоте страницы)
//         if (!btnPressed && (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight)) {
//             // принудительно вызываем нажатие кнопки (она нажимается без участия пользователя)
//             document.querySelector(selector).click();
//         }
//         //Если необходима поддержка старых браузеров
//         // мы получаем большее значение из двух в переменную scrollHeight (document.body.scrollHeight - для старых браузеров)
//         // let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
//         // if (!btnPressed && (window.pageYOffset + document.documentElement.clientHeight >= scrollHeight)) {
//         //     document.querySelector(selector).click();
//         // }
//     });
// }
// // примеры вызова
// bindModal('.fixed-gift', '.popup-gift', '.popup-gift .popup-close', true);
// openByScroll('.fixed-gift');

//*================================================