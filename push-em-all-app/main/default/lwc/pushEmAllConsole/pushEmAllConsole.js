import { LightningElement } from "lwc";
import sendPushNotification from "@salesforce/apex/PushEmAllConsoleController.sendPushNotification";

export default class PushEmAllConsole extends LightningElement {
    recipientIds = new Array();
    _error;

    createNotification() {
        let title = this.template.querySelector("lightning-input").value;
        let body = this.template.querySelector("lightning-textarea").value;
        console.log("Create notification to: " + this.recipientIds[0]);
        console.log(title);
        console.log(body);
        sendPushNotification({
            notificationInfo: {
                title: title,
                body: body,
                recipientIds: this.recipientIds
            }
        })
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                this._error = error;
                console.log(error);
            });
    }

    lookupChange(e) {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        let record = e.detail;
        console.log(JSON.stringify(record, null, 4));
        if (record != null) this.recipientIds[0] = record.id;
    }
}
