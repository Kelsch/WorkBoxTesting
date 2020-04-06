const jobModal = document.getElementById("modalCard_job");

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
    resizable.style.height = 220 + 'px';

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
    const request = new Request(`https://pdwebapi-mf5.conveyor.cloud/api/installerAppData/getInstallIndicators?businessId=2`);

    const jobDetailDiv = jobModal.querySelector(".modal-jobContainer");
    
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
                    // const installColor = determineInstallColor(fJob.status);
                    const modalName = jobModal.querySelector(".modal-jobName");

                    modalName.innerHTML = fJob.name;

                    const buttonHtml = `
                        <div class="job-datails job-name job-shippingNotes">
                            ${fJob.name}
                        </div>
                        <div class="job-datails job-address job-shippingNotes">
                            Get Address Here
                        </div>
                        <div class="job-datails job-cabinetCount job-shippingNotes">
                            <span class="job-label">Cab. Count:</span>
                            ${fJob.cabinetCount}
                        </div>
                        <div class="job-datails job-shippingNotes">
                            <span class="job-label">H.O.:</span>
                            Get H.O.
                        </div>

                        <div class="job-datails job-shippingNotes">
                            <span class="job-label">Pay:</span>
                            $${fJob.installerPay}
                        </div>
                        <div class="job-datails job-shippingNotes">
                            <span class="job-label">Shipping Notes:</span>
                            Get Shipping Notes
                        </div>
                        <div class="job-datails job-buttons">
                            <span class="job-button mdc-button" data-buttontype="info" title="info" jobid="${fJob.jobId}">
                                <div class="mdc-button__ripple"></div>
                                <i class="material-icons">info</i>
                            </span>
                            <!-- <span class="job-button mdc-button" data-buttontype="status" title="status" jobid="${fJob.jobId}">
                                <div class="mdc-button__ripple"></div>
                                    <i class="material-icons">directions_run</i>
                                </span> -->
                            <!-- <span class="job-button mdc-button" data-buttontype="note" title="note" jobid="${fJob.jobId}">
                                <div class="mdc-button__ripple"></div>
                                    <i class="material-icons">note</i>
                                </span> -->
                            <!-- <span class="job-button mdc-button" data-buttontype="job" title="job" jobid="${fJob.jobId}">
                                <div class="mdc-button__ripple"></div>
                                    <i class="material-icons">arrow_forward</i>
                                </span> -->
                            <span class="job-button mdc-button" data-buttontype="layouts" title="layouts" jobid="${fJob.jobId}">
                                <div class="mdc-button__ripple"></div>
                                <i class="material-icons">arrow_forward</i>
                            </span>
                        </div>
                    `;

                    jobDetailDiv.innerHTML += buttonHtml;
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