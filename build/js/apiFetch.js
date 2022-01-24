let token = localStorage.getItem('token');
const appTopBar = document.getElementById('app_topBar');
const darkModeCheckbox = appTopBar.querySelector('#darkMode-checkbox');
const darkModeSwitch = appTopBar.querySelector('#darkMode-switch');
const darkModeListItem = appTopBar.querySelector('#darkMode-liItem');
const dialog = document.getElementById('dialog_container');
// const fab = document.getElementById('fab_PORequest');
const fab = document.querySelector('.mdc-fab');
// const poRequstDialog = document.getElementById('app_porequest_dialog');
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
FabButtonAnimation(fab);
IconButtonAnimation(appTopBar);
MenuAnimation(appTopBar);
CheckboxAnimation(appTopBar);
SwitchAnimation(appTopBar);
DialogAnimation(dialog);
TextInputAnimation(document.getElementById('job-poRequest-content'));

function getNonWorkDays() {
    let token = localStorage.getItem('token');
    fetch(`${apiURL}/api/installerAppData/getNonWorkDays`, {
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
        .then(data => {
            const today = new Date(new Date().setHours(0, 0, 0, 0));
            let days = data;
            const currentCalendar = document.getElementById('calendar_dayContainer');

            let sixthDay = days.filter(day => new Date(day.dateId) >= today && day.isWorkDay)[6];

            const sixthDayElement = currentCalendar.querySelector(`[id='${sixthDay.mm}-${sixthDay.dd}-${sixthDay.yy}']`);
            if (sixthDayElement !== null) {
                sixthDayElement.classList.add('sixthDayCallout');
            }

            return days.map(function (day) {
                const dateElement = currentCalendar.querySelector(`[id='${day.mm}-${day.dd}-${day.yy}']`);
                if (dateElement !== null && !day.isWorkDay) {
                    dateElement.classList.add('calendar-nonWorkDay');
                }
            });
        })
        .catch(err => {
            if (parseInt(err.message) === 401) {
                login();
            }
            else {
                // logout();
            }
        });
}

let timesRunGetJobs = 0;
async function getJobs(month, year) {
    let token = localStorage.getItem('token');
    fetch(`${apiURL}/api/installerAppData/getInstallIndicators?businessId=${cred.name}`, {
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

            // Get design sets and layouts for every job in the month LIMITED TO 55 AT A TIME
            window.jobIdLists = [];
            let jobIdList = [];
            let timesReset = 0;
            for (let i = 0; i < filteredJobs.length; i++) {
                const job = filteredJobs[i];
                jobIdList = [...jobIdList, job.jobId];


                if (jobIdList.length / 5 == 11 || (((timesReset * 55) - filteredJobs.length) * -1 < 55 && (((timesReset * 55) - filteredJobs.length) * -1 > -1 && filteredJobs.length - 1 == i))) {
                    window.jobIdLists = [...window.jobIdLists, jobIdList];
                    getDesignSets(jobIdList);
                    getLayouts(jobIdList);

                    jobIdList = [];
                    timesReset++;
                }
            }
        })
        .catch(err => {
            console.error(err);
            if (parseInt(err.message) === 401) {
                login();
            }
            else {
                // logout();
            }
        });
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
                                            ${fJob.hasHomeOwner ? '<i class="material-icons mdc-button__icon" aria-hidden="true">home</i>' : ''}
                                            <span class="mdc-button__label">
                                                ${fJob.name}: ${fJob.cabinetCount} ${fJob.scheduledFrom != null ? '- Scheduled Time' : ''}
                                            </span>
                                            <i class="material-icons mdc-button__icon" aria-hidden="true">${fJob.installDateConfirmed ? 'check_circle_outline' : 'radio_button_unchecked'}</i>
                                        </button>`;

                    jobDiv.innerHTML += buttonHtml;
                });

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
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.status);
            }

            return response.json();
        })
        .catch(err => {
            if (parseInt(err.message) === 401) {
                login();
            }
            else {
                // logout();
            }
        });
}

async function getLayouts(jobIds) {
    if (jobIds !== null) {
        if (jobIds.length <= 0) {
            return;
        }
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
                if (parseInt(err.message) === 401) {
                    login();
                }
                else {
                    // logout();
                }
            });
    }
}

async function jobToggleInstallConfirmation(jobId) {
    if (jobId != null) {
        let button = body.querySelector('.job-button[data-buttontype="dateConfirmed"]');
        let installDateConfirmed = button.getAttribute('title') != "true";
        let token = localStorage.getItem('token');
        let installCompletion = {};
        installCompletion.InstallCompletionJobId = jobId;
        installCompletion.InstallCompletionInstallerId = parseInt(cred.name);
        installCompletion.installDateConfirmed = installDateConfirmed;

        let buttonIcon = button.querySelector('.material-icons');
        buttonIcon.innerHTML = installDateConfirmed ? "check_circle_outline" : "radio_button_unchecked";
        button.setAttribute('title', installDateConfirmed);
        // console.log(button.getAttribute('title'), buttonIcon.innerHTML)
        updateChangedJob(installCompletion);

        fetch(`${apiURL}/api/installerAppData/postJobToggleInstallConfirmation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(jobId)
        })
            .then(response => {
                if (response.status !== 200) {
                    throw response;
                }

                return response.json();
            })
            .catch(err => {
                console.error(err)
                if (parseInt(err.message) === 401) {
                    login();
                }
                return err;
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

        updateChangedJob(installCompletion);

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
                console.error(err)
                if (parseInt(err.message) === 401) {
                    login();
                }
            });
    }
}

async function postPORequest(installPORequest) {
    const jobId = this.currentJobId;
    installPORequest.InstallerPORequestJobId = jobId;
    installPORequest.PORequestInstallerId = parseInt(cred.name);
    installPORequest.DateRequested = new Date().toLocalJSON().replace(/"/g, "");
    console.log(installPORequest)

    let token = localStorage.getItem('token');

    fetch(`${apiURL}/api/installerAppData/postJobInstallPORequest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(installPORequest)
    })
        .then(response => {
            if (response.status !== 200) {
                throw response;
            }

            return response.json();
        })
        .catch(err => {
            if (parseInt(err.message) === 401) {
                login();
            }
        });
}

async function updateChangedJob(jobUpdate) {
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
                let jobIndex = 0;
                const filteredJobs = jobs.filter((job, index) => {
                    if (job.jobId === jobUpdate.InstallCompletionJobId) {
                        jobIndex = index;
                    }
                    return job.jobId === jobUpdate.InstallCompletionJobId;
                });
                filteredJobs.map(fJob => {
                    fJob.docsUploaded = jobUpdate.docsUploaded ?? false;
                    fJob.readyForTemplate = jobUpdate.readyForTemplate ?? false;
                    fJob.returnTripRequired = jobUpdate.returnTripRequired ?? false;
                    fJob.installDateConfirmed = jobUpdate.installDateConfirmed ?? false;
                });

                jobs[jobIndex] = filteredJobs[0];
                jsonJobs = JSON.stringify(jobs);

                cache.put(request, new Response(jsonJobs));

                dateSelected(document.querySelector('.calendar-selectedDate'));
            });
        });
    }).catch(err => {
        console.error(err)
    });
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

function FabButtonAnimation(fab) {
    if (typeof mdc !== 'undefined') {
        mdc.ripple.MDCRipple.attachTo(fab);

        fab.addEventListener('click', async () => {
            createPORequest();
        });
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

        for (const mdcDialog of container.querySelectorAll('.mdc-dialog')) {
            const dialog = mdc.dialog.MDCDialog.attachTo(mdcDialog);
            const list = mdc.list.MDCList.attachTo(mdcDialog.querySelector('.mdc-dialog .mdc-list'));

            dialog.listen('MDCDialog:opened', (dialogElement) => {
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
                            if (mdcDialog.parentElement.getAttribute('id') == "app_porequest_dialog") {
                                for (let index = 0; index < list.root_.children.length; index++) {
                                    const element = list.root_.children[index];

                                    if (element.getAttribute('data-input-type') == "checkbox") {
                                        element.querySelector('#salesrep-confirmed-checkbox').checked = false;
                                    }
                                    if (element.getAttribute('data-input-type') == "text" || element.getAttribute('data-input-type') == "number") {
                                        element.querySelector('.mdc-floating-label').classList.remove('mdc-floating-label--float-above');
                                        element.querySelector('.mdc-text-field__input').value = null;
                                        element.classList.remove('mdc-text-field--label-floating');
                                    }
                                }
                            }

                            if (currentJob === null) {
                                let selectedBoxes = [];
                                for (let i = 0; i < list.listElements.length; i++) {
                                    const element = list.listElements[i];
                                    let dataName = '';
                                    if (mdcDialog.parentElement.getAttribute('id') == "app_done_dialog") {
                                        dataName = 'data-install-complete';
                                    }
                                    const attributeTrue = element.getAttribute('data-input-type') == 'checkbox' ? currentJob[element.getAttribute(dataName)] ?? false : false;
                                    if (attributeTrue) {
                                        selectedBoxes = [...selectedBoxes, i];
                                    }
                                }
                                if (selectedBoxes.length > 0) {
                                    list.selectedIndex = selectedBoxes;
                                }
                                list.layout();
                            }
                        });
                    });
                }).catch(err => {
                    console.error(err)
                });
            });

            dialog.listen('MDCDialog:closing', event => {
                if (mdcDialog.parentElement.getAttribute('id') == "app_porequest_dialog") {
                    if (event.detail.action == "accept") {
                        let installPORequest = {};

                        for (let i = 0; i < list.root_.children.length; i++) {
                            const listElement = list.root_.children[i];
                            if (listElement.getAttribute('data-input-type') == "checkbox") {
                                installPORequest[`${listElement.getAttribute('data-install-porequest')}`] = listElement.querySelector('#salesrep-confirmed-checkbox').checked;
                            }
                            if (listElement.getAttribute('data-input-type') == "text" || listElement.getAttribute('data-input-type') == "number") {
                                const elementValue = listElement.querySelector('.mdc-text-field__input').value;

                                installPORequest[`${listElement.getAttribute('data-install-porequest')}`] = listElement.getAttribute('data-input-type') == "number" ? parseFloat(elementValue) || 0 : elementValue;
                            }
                        }

                        if (installPORequest != null) {
                            if (installPORequest.poRequestReason == "" || installPORequest.jobDescriptor == "") {
                                alert('Reason or Job Name missing');
                                return;
                            }
                            postPORequest(installPORequest);
                        }
                    }
                }
                if (mdcDialog.parentElement.getAttribute('id') == "app_done_dialog") {
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
                }
            });

            if (mdcDialog.parentElement.getAttribute('id') == "app_porequest_dialog") {
                window.dialogPORequest = dialog;
            }
            if (mdcDialog.parentElement.getAttribute('id') == "app_done_dialog") {
                window.dialog = dialog;
            }
        }
    }
}

async function OpenMaps(place, specificPlace) {
    let setLocation;

    if (!isEmptyOrSpaces(specificPlace) && specificPlace.length >= 5 && specificPlace !== 'undefined') {
        setLocation = specificPlace;
    }
    else {
        setLocation = place;
    }

    if (!isEmptyOrSpaces(setLocation) && setLocation.length >= 5 && setLocation !== 'undefined') {
        if (confirm("Open Location in Map?", place, "Yes", "No")) {
            if ((navigator.platform.indexOf('iPhone') != -1) || (navigator.platform.indexOf('iPad') != -1) || (navigator.platform.indexOf('iPod') != -1)) {/* if we're on iOS, open in Apple Maps */
                window.open('http://maps.apple.com/?q=' + setLocation);
            } else { /* else use Google */
                window.open('https://maps.google.com/maps?q=' + setLocation);
            }
        }
    }
}

async function OpenPhoneNumber(phoneNumber) {
    if (isEmptyOrSpaces(phoneNumber)) {
        return;
    }

    if (confirm("Open Phone Number?", phoneNumber, "Yes", "No")) {
        window.open('tel:' + phoneNumber);
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

function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}