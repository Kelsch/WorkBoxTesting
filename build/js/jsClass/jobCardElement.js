class JobCard extends HTMLElement {
    constructor() {
        super();

        this._jobId = "";
        this._orderId = "";
        this._name = "";
        this._shopName = "";
        this._cabinetCount = 0;
        this._install = false;
        this._installScheduled = false;
        this._installDate = Date.now;
        this._installDateRange = Date.now;
        this._scheduledFrom;
        this._scheduledTo;
        this._status = 0;
        this._statusName = "";
        this._installPrice = 0;
        this._personId = 0;
        this._salesRepId = 0;
        this._installerBusinessId = 0;
        this._installRoleId = 1;
        this._installed = false;
        this._installerMistakeCost = 0;
        this._servicingNote = "";
        this._dayPriority = 0;
        this._installerPay = 0;
        this._installerNotes = "";
        this._hasHomeOwner = false;
        this._address = "";
        this._longLat = "";
        this._installDateConfirmed = false;
        this._addressNumber = "";
    }

    //#region getter/setter

    set jobId(value) {
        this._jobId = value;
    }
    get jobId() {
        return this._jobId;
    }

    set orderId(value) {
        this._orderId = value;
    }
    get orderId() {
        return this._orderId;
    }

    set name(value) {
        this._name = value;
    }
    get name() {
        return this._name;
    }

    set shopName(value) {
        this._shopName = value;
    }
    get shopName() {
        return this._shopName;
    }

    set cabinetCount(value) {
        this._cabinetCount = value;
    }
    get cabinetCount() {
        return this._cabinetCount;
    }

    set install(value) {
        this._install = value;
    }
    get install() {
        return this._install;
    }

    set installScheduled(value) {
        this._installScheduled = value;
    }
    get installScheduled() {
        return this._installScheduled;
    }

    set installDate(value) {
        this._installDate = value;
    }
    get installDate() {
        return this._installDate;
    }

    set installDateRange(value) {
        this._installDateRange = value;
    }
    get installDateRange() {
        return this._installDateRange;
    }

    set scheduledFrom(value) {
        this._scheduledFrom = value;
    }
    get scheduledFrom() {
        return this._scheduledFrom;
    }

    set scheduledTo(value) {
        this._scheduledTo = value;
    }
    get scheduledTo() {
        return this._scheduledTo;
    }

    set status(value) {
        this._status = value;
    }
    get status() {
        return this._status;
    }

    set statusName(value) {
        this._statusName = value;
    }
    get statusName() {
        return this._statusName;
    }

    set installPrice(value) {
        this._installPrice = value;
    }
    get installPrice() {
        return this._installPrice;
    }

    set personId(value) {
        this._personId = value;
    }
    get personId() {
        return this._personId;
    }

    set salesRepId(value) {
        this._salesRepId = value;
    }
    get salesRepId() {
        return this._salesRepId;
    }

    set installerBusinessId(value) {
        this._installerBusinessId = value;
    }
    get installerBusinessId() {
        return this._installerBusinessId;
    }

    set installRoleId(value) {
        this._installRoleId = value;
    }
    get installRoleId() {
        return this._installRoleId;
    }

    set installed(value) {
        this._installed = value;
    }
    get installed() {
        return this._installed;
    }

    set installerMistakeCost(value) {
        this._installerMistakeCost = value;
    }
    get installerMistakeCost() {
        return this._installerMistakeCost;
    }

    set servicingNote(value) {
        this._servicingNote = value;
    }
    get servicingNote() {
        return this._servicingNote;
    }

    set dayPriority(value) {
        this._dayPriority = value;
    }
    get dayPriority() {
        return this._dayPriority;
    }

    set installerPay(value) {
        this._installerPay = value;
    }
    get installerPay() {
        return this._installerPay;
    }

    set installerNotes(value) {
        this._installerNotes = value;
    }
    get installerNotes() {
        return this._installerNotes;
    }

    set hasHomeOwner(value) {
        this._hasHomeOwner = value;
    }
    get hasHomeOwner() {
        return this._hasHomeOwner;
    }

    set address(value) {
        this._address = value;
    }
    get address() {
        return this._address;
    }

    set longLat(value) {
        this._ = value;
    }
    get longLat() {
        return this._longLat;
    }

    set installDateConfirmed(value) {
        this._installDateConfirmed = value;
    }
    get installDateConfirmed() {
        return this._installDateConfirmed;
    }

    set addressNumber(value) {
        this._addressNumber = value;
    }
    get addressNumber() {
        return this._addressNumber;
    }
    //#endregion

    connectedCallback() {
        const installColor = determineInstallColor(this.status);
        
        const cacheName = 'jobs-layout-list';
        const request = new Request(`${apiURL}/api/installerAppData/getJobsLayouts?jobIdStrings=${window.currentJobIds}`);
        
        caches.open(cacheName).then(cache => {
            cache.match(request).then((response) => {
                let result;
                
                if (response == undefined) {
                    result = false;
                    
                    this.innerHTML = jobCardHTML(this, result, installColor);
                }
                else {
                    response.json().then(data => {
                        for (let i = 0; i < data.length; i++) {
                            if (!result) {
                                const layout = data[i];
                                
                                result = !result ? layout.jobId == this.jobId : result;
                            }
                        }
    
                        this.innerHTML = jobCardHTML(this, result, installColor);
                    });
                }
            });
        });
    }
}

function jobCardHTML(data, result, installColor) {
    setCurrentJobIds(data.jobId);
    
    const htmlString = 
        `<div class="modal-information">
            <div class="job-datails job-name job-notes">
                ${data.orderId} - ${data.name}
            </div>
            <div class="job-datails job-address job-notes" onclick="OpenMaps('${data.address}', '${data.longLat}')">
                ${data.address}
            </div>
            ${data.installDateRange == null ? `
                <div class="job-datails job-installDate job-notes">
                    <span class="job-label">Date:</span>
                    ${new Date(data.installDate).toLocaleDateString()}
                </div>
                ` : `
                <div class="job-datails job-installDate job-notes">
                    <span class="job-label">Date Range:</span>
                    ${new Date(data.installDate).toLocaleDateString()} - ${new Date(data.installDateRange).toLocaleDateString()}
                </div>
            `}
            ${data.scheduledFrom == null ? '' : `
                <div class="job-datails job-scheduledTime job-notes">
                    <span class="job-label">Scheduled Time:</span>
                    ${formatDateTime(new Date(data.scheduledFrom))} - ${formatDateTime(new Date(data.scheduledTo))}
                </div>
            `}
            <div class="job-datails job-cabinetCount job-notes">
                <span class="job-label">Cab. Count:</span>
                ${data.cabinetCount}
            </div>
            <div class="job-datails job-notes${data.hasHomeOwner ? ' job-hasHomeOwner' : ''}" ${data.hasHomeOwner ? `onclick="OpenPhoneNumber('${data.addressNumber === null || data.addressNumber === '' ? '' : data.addressNumber}')"` : ''}>
                <span class="job-label">Home Owner:</span>
                ${data.hasHomeOwner ? `${data.addressNumber === null || data.addressNumber === '' ? 'Number Missing' : data.addressNumber}` : 'No'}
            </div>
            ${data.installRoleId == 1 ?
                `<div class="job-datails job-notes">
                    <span class="job-label">Pay:</span>
                    $${data.installerPay.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString()}
                </div>` : ''}
            <div class="job-datails job-notes">
                <span class="job-label">Notes:</span>
                ${data.installerNotes === null || data.installerNotes === '' ? '' : data.installerNotes}
            </div>
            <div class="job-datails job-buttons">
                <button class="job-button mdc-button${installColor}" data-buttontype="info" title="info" jobid="${data.jobId}" onclick="designSetInfoClicked('${data.jobId}')">
                    <div class="mdc-button__ripple"></div>
                    <i class="material-icons">info</i>
                </button>
                <!-- <button class="job-button mdc-button${installColor}" data-buttontype="status" title="status" jobid="${data.jobId}">
                    <div class="mdc-button__ripple"></div>
                        <i class="material-icons">directions_run</i>
                    </button> -->
                <!-- <button class="job-button mdc-button${installColor}" data-buttontype="note" title="note" jobid="${data.jobId}">
                    <div class="mdc-button__ripple"></div>
                        <i class="material-icons">note</i>
                    </button> -->
                <!-- <button class="job-button mdc-button${installColor}" data-buttontype="job" title="job" jobid="${this.jobId}">
                    <div class="mdc-button__ripple"></div>
                        <i class="material-icons">arrow_forward</i>
                    </button> -->
                <button class="job-button layout-button mdc-button${installColor}" data-buttontype="layouts" title="layouts" jobid="${data.jobId}" onclick="jobLayouts('${data.jobId}')" ${result ? '' : 'disabled'}>
                    <div class="mdc-button__ripple"></div>
                    <i class="material-icons">perm_media</i>
                </button>
                <button class="job-button mdc-button${installColor}" data-buttontype="PORequest" title="PO Request" jobid="${data.jobId}" onclick="createPORequest('${data.jobId}')">
                    <div class="mdc-button__ripple"></div>
                    <i class="material-icons">receipt</i>
                </button>
                <button class="job-button mdc-button${installColor}" data-buttontype="InstallDateChange" title="Change Install Date" jobid="${data.jobId}" onclick="changeInstallDate('${data.jobId}')">
                    <div class="mdc-button__ripple"></div>
                    <i class="material-icons">date_range</i>
                </button>
                <button class="job-button mdc-button${installColor}" data-buttontype="done" title="done" jobid="${data.jobId}" onclick="jobDone('${data.jobId}')">
                    <div class="mdc-button__ripple"></div>
                    <i class="material-icons">done</i>
                </button>
                <button class="job-button mdc-button${installColor}" data-buttontype="dateConfirmed" title="${data.installDateConfirmed}" jobid="${data.jobId}"
                    onclick="jobToggleInstallConfirmation('${data.jobId}')">
                    <div class="mdc-button__ripple"></div>
                    <i class="material-icons">${data.installDateConfirmed ? 'check_circle_outline' : 'radio_button_unchecked'}</i>
                </button>
            </div>
        </div>`;
    return htmlString;
}

customElements.define('job-card', JobCard);