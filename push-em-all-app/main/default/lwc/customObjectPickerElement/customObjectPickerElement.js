import { LightningElement, api } from "lwc";

export default class CustomObjectPickerElement extends LightningElement {
    @api value;

    get iconName() {
        return this.value.iconName;
    }

    get label() {
        return this.value.label;
    }

    handleSelection = () => {
        this.dispatchEvent(new CustomEvent("selected", { detail: this.value }));
    };
}
