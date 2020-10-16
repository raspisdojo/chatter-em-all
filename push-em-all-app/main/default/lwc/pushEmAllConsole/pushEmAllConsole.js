import { LightningElement } from "lwc";
import sendPushNotification from "@salesforce/apex/PushEmAllConsoleController.sendPushNotification";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class PushEmAllConsole extends LightningElement {
    isLoading = false;

    recipientIds = new Array();
    _error;

    createNotification() {
        this.isLoading = true;
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
                this.isLoading = false;
                console.log(result);
                this.dispatchToastEvent("Success!", "Notification has been sent", "success");
            })
            .catch((error) => {
                this.isLoading = false;
                this._error = error;
                console.log(error);
                this.dispatchToastEvent("Error", error, "error");
            });
    }

    lookupChange(e) {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        let record = e.detail;
        console.log(JSON.stringify(record, null, 4));
        if (record != null) this.recipientIds[0] = record.id;
    }

    selectPicker(e) {
        let object = e.detail.details;
        console.log(object);
        console.log(e.detail.objectName);
    }

    get menuItems() {
        return [
            { objectName: "User", iconName: "standard:user", label: "User" },
            { objectName: "Group", iconName: "standard:groups", label: "Group" }
        ];
    }

    get defaultValue() {
        return this.menuItems[0];
    }

    dispatchToastEvent = (t, m, v) => {
        const evt = new ShowToastEvent({
            title: t,
            message: m,
            variant: v,
            mode: "sticky"
        });
        this.dispatchEvent(evt);
    };
}
