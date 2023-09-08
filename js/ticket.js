let seanceInfo = JSON.parse(sessionStorage.getItem('session'));

fetch("https://jscp-diplom.netoserver.ru/", {
	method: "POST",
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: `event=sale_add&timestamp=${seanceInfo.timestamp}&hallId=${seanceInfo.hallId}&seanceId=${seanceInfo.seanceId}&hallConfiguration=${seanceInfo.hallConfig}`
});

let filmInfo = document.querySelector('.ticket__title');
let ticketInfo = document.querySelector('.ticket__chairs');
let ticketHall = document.querySelector('.ticket__hall');
let ticketStart = document.querySelector('.ticket__start');

let date = new Date(seanceInfo.timestamp * 1000);
let dateString = date.toLocaleString().slice(0, -3);

filmInfo.innerHTML = seanceInfo.filmName;
ticketInfo.innerHTML = getRowAndPlace();
ticketHall.innerHTML = seanceInfo.hallName.split('Зал').join('Зал ');
ticketStart.innerHTML = dateString;


function getRowAndPlace () {
    let tickets = [];
    let choisenPlaces = Array.from(seanceInfo.selectedPlaces);
    for (let i = 0; i < choisenPlaces.length; i++) {
        tickets.push(choisenPlaces[i].row + '/' + choisenPlaces[i].place);
    };
    return tickets;
};

let qrContent = `Билет в кино
На сеанс: "${seanceInfo.filmName}"
Начало сеанса: ${dateString}
Зал: ${seanceInfo.hallName}
Ряд/Место: ${ticketInfo.textContent}
`;
qrImg = document.querySelector(".ticket__info-qr");
let qrCode = QRCreator(qrContent, { image: "SVG" });                       
qrCode.download();
qrImg.append(qrCode.result);