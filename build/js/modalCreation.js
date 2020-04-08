const jobModal = document.getElementById("modalCard_job");
const designSetModal = document.getElementById("modalCard_designSetInfo");

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
    if ((startHeight - clientY + startY) <= 65) {
        resetModal();
    }
}

function stopDrag() {
    document.documentElement.removeEventListener('mousemove', doDrag, false);    
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
    document.documentElement.removeEventListener('touchmove', doDrag, false);
    document.documentElement.removeEventListener('touchstop', stopDrag, false);
}

function resetModal() {
    resizable.parentElement.classList.remove('modal-card-container-show')
    resizable.style.height = 400 + 'px';

    document.querySelector('.list-jobs').classList.remove('stopScroll');

    stopDrag();
    
    let remainingModal = document.querySelector('.modal-card-container-show');
    if (remainingModal !== null) {
        resizable = remainingModal.querySelector('.modal-card');
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
    });
    
    hiddenModal.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('modal-card-container-tint')) {
            resetModal();
        }
    });
    
    resizer.addEventListener('mousedown', initDrag, false);
    resizer.addEventListener('touchstart', initDrag, false);
}

async function jobClicked(jobId) {
    const cacheAvailable = 'caches' in self;
    if (!cacheAvailable && selectedInstallDate != null) {
        return;
    }
    const cacheName = 'job-list';
    // const request = new Request(`https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators?businessId=2`);
    const request = new Request(`${apiURL}/api/installerAppData/getInstallIndicators?businessId=2`);

    const jobDetailDiv = jobModal.querySelector(".modal-info-container");
    
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

                    const jobCreatedElement = document.createElement('job-card');

                    jobCreatedElement.jobId = fJob.jobId;
                    jobCreatedElement.name = fJob.name;
                    jobCreatedElement.cabinetCount = fJob.cabinetCount;
                    jobCreatedElement.hasHomeOwner = fJob.hasHomeOwner;
                    jobCreatedElement.installerPay = fJob.installerPay;
                    jobCreatedElement.installerNotes = fJob.installerNotes;
                    jobCreatedElement.status = fJob.status;
                    jobCreatedElement.address = fJob.address;

                    jobDetailDiv.appendChild(jobCreatedElement);

                    modalName.innerHTML = fJob.name;
                });

                const buttons = jobDetailDiv.querySelectorAll('.mdc-button');
                if (typeof mdc !== 'undefined') {
                    for (let i = 0; i < buttons.length; i++) {
                        const element = buttons[i];
                        mdc.ripple.MDCRipple.attachTo(element);
                    }
                }
                jobModal.classList.add("modal-card-container-show");
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
    // const request = new Request(`https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators?businessId=2`);
    const request = new Request(`${apiURL}/api/installerAppData/getInstallIndicators?businessId=2`);

    const designSetInfoDetailDiv = designSetModal.querySelector(".modal-info-container");

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

                    console.log(fJob)
                    
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
                    designSetInfoCreatedElement.closeDate = fJob.closeDate;
                    designSetInfoCreatedElement.products = fJob.products;
                    designSetInfoCreatedElement.designSetDTOs = fJob.designSetDTOs;

                    designSetInfoDetailDiv.appendChild(designSetInfoCreatedElement);

                    modalName.innerHTML = fJob.name;
                });

                const buttons = designSetInfoDetailDiv.querySelectorAll('.mdc-button');
                if (typeof mdc !== 'undefined') {
                    for (let i = 0; i < buttons.length; i++) {
                        const element = buttons[i];
                        mdc.ripple.MDCRipple.attachTo(element);
                    }
                }
                designSetModal.classList.add("modal-card-container-show");
            });
        });
    }).catch(err => {
        console.error(err)
    });
}