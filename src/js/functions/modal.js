//TODO Добавить классы:
//* data-modal-btn="modal-prod" - атрибут кнопки вызова модального окна с классом модального окна
//* data-speed="300" - добавить кнопке вызова окна, если скорость анимации отличается от 500 (по умолчанию)
//* block-fix - добавить класс для блоков с position: absolute или fixed (добавится padding)
//* small-fix - добавить класс для маленьких блоков с position: absolute или fixed (добавится margin)

// class Modal {
//     constructor(options) {
//         let defaultOptions = {
// 			isOpen: ()=>{},
// 			isClose: ()=>{},
// 		}
//         this.options = Object.assign(defaultOptions, options);
//         this.modal = document.querySelector('.modal-overlay');
//         this.speed = 500;
//         this._reOpen = false;
//         this._nextContainer = false;
//         this.modalContainer = false;
//         this.isOpen = false;
//         this.previousActiveElement = false;
//         this._focusElements = [
// 			'a[href]',
// 			'input',
// 			'select',
// 			'textarea',
// 			'button',
// 			'iframe',
// 			'[contenteditable]',
// 			'[tabindex]:not([tabindex^="-"])'
// 		];
//         this._fixBlocks = document.querySelectorAll('.block-fix');
//         this._fixSmall = document.querySelectorAll('.small-fix');
//         this.events();
//     }
//     events() {
// 		if (this.modal) {
// 			document.addEventListener('click', function(e) {
// 				const clickedElement = e.target.closest('[data-modal-btn]');
// 				if (clickedElement) {
// 					let target = clickedElement.dataset.modalBtn;
//                     let speed =  clickedElement.dataset.speed;
//                     this.speed = speed ? parseInt(speed) : 500;
// 					this._nextContainer = document.querySelector(`.${target}`);
// 					this.open();
// 					return;
// 				}

// 				if (e.target.closest('.modal__close')) {
// 					this.close();
// 					return;
// 				}
// 			}.bind(this));

// 			window.addEventListener('keydown', function(e) {
// 				if (e.code === 'Escape' && this.isOpen) {
// 					this.close();
//                     return;
// 				}

// 				if (e.code === 'Tab' && this.isOpen) {
// 					this.focusCatch(e);
// 					return;
// 				}
// 			}.bind(this));

// 			document.addEventListener('click', function(e) {
// 				if (e.target.classList.contains('modal-overlay') && e.target.classList.contains("is-open")) {
// 					this.close();
// 				}
// 			}.bind(this));
// 		}
// 	}

//     open(selector) {
// 		this.previousActiveElement = document.activeElement;

// 		if (this.isOpen) {
// 			this.reOpen = true;
// 			this.close();
// 			return;
// 		}

// 		this.modalContainer = this._nextContainer;

// 		this.modal.classList.add('is-open');
//         this.modal.setAttribute('tabindex', '0');

// 		this.disableScroll();

// 		this.modalContainer.classList.add('modal-open');
//         this.modalContainer.setAttribute('aria-hidden', false);

// 		setTimeout(() => {
// 			this.options.isOpen(this);
// 			this.isOpen = true;
// 			this.focusTrap();
// 		}, this.speed);
// 	}

//     close() {
// 		if (this.modalContainer) {
// 			this.modal.classList.remove('is-open');
//             this.modal.setAttribute('tabindex', '-1');
// 			this.modalContainer.classList.remove('modal-open');
//             this.modalContainer.setAttribute('aria-hidden', true);

// 			this.enableScroll();

// 			this.options.isClose(this);
// 			this.isOpen = false;
// 			this.focusTrap();

// 			if (this.reOpen) {
// 				this.reOpen = false;
// 				this.open();
// 			}
// 		}
// 	}

//     focusCatch(e) {
// 		const nodes = this.modalContainer.querySelectorAll(this._focusElements);
// 		const nodesArray = Array.prototype.slice.call(nodes);
// 		const focusedItemIndex = nodesArray.indexOf(document.activeElement)
// 		if (e.shiftKey && focusedItemIndex === 0) {
// 			nodesArray[nodesArray.length - 1].focus();
// 			e.preventDefault();
// 		}
// 		if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
// 			nodesArray[0].focus();
// 			e.preventDefault();
// 		}
// 	}

//     focusTrap() {
// 		// const nodes = this.modalContainer.querySelectorAll(this._focusElements); //* для фокуса на первом элементе окна
// 		if (this.isOpen) {
//             this.modal.focus();
// 			// if (nodes.length) nodes[0].focus(); //* для фокуса на первом элементе окна
// 		} else {
// 			this.previousActiveElement.focus();
// 		}
// 	}

//     disableScroll() {
// 		let pagePosition = window.scrollY;
// 		console.log(pagePosition);	
// 		this.lockPadding();
// 		document.body.classList.add('scroll-lock');
// 		document.body.dataset.position = pagePosition;
// 		document.body.style.top = -pagePosition + 'px';
// 	}

// 	enableScroll() {
// 		let pagePosition = parseInt(document.body.dataset.position, 10);
// 		this.unlockPadding();
// 		document.body.style.top = 'auto';
// 		document.body.classList.remove('scroll-lock');
// 		window.scroll({
// 			top: pagePosition,
// 			left: 0
// 		});
// 		document.body.removeAttribute('data-position');
// 	}

//     lockPadding() {
// 		let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
//         document.body.style.paddingRight = paddingOffset;
//         if (this._fixBlocks.length > 0) {
//             this._fixBlocks.forEach((el) => {
//                 el.style.paddingRight = paddingOffset;
//             });
//         }
//         if (this._fixSmall.length > 0) {
//             this._fixSmall.forEach((el) => {
//                 el.style.marginRight = paddingOffset;
//             });
//         }
// 	}

// 	unlockPadding() {
//         document.body.style.paddingRight = '0px';
//         if (this._fixBlocks.length > 0) {
//             this._fixBlocks.forEach((el) => {
//                 el.style.paddingRight = '0px';
//             });
//         }
//         if (this._fixSmall.length > 0) {
//             this._fixSmall.forEach((el) => {
//                 el.style.marginRight = '0px';
//             });
//         }
// 	}
// }