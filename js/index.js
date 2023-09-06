let dayNumber = Array.from(document.querySelectorAll('.page-nav__day-number'));
let dayWeek = document.querySelectorAll('.page-nav__day-week');
let dayWeekList = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
let today = new Date();
let todayStartDay = today.setHours(0, 0, 0, 0);
let dayBtn = Array.from(document.querySelectorAll('.page-nav__day'));
let url = 'https://jscp-diplom.netoserver.ru/';
let eventUpdate = 'event=update';

function sendRequest (body, callback) {
	let bodyForRequest = {
		method: 'POST',
		body: body,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	};
	fetch(url, bodyForRequest).then((response) => {
		if (!response.ok) {
			throw new Error('Ошибка при запросе на сервер');
		};
		return response.json();
	})
	.then((data) => {
		callback(data);
	})
	.catch((error) => {
		console.log(error);
	});

};

for (let i = 0; i < dayNumber.length; i++) {
    let dayNow = new Date(todayStartDay + (i * (24 * 60 * 60 * 1000)));
    dayNumber[i].textContent = `${dayNow.getDate()}`;
    dayWeek[i].textContent = `${dayWeekList[dayNow.getDay()]}`
    if (dayWeek[i].textContent === 'Сб' || dayWeek[i].textContent === 'Вс') {
        dayNumber[i].parentNode.classList.add('page-nav__day_weekend');
	} else {
		dayNumber[i].parentNode.classList.remove('page-nav__day_weekend');
	};
};

dayBtn.forEach(item => {
	item.addEventListener('click', () => {
		dayBtn.forEach(el => {
			el.classList.remove('page-nav__day_chosen');
		});
		item.classList.add('page-nav__day_chosen');
		sendRequest(eventUpdate, updateSessionInfo);
	});
});

function updateSessionInfo (response) {
	let main = document.querySelector('main');
	main.textContent = '';
	let arr = {};
	arr.seances = response.seances.result;
	arr.films = response.films.result;
	arr.halls = response.halls.result;
	arr.halls = arr.halls.filter((hall) => hall.hall_open == 1);
	let addInfo = '';
	console.log (arr);

	arr.films.forEach(film => {
		addInfo += 
		`<section class="movie">
			<div class="movie__info">
				<div class="movie__poster">
					<img class="movie__poster-image" src="${film.film_poster}">
				</div>
			  	<div class="movie__description">
					<h2 class="movie__title">${film.film_name}</h2>
					<p class="movie__synopsis">${film.film_description}</p>
					<p class="movie__data">
				  		<span class="movie__data-duration">${film.film_duration} мин</span>
				  		<span class="movie__data-origin">${film.film_origin}</span>
					</p>
			  	</div>
			</div>`;
		arr.halls.forEach (hall => {
			let seances = arr.seances.filter(seance => ((seance.seance_hallid === hall.hall_id) && (seance.seance_filmid === film.film_id)));
			if (seances.length > 0) {
				addInfo +=
					`<div class="movie-seances__hall">
						<h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
						<ul class="movie-seances__list">`;
				seances.forEach(seance =>
					addInfo +=
						`<li class="movie-seances__time-block"><a class="movie-seances__time" href="hall.html"
						data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}"
						data-hall-name="${hall.hall_name}" data-price-standart="${hall.hall_price_standart}" 
						data-price-vip="${hall.hall_price_vip}" data-seance-id="${seance.seance_id}"
						data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">
						${seance.seance_time}</a></li>`
				);
					addInfo +=
						`</ul>
						</div>`;	
			};
		});
		addInfo +=
			`</section>`;
			
		main.insertAdjacentHTML("beforeend", addInfo);
	});

	let chosenSeance = Array.from(document.querySelectorAll('.movie-seances__time'));
	let chosenDay = document.querySelector('.page-nav__day_chosen');
	let chosenDayTimestamp = chosenDay.dataset.timestamp;

	chosenSeance.forEach(el => {
		let seanseTimestamp = +chosenDayTimestamp + (+el.dataset.seanceStart * 60 * 1000);
		let todayTime = new Date().getTime();

		if (seanseTimestamp < todayTime) {
			el.style.background = 'grey'
		};
		el.addEventListener('click', (event) => {
			let target = event.target;
			if (seanseTimestamp < todayTime) {
				event.preventDefault();
			} else {
				let chosenData = target.dataset;
				chosenData.timestamp = Math.floor(seanseTimestamp / 1000);

				chosenData.hallConfig = arr.halls.find(hall => hall.hall_id == chosenData.hallId).hall_config;
				sessionStorage.setItem('session', JSON.stringify(chosenData));
			};
		});
	});
};