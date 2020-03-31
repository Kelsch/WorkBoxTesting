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

getJobs = () => {
    fetch('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators?businessId=2')
    .then(response => response.json())
    .then(data => {
        let jobs = data;
        // const jobInstallDate = new Date(jobs[0].installDate);
        // console.log(jobs, jobs[0].installDate, jobInstallDate.getDate())
        const currentCalendar = document.getElementById('calendar_dayContainer');
        return jobs.map(function (job) {
            const jobInstallDate = new Date(job.installDate);
            const installElement = currentCalendar.querySelector(`[id='indicatorContainer${jobInstallDate.getMonth() + 1}-${jobInstallDate.getDate()}-${jobInstallDate.getFullYear()}']`);
            if (installElement !== null) {
                // console.log(job, installElement);
                installElement.innerHTML += '<div class="dateNumber-indicator"></div>';
            }
        });
    });
}