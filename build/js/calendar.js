const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let calendarDayElements;
const calendarElement = document.getElementById('create_calendar');

// showCalendar(currentMonth, currentYear);
// setupSwipeListener(calendarElement);

function showCalendar(month, year) {
    const firstDay = (new Date(year, month)).getDay();
    calendarElement.innerHTML = "";

    let date = 1;
    let cellElements = '';

    for (let r = 0; r < 6; r++) {
        for (let i = 0; i < 7; i++) {
            let cell = '';

            if (r === 0 && i < firstDay) {
                let lastMonth;
                let lastMonthYear = year;
                if (month === 0) {
                    lastMonth = month + 11;
                    lastMonthYear = year - 1;
                }
                else {
                    lastMonth = month - 1;
                }
                let previousMonthDate = daysInMonth(lastMonth, year) - firstDay + i + 1;
                cell = `
                <div id="${lastMonth + 1}-${previousMonthDate}-${lastMonthYear}" class="calendar-day calendar-notCurrentMonth" onClick="dateSelected(this)">
                    <div class="calendar-date">${previousMonthDate}</div>
                    <div id="indicatorContainer${lastMonth + 1}-${previousMonthDate}-${lastMonthYear}" class="dateNumber-jobIndicator">
                    </div>
                </div>`;
            }
            else if (date > daysInMonth(month, year)) {
                const nextMonthYear = month + 2 > 12 ? year + 1 : year;
                const nextMonthDate = date - daysInMonth(month, year);
                const nextMonth = month + 2 > 12 ? month - 10 : month + 2;
                cell = `
                <div id="${nextMonth}-${nextMonthDate}-${nextMonthYear}" class="calendar-day calendar-notCurrentMonth" onClick="dateSelected(this)">
                    <div class="calendar-date">${nextMonthDate}</div>
                    <div id="indicatorContainer${nextMonth}-${nextMonthDate}-${nextMonthYear}" class="dateNumber-jobIndicator">
                    </div>
                </div>`;
                date++;
            }
            else {
                cell = `
                <div id="${month + 1}-${date}-${year}" class="calendar-day${(date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) ? ' calendar-selectedDate' : ''}" onClick="dateSelected(this)">
                    <div class="calendar-date${(date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) ? ' calendar-currentDay' : ''}">${date}</div>
                    <div id="indicatorContainer${month + 1}-${date}-${year}" class="dateNumber-jobIndicator">
                    </div>
                </div>`;

                date++;
            }
            cellElements += cell;
        }
    }

    let calendarCardHTML = `
        <div id="calendar_monthHeader">
            <div><div class="material-icons calendar-monthHeader" onClick="previous()">keyboard_arrow_left</div></div>
            <div><div class="calendar-monthHeader" onClick="returnToCurrent()">${months[month]} ${year}</div></div>
            <div><div class="material-icons calendar-monthHeader" onClick="next()">keyboard_arrow_right</div></div>
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

    calendarElement.innerHTML = calendarCardHTML;
    calendarDayElements = calendarElement.querySelectorAll('.calendar-day');

    const selectedDate = calendarElement.querySelector('.calendar-selectedDate');
    if (selectedDate != null) {
        dateSelected(selectedDate);
    }

    getJobs(month, year);
    getNonWorkDays();
}

function setupSwipeListener(calendarElement) {
    calendarElement.addEventListener('swiped-right', function (e) {
        // the element that was swiped
        previous();
    });

    calendarElement.addEventListener('swiped-left', function (e) {
        // the element that was swiped
        next();
    });
}

function dateSelected(element) {
    for (let i = 0; i < calendarDayElements.length; i++) {
        const dayElement = calendarDayElements[i];
        dayElement.classList.remove('calendar-selectedDate');
    }
    element.classList.add('calendar-selectedDate');

    const selectedInstallDate = new Date(element.getAttribute('id').replace(/-/g, '/'));
    const installDateString = new Date(selectedInstallDate.setHours(0, 0, 0, 0)).toJSON();
    
    const buttonContainerTitle = document.getElementById('date_selected');
    buttonContainerTitle.innerHTML = selectedInstallDate.toLocaleDateString();

    findSelectedDateJobs(`${installDateString.substring(0, installDateString.indexOf('T'))}T00:00:00`);
}

document.onkeydown = checkKey;

function checkKey(e) {
    if (!localStorage.hasOwnProperty('token') || window.jobOpened == true) {
        return;
    }
    let event = window.event ? window.event : e;
    if (event.keyCode == 37) {
        previous();
    }
    if (event.keyCode == 39) {
        next();
    }
}

function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function returnToCurrent() {
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    showCalendar(currentMonth, currentYear);
}

// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}