class DesignSetInfoCard extends HTMLElement {
    constructor() {
        super();

        this._name = "";
        this._orderId = "";
        this._salesRepName = "";
        this._branchName = "";
        this._salesNumber = "";
        this._statusName = "";
        this._addressName = "";
        this._addressNumber = "";
        this._address = "";
        this._shopName = "";
        this._specie = "";
        this._upperDoor = "";
        this._lowerDoor = "";
        this._front = "";
        this._finish = "";
        this._glaze = "";
        this._finishOption = "";
        this._distress = "";
        this._sheen = "";
        this._interior = "";
        this._drawer = "";
        this._hinge = "";
        this._slide = "";
        this._orderDate = Date.now();
        this._shipDate = Date.now();
        this._scheduledTime = Date.now();
        this._completionDate = Date.now();
        this._installer = "";
        this._installDate = Date.now();
        this._closeDate = Date.now();
        this._designSetDTOs = [];
        this._products = [];
    }

    //#region getter/setter
    set jobName(value) {
        this._jobName = value;
    }
    get jobName() {
        return this._jobName;
    }

    set salesRepName(value) {
        this._salesRepName = value;
    }
    get salesRepName() {
        return this._salesRepName;
    }

    set branchName(value) {
        this._branchName = value;
    }
    get branchName() {
        return this._branchName;
    }

    set salesNumber(value) {
        this._salesNumber = value;
    }
    get salesNumber() {
        return this._salesNumber;
    }

    set statusName(value) {
        this._statusName = value;
    }
    get statusName() {
        return this._statusName;
    }

    set addressName(value) {
        this._addressName = value;
    }
    get addressName() {
        return this._addressName;
    }

    set addressNumber(value) {
        this._addressNumber = value;
    }
    get addressNumber() {
        return this._addressNumber;
    }

    set address(value) {
        this._address = value;
    }
    get address() {
        return this._address;
    }

    set shopName(value) {
        this._shopName = value;
    }
    get shopName() {
        return this._shopName;
    }

    set specie(value) {
        this._specie = value;
    }
    get specie() {
        return this._specie;
    }

    set upperDoor(value) {
        this._upperDoor = value;
    }
    get upperDoor() {
        return this._upperDoor;
    }

    set lowerDoor(value) {
        this._lowerDoor = value;
    }
    get lowerDoor() {
        return this._lowerDoor;
    }

    set front(value) {
        this._front = value;
    }
    get front() {
        return this._front;
    }

    set finish(value) {
        this._finish = value;
    }
    get finish() {
        return this._finish;
    }

    set glaze(value) {
        this._glaze = value;
    }
    get glaze() {
        return this._glaze;
    }

    set finishOption(value) {
        this._finishOption = value;
    }
    get finishOption() {
        return this._finishOption;
    }

    set distress(value) {
        this._distress = value;
    }
    get distress() {
        return this._distress;
    }

    set sheen(value) {
        this._sheen = value;
    }
    get sheen() {
        return this._sheen;
    }

    set interior(value) {
        this._interior = value;
    }
    get interior() {
        return this._interior;
    }

    set drawer(value) {
        this._drawer = value;
    }
    get drawer() {
        return this._drawer;
    }

    set hinge(value) {
        this._hinge = value;
    }
    get hinge() {
        return this._hinge;
    }

    set slide(value) {
        this._slide = value;
    }
    get slide() {
        return this._slide;
    }

    set orderDate(value) {
        this._orderDate = new Date(value);
    }
    get orderDate() {
        return this._orderDate;
    }

    set shipDate(value) {
        this._shipDate = new Date(value);
    }
    get shipDate() {
        return this._shipDate;
    }

    set scheduledTime(value) {
        this._scheduledTime = new Date(value);
    }
    get scheduledTime() {
        return this._scheduledTime;
    }

    set completionDate(value) {
        this._completionDate = new Date(value);
    }
    get completionDate() {
        return this._completionDate;
    }

    set installer(value) {
        this._installer = value;
    }
    get installer() {
        return this._installer;
    }

    set installDate(value) {
        this._installDate = new Date(value);
    }
    get installDate() {
        return this._installDate;
    }

    set closeDate(value) {
        this._closeDate = new Date(value);
    }
    get closeDate() {
        return this._closeDate;
    }

    set designSets(value) {
        this._designSets = value;
    }
    get designSets() {
        return this._designSets
    }

    set products(value) {
        this._products = value;
    }
    get products() {
        return this._products;
    }
    //#endregion

    connectedCallback() {
        // const installColor = determineInstallColor(this.status);
        let designSetInfomations = "";
        for (let i = 0; i < this.designSetDTOs.length; i++) {
            const designData = this.designSetDTOs[i];
            designSetInfomations += `
            <div class="modal-information">
                <div class="status-item-title">${this.orderId}${designData.shopLabel === '' ? '' : '- ' + designData.shopLabel}</div>
                <div class="modal-designSet-container">
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Species:</div>
                        <div class="designSet-detail-info">${designData.specieDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Upper Door:</div>
                        <div class="designSet-detail-info">${designData.upperDoorDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Lower Door:</div>
                        <div class="designSet-detail-info">${designData.lowerDoorDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Front:</div>
                        <div class="designSet-detail-info">${designData.frontDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Finish:</div>
                        <div class="designSet-detail-info">${designData.finishDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Glaze:</div>
                        <div class="designSet-detail-info">${designData.glazeDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Finish Option:</div>
                        <div class="designSet-detail-info">${designData.finishOptionDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Distress:</div>
                        <div class="designSet-detail-info">${designData.distressDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Sheen:</div>
                        <div class="designSet-detail-info">${designData.sheenDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Interior:</div>
                        <div class="designSet-detail-info">${designData.interiorDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Drawer:</div>
                        <div class="designSet-detail-info">${designData.drawerDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Hinge:</div>
                        <div class="designSet-detail-info">${designData.hingeDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Slide:</div>
                        <div class="designSet-detail-info">${designData.slideDisplay}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Order Date:</div>
                        <div class="designSet-detail-info">${isNaN(this.orderDate.getTime()) ? '' : this.orderDate.toLocaleDateString()}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Ship Date:</div>
                        <div class="designSet-detail-info">${isNaN(this.shipDate.getTime()) ? '' : this.shipDate.toLocaleDateString()}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Scheduled Time:</div>
                        <div class="designSet-detail-info">${isNaN(this.scheduledTime.getTime()) ? '' : this.scheduledTime.toLocaleDateString()}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Completion Date:</div>
                        <div class="designSet-detail-info">${isNaN(this.completionDate.getTime()) ? '' : this.completionDate.toLocaleDateString()}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Installer:</div>
                        <div class="designSet-detail-info">${this.installer}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Install Date:</div>
                        <div class="designSet-detail-info">${isNaN(this.installDate.getTime()) ? '' : this.installDate.toLocaleDateString()}</div>
                    </div>
                    <div class="designSet-detail">
                        <div class="designSet-detail-name">Close Date:</div>
                        <div class="designSet-detail-info">${isNaN(this.closeDate.getTime()) ? '' : this.closeDate.toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="designSet-product-container">
                    <!---->
                        <div class="designSet-product">
                            <div class="product-quantity"><!---->1<!----></div>
                            <div class="product-detail product-name"><!---->WBK2757*12D<!----></div>
                            <div class="product-detail product-info product-mods"><!---->Bottom: No Bottom<!----></div>
                            <div class="product-detail product-info product-notes"><!---->Notes and Such<!----></div>
                        </div>
                    <!---->
                </div>
            </div>
            `;
        }
        
        this.innerHTML = `
            <div class="modal-information">
                <div class="modal-job-info">
                    <div class="modal-job-details">
                        <div class="modal-job-detail modal-salesRep">Sales Rep: ${this.salesRepName}</div>
                        <div class="modal-job-detail modal-branch">Branch: ${this.branchName}</div>
                        <div class="modal-job-detail modal-costs">
                            <div class="modal-cost-detail">Sales #: ${this.salesNumber === null || this.salesNumber === '' ? '' : this.salesNumber}</div>
                            <div class="modal-cost-detail">Status: ${this.statusName}</div>
                        </div>
                    </div>
                    <div class="modal-job-detail modal-address">
                        <div class="modal-address-detail">${this.addressName}</div>
                        <div class="modal-address-detail">${this.address}</div>
                        <div class="modal-address-detail">${this.addressNumber === null || this.addressNumber === '' ? '' : this.addressNumber}</div>
                    </div>
                </div>
            </div>

            <div class="modal-designSets">
                ${designSetInfomations}
            </div>
        `;
    }
}
customElements.define('designset-card', DesignSetInfoCard);