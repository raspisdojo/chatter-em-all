import { LightningElement, api, wire, track } from "lwc";
import findSObjects from "@salesforce/apex/LookupController.findSObjects";

export default class Lookup extends LightningElement {
    @api sobjectApiName;
    @api titleApiName;
    @api subtitleApiName;
    @api iconName;
    @api labelHidden;
    @api label;
    @api selectedObj; //= {id: "0011i00000f1W5VAAU", subtitle: "000111222", title: "Hola Hola"};
    sobjects = [];
    selected = false;
    isOpen = false;
    searchKey;
    placeholder;
    _error;
    _container;

    renderedCallback() {
        console.log(this.sobjectApiName);
        this._container = this.template.querySelector("[data-id=combobox]");
        this.placeholder = "Search " + this.sobjectApiName + "...";
    }

    handleOnClick(e) {
        this.selectedObj = this.sobjects[parseInt(e.currentTarget.dataset.index)];
        this.selected = true;
        this.dispatchEvent(new CustomEvent("change"));
        //this.template.querySelector('[data-id=comboboxContainer]').classList.add("slds-has-selection");
    }

    removeSelected() {
        console.log("removeSelected");
        this.selectedObj = null;
        this.selected = false;
        this.dispatchEvent(new CustomEvent("change"));
    }

    search(e) {
        this.searchKey = e.target.value;
        if (this.searchKey != null && this.searchKey != "") {
            findSObjects({
                searchKey: this.searchKey,
                sobjectApiName: this.sobjectApiName,
                titleApiName: this.titleApiName,
                subtitleApiName: this.subtitleApiName
            })
                .then((result) => {
                    this.sobjects = result;
                })
                .catch((error) => {
                    this._error = error;
                });
        } else {
            this.sobjects = [];
        }
        this.displayList();
        //this.addOnClickEvent();
    }

    displayList() {
        this.isOpen = this.searchKey != null && this.searchKey != "";
        if (this.isOpen) this._container.classList.add("slds-is-open");
        else this._container.classList.remove("slds-is-open");
    }

    /*addOnClickEvent() {
        for (let listItem of this.template.querySelectorAll("li.myListItem")){
            listItem.addEventListener("click", this.handleOnClick(this.sobjects[parseInt(listItem.dataset.id)]));
        }
    }*/
}
