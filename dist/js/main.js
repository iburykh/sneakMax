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

const checkBox = document.querySelectorAll('.name-checkbox__label');

checkBox.forEach(item => {
	item.addEventListener('keydown', (e) => {
		if (e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space') {
			let check = e.target.previousElementSibling;
			console.log(check.checked);
			if (check.checked === false) {
				check.checked = true;
			} 
		}
	});
});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJidXJnZXIuanMiLCJjaGVja2JveC5qcyIsImxhenkuanMiLCJyYW5nZS1zbGlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBmb3JFYWNoIFBvbHlmaWxsXHJcbmlmICh3aW5kb3cuTm9kZUxpc3QgJiYgIU5vZGVMaXN0LnByb3RvdHlwZS5mb3JFYWNoKSB7XHJcbiAgICBOb2RlTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xyXG59XHJcblxyXG4vLyB3aW5kb3cubm9aZW5zbW9vdGggPSB0cnVlOyIsImxldCBtZW51Qm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51Jyk7XHJcbmxldCBtZW51SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tZW51X19saW5rJyk7XHJcbmxldCBoYW1idXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyJyk7XHJcblxyXG5oYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7ICAgIFxyXG4gICAgaGFtYnVyZ2VyLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgbWVudUJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3Njcm9sbC1sb2NrJyk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgbWVudUJvZHkuZm9jdXMoKTtcclxuICAgIH0sIDYwMCk7XHJcbn0pO1xyXG5cclxubWVudUl0ZW0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgaWYgKGhhbWJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIGhhbWJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgbWVudUJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnc2Nyb2xsLWxvY2snKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KVxyXG4iLCJjb25zdCBjaGVja0JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYW1lLWNoZWNrYm94X19sYWJlbCcpO1xyXG5cclxuY2hlY2tCb3guZm9yRWFjaChpdGVtID0+IHtcclxuXHRpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG5cdFx0aWYgKGUuY29kZSA9PT0gJ0VudGVyJyB8fCBlLmNvZGUgPT09ICdOdW1wYWRFbnRlcicgfHwgZS5jb2RlID09PSAnU3BhY2UnKSB7XHJcblx0XHRcdGxldCBjaGVjayA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblx0XHRcdGNvbnNvbGUubG9nKGNoZWNrLmNoZWNrZWQpO1xyXG5cdFx0XHRpZiAoY2hlY2suY2hlY2tlZCA9PT0gZmFsc2UpIHtcclxuXHRcdFx0XHRjaGVjay5jaGVja2VkID0gdHJ1ZTtcclxuXHRcdFx0fSBcclxuXHRcdH1cclxuXHR9KTtcclxufSk7IiwiY29uc3QgbGF6eUltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZ1tkYXRhLXNyY10sc291cmNlW2RhdGEtc3Jjc2V0XScpO1xyXG5jb25zdCBsb2FkTWFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvYWQtbWFwJyk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoKSA9PiB7XHJcblx0bGV0IHNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWTtcclxuXHRpZiAobGF6eUltYWdlcy5sZW5ndGggPiAwKSB7XHJcblx0XHRsYXp5SW1hZ2VzLmZvckVhY2goaW1nID0+IHtcclxuXHRcdFx0bGV0IGltZ09mZnNldCA9IGltZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBwYWdlWU9mZnNldDtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChzY3JvbGxZID49IGltZ09mZnNldCAtIDEwMDApIHtcclxuXHRcdFx0XHRpZiAoaW1nLmRhdGFzZXQuc3JjKSB7XHJcblx0XHRcdFx0XHRpbWcuc3JjID0gaW1nLmRhdGFzZXQuc3JjO1xyXG5cdFx0XHRcdFx0aW1nLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zcmMnKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGltZy5kYXRhc2V0LnNyY3NldCkge1xyXG5cdFx0XHRcdFx0aW1nLnNyY3NldCA9IGltZy5kYXRhc2V0LnNyY3NldDtcclxuXHRcdFx0XHRcdGltZy5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3Jjc2V0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly9NYXBcclxuXHQvLyBpZiAoIWxvYWRNYXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb2FkZWQnKSkge1xyXG5cdC8vIFx0bGV0IG1hcE9mZnNldCA9IGxvYWRNYXAub2Zmc2V0VG9wO1xyXG5cdC8vIFx0aWYgKHNjcm9sbFkgPj0gbWFwT2Zmc2V0IC0gMjAwKSB7XHJcblx0Ly8gXHRcdGNvbnN0IGxvYWRNYXBVcmwgPSBsb2FkTWFwLmRhdGFzZXQubWFwO1xyXG5cdC8vIFx0XHRpZiAobG9hZE1hcFVybCkge1xyXG5cdC8vIFx0XHRcdGxvYWRNYXAuaW5zZXJ0QWRqYWNlbnRIVE1MKFxyXG5cdC8vIFx0XHRcdFx0XCJiZWZvcmVlbmRcIixcclxuXHQvLyBcdFx0XHRcdGA8aWZyYW1lIHNyYz1cIiR7bG9hZE1hcFVybH1cIiBzdHlsZT1cImJvcmRlcjowO1wiIGFsbG93ZnVsbHNjcmVlbj1cIlwiIGxvYWRpbmc9XCJsYXp5XCI+PC9pZnJhbWU+YFxyXG5cdC8vIFx0XHRcdCk7XHJcblx0Ly8gXHRcdFx0bG9hZE1hcC5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKTtcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxufSk7IiwiY29uc3QgcmFuZ2VTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZ2Utc2xpZGVyJyk7XG5cbmlmIChyYW5nZVNsaWRlcikge1xuXHRub1VpU2xpZGVyLmNyZWF0ZShyYW5nZVNsaWRlciwge1xuICAgIHN0YXJ0OiBbNTAwLCA5OTk5OTldLFxuXHRcdGNvbm5lY3Q6IHRydWUsXG5cdFx0c3RlcDogMSxcbiAgICByYW5nZToge1xuXHRcdFx0J21pbic6IFs1MDBdLFxuXHRcdFx0J21heCc6IFs5OTk5OTldXG4gICAgfVxuXHR9KTtcblxuXHRjb25zdCBpbnB1dDAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtMCcpO1xuXHRjb25zdCBpbnB1dDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtMScpO1xuXHRjb25zdCBpbnB1dHMgPSBbaW5wdXQwLCBpbnB1dDFdO1xuXG5cdHJhbmdlU2xpZGVyLm5vVWlTbGlkZXIub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKHZhbHVlcywgaGFuZGxlKXtcblx0XHRpbnB1dHNbaGFuZGxlXS52YWx1ZSA9IE1hdGgucm91bmQodmFsdWVzW2hhbmRsZV0pO1xuXHR9KTtcblxuXHRjb25zdCBzZXRSYW5nZVNsaWRlciA9IChpLCB2YWx1ZSkgPT4ge1xuXHRcdGxldCBhcnIgPSBbbnVsbCwgbnVsbF07XG5cdFx0YXJyW2ldID0gdmFsdWU7XG5cblx0XHRjb25zb2xlLmxvZyhhcnIpO1xuXG5cdFx0cmFuZ2VTbGlkZXIubm9VaVNsaWRlci5zZXQoYXJyKTtcblx0fTtcblxuXHRpbnB1dHMuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XG5cdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGluZGV4KTtcblx0XHRcdHNldFJhbmdlU2xpZGVyKGluZGV4LCBlLmN1cnJlbnRUYXJnZXQudmFsdWUpO1xuXHRcdH0pO1xuXHR9KTtcbn0iXX0=
