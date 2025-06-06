const jobModal = document.getElementById("modalCard_job");
const designSetModal = document.getElementById("modalCard_designSetInfo");
const layoutModal = document.getElementById("modalCard_layout");

let hiddenModals = document.getElementsByClassName('modal-card-container-tint');
let resizable, resizer, startY, startHeight;

let initDrag = function (e) {
    resizable = this.parentElement;

    startY = e.clientY || e.targetTouches[0].pageY;

    startHeight = parseInt(document.defaultView.getComputedStyle(resizable).height, 10);

    if (e.type == 'touchstart') {
        document.querySelector('.list-jobs').classList.add('stopScroll');

        document.documentElement.addEventListener('touchmove', doDrag, false);
        document.documentElement.addEventListener('touchstop', stopDrag, false);
    }
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
}

function doDrag(e) {
    if (!e.target.classList.contains('modal-jobName') && (e.type == "mousemove" || e.type == "touchmove") && typeof window.orientation != 'undefined') {
        return;
    }
    let clientY = e.clientY || e.targetTouches[0].clientY;
    resizable.style.height = (startHeight - clientY + startY) + 'px';
    if (resizable.classList.contains('modal-card-sub')) {
        const productContainers = resizable.querySelectorAll('.designSet-product-container');
        const designSetInfoContainer = resizable.querySelector('.modal-designSet-container');
        for (let i = 0; i < productContainers.length; i++) {
            const products = productContainers[i];
            products.style.height = (startHeight - clientY + startY) - designSetInfoContainer.clientHeight + 'px';
        }
    }
    if ((startHeight - clientY + startY) <= 65) {
        resetModal();
    }
}

function stopDrag() {
    document.documentElement.removeEventListener('mousemove', doDrag, {passive: true});
    document.documentElement.removeEventListener('mouseup', stopDrag, {passive: true});
    document.documentElement.removeEventListener('touchmove', doDrag, {passive: true});
    document.documentElement.removeEventListener('touchstop', stopDrag, {passive: true});
}

function resetModal() {
    resizable.parentElement.classList.remove('modal-card-container-show')
    resizable.style.height = 400 + 'px';

    if (resizable.classList.contains('modal-card-sub')) {
        resizable.style.height = 370 + 'px';
    }
    
    history.back();

    document.querySelector('.list-jobs').classList.remove('stopScroll');
    
    stopDrag();

    let remainingModal = document.querySelector('.modal-card-container-show');
    if (remainingModal !== null) {
        resizable = remainingModal.querySelector('.modal-card');
    }
    else {
        window.jobOpened = false;
    }
}

for (let index = 0; index < hiddenModals.length; index++) {
    const hiddenModal = hiddenModals[index];

    resizable = hiddenModal.querySelector('.modal-card'),
        resizer = hiddenModal.querySelector('.modal-jobName'),
        startY, startHeight;

    hiddenModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-card-container-tint')) {
            resetModal();
        }
    }, {passive: true});

    hiddenModal.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('modal-card-container-tint')) {
            resetModal();
        }
    }, {passive: true});

    resizer.addEventListener('mousedown', initDrag, {passive: true});
    resizer.addEventListener('touchstart', initDrag, {passive: true});
}

async function jobClicked(jobId) {
    window.jobOpened = true;
    setCurrentJobIds(jobId);
    const cacheAvailable = 'caches' in self;
    if (!cacheAvailable && selectedInstallDate != null) {
        return;
    }
    const cacheName = 'job-list';
    const request = new Request(`${apiURL}/api/installerAppData/getInstallIndicators?businessId=${cred.name}`);

    const jobDetailDiv = jobModal.querySelector(".modal-info-container");

    document.activeElement.blur();

    caches.open(cacheName).then(cache => {
        cache.match(request).then((response) => {
            if (response == undefined) {
                return;
            }
            response.json().then(jobs => {

                jobDetailDiv.innerHTML = '';
                const filteredJobs = jobs.filter(job => {
                    return job.jobId === jobId;
                });
                filteredJobs.map(fJob => {
                    const modalName = jobModal.querySelector(".modal-jobName");
                    const layoutModalName = layoutModal.querySelector(".modal-jobName");

                    const jobCreatedElement = document.createElement('job-card');

                    jobCreatedElement.jobId = fJob.jobId;
                    jobCreatedElement.name = fJob.name;
                    jobCreatedElement.orderId = fJob.orderId;
                    jobCreatedElement.cabinetCount = fJob.cabinetCount;
                    jobCreatedElement.hasHomeOwner = fJob.hasHomeOwner;
                    jobCreatedElement.installerPay = fJob.installerPay;
                    jobCreatedElement.installerNotes = fJob.installerNotes;
                    jobCreatedElement.status = fJob.status;
                    jobCreatedElement.address = fJob.address;
                    jobCreatedElement.installRoleId = fJob.installRoleId;
                    jobCreatedElement.scheduledFrom = fJob.scheduledFrom;
                    jobCreatedElement.scheduledTo = fJob.scheduledTo;
                    jobCreatedElement.installDate = fJob.installDate;
                    jobCreatedElement.installDateRange = fJob.installDateRange;
                    jobCreatedElement.installDateConfirmed = fJob.installDateConfirmed;
                    jobCreatedElement.addressNumber = fJob.addressNumber;

                    jobDetailDiv.appendChild(jobCreatedElement);

                    modalName.innerHTML = `${fJob.orderId} - ${fJob.name}`;
                    layoutModalName.innerHTML = `${fJob.orderId} - ${fJob.name}`;
                });

                const buttons = jobDetailDiv.querySelectorAll('.mdc-button');
                if (typeof mdc !== 'undefined') {
                    for (let i = 0; i < buttons.length; i++) {
                        const element = buttons[i];
                        mdc.ripple.MDCRipple.attachTo(element);
                    }
                }
                jobModal.classList.add("modal-card-container-show");
                
                let jobModalHistory = {modal: "jobModal"}; // state object
                history.pushState(jobModalHistory, "unused argument", "#jobModal");
            });
        });
    }).catch(err => {
        console.error(err)
    });
}

function designSetInfoClicked(jobId) {
    const cacheAvailable = 'caches' in self;
    if (!cacheAvailable && selectedInstallDate != null) {
        return;
    }
    const cacheName = 'job-list';
    const request = new Request(`${apiURL}/api/installerAppData/getInstallIndicators?businessId=${cred.name}`);

    setCurrentJobIds(jobId);

    const cacheNameDesignSet = 'job-designSets-list';
    const requestDesignSet = new Request(`${apiURL}/api/installerAppData/getInstallJobsDesignSets?jobIdStrings=${window.currentJobIds}`);

    const designSetInfoDetailDiv = designSetModal.querySelector(".modal-info-container");

    document.activeElement.blur();

    caches.open(cacheName).then(cache => {
        cache.match(request).then((response) => {
            if (response == undefined) {
                return;
            }
            response.json().then(jobs => {
                designSetInfoDetailDiv.innerHTML = '';
                const filteredJobs = jobs.filter(job => {
                    return job.jobId === jobId;
                });
                filteredJobs.map(fJob => {
                    const modalName = designSetModal.querySelector(".modal-jobName");
                    
                    const designSetInfoCreatedElement = document.createElement('designset-card');
                    
                    designSetInfoCreatedElement.name = fJob.name;
                    designSetInfoCreatedElement.orderId = fJob.orderId;
                    designSetInfoCreatedElement.salesRepName = fJob.salesRepName;
                    designSetInfoCreatedElement.branchName = fJob.branchName;
                    designSetInfoCreatedElement.salesNumber = formatPhoneNumber(fJob.salesRepNumber);
                    designSetInfoCreatedElement.statusName = fJob.statusName;
                    designSetInfoCreatedElement.addressName = fJob.addressName;
                    designSetInfoCreatedElement.addressNumber = formatPhoneNumber(fJob.addressNumber);
                    designSetInfoCreatedElement.address = fJob.address;
                    designSetInfoCreatedElement.shopName = fJob.shopName;
                    designSetInfoCreatedElement.specie = fJob.specie;
                    designSetInfoCreatedElement.upperDoor = fJob.upperDoor;
                    designSetInfoCreatedElement.lowerDoor = fJob.lowerDoor;
                    designSetInfoCreatedElement.front = fJob.front;
                    designSetInfoCreatedElement.finish = fJob.finish;
                    designSetInfoCreatedElement.glaze = fJob.glaze;
                    designSetInfoCreatedElement.finishOption = fJob.finishOption;
                    designSetInfoCreatedElement.distress = fJob.distress;
                    designSetInfoCreatedElement.sheen = fJob.sheen;
                    designSetInfoCreatedElement.interior = fJob.interior;
                    designSetInfoCreatedElement.drawer = fJob.drawer;
                    designSetInfoCreatedElement.hinge = fJob.hinge;
                    designSetInfoCreatedElement.slide = fJob.slide;
                    designSetInfoCreatedElement.orderDate = fJob.orderDate;
                    designSetInfoCreatedElement.shipDate = fJob.shipDate;
                    designSetInfoCreatedElement.scheduledTime = fJob.scheduleTime;
                    designSetInfoCreatedElement.completionDate = fJob.completionDate;
                    designSetInfoCreatedElement.installer = fJob.installer;
                    designSetInfoCreatedElement.installDate = fJob.installDate;
                    designSetInfoCreatedElement.installDateRange = fJob.installDateRange;
                    designSetInfoCreatedElement.closeDate = fJob.closeDate;
                    designSetInfoCreatedElement.products = fJob.products;
                    // designSetInfoCreatedElement.designSetDTOs = fJob.designSetDTOs;
                    
                    caches.open(cacheNameDesignSet).then(cacheDs => {
                        cacheDs.match(requestDesignSet).then((responseDs) => {
                            if (responseDs == undefined) {
                                return;
                            }
                            responseDs.json().then(designSetDTOs => {
                                let designSetDTOsJob = [];
                                for (let i = 0; i < designSetDTOs.length; i++) {
                                    const designSetDTO = designSetDTOs[i];
                                    if (designSetDTO.jobId === jobId) {
                                        designSetDTOsJob = [...designSetDTOsJob, designSetDTO];
                                    }
                                }
                                designSetInfoCreatedElement.designSetDTOs = designSetDTOsJob;
                                // console.log(designSetDTOs, jobId)
                                designSetInfoDetailDiv.appendChild(designSetInfoCreatedElement);
                            });
                        });
                    });

                    modalName.innerHTML = `${fJob.orderId} - ${fJob.name}`;
                });

                const buttons = designSetInfoDetailDiv.querySelectorAll('.mdc-button');
                if (typeof mdc !== 'undefined') {
                    for (let i = 0; i < buttons.length; i++) {
                        const element = buttons[i];
                        mdc.ripple.MDCRipple.attachTo(element);
                    }
                }
                designSetModal.classList.add("modal-card-container-show");

                let designSetModalHistory = {modal: "designSetModal"}; // state object
                history.pushState(designSetModalHistory, "unused argument", "#designSetModal");
            });
        });
    }).catch(err => {
        console.error(err)
    });
}

async function hasLayouts() {
    const cacheName = 'jobs-layout-list';
    const request = new Request(`${apiURL}/api/installerAppData/getJobsLayouts?jobIdStrings=${window.currentJobIds}`);

    let result;
    
    caches.open(cacheName).then(async cache => {
        await cache.match(request).then(async (response) => {
            if (response == undefined) {
                result = false;
            }
            else {
                result = true;
            }
            console.log(result)
            return await result;
        });
    });

}

function jobLayouts(jobId) {
    setCurrentJobIds(jobId);
    const cacheName = 'jobs-layout-list';
    const request = new Request(`${apiURL}/api/installerAppData/getJobsLayouts?jobIdStrings=${window.currentJobIds}`);
    const layoutDetailDiv = layoutModal.querySelector(".modal-info-container");

    document.activeElement.blur();

    caches.open(cacheName).then(cache => {
        cache.match(request).then((response) => {
            if (response == undefined) {
                return;
            }
            response.json().then(layouts => {
                let layoutModalDetails = '';
                for (let i = 0; i < layouts.length; i++) {
                    const layout = layouts[i];
                    if (layout.jobId == jobId) {
                        layoutModalDetails += `
                            <div class="modal-information">
                                <div class="job-button mdc-button" title="${layout.url}" data-jobid="${layout.jobId}" onclick="window.open('${layout.url}')">
                                    <div class="mdc-button__ripple"></div>
                                    ${layout.name}
                                </div>
                            </div>
                        `;
                    }
                }
                layoutDetailDiv.innerHTML = layoutModalDetails;

                const buttons = layoutDetailDiv.querySelectorAll('.mdc-button');
                if (typeof mdc !== 'undefined') {
                    for (let i = 0; i < buttons.length; i++) {
                        const element = buttons[i];
                        mdc.ripple.MDCRipple.attachTo(element);
                    }
                }

                layoutModal.classList.add("modal-card-container-show");

                let layoutModalHistory = {modal: "layoutModal"}; // state object
                history.pushState(layoutModalHistory, "unused argument", "#layoutModal");
            });
        });
    });
}

function setCurrentJobIds(jobId) {
    const currentJobIds = window.jobIdLists.find(jobIds => {
        return jobIds.find(x => x === jobId);
    });

    window.currentJobIds = currentJobIds;
}

function jobDone(jobId) {
    this.dialog.open();
    this.currentJobId = jobId;

    let jobDoneModalHistory = {modal: "jobDoneModal"}; // state object
    history.pushState(jobDoneModalHistory, "unused argument", "#jobDoneModal");
}

function createPORequest(jobId) {
    this.dialogPORequest.open();
    this.currentJobId = jobId;

    let poRequestModalHistory = {modal: "poRequestModal"}; // state object
    history.pushState(poRequestModalHistory, "unused argument", "#poRequestModal");
}

function changeInstallDate(jobId) {
    this.dialogChangeInstallDate.open();
    this.currentJobId = jobId;

    let changeInstallDateModalHistory = {modal: "changeInstallDateModal"}; // state object
    history.pushState(changeInstallDateModalHistory, "unused argument", "#changeInstallDateModal");
}

function searchJob() {
    this.dialogSearchJobs.open();

    let searchJobsModalHistory = {modal: "searchJobsModal"}; // state object
    history.pushState(searchJobsModalHistory, "unused argument", "#searchJobsModal");
}