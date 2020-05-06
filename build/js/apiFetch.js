let token = localStorage.getItem('token');
const appTopBar = document.getElementById('app_topBar');
const darkModeCheckbox = appTopBar.querySelector('#darkMode-checkbox');
const darkModeSwitch = appTopBar.querySelector('#darkMode-switch');
const darkModeListItem = appTopBar.querySelector('#darkMode-liItem');
const dialog = document.getElementById('app_done_dialog');
const body = document.body;

// Get user's current theme
const theme = localStorage.getItem('theme');
if (theme) {
    body.classList.add(theme);
    darkModeSwitch.checked = theme == 'dark' ? true : false;
}

const sleep = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

TextInputAnimation(document.getElementById('app_loginForm'));
ButtonAnimation(document.getElementById('app_loginForm'));
IconButtonAnimation(appTopBar);
MenuAnimation(appTopBar);
CheckboxAnimation(appTopBar);
SwitchAnimation(appTopBar);
DialogAnimation(dialog);

function getNonWorkDays() {
    let token = localStorage.getItem('token');
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
        })
        .catch(() => logout());
}

let timesRunGetJobs = 0;
async function getJobs(month, year) {
    let token = localStorage.getItem('token');
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
                const jobInstallDate = new Date(job.installDate.substring(0, job.installDate.indexOf('T')).replace(/-/g, '/'));
                const installElement = currentCalendar.querySelector(`[id='indicatorContainer${jobInstallDate.getMonth() + 1}-${jobInstallDate.getDate()}-${jobInstallDate.getFullYear()}']`);
                if (installElement !== null) {
                    const installColor = determineInstallColor(job.status);
                    installElement.innerHTML += `<div class="dateNumber-indicator${installColor}" data-jobid="${job.jobId}"></div>`;
                }
            });
        })
        .catch(() => logout());
    timesRunGetJobs = 0;
}

async function findSelectedDateJobs(selectedInstallDate) {
    const cacheAvailable = 'caches' in self;
    if (!cacheAvailable && selectedInstallDate != null) {
        return;
    }
    const cacheName = 'job-list';
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
    if (jobIds.length <= 0) {
        return;
    }
    let token = localStorage.getItem('token');
    fetch(`${apiURL}/api/installerAppData/getInstallJobsDesignSets?jobIdStrings=${jobIds.toString()}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .catch(err => logout());
}

async function getLayouts(jobIds) {
    // if (jobIds.length <= 0) {
    //     return;
    // }
    if (jobIds !== null) {
        let token = localStorage.getItem('token');
        fetch(`${apiURL}/api/installerAppData/getJobsLayouts?jobIdStrings=${jobIds.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(response.status);
                }

                return response.json();
            })
            .catch(err => {
                logout();
            });
    }
}

async function postJobCompletion(installCompletion) {
    const jobId = this.currentJobId;
    installCompletion.InstallCompletionJobId = jobId;
    installCompletion.InstallCompletionInstallerId = parseInt(cred.name);
    installCompletion.DateCompleted = new Date().toLocalJSON().replace(/"/g, "");
    if (jobId != null) {
        let token = localStorage.getItem('token');
        fetch(`${apiURL}/api/installerAppData/postJobInstallCompletion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(installCompletion)
        })
            .then(response => {
                if (response.status !== 200) {
                    throw response;
                }
                
                return response.json();
            })
            .catch(err => {
                if (err.status === 401) {
                    logout();
                }
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

function IconButtonAnimation(container) {
    const buttons = container.querySelectorAll('.mdc-icon-button');
    if (typeof mdc !== 'undefined') {
        for (let i = 0; i < buttons.length; i++) {
            const element = buttons[i];
            const rippleIcon = mdc.ripple.MDCRipple.attachTo(element);
            rippleIcon.unbounded = true;
        }
    }
}

function MenuAnimation(container) {
    const buttons = container.querySelectorAll('.mdc-menu');

    if (typeof mdc !== 'undefined') {
        for (let i = 0; i < buttons.length; i++) {
            const element = buttons[i];
            const menu = mdc.menu.MDCMenu.attachTo(element);

            const btn = container.querySelector('.settings-button');
            btn.addEventListener('click', async () => {
                menu.open = !menu.open;

                await sleep(100);
                element.style.top = '10px';
                element.style.right = '10px';
            });
        }
    }
}

function CheckboxAnimation(container) {
    const buttons = container.querySelectorAll('.mdc-checkbox');
    if (typeof mdc !== 'undefined') {
        for (let i = 0; i < buttons.length; i++) {
            const element = buttons[i];
            const ckbx = mdc.checkbox.MDCCheckbox.attachTo(element);
        }
    }
}

function SwitchAnimation(container) {
    const switches = container.querySelectorAll('.mdc-switch');
    if (typeof mdc !== 'undefined') {
        for (let i = 0; i < switches.length; i++) {
            const element = switches[i];
            const switchMDC = mdc.switchControl.MDCSwitch.attachTo(element);
        }
    }
}

function TextInputAnimation(container) {
    const inputs = container.querySelectorAll('.mdc-text-field');
    if (typeof mdc !== 'undefined') {
        for (let i = 0; i < inputs.length; i++) {
            const element = inputs[i];
            mdc.textField.MDCTextField.attachTo(element);
        }
    }
}

function DialogAnimation(container) {
    if (typeof mdc !== 'undefined') {
        const dialog = mdc.dialog.MDCDialog.attachTo(container.querySelector('.mdc-dialog'));
        const list = mdc.list.MDCList.attachTo(container.querySelector('.mdc-dialog .mdc-list'));

        dialog.listen('MDCDialog:opened', () => {
            const cacheAvailable = 'caches' in self;
            if (!cacheAvailable) {
                return;
            }
            const cacheName = 'job-list';
            const request = new Request(`${apiURL}/api/installerAppData/getInstallIndicators?businessId=${cred.name}`);
            let currentJob;
            caches.open(cacheName).then(cache => {
                cache.match(request).then((response) => {
                    if (response == undefined) {
                        return;
                    }
                    response.json().then(jobs => {
                        const filteredJobs = jobs.filter(job => {
                            return job.jobId === window.currentJobId;
                        });
                        currentJob = filteredJobs[0];
                        let selectedBoxes = [];
                        for (let i = 0; i < list.listElements.length; i++) {
                            const element = list.listElements[i];
                            const attributeTrue = currentJob[element.getAttribute('data-install-complete')] ?? false;
                            if (attributeTrue) {
                                selectedBoxes = [...selectedBoxes, i];
                            }
                        }
                        list.selectedIndex = selectedBoxes;
                        list.layout();
                    });
                });
            }).catch(err => {
                console.error(err)
            });
        });

        dialog.listen('MDCDialog:closing', event => {
            if (event.detail.action == "accept") {
                let installCompletion = {};
                for (let i = 0; i < list.selectedIndex.length; i++) {
                    const selectedIndex = list.selectedIndex[i];
                    const element = list.listElements[selectedIndex];
                    installCompletion[`${element.getAttribute('data-install-complete')}`] = true;
                }
                if (installCompletion != null) {
                    postJobCompletion(installCompletion);
                }
            }
        });

        window.dialog = dialog;
    }
}

async function darkModeCheck() {
    const themeStyle = darkModeSwitch.parentElement.parentElement.classList.contains('mdc-switch--checked') ? 'light' : 'dark';
    if (themeStyle == 'dark') {
        body.classList.replace('light', 'dark');
    }
    else {
        body.classList.replace('dark', 'light');
    }
    localStorage.setItem('theme', themeStyle);
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