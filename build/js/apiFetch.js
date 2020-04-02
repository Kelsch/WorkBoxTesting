function getNonWorkDays() {
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
function getJobs(month, year) {
    fetch('https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators?businessId=2')
        .then(response => response.json())
        .then(data => {
            if (timesRunGetJobs > 0) {
                return;
            }
            timesRunGetJobs++;
            let jobs = data;
            const currentCalendar = document.getElementById('calendar_dayContainer');

            year = month - 1 == -1 ? year - 1 : year;
            month = month - 1 == -1 ? 12 : month - 1;
            const selectedInstallMonth = new Date(year, month - 1, 1);
            
            const filteredJobs = jobs.filter(job => {
                let jobInstallDate = new Date(job.installDate);
                return jobInstallDate >= selectedInstallMonth;
            });

            filteredJobs.map(function (job) {
                const jobInstallDate = new Date(job.installDate);
                const installElement = currentCalendar.querySelector(`[id='indicatorContainer${jobInstallDate.getMonth() + 1}-${jobInstallDate.getDate()}-${jobInstallDate.getFullYear()}']`);
                if (installElement !== null) {
                    let installColor;

                    switch (job.status) {
                        case 60:
                        case 63:
                        case 65:
                        case 70:
                            installColor = ' indicator-notReady';
                            break;
                        case 73:
                            installColor = ' indicator-onRoute';
                            break;
                        case 80:
                            installColor = ' indicator-ready';
                            break;
                        case 90:
                        case 100:
                            installColor = ' indicator-installed';
                            break;
                        case 110:
                            installColor = ' indicator-complete';
                            break;
                        default:
                            installColor = ' indicator-notReady';
                            break;
                    }

                    installElement.innerHTML += `<div class="dateNumber-indicator${installColor}"></div>`;
                }
            });
        });
    timesRunGetJobs = 0;
}

async function findSelectedDateJobs(selectedInstallDate) {
    const cacheAvailable = 'caches' in self;
    if (!cacheAvailable && selectedInstallDate != null) {
        return;
    }
    const cacheName = 'job-list';
    const request = new Request(`https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators?businessId=2`);

    const ul = document.getElementById('jobs');

    caches.open(cacheName).then(cache => {
        cache.match(request).then((response) => {
            response.json().then(jobs => {
                ul.innerHTML = '';
                const filteredJobs = jobs.filter(job => {
                    return job.installDate === selectedInstallDate;
                });
                // console.log(jobs, filteredJobs, selectedInstallDate)
                filteredJobs.map(fJob => {
                    let li = createNode('li')
                    span = createNode('span');

                    li.innerHTML = fJob.name;
                    span.innerHTML = fJob.orderId;

                    append(li, span);
                    append(ul, li);
                });

                // const test = jobs.map(function (job) {
                //     return job.installDate === selectedInstallDate;
                // });
                // console.log(test)
            });
        });
    }).catch(err => {
        console.error(err)
    });
}