const catalogProducts = document.querySelector('.catalog__wrap');
const catalogMore = document.querySelector('.catalog__more');
const prodModal = document.querySelector('.modal-prod__content');
const prodModalSlider = prodModal.querySelector('.slider-main__wrapper');
const prodModalPreview = prodModal.querySelector('.slider-min__wrapper');
let prodQuantity = 6;
let dataLength = null;
// let openBtnId;

// функция вставляет пробел между разрядами
const normalPrice = (str) => {
	return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

const modalSlider = () => {
	const minSlider = new Swiper('.slider-min', {
		grabCursor: true,
		slidesPerView: 6,
		initialSlide: 0,
		spaceBetween: 20,
		freeMode: true,
	});
	
	const mainSlider = new Swiper('.slider-main', {
		grabCursor: true,
		spaceBetween: 20,
		slidesPerView: 1,
		initialSlide: 0,
		simulateTouch: false,
		effect: 'fade',
		fadeEffect: {
		  crossFade: true
		},
		thumbs: {
			swiper: minSlider,
		}
	});
};



if (catalogProducts) {
	//* функция создания карточек в каталоге товаров
	const loadProducts = (quantity = 5) => {
		fetch('../data/data.json')
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				dataLength = data.length;
		
				catalogProducts.innerHTML = '';
		
				for (let i = 0; i < dataLength; i++) {
					if (i < quantity) {
					let item = data[i];
		
						catalogProducts.innerHTML += `
							<article class="catalog-item">
								<div class="catalog-item__img">
									<img src="${item.mainImage}" loading="lazy" alt="${item.title}">
									<div class="catalog-item__btns">
										<button class="catalog-item__btn btn-reset modal-btn" data-id="${item.id}" aria-label="Показать информацию о товаре">
											<svg><use xlink:href="img/sprite.svg#show"></use></svg>
										</button>
										<button class="catalog-item__btn btn-reset" data-id="${item.id}" aria-label="Добавить товар в корзину">
											<svg><use xlink:href="img/sprite.svg#cart"></use></svg>
										</button>
									</div>
								</div>
								<h3 class="catalog-item__title">${item.title}</h3>
								<span class="catalog-item__price">${normalPrice(item.price)} р</span>
							</article>

						`;
					}
				}
			})
			.then(() => {
				bindModal('.modal-btn', '.modal-prod', '.modal__close', 500, loadModalData);
				
				//TODO - добавить аргумент func в функцию bindModal(triggerSelector, modalSelector, closeSelector, speed, func)
				//TODO - вставить этот код в функцию bindModal (модальное окно) в момент открытия окна после получения lastFocus
				// получение id кнопки
				// if (modalContent.classList.contains('modal-prod')) {
				// 	let openBtnId = lastFocus.dataset.id;
				// 	// console.log(openBtnId);
				// 	func(openBtnId);
				// }
			});
	};
  
	loadProducts(prodQuantity);

	//* функция создания окна товара
	const loadModalData = (id = 1) => {
		fetch('../data/data.json')
			.then((response) => {
				return response.json();
			})
			.then((data) => {

				prodModalSlider.innerHTML = '';
				prodModalPreview.innerHTML = '';
				// prodModalInfo.innerHTML = '';
				// prodModalDescr.textContent = '';
				// prodModalChars.innerHTML = '';
				// prodModalVideo.innerHTML = '';
	
				for (let dataItem of data) {
					if (dataItem.id == id) {	


						const preview = dataItem.gallery.map((image, idx) => {
							return `
								<div class="slider-min__item swiper-slide">
									<img src="${image}" alt="изображение">
								</div>
							`;
						});

						const slides = dataItem.gallery.map((image, idx) => {
							return `
								<div class="slider-main__item swiper-slide">
									<img src="${image}" alt="изображение">
								</div>
							`;
						});

						
						prodModalPreview.innerHTML = preview.join('');
						prodModalSlider.innerHTML = slides.join('');
					}
				}
			})
			.then(() => {
				modalSlider();
			});
	};
  
	catalogMore.addEventListener('click', (e) => {
		//* +3 - добавлять по з карточки товара
		prodQuantity = prodQuantity + 3;

		loadProducts(prodQuantity);

		if (prodQuantity >= dataLength) {
			catalogMore.style.display = 'none';
		} else {
			catalogMore.style.display = 'block';
		}
	});
}