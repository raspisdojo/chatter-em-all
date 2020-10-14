import { LightningElement, api } from "lwc";

export default class PushEmAllConsole extends LightningElement {
    @api record;

    createNotification() {
        console.log("Create notification to: " + this.record.id);
    }

    lookupChange(e) {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.record = e.detail;
        console.log(JSON.stringify(this.record, null, 4));
    }
}
