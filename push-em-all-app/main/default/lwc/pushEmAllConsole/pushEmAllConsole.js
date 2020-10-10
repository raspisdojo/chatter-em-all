import { LightningElement, api } from "lwc";

export default class PushEmAllConsole extends LightningElement {
    @api record;

    createNotification() {
        console.log("Create notification to: " + this.record.id);
    }

    lookupChange(e) {
        this.record = e.detail;
        console.log(JSON.stringify(this.record, null, 4));
    }
}
