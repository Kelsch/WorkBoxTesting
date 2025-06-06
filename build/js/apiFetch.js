let token = localStorage.getItem('token');
const appTopBar = document.getElementById('app_topBar');
const darkModeCheckbox = appTopBar.querySelector('#darkMode-checkbox');
const darkModeSwitch = appTopBar.querySelector('#darkMode-switch');
const darkModeListItem = appTopBar.querySelector('#darkMode-liItem');
const dialog = document.getElementById('dialog_container');
// const fab = document.getElementById('fab_PORequest');
const fab = document.querySelector('.mdc-fab');
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
TextInputAnimation(document.getElementById('job-changeInstallDate-content'));
TextInputAnimation(document.getElementById('search_bar'));

const options = { focusInputAfterCloseModal: true, theme: 'crane-radius' };
const scheduleFromElement = document.querySelector('#job-changeInstallDate-scheduleFrom');
const myTimePickerFrom = new TimepickerUI(scheduleFromElement, options);
myTimePickerFrom.create();

const scheduleToElement = document.querySelector('#job-changeInstallDate-scheduleTo');
const myTimePickerTo = new TimepickerUI(scheduleToElement, options);
myTimePickerTo.create();

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

            const installMeetingDays = days.filter(day => day.installMeeting);
            installMeetingDays.forEach(installMeetingDay => {
                const installMeetingElement = currentCalendar.querySelector(`[id='${installMeetingDay.mm}-${installMeetingDay.dd}-${installMeetingDay.yy}']`);
                if (installMeetingElement !== null) {
                    installMeetingElement.classList.add('installerMeeting');
                }
            });

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

            getNewAssignedJobs();

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
                    installElement.innerHTML += `<div class="dateNumber-indicator${installColor}" data-jobid="${job.jobId}" data-orderid="${job.orderId}"></div>`;
                }

                let jobInstallDateRange;
                if (job.installDateRange != null) {
                    jobInstallDateRange = new Date(job.installDateRange.substring(0, job.installDateRange.indexOf('T')).replace(/-/g, '/'));

                    let datesBetween;
                    let startDate = new Date(job.installDate);
                    startDate.setDate(startDate.getDate() + 1);
                    let endDate = new Date(job.installDateRange);
                    datesBetween = getDatesBetweenDates(startDate, endDate);
                    
                    for (var i3 = 0; i3 < datesBetween.length; i3++) {
                        let dateBetween = datesBetween[i3];
                        
                        const installElementRange = currentCalendar.querySelector(`[id='indicatorContainer${dateBetween.getMonth() + 1}-${dateBetween.getDate()}-${dateBetween.getFullYear()}']`);
                        if (installElementRange !== null) {
                            const installColorRange = determineInstallColor(job.status);
                            installElementRange.innerHTML += `<div class="dateNumber-indicator${installColorRange}" data-jobid="${job.jobId}"></div>`;
                        }
                    }
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

function getDatesBetweenDates(start, end) {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    return arr;
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
                    return (job.installDate === selectedInstallDate) || (job.installDateRange >= selectedInstallDate && job.installDate <= selectedInstallDate);
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

async function getNewAssignedJobs() {
    let token = localStorage.getItem('token');
        fetch(`${apiURL}/api/installerAppData/getInstallerJobNotification?businessId=${cred.name}`, {
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
                const notificationMenu = document.getElementById("notification-menu");
                
                if (data.length > 0) {
                    let anyJobHasntBeenSeen = false;
                    for (let i = 0; i < data.length; i++) {
                        const job = data[i];
                        if (!job.hasBeenSeen && !anyJobHasntBeenSeen) {
                            anyJobHasntBeenSeen = !job.hasBeenSeen;
                        }
                    }
                    if (anyJobHasntBeenSeen) {
                        let notificationButtonElement = document.getElementById("app_topBar_notificationBell");
                        notificationButtonElement.innerHTML = "notifications";
                    }
                }

                data.forEach(job => {
                    let jobElement = document.createElement('li');
                    jobElement.classList.add("mdc-list-item");
                    jobElement.setAttribute('role', 'menuitem');

                    let jobInfoContainer = document.createElement('div');
                    jobInfoContainer.classList.add('notification-jobInfoContainer');
                    
                    let jobInfoName = document.createElement('span');
                    jobInfoName.classList.add('mdc-list-item__text');
                    jobInfoName.textContent = job.shopName;

                    let jobInfoInstallDate = document.createElement('span');
                    jobInfoInstallDate.classList.add('mdc-list-item__text');
                    jobInfoInstallDate.classList.add('secondary-text');
                    jobInfoInstallDate.textContent = new Date(job.installDate).toLocaleDateString();

                    jobInfoContainer.appendChild(jobInfoName);
                    jobInfoContainer.appendChild(jobInfoInstallDate);

                    jobElement.setAttribute('tabindex', -1);
                    jobElement.setAttribute('jobid', job.jobId);
                    jobElement.appendChild(jobInfoContainer);
                    jobElement.onclick = notificationJobClicked;
                    notificationMenu.appendChild(jobElement);
                });

                ListAnimation(document.getElementById("settings_menu"));
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

async function notificationJobClicked(event) {
    const installDate = this.querySelector(".secondary-text").innerHTML.replaceAll("/", "-");
    dateSelected(document.getElementById(installDate));
    jobClicked(this.getAttribute('jobid'));
}

async function updateNotificationJobs() {
    const cacheAvailable = 'caches' in self;
    if (!cacheAvailable && selectedInstallDate != null) {
        return;
    }
    const cacheName = 'job-notification-list';
    const request = new Request(`${apiURL}/api/installerAppData/getInstallerJobNotification?businessId=${cred.name}`);

    caches.open(cacheName).then(cache => {
        cache.match(request).then((response) => {
            if (response == undefined) {
                return;
            }
            
            response.json().then(jobs => {
                jobs.map(job => {
                    job.hasBeenSeen = true;
                });

                jsonJobs = JSON.stringify(jobs);

                cache.put(request, new Response(jsonJobs));

                let notificationButtonElement = document.getElementById("app_topBar_notificationBell");
                notificationButtonElement.innerHTML = "notifications_none";
            });
        });
    }).catch(err => {
        console.error(err)
    });

    let token = localStorage.getItem('token');
    fetch(`${apiURL}/api/installerAppData/putInstallerNotificationsSeen?businessId=${cred.name}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
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

                    if (jobUpdate.InstallCompletionJobId === undefined) {
                        if (job.jobId === jobUpdate.JobId) {
                            jobIndex = index;
                        }
                        return job.jobId === jobUpdate.JobId;
                    }

                    return job.jobId === jobUpdate.InstallCompletionJobId;
                });
                filteredJobs.map(fJob => {
                    fJob.docsUploaded = jobUpdate.docsUploaded ?? false;
                    fJob.readyForTemplate = jobUpdate.readyForTemplate ?? false;
                    fJob.returnTripRequired = jobUpdate.returnTripRequired ?? false;
                    fJob.installDateConfirmed = jobUpdate.installDateConfirmed ?? false;
                });

                if (jobUpdate.JobId !== undefined) {
                    filteredJobs.map(fJob => {
                        fJob.installDate = jobUpdate.InstallDate;
                        fJob.scheduledFrom = jobUpdate.ScheduledFrom;
                        fJob.scheduledTo = jobUpdate.ScheduledTo;
                    });
                }
                
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

async function postJobInstallDateTimeChange(installDateTimeChange) {
    const jobId = this.currentJobId;
    installDateTimeChange.JobId = jobId;
    installDateTimeChange.InstallDateChangeInstallerId = parseInt(cred.name);
    installDateTimeChange.DateWhenRequested = new Date().toLocalJSON().replace(/"/g, "");
    
    updateChangedJob(installDateTimeChange);
    let token = localStorage.getItem('token');

    fetch(`${apiURL}/api/installerAppData/postJobInstallDateTimeChange`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(installDateTimeChange)
    })
    .then(response => {
        if (response.status !== 200) {
            throw response;
        }
        
        const jobCardElement = document.getElementById('modalCard_job');
        const scheduleTimeElement = jobCardElement.querySelector('.job-datails.job-scheduledTime');

        // console.log(installDateTimeChange.ScheduledFrom === undefined)
    
        if (installDateTimeChange.ScheduledFrom !== undefined) {
            const scheduledFromDateTime = new Date(installDateTimeChange.ScheduledFrom.split('T')[0] + " " + installDateTimeChange.ScheduledFrom.split('T')[1].replace('T', '').replace('Z', ''));
            const newScheduledFrom = formatDateTime(scheduledFromDateTime);
            const scheduledToDateTime = new Date(installDateTimeChange.ScheduledTo.split('T')[0] + " " + installDateTimeChange.ScheduledTo.split('T')[1].replace('T', '').replace('Z', ''));
            const newScheduledTo = formatDateTime(scheduledToDateTime);
            scheduleTimeElement.innerHTML = `<span class="job-label">Scheduled Time:</span> ${newScheduledFrom} - ${newScheduledTo}`;
            
            showCalendar(scheduledFromDateTime.getMonth(), scheduledFromDateTime.getFullYear());
        }

        if (installDateTimeChange.ScheduledFrom === undefined) {
            const scheduledInstallDate = new Date(installDateTimeChange.InstallDate);
            showCalendar(scheduledInstallDate.getMonth(), scheduledInstallDate.getFullYear());
        }
        
        return response.json();
    })
    .catch(err => {
        if (parseInt(err.message) === 401) {
            login();
        }
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

function ListAnimation(container) {
    const listElement = container.querySelector('.mdc-list');
    if (typeof mdc !== 'undefined') {
        const list = mdc.list.MDCList.attachTo(listElement);
        const listItemRipples = list.listElements.map((listItemEl) => mdc.ripple.MDCRipple.attachTo(listItemEl));
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
            
            if (element.parentElement.id === "settings_menu") {
                const btnSettings = container.querySelector('.settings-button');
                btnSettings.addEventListener('click', async () => {
                    menu.open = !menu.open;

                    await sleep(100);
                    element.style.top = '10px';
                    element.style.right = '10px';
                });
            }

            if (element.parentElement.id === "notification_menu") {
                const btnNotificationBell = container.querySelector('.notificationBell-button');
                btnNotificationBell.addEventListener('click', async () => {
                    menu.open = !menu.open;

                    await sleep(100);
                    element.style.top = '10px';
                    element.style.left = '10px';

                    updateNotificationJobs();
                });
            }
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

                            if (mdcDialog.parentElement.getAttribute('id') == "g") {
                                document.activeElement.blur();

                                const jobInstallDate = new Date(currentJob.installDate);
                                const installDateElement = list.root_.querySelector('#job-changeInstallDate-installDate');
                                let mdcTextInstallDateInput = new mdc.textField.MDCTextField(installDateElement);
                                mdcTextInstallDateInput.value = `${jobInstallDate.getMonth() + 1}/${jobInstallDate.getDate()}/${jobInstallDate.getFullYear()}`;
                                if (currentJob.scheduledFrom != null) {
                                    const scheduledFromElement = list.root_.querySelector('#job-changeInstallDate-scheduleFrom');
                                    let mdcTextScheduleFromInput = new mdc.textField.MDCTextField(scheduledFromElement);
                                    const scheduledFromDateTime = new Date(currentJob.scheduledFrom);
                                    
                                    mdcTextScheduleFromInput.value = formatAMPM(scheduledFromDateTime);
                                }
                                if (currentJob.scheduledTo != null) {
                                    const scheduledToElement = list.root_.querySelector('#job-changeInstallDate-scheduleTo');
                                    let mdcTextScheduleToInput = new mdc.textField.MDCTextField(scheduledToElement);
                                    const scheduledToDateTime = new Date(currentJob.scheduledTo);
                                    
                                    mdcTextScheduleToInput.value = formatAMPM(scheduledToDateTime);
                                }

                                if (currentJob.scheduledFrom != null && currentJob.scheduledTo == null) {
                                    const scheduledToElement = list.root_.querySelector('#job-changeInstallDate-scheduleTo');
                                    let mdcTextScheduleToInput = new mdc.textField.MDCTextField(scheduledToElement);
                                    let scheduledToDateTime = new Date(currentJob.scheduledFrom);
                                    scheduledToDateTime.setHours(scheduledToDateTime.getHours() + 4);

                                    mdcTextScheduleToInput.value = formatAMPM(scheduledToDateTime);
                                }

                                if (currentJob.scheduledFrom == null && currentJob.scheduledTo != null) {
                                    const scheduledFromElement = list.root_.querySelector('#job-changeInstallDate-scheduleFrom');
                                    let mdcTextScheduleFromInput = new mdc.textField.MDCTextField(scheduledFromElement);
                                    let scheduledFromDateTime = new Date(currentJob.scheduledTo);
                                    scheduledFromDateTime.setHours(scheduledFromDateTime.getHours() - 4);

                                    mdcTextScheduleFromInput.value = formatAMPM(scheduledFromDateTime);
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

                if (mdcDialog.parentElement.getAttribute('id') == "app_changeinstalldate_dialog") {
                    const installDateElement = list.root_.querySelector('#job-changeInstallDate-installDate');
                    let mdcTextInstallDateInput = new mdc.textField.MDCTextField(installDateElement);

                    const scheduledFromElement = list.root_.querySelector('#job-changeInstallDate-scheduleFrom');
                    let mdcTextScheduleFromInput = new mdc.textField.MDCTextField(scheduledFromElement);

                    const scheduledToElement = list.root_.querySelector('#job-changeInstallDate-scheduleTo');
                    let mdcTextScheduleToInput = new mdc.textField.MDCTextField(scheduledToElement);

                    const noteElement = list.root_.querySelector('#job-changeInstallDate-note');
                    let mdcTextNoteInput = new mdc.textField.MDCTextField(noteElement);

                    if (event.detail.action == "accept") {
                        let installDateTimeChange = {};
                        installDateTimeChange['InstallDate'] = mdcTextInstallDateInput.value;
                        if (mdcTextScheduleFromInput.value != '') {
                            installDateTimeChange['ScheduledFrom'] = new Date(installDateTimeChange['InstallDate'] + " " + formatTwentyFourHour(mdcTextScheduleFromInput.value)).toLocalJSON().replace(/"/g, "");
                        }
                        if (mdcTextScheduleToInput.value != '') {
                            installDateTimeChange['ScheduledTo'] = new Date(installDateTimeChange['InstallDate'] + " " + formatTwentyFourHour(mdcTextScheduleToInput.value)).toLocalJSON().replace(/"/g, "");
                        }
                        if (mdcTextNoteInput.value != '') {
                            installDateTimeChange['Note'] = mdcTextNoteInput.value;
                        }
                        if (installDateTimeChange != null) {
                            postJobInstallDateTimeChange(installDateTimeChange);
                            history.back();
                        }
                    }
                    else {
                        mdcTextInstallDateInput.value = ``;
                        mdcTextScheduleFromInput.value = '';
                        mdcTextScheduleToInput.value = '';
                        mdcTextNoteInput.value = '';
                    }
                }

                if (mdcDialog.parentElement.getAttribute('id') == "app_search_dialog") {
                    if (event.detail.action == "accept") {
                        history.back();
                    }
                    else {
                        
                    }
                }
            });

            dialog.listen('MDCDialog:closed', event => {
                if (event.detail.action == 'close') {
                    history.back();
                }
            });

            if (mdcDialog.parentElement.getAttribute('id') == "app_porequest_dialog") {
                window.dialogPORequest = dialog;
            }
            if (mdcDialog.parentElement.getAttribute('id') == "app_done_dialog") {
                window.dialog = dialog;
            }
            if (mdcDialog.parentElement.getAttribute('id') == "app_changeinstalldate_dialog") {
                window.dialogChangeInstallDate = dialog;
            }
            if (mdcDialog.parentElement.getAttribute('id') == "app_search_dialog") {
                window.dialogSearchJobs = dialog;
            }
        }
    }
}

async function CustomEventAfterOk(event) {
    const scheduledFromElement = document.querySelector('#job-changeInstallDate-scheduleFrom');
    const mdcTextScheduleFromInput = new mdc.textField.MDCTextField(scheduledFromElement);

    const scheduledToElement = document.querySelector('#job-changeInstallDate-scheduleTo');
    const mdcTextScheduleToInput = new mdc.textField.MDCTextField(scheduledToElement);

    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    if (event._element.id.includes('scheduleFrom')) {
        if (mdcTextScheduleToInput.value == '') {
            today.setHours(formatTwentyFourHour(mdcTextScheduleFromInput.value).split(':')[0]);
            today.setMinutes(formatTwentyFourHour(mdcTextScheduleFromInput.value).split(':')[1]);
            let scheduledTo = today;
            scheduledTo.setHours(scheduledTo.getHours() + 4);
            mdcTextScheduleToInput.value = formatAMPM(scheduledTo);
        }
    }
    if (event._element.id.includes('scheduleTo')) {
        if (mdcTextScheduleFromInput.value == '') {
            today.setHours(formatTwentyFourHour(mdcTextScheduleToInput.value).split(':')[0]);
            today.setMinutes(formatTwentyFourHour(mdcTextScheduleToInput.value).split(':')[1]);
            let scheduledFrom = today;
            scheduledFrom.setHours(scheduledFrom.getHours() - 4);
            mdcTextScheduleFromInput.value = formatAMPM(scheduledFrom);
        }
    }

    let fromTime = new Date();
    fromTime.setHours(formatTwentyFourHour(mdcTextScheduleFromInput.value).split(':')[0]);
    fromTime.setMinutes(formatTwentyFourHour(mdcTextScheduleFromInput.value).split(':')[1]);

    let toTime = new Date();
    toTime.setHours(formatTwentyFourHour(mdcTextScheduleToInput.value).split(':')[0]);
    toTime.setMinutes(formatTwentyFourHour(mdcTextScheduleToInput.value).split(':')[1]);
    
    if (fromTime > toTime) {
        today.setHours(formatTwentyFourHour(mdcTextScheduleFromInput.value).split(':')[0]);
        today.setMinutes(formatTwentyFourHour(mdcTextScheduleFromInput.value).split(':')[1]);
        let scheduledTo = today;
        scheduledTo.setHours(scheduledTo.getHours() + 4);
        mdcTextScheduleToInput.value = formatAMPM(scheduledTo);
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