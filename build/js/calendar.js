// import {html, render} from 'https://unpkg.com/lit-html?module';

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
// const selectYear = document.getElementById("year");
// const selectMonth = document.getElementById("month");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// const styles = `
//     .calendar-basicGrid {
//         display: grid;
//         grid-template-columns: repeat(7, 1fr);
//     }
// `;

// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);

// class CalendarCard extends HTMLElement {
//     // Define constructor
//     // constructor() {
//     //     super();
//     // }

//     // Create inner HTML contents
//     connectedCallback() {
//         let calendarObj = JSON.parse(this.getAttribute('calendardata'));

//         let firstDay = (new Date(currentYear, currentMonth)).getDay();
        
//         let calendarCardHTML = () => html`
//         <div>
//             Tetss 1
//         </div>
//         `;
//         render(calendarCardHTML(), this);
//     }
// }
// customElements.define('calendar-card', CalendarCard);

showCalendar(currentMonth, currentYear);

function showCalendar(month, year) {
    const firstDay = (new Date(year, month)).getDay();
    const calendarElement = document.getElementById('create_calendar');
    calendarElement.innerHTML = "";

    let date = 1;
    let cellElements = '';

    for (let r = 0; r < 6; r++)  {
        for (let i = 0; i < 7; i++) {
            let cell = '';
            if (r === 0 && i < firstDay) {
                let lastMonth;
                if (month === 0) {
                    lastMonth = month + 11;
                }
                else {
                    lastMonth = month - 1;
                
                }
                let previousMonthDate = daysInMonth(lastMonth, year) - firstDay + i + 1;
                
                cell = `<div class="calendar-day">${previousMonthDate}</div>`;
            }
            else if (date > daysInMonth(month, year)) {
                let nextMonthDate = date - daysInMonth(month, year);
                cell = `<div class="calendar-day">${nextMonthDate}</div>`;
                date++;
            }
            else {
                cell = `<div class="calendar-day${(date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) ? 'calendar-currentDay' : ''}">${date}</div>`;
                
                date++;
            }
            cellElements += cell;
        }
    }

    // let calendarCardHTML = () => html`
    let calendarCardHTML = `
        <div id="calendar_monthHeader">
            <span>${months[month]}</span>
            <span>${year}</span>
        </div>
        <div id="calendar_dayHeader" class="calendar-basicGrid">
            <span class="week-name">S</span>
            <span class="week-name">M</span>
            <span class="week-name">T</span>
            <span class="week-name">W</span>
            <span class="week-name">T</span>
            <span class="week-name">F</span>
            <span class="week-name">S</span>
        </div>
        <div id="calendar_dayContainer" class="calendar-basicGrid">
            ${cellElements}
        </div>
    `;
    // render(calendarCardHTML(), this);
    
    calendarElement.innerHTML = calendarCardHTML;
}

function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}
previous()
function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}