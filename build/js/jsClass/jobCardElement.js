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
        this._scheduledFrom;
        this._scheduledTo;
        this._status = 0;
        this._statusName = "";
        this._installPrice = 0;
        this._personId = 0;
        this._salesRepId = 0;
        this._installerBusinessId = 0;
        this._installed = false;
        this._installerMistakeCost = 0;
        this._servicingNote = "";
        this._dayPriority = 0;
        this._installerPay = 0;
        this._installerNotes = "";
        this._hasHomeOwner = false;
        this._address = "";
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
                }
                else {
                    result = true;
                }

                this.innerHTML = `
                    <div class="modal-information">
                        <div class="job-datails job-name job-notes">
                            ${this.name}
                        </div>
                        <div class="job-datails job-address job-notes">
                            ${this.address}
                        </div>
                        <div class="job-datails job-cabinetCount job-notes">
                            <span class="job-label">Cab. Count:</span>
                            ${this.cabinetCount}
                        </div>
                        <div class="job-datails job-notes">
                            <span class="job-label">H.O.:</span>
                            ${this.hasHomeOwner ? 'Yes' : 'No'}
                        </div>
                        <div class="job-datails job-notes">
                            <span class="job-label">Pay:</span>
                            $${this.installerPay.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString()}
                        </div>
                        <div class="job-datails job-notes">
                            <span class="job-label">Notes:</span>
                            ${this.installerNotes === null || this.installerNotes === '' ? '' : this.installerNotes}
                        </div>
                        <div class="job-datails job-buttons">
                            <button class="job-button mdc-button${installColor}" data-buttontype="info" title="info" jobid="${this.jobId}" onclick="designSetInfoClicked('${this.jobId}')">
                                <div class="mdc-button__ripple"></div>
                                <i class="material-icons">info</i>
                            </button>
                            <!-- <button class="job-button mdc-button${installColor}" data-buttontype="status" title="status" jobid="${this.jobId}">
                                <div class="mdc-button__ripple"></div>
                                    <i class="material-icons">directions_run</i>
                                </button> -->
                            <!-- <button class="job-button mdc-button${installColor}" data-buttontype="note" title="note" jobid="${this.jobId}">
                                <div class="mdc-button__ripple"></div>
                                    <i class="material-icons">note</i>
                                </button> -->
                            <!-- <button class="job-button mdc-button${installColor}" data-buttontype="job" title="job" jobid="${this.jobId}">
                                <div class="mdc-button__ripple"></div>
                                    <i class="material-icons">arrow_forward</i>
                                </button> -->
                            <button class="job-button layout-button mdc-button${installColor}" data-buttontype="layouts" title="layouts" jobid="${this.jobId}" onclick="jobLayouts('${this.jobId}')" ${result ? '' : 'disabled'}>
                                <div class="mdc-button__ripple"></div>
                                <i class="material-icons">perm_media</i>
                            </button>
                        </div>
                    </div>
                `;
            });
        });
    }
}
customElements.define('job-card', JobCard);