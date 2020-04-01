function createNode(element) {
    return document.createElement(element); 
}

function append(parent, el) {
    return parent.appendChild(el); 
}

const ul = document.getElementById('people');

// fetch('https://jsonplaceholder.typicode.com/users')
fetch('userTestJson.json')
    .then(response => response.json())
    .then(data => {
        let people = data;
        return people.map(function(person) {
            let li = createNode('li')
            span = createNode('span');

            li.innerHTML = person.name;
            span.innerHTML = person.email;

            append(li, span);
            append(ul, li);

        });
    });

getNonWorkDays = () => {
    fetch('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getNonWorkDays')
    .then(response => response.json())
    .then(data => {
        let days = data;
        const currentCalendar = document.getElementById('calendar_dayContainer');
        return days.map(function (day) {
            const dateElement = currentCalendar.querySelector(`[id='${day.mm}-${day.dd}-${day.yy}']`);
            if (dateElement !== null && !day.isWorkDay) {
                dateElement.classList.add('calendar-nonWorkDay');
            }
        });
    });
}

let timesRunGetJobs = 0;
getJobs = () => {
    fetch('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators?businessId=2')
    .then(response => response.json())
    .then(data => {
        if (timesRunGetJobs > 0) {
            return;
        }
        timesRunGetJobs++;
        let jobs = data;
        const currentCalendar = document.getElementById('calendar_dayContainer');
        return jobs.map(function (job) {
            const jobInstallDate = new Date(job.installDate);
            const installElement = currentCalendar.querySelector(`[id='indicatorContainer${jobInstallDate.getMonth() + 1}-${jobInstallDate.getDate()}-${jobInstallDate.getFullYear()}']`);
            
            if (installElement !== null) {
                installElement.innerHTML += '<div class="dateNumber-indicator"></div>';
            }
        });
    });
    timesRunGetJobs = 0;
}