import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, TemplateRef, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Response } from '@angular/http/src/static_response';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from '../../app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../components/header/header.component';

@Component({
    selector: 'app-warehouses',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss']
})

export class WarehouseComponent implements OnInit {
    private selectedRow : number = 0;

    private dbData : Array<any> = new Array<any>();
    private filter = { colornr : "", name : "", strength: "" };
    private currentTable : string = "Rohwaren";

    constructor(private http: Http, private modalService: NgbModal){ };

    ngOnInit() {
        this.getItems(AppComponent.getLink("read", "&table=Rohwaren"));
    }

    // connects this method with the popup dialog that lets us add and remove entrys from the warehouse
    @ViewChild('popupDialog')
    public wizardRef: TemplateRef<any>;  
    public showItemDialog()
    {
        this.modalService.open(this.wizardRef);
        this.setSelectedRB();
        this.fillItemDialog();
    }
    public suspendItemDialog() {
        //TODO: find a way to close the dialog via button
    }

    fillItemDialog() {
        var theader : HTMLElement = document.getElementById('selectedItemTable').getElementsByTagName('thead')[0];
        var tbody : HTMLTableSectionElement = document.getElementById("selectedItemTable").getElementsByTagName("tbody")[0];
        var theaderOut : string = "<tr>";
        var tbodyOut : string = "<tr>";

        for (var key in this.dbData[this.selectedRow]) {
            if(!key.includes("id")) {
                theaderOut += "<td>" + key + "</td>";
                tbodyOut += "<td>" + this.dbData[this.selectedRow][key] + "</td>";
            }
        }

        theader.innerHTML = theaderOut + "</tr>";
        tbody.innerHTML = tbodyOut + "</tr>";
    }


    // gets called when a line gets selected (via radio button or klick on the row)
    public setSelectedRB() {
        var toReturn = 0;

        for(var idx = 0; idx <= this.dbData.length; idx++)  {
            var b : any = document.getElementById("btnRadio" + idx);

            if(b.checked) {
                toReturn = idx;
                break;
            }
        }

        this.selectedRow = toReturn;
    }
    

    outsourceFromWarehouse() {
        //#### Transaction erstellen #### Transaction wird nach erfolgreichem Update erstellt!!
        // TODO: 
        //  Tabelle im Modal updaten 
        this.updateExistingWarehouseEntry(this.selectedRow, false);
    }

    insertIntoWarehouse() {
        this.updateExistingWarehouseEntry(this.selectedRow, true);
    }

    // CREATING A NEW TRANSAKTION
    createNewTransaktion(isInsert: boolean, toAdd, source) {
        var menge =  Math.abs(parseFloat(source.Menge) - parseFloat(toAdd.Menge));
        var preis = parseFloat(toAdd.Preis);
        var sum = menge * preis;

        var json = {
            "Name": HeaderComponent.getUsername(),
            "Produkt": toAdd.Warengruppe,
            "Menge": menge,
            "Einheit": toAdd.Mengenangabe,
            "PreisProEinheit": preis,
            "Gesamtpreis":  sum,
            "Waehrung": "€",
            "Datum": new Date(),
            "Typ": isInsert ? "Einlagerung" : "Auslagerung",
            "Bezahlt": "false"
          };
          console.log(json);
        return this.http.post(
            AppComponent.getLink("add", "&table=Transaktionen"), json);
    }

    // UPDATING AN ENTRY
    updateExistingWarehouseEntry(selectedRow, isInsert) {
        var oldEntry = this.clone(this.dbData[selectedRow]);
        var newEntry =  this.clone(this.dbData[selectedRow]);
        var input = document.getElementById("removeDialogAmount") as HTMLInputElement;
        newEntry["Menge"] = parseInt(newEntry["Menge"]) + parseInt(input.value) * (isInsert ?  1 : -1 );

        var json = {"source": oldEntry, "destination": newEntry};

        this.http.put(AppComponent.getLink("update", "&table=" + this.currentTable), json)
        .map(res => res.json()).subscribe((data) => {
            console.log("SUCCESS");
            console.log(data);

            this.createNewTransaktion(isInsert, 
            data.updated, data.source).map(res => res.json()).subscribe((data) => {
                console.log("SUCCESS");
                console.log(data);
            },
                (err) => console.log(err + " ErrorCode: " + err.status)
            );

            this.getItems(AppComponent.getLink("read", "&table=" + this.currentTable));
        },
            (err) => console.log(err + " ErrorCode: " + err.status)
        );
    }

    public clone(toClone) {
        var clone = {};
        for (var key in toClone) {
            if(!key.includes("id"))
                clone[key] = toClone[key];
        }
        return clone;
    }

    /* TODO: creating new warehouse entries
    addNewWarehouseEntry(entryToAdd) {
        return this.http.post(
            AppComponent.getLink("add", "&table="+this.currentTable), 
            // Use this
            entryToAdd
            // Just a copy
            { 
                "Name": HeaderComponent.getUsername(),
                "Produkt": this.selectedEntry[0],
                "Menge": this.selectedEntry[1],
                "Einheit": this.selectedEntry[2],
                "PreisProEinheit": this.selectedEntry[3],
                "Gesamtpreis": this.selectedEntry[4],
                "Waehrung": this.selectedEntry[5],
                "Datum": new Date(),
                //"Typ": type,
                "Bezahlt": "false"
              }
        );
    }
    */

     /*
     isNewEntry() {
         for (let index = 0; index < this.dbData.length; index++) {
             if(JSON.stringify(this.dbData[index]).indexOf('')>0) {
                return false;
             }
         }
         return true;
     }
     */

    radioButtonOnClick (table : string) {
        switch(table){
            case "Naehseide":
            this.adjustColumnsForNaehseiden();
            break;
        case "Bundhaken":
            this.adjustColumnsForBundhaken();
            break;
        case "Knoepfe":
            this.adjustColumnsForKnoepfe();
            break;
        case"Rohwaren":
            this.adjustColumnsForRohwaren();
            break;
        }

        this.currentTable = table;
        this.getItems(AppComponent.getLink("read", "&table=" + table));
    }

    filterBy (filterName : string) {
        switch(filterName) {
            case "color":
                this.filter.colornr = (document.getElementById("txt_Color") as HTMLInputElement).value;
                break;
            case "name":
                this.filter.name = (document.getElementById("txt_Name") as HTMLInputElement).value;
                break;
            case "strength":
                this.filter.strength = (document.getElementById("txt_Strength") as HTMLInputElement).value;
                break;
        }

        this.refreshTable(this.dbData, this.filter);
    }

    getItems (url : string) {
        this.dbData = new Array<any>();

        this.http.get(url).subscribe(res =>{
            res.json().map(e => {
                this.dbData.push(e);
            })
            this.refreshTable(this.dbData, this.filter);
        });
    }
    
    refreshTable(data: Array<any>, filter: any) {
        var theader : HTMLElement = document.getElementById('warehouseitemtable').getElementsByTagName('thead')[0];
        var tbody : HTMLElement = document.getElementById('warehouseitemtable').getElementsByTagName('tbody')[0];

        var table = this.generateTable(this.dbData, this.filter);
        theader.innerHTML = table.header;
        tbody.innerHTML = table.body;
    }

    /** Creates a Table with the given data array and filter
     * @param data: Array<any> of the wanted array
     * @param filter: json string of the filters. name, strength, colornr (filter can be null)
     * @returns json with {header: "...", body: "..."}
     */
    generateTable (data: Array<any>, filter: any) {        
        return {"header": this.generateHeader(data), "body": this.generateBody(data, filter)};
    }

    private generateHeader(data: Array<any>) {
        var theaderOut : string = "";

        theaderOut += "<tr><td>Nr</td>";
            for(var key in this.dbData[0])
                if(!key.includes("id"))
                    theaderOut += "<td>" + key + "</td>";
    
        theaderOut += "<td>#</td></tr>";

        return theaderOut;
    }

    /** Generates content of a table body (tbody)
     * @param data: Array<any> of the wanted array
     * @param filter: json string of the filters. name, strength, colornr (filter can be null)
     * @returns string
     */
    private generateBody (data : Array<any>, filter: any) : string {
        var tbodyOut : string = "";

        for(var idx = 0; idx < data.length; idx++) {
            if(filter != null && this.shouldShowEntry(data[idx], filter)) {
                tbodyOut += "<tr><th scope=\"col\">" + (idx+1) + "</th>";

                for (var key in data[0]) {
                    if(!key.includes("id")) {
                        tbodyOut += "<td>" + data[idx][key] + "</td>";
                    }
                }

                tbodyOut +=  '<td><div class="radio">'
                        + '<input type="radio" name="selectionRadioBs" '
                        + 'id="btnRadio' + idx +'" '
                        + 'value="' + idx +'" /></div></td></tr>';  
            }
        }

        return tbodyOut;
    }

    shouldShowEntry(e : any, filter : any) {
        if (this.currentTable == "Naehseide") {
            return e["Warengruppe"].toLowerCase().includes(filter.name.toLowerCase()) && e["Staerke"].includes(filter.strength) && e["Farbnummer"].includes(filter.colornr);
        }

        return e["Warengruppe"].toLowerCase().includes(filter.name.toLowerCase());
    }

    adjustColumnsForNaehseiden() {
        (document.getElementById("txt_Color") as HTMLInputElement).removeAttribute("disabled");
        (document.getElementById("txt_Strength") as HTMLInputElement).removeAttribute("disabled");
    }

    adjustColumnsForBundhaken() {
        (document.getElementById("txt_Color") as HTMLInputElement).setAttribute("disabled", "true");
        (document.getElementById("txt_Strength") as HTMLInputElement).setAttribute("disabled", "true");
    }

    adjustColumnsForKnoepfe() {
        this.adjustColumnsForBundhaken();
    }

    adjustColumnsForRohwaren() {
        this.adjustColumnsForBundhaken();
    }
}

