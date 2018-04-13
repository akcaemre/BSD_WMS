import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, TemplateRef, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Response } from '@angular/http/src/static_response';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from '../../app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../components/header/header.component';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
    selector: 'app-warehouses',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss']
})

export class WarehouseComponent implements OnInit {
    selectedRow : Number = 0;
    setClickedRow : Function;
    rowCount: number;

    private dbData : Array<any> = new Array<any>();
    private name : string = "";
    private color : string = "";
    private strength : string = "";
    private currentTable : string = "Rohwaren";
    public Lagereintrag: Observable<Array<any>>;
    public selectedEntry: any;

    constructor(private http: Http, private modalService: NgbModal){
        this.setClickedRow = function(index){
            this.selectedRow = index;
        }
    };

    // connects this method with the popup dialog that lets us add and remove entrys from the warehouse
    @ViewChild('popupDialog')
    public wizardRef: TemplateRef<any>;  
    public showItemDialog()
    {
        this.modalService.open(this.wizardRef);
        this.selectedRow = this.getSelectedRB()
        this.fillItemDialog();
    }
    public suspendItemDialog() {
        //TODO: find a way to close the dialog via button
    }

    fillItemDialog() {
        var theader : HTMLElement = document.getElementById('selectedItemTable').getElementsByTagName('thead')[0];
        var theaderOut : string = "";
        theaderOut += "<tr>";

        for(var key in this.dbData[0])
            if(!key.includes("id"))
                theaderOut += "<td>" + key + "</td>";

        theaderOut += "</tr>";

        theader.innerHTML = theaderOut;

        var tbody : HTMLTableSectionElement = document.getElementById("selectedItemTable").getElementsByTagName("tbody")[0];
        var tbodyOut : string = "";
        tbodyOut += "<tr>";

        for (var key in this.dbData[toInteger(this.selectedRow)]) {
            if(!key.includes("id")) {
                tbodyOut += "<td>" + this.dbData[toInteger(this.selectedRow)][key] + "</td>";
            }
        }
        tbodyOut +=  '</tr>';
        
        tbody.innerHTML = tbodyOut;
        console.log(tbody);
    }


    // gets called when a line gets selected (via radio button or klick on the row)
    private getSelectedRB() {
        var toReturn = 0;
        for(var idx = 0; idx <= this.dbData.length; idx++)  {
            var b : any = document.getElementById("btnRadio" + idx);

            if(b.checked) {
                toReturn = idx;
                console.log(idx);
                break;
            }
        }
        return toReturn;
    }
    

    outsourceFromWarehouse() {
        //TODO: Transaction erstellen + Tabelle updaten
        //this.createNewTransaktion("Auslagerung");
        console.log("transaction created");
        this.updateExistingWarehouseEntry(this.selectedRow, false);
    }

    insertIntoWarehouse() {
        //this.createNewTransaktion("Einlagerung");
        this.updateExistingWarehouseEntry(this.selectedRow, true);
    }

    // CREATING A NEW TRANSAKTION
    createNewTransaktion(type: string, toAdd, source) {
        var menge = parseFloat(toAdd.Menge);
        var preis = parseFloat(toAdd.Preis);
        var sum = menge * preis;

        var json = {
            "Name": HeaderComponent.getUsername(),
            "Produkt": toAdd.Warengruppe,
            "Menge": toAdd.Menge,
            "Einheit": toAdd.Mengenangabe,
            "PreisProEinheit": preis,
            "Gesamtpreis":  sum,
            "Waehrung": "€",
            "Datum": new Date(),
            "Typ": type,
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
        //TODO: fill newEntry with new data from the popup dialog
        if(isInsert)
            newEntry["Menge"] = toInteger(newEntry["Menge"]) + toInteger(input.value) + "";
        else
            newEntry["Menge"]= toInteger(newEntry["Menge"]) - toInteger(input.value) + "";

        var json = {"source": oldEntry, "destination": newEntry};


        console.log(newEntry);
        console.log(json);
        console.log(AppComponent.getLink("update", "&table=" + this.currentTable));
        this.http.put(AppComponent.getLink("update", "&table=" + this.currentTable), json)
        .map(res => res.json()).subscribe((data) => {
            console.log("SUCCESS");
            console.log(data);
            this.createNewTransaktion(isInsert ? "Einlagerung" : "Auslagerung", data.updated, data.source).map(res => res.json()).subscribe((data) => {
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
    addNewWarehouseEntry() {
        return this.http.post(
            AppComponent.getLink("add", "&table="+this.currentTable), 
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
   

    ngOnInit() {
        this.getItems(AppComponent.getLink("read", "&table=Rohwaren"));
     }

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
                this.color = (document.getElementById("txt_Color") as HTMLInputElement).value;
                break;
            case "name":
                this.name = (document.getElementById("txt_Name") as HTMLInputElement).value;
                break;
            case "strength":
                this.strength = (document.getElementById("txt_Strength") as HTMLInputElement).value;
                break;
        }

        this.generateTable(this.dbData, { colornr : this.color, name : this.name, strength: this.strength });
    }

    getItems (url : string) {
        var theader : HTMLElement = document.getElementById('warehouseitemtable').getElementsByTagName('thead')[0];
        var theaderOut : string = "";

        this.dbData = new Array<any>();

        this.http.get(url).subscribe(res =>{
            res.json().map(e => {
                this.dbData.push(e);
            })

            theaderOut += "<tr><td>Nr</td>";
            for(var key in this.dbData[0])
                if(!key.includes("id"))
                    theaderOut += "<td>" + key + "</td>";
    
            theaderOut += "<td>#</td></tr>";
    
            theader.innerHTML = theaderOut;
            this.generateTable(this.dbData, { colornr : this.color, name : this.name, strength: this.strength });
        });
    }
    
    generateTable(data : Array<any>, filter : any) {
        var tbody : HTMLTableSectionElement = document.getElementById('warehouseitemtable').getElementsByTagName('tbody')[0];
        var tbodyOut : string = "";
        
        for(var idx = 0; idx < data.length; idx++) {
            if(this.shouldShowEntry(data[idx], filter)) { 
                    tbodyOut += "<tr><th scope=\"col\">" + (idx+1) + "</th>";

                    for (var key in this.dbData[0]) {
                        if(!key.includes("id")) {
                            tbodyOut += "<td>" + data[idx][key] + "</td>";
                        }
                    }

                    tbodyOut +=  '<td><div class="radio">'
                            + '<input type="radio" name="selectionRadioBs" '
                            + 'id="btnRadio' + idx +'" value="' + idx +'"'
                            + ')"/></div></td></tr>';
                }
            } 
        tbody.innerHTML = tbodyOut;
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

    }

    adjustColumnsForRohwaren() {

    }
}

