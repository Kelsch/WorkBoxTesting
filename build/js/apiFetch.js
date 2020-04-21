let token = localStorage.getItem('token');

TextInputAnimation(document.getElementById('app_loginForm'));
ButtonAnimation(document.getElementById('app_loginForm'));

function getNonWorkDays() {
    fetch(`${apiURL}/api/installerAppData/getNonWorkDays`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
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
async function getJobs(month, year) {
    fetch(`${apiURL}/api/installerAppData/getInstallIndicators?businessId=${cred.name}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
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
                    const installColor = determineInstallColor(job.status);

                    installElement.innerHTML += `<div class="dateNumber-indicator${installColor}" data-jobid="${job.jobId}"></div>`;
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
    // const request = new Request(`https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators?businessId=2`);
    const request = new Request(`${apiURL}/api/installerAppData/getInstallIndicators?businessId=${cred.name}`);

    const jobDiv = document.getElementById('jobs');

    caches.open(cacheName).then(cache => {
        cache.match(request).then((response) => {
            if (response == undefined) {
                return;
            }
            response.json().then(jobs => {
                jobDiv.innerHTML = '';
                const filteredJobs = jobs.filter(job => {
                    return job.installDate === selectedInstallDate;
                });
                filteredJobs.map(fJob => {
                    const installColor = determineInstallColor(fJob.status);

                    const buttonHtml = `<button class="mdc-button mdc-button--unelevated${installColor}" jobid="${fJob.jobId}" onclick="jobClicked('${fJob.jobId}')">
                                            <div class="mdc-button__ripple"></div>
                                            <span class="mdc-button__label">
                                                ${fJob.name}: ${fJob.cabinetCount}
                                            </span>
                                        </button>`;

                    jobDiv.innerHTML += buttonHtml;
                });

                let jobIdList = [];
                for (let i = 0; i < filteredJobs.length; i++) {
                    const job = filteredJobs[i];
                    jobIdList = [...jobIdList, job.jobId];
                }
                getDesignSets(jobIdList);
                getLayouts(jobIdList);
                ButtonAnimation(jobDiv);
            });
        });
    }).catch(err => {
        console.error(err)
    });
}

async function getDesignSets(jobIds) {
    window.currentJobIds = jobIds;
    fetch(`${apiURL}/api/installerAppData/getInstallJobsDesignSets?jobIdStrings=${jobIds.toString()}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json());
}

async function getLayouts(jobIds) {
    if (jobIds !== null) {
        fetch(`${apiURL}/api/installerAppData/getJobsLayouts?jobIdStrings=${jobIds.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .catch(err => {
                console.error(err)
            });
    }
}

function ButtonAnimation(container) {
    const buttons = container.querySelectorAll('.mdc-button');
    if (typeof mdc !== 'undefined') {
        for (let i = 0; i < buttons.length; i++) {
            const element = buttons[i];
            mdc.ripple.MDCRipple.attachTo(element);
        }
    }
}

function TextInputAnimation(container) {
    const  inputs = container.querySelectorAll('.mdc-text-field');
    if (typeof mdc !== 'undefined') {
        for (let i = 0; i < inputs.length; i++) {
            const element = inputs[i];
            mdc.textField.MDCTextField.attachTo(element);
        }
    }
}

function determineInstallColor(jobStatus) {
    let installColor;

    switch (jobStatus) {
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

    return installColor;
}