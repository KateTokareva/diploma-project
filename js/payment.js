let information = JSON.parse(sessionStorage.getItem('session'));
let filmInfo = document.querySelector('.ticket__title');
let ticketInfo = document.querySelector('.ticket__chairs');
let ticketHall = document.querySelector('.ticket__hall');
let ticketStart = document.querySelector('.ticket__start');
let ticketCost = document.querySelector('.ticket__cost');
let acceptinBtn = document.querySelector('.acceptin-button');

let date = new Date(information.timestamp * 1000);
let dateString = date.toLocaleString().slice(0, -3)

filmInfo.innerHTML = information.filmName;
ticketInfo.innerHTML = getRowAndPlace();
ticketHall.innerHTML = information.hallName.split('Зал').join('Зал ');
ticketStart.innerHTML = dateString;
ticketCost.innerHTML = getCost();

function getRowAndPlace () {
    let tickets = [];
    let choisenPlaces = Array.from(information.selectedPlaces);
    for (let i = 0; i < choisenPlaces.length; i++) {
        tickets.push(choisenPlaces[i].row + '/' + choisenPlaces[i].place);
    };
    return tickets;
};

function getCost () {
    let cost = 0;
    let choisenPlaces = Array.from(information.selectedPlaces);
    for (let i = 0; i < choisenPlaces.length; i++) {
        if (choisenPlaces[i].placeType === 'standart') {
            cost += +information.priceStandart;
        } else {
            cost += +information.priceVip;
        };
    };
    return cost;
};

acceptinBtn.addEventListener('click', () => {
    window.location.href = 'ticket.html';
})

