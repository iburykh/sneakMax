'use strict';

// forEach Polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// window.noZensmooth = true;
let menuBody = document.querySelector('.menu');
let menuItem = document.querySelectorAll('.menu__link');
let hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {    
    hamburger.classList.toggle('active');
    menuBody.classList.toggle('active');
    document.body.classList.toggle('scroll-lock');

    setTimeout(() => {
        menuBody.focus();
    }, 600);
});

menuItem.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        let target = e.target;
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            menuBody.classList.remove('active');
            document.body.classList.remove('scroll-lock');
        }
    })
})

const lazyImages = document.querySelectorAll('img[data-src],source[data-srcset]');
const loadMap = document.querySelector('.load-map');

window.addEventListener("scroll", () => {
	let scrollY = window.scrollY;
	if (lazyImages.length > 0) {
		lazyImages.forEach(img => {
			let imgOffset = img.getBoundingClientRect().top + pageYOffset;
			
			if (scrollY >= imgOffset - 1000) {
				if (img.dataset.src) {
					img.src = img.dataset.src;
					img.removeAttribute('data-src');
				} else if (img.dataset.srcset) {
					img.srcset = img.dataset.srcset;
					img.removeAttribute('data-srcset');
				}
			}
		});
	}
	//Map
	// if (!loadMap.classList.contains('loaded')) {
	// 	let mapOffset = loadMap.offsetTop;
	// 	if (scrollY >= mapOffset - 200) {
	// 		const loadMapUrl = loadMap.dataset.map;
	// 		if (loadMapUrl) {
	// 			loadMap.insertAdjacentHTML(
	// 				"beforeend",
	// 				`<iframe src="${loadMapUrl}" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
	// 			);
	// 			loadMap.classList.add('loaded');
	// 		}
	// 	}
	// }
});
const rangeSlider = document.getElementById('range-slider');

if (rangeSlider) {
	noUiSlider.create(rangeSlider, {
    start: [500, 999999],
		connect: true,
		step: 1,
    range: {
			'min': [500],
			'max': [999999]
    }
	});

	const input0 = document.getElementById('input-0');
	const input1 = document.getElementById('input-1');
	const inputs = [input0, input1];

	rangeSlider.noUiSlider.on('update', function(values, handle){
		inputs[handle].value = Math.round(values[handle]);
	});

	const setRangeSlider = (i, value) => {
		let arr = [null, null];
		arr[i] = value;

		console.log(arr);

		rangeSlider.noUiSlider.set(arr);
	};

	inputs.forEach((el, index) => {
		el.addEventListener('change', (e) => {
			console.log(index);
			setRangeSlider(index, e.currentTarget.value);
		});
	});
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJidXJnZXIuanMiLCJsYXp5LmpzIiwicmFuZ2Utc2xpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIGZvckVhY2ggUG9seWZpbGxcclxuaWYgKHdpbmRvdy5Ob2RlTGlzdCAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcclxuICAgIE5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XHJcbn1cclxuXHJcbi8vIHdpbmRvdy5ub1plbnNtb290aCA9IHRydWU7IiwibGV0IG1lbnVCb2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcclxubGV0IG1lbnVJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVfX2xpbmsnKTtcclxubGV0IGhhbWJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKTtcclxuXHJcbmhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgICAgXHJcbiAgICBoYW1idXJnZXIuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBtZW51Qm9keS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnc2Nyb2xsLWxvY2snKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBtZW51Qm9keS5mb2N1cygpO1xyXG4gICAgfSwgNjAwKTtcclxufSk7XHJcblxyXG5tZW51SXRlbS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgICAgICBpZiAoaGFtYnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBtZW51Qm9keS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtbG9jaycpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcbiIsImNvbnN0IGxhenlJbWFnZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1zcmNdLHNvdXJjZVtkYXRhLXNyY3NldF0nKTtcclxuY29uc3QgbG9hZE1hcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkLW1hcCcpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKCkgPT4ge1xyXG5cdGxldCBzY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XHJcblx0aWYgKGxhenlJbWFnZXMubGVuZ3RoID4gMCkge1xyXG5cdFx0bGF6eUltYWdlcy5mb3JFYWNoKGltZyA9PiB7XHJcblx0XHRcdGxldCBpbWdPZmZzZXQgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgcGFnZVlPZmZzZXQ7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2Nyb2xsWSA+PSBpbWdPZmZzZXQgLSAxMDAwKSB7XHJcblx0XHRcdFx0aWYgKGltZy5kYXRhc2V0LnNyYykge1xyXG5cdFx0XHRcdFx0aW1nLnNyYyA9IGltZy5kYXRhc2V0LnNyYztcclxuXHRcdFx0XHRcdGltZy5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChpbWcuZGF0YXNldC5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdGltZy5zcmNzZXQgPSBpbWcuZGF0YXNldC5zcmNzZXQ7XHJcblx0XHRcdFx0XHRpbWcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyY3NldCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vTWFwXHJcblx0Ly8gaWYgKCFsb2FkTWFwLmNsYXNzTGlzdC5jb250YWlucygnbG9hZGVkJykpIHtcclxuXHQvLyBcdGxldCBtYXBPZmZzZXQgPSBsb2FkTWFwLm9mZnNldFRvcDtcclxuXHQvLyBcdGlmIChzY3JvbGxZID49IG1hcE9mZnNldCAtIDIwMCkge1xyXG5cdC8vIFx0XHRjb25zdCBsb2FkTWFwVXJsID0gbG9hZE1hcC5kYXRhc2V0Lm1hcDtcclxuXHQvLyBcdFx0aWYgKGxvYWRNYXBVcmwpIHtcclxuXHQvLyBcdFx0XHRsb2FkTWFwLmluc2VydEFkamFjZW50SFRNTChcclxuXHQvLyBcdFx0XHRcdFwiYmVmb3JlZW5kXCIsXHJcblx0Ly8gXHRcdFx0XHRgPGlmcmFtZSBzcmM9XCIke2xvYWRNYXBVcmx9XCIgc3R5bGU9XCJib3JkZXI6MDtcIiBhbGxvd2Z1bGxzY3JlZW49XCJcIiBsb2FkaW5nPVwibGF6eVwiPjwvaWZyYW1lPmBcclxuXHQvLyBcdFx0XHQpO1xyXG5cdC8vIFx0XHRcdGxvYWRNYXAuY2xhc3NMaXN0LmFkZCgnbG9hZGVkJyk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcbn0pOyIsImNvbnN0IHJhbmdlU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhbmdlLXNsaWRlcicpO1xuXG5pZiAocmFuZ2VTbGlkZXIpIHtcblx0bm9VaVNsaWRlci5jcmVhdGUocmFuZ2VTbGlkZXIsIHtcbiAgICBzdGFydDogWzUwMCwgOTk5OTk5XSxcblx0XHRjb25uZWN0OiB0cnVlLFxuXHRcdHN0ZXA6IDEsXG4gICAgcmFuZ2U6IHtcblx0XHRcdCdtaW4nOiBbNTAwXSxcblx0XHRcdCdtYXgnOiBbOTk5OTk5XVxuICAgIH1cblx0fSk7XG5cblx0Y29uc3QgaW5wdXQwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LTAnKTtcblx0Y29uc3QgaW5wdXQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LTEnKTtcblx0Y29uc3QgaW5wdXRzID0gW2lucHV0MCwgaW5wdXQxXTtcblxuXHRyYW5nZVNsaWRlci5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbih2YWx1ZXMsIGhhbmRsZSl7XG5cdFx0aW5wdXRzW2hhbmRsZV0udmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlc1toYW5kbGVdKTtcblx0fSk7XG5cblx0Y29uc3Qgc2V0UmFuZ2VTbGlkZXIgPSAoaSwgdmFsdWUpID0+IHtcblx0XHRsZXQgYXJyID0gW251bGwsIG51bGxdO1xuXHRcdGFycltpXSA9IHZhbHVlO1xuXG5cdFx0Y29uc29sZS5sb2coYXJyKTtcblxuXHRcdHJhbmdlU2xpZGVyLm5vVWlTbGlkZXIuc2V0KGFycik7XG5cdH07XG5cblx0aW5wdXRzLmZvckVhY2goKGVsLCBpbmRleCkgPT4ge1xuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhpbmRleCk7XG5cdFx0XHRzZXRSYW5nZVNsaWRlcihpbmRleCwgZS5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcblx0XHR9KTtcblx0fSk7XG59Il19
