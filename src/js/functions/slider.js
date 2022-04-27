
const minSlider = new Swiper('.slider-min', {
	grabCursor: true,
	slidesPerView: 6,
	spaceBetween: 20,
	freeMode: true,
	// speed: 800
});

const mainSlider = new Swiper('.slider-main', {
	spaceBetween: 20,
	slidesPerView: 1,
	simulateTouch: false,
	effect: 'fade',
	fadeEffect: {
	  crossFade: true
	},
	thumbs: {
		swiper: minSlider,
	}
});