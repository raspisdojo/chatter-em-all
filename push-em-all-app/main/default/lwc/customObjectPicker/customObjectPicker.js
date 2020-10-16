import { LightningElement, api } from "lwc";

export default class CustomObjectPicker extends LightningElement {
    /**
     * Array of Objects with the following interface:
     * @param objectName <string> API NAME of the Object
     * @param iconName icon name like: custom:custom1
     * @param label Label to display
     * @param nameField Api Name field to display
     * @param subtitleFieldName api name of the field for subtitle (optional)
     * example:
     * [{
     *  objectName: "Account",
     *   iconName: "standard:account",
     *   label: "Accounts",
     *   nameField: "Name",
     *   subtitleFieldName: "Website"
     * }]
     */
    @api menuItems;
    @api defaultValue;

    selectedMenuIcon;
    isOpen = false;

    connectedCallback() {
        this.selectedMenuIcon = this.defaultValue.iconName;
        this._dispatchSelectEvent(this.defaultValue);
    }

    switchButton() {
        this.isOpen = !this.isOpen;
    }

    get buttonClass() {
        let value = "slds-dropdown-trigger slds-dropdown-trigger_click";
        if (this.isOpen) {
            value = value + " slds-is-open";
        }
        return value;
    }

    _dispatchSelectEvent(details) {
        this.dispatchEvent(
            new CustomEvent("select", {
                detail: { details }
            })
        );
    }

    handleMenuSelect = (event) => {
        this.selectedMenuIcon = event.detail.iconName;
        this.switchButton();
        this._dispatchSelectEvent(event.detail);
    };
}
