import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Http } from '@angular/http';
import { Response } from '@angular/http/src/static_response';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from '../../app.component';

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
    private currentTable : string = "Lager";
    public Lagereintrag: Observable<Array<any>>;

    constructor(private http: Http){
        this.setClickedRow = function(index){
            this.selectedRow = index;
        }
    };

    ngOnInit() {
        this.getItems(AppComponent.getLink("read", "&table=Rohwaren"));
     }
    
    radioButtonOnClick (table : string) {
        if(table == "Naehseide") {
            (document.getElementById("txt_Color") as HTMLInputElement).removeAttribute("disabled");
            (document.getElementById("txt_Strength") as HTMLInputElement).removeAttribute("disabled");
        } else {
            (document.getElementById("txt_Color") as HTMLInputElement).setAttribute("disabled", "true");
            (document.getElementById("txt_Strength") as HTMLInputElement).setAttribute("disabled", "true");
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
    
            theaderOut += "</tr>";
    
            theader.innerHTML = theaderOut;
            this.generateTable(this.dbData, { colornr : this.color, name : this.name, strength: this.strength });
        });
    }

    generateTable(data : Array<any>, filter : any) {
        var tbody : HTMLTableSectionElement = document.getElementById('warehouseitemtable').getElementsByTagName('tbody')[0];
        var tbodyOut : string = "";
        
        for(var idx = 0; idx < data.length; idx++) {
            if(this.shouldShowEntry(data[idx], filter)) { 
                    tbodyOut += "<tr><th scope=\"row\">" + (idx+1) + "</th>";

                    for (var key in this.dbData[0]) {
                        if(!key.includes("id")) {
                            tbodyOut += "<td>" + data[idx][key] + "</td>";
                        }
                    }

                    tbodyOut +=  "</tr>";
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
}