import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Input } from '@angular/compiler/src/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http/src/static_response';
import 'rxjs/add/operator/map'
import { AppComponent } from '../../app.component';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionComponent implements OnInit {    
    public transactions: Observable<Array<any>>;
    private _transactions : Array<any> = new Array<any>();

    constructor(private router: Router, private http : Http) {
        this.transactions = this.getTransactions();
        this.transactions.subscribe(
            res => this._transactions.push(res)
        );
    }

    ngOnInit() {
        //this.getTransactions();
    }

    getTransactions(){
        return this.http.get(AppComponent.getLink("read", "&table=Transaktionen"))
        .map((res : Response) => res.json());

        /*
        this.i = 1;
        var tbody : HTMLTableSectionElement = document.getElementById('myTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML +=  "<fieldset class=\"form-group\">";

		this.http.get(this.readUrl).subscribe(res =>{
            res.json().map(e => {

                tbody.innerHTML += 
                "<tr class=\" " + (e.Typ == "Auslagerung" ? "table-danger" : "table-success") + "\">"
                + "<th scope=\"row\">" + this.i + "</th>"
                + "<td>" + e.Name + "</td>"
                + "<td>" + e.Produkt + "</td>"
                + "<td>" + e.Menge + "</td>"
                + "<td>" + e.Einheit + "</td>"
                + "<td>" + e.PreisProEinheit + "</td>"
                + "<td>" + e.Gesamtpreis + "</td>"
                + "<td>" + e.Währung + "</td>"
                + "<td>" + e.Datum + "</td>"
                + "<td>" + '<div class="radio"><input type="radio" name="optionsRadios" id="btnRadio' + this.i + '" value="option' + this.i + '"></div>' +  "</td>"
              + "</tr>";
                this.i++;
            })});

            tbody.innerHTML += "</fieldset>";
            */
    }

    public printTransBySelection() {
        for(var idx = 1; idx <= this._transactions[0].length; idx++)  {
            var b : any = document.getElementById("btnRadio" + idx);
            if(b.checked) {
                this.printTrans(idx-1); break;
            }
        }
    }

    public printTrans (row) {
        this._transactions.forEach(function(next) {console.log(next);} );
        var content = this.getContent(
            this._transactions[0][row].Name,
            this._transactions[0][row].Produkt,
            this._transactions[0][row].Menge,
            this._transactions[0][row].Einheit,
            this._transactions[0][row].PreisProEinheit,
            this._transactions[0][row].Gesamtpreis,
            this._transactions[0][row].Waehrung,
            this._transactions[0][row].Datum,
            this._transactions[0][row].Bezahlt
        );
        var win = window.open("", "html", "resizable,scrollbars,status");

        win.document.open();
        win.document.write(content);
        win.document.close();
    }

    public getContent(Name, Produkt, Menge, Einheit, PreisProEinheit, Gesamtpreis, Währung, Datum, Bezahlt) {
        return '<!DOCTYPE html><html lang="en"> <head> <meta charset="utf-8"> <title>Rechnung_' + Name + '_' + Datum + '</title>'
        + '<style>#client,#logo{float:left}#company,#invoice{float:right;text-align:right}#invoice h1,h2.name,table td h3,table th{font-weight:400}#client,#notices{padding-left:6px;border-left:6px solid #0087C3}footer,table tfoot td{border-top:1px solid #AAA}@font-face{font-family:SourceSansPro;src:url(SourceSansPro-Regular.ttf)}.clearfix:after{content:"";display:table;clear:both}a{color:#0087C3;text-decoration:none}body{position:relative;width:21cm;height:29.7cm;margin:0 auto;color:#555;background:#FFF;font-size:14px;font-family:SourceSansPro}header{padding:10px 0;margin-bottom:20px;border-bottom:1px solid #AAA}#logo{margin-top:8px}#logo img{height:70px}#details{margin-bottom:50px}#client .to{color:#777}h2.name{font-size:1.4em;margin:0}#invoice h1{color:#0087C3;font-size:2.4em;line-height:1em;margin:0 0 10px}#invoice .date{font-size:1.1em;color:#777}table{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:20px}table td,table th{padding:20px;background:#EEE;text-align:center;border-bottom:1px solid #FFF}table th{white-space:nowrap}table td{text-align:right}table td h3{color:#57B223;font-size:1.2em;margin:0 0 .2em}table .no{color:#FFF;font-size:1.6em;background:#57B223}table td.qty,tabletd.total,table td.unit,table tfoot td{font-size:1.2em}table .desc{text-align:left}table .unit{background:#DDD}table .total{background:#57B223;color:#FFF}table tbody tr:last-child td,table tfoot tr td:first-child{border:none}table tfoot td{padding:10px 20px;background:#FFF;border-bottom:none;white-space:nowrap}table tfoot tr:first-child td{border-top:none}table tfoot tr:last-child td{color:#57B223;font-size:1.4em;border-top:1px solid #57B223}#thanks{font-size:2em;margin-bottom:50px}#notices .notice{font-size:1.2em}footer{color:#777;width:100%;height:30px;position:absolute;bottom:0;padding:8px 0;text-align:center}</style>' 
        + '<script>function printWindow(){var button=document.getElementById("bttn_Print"); button.hidden=true; window.print(); button.hidden=false;}</script>' 
        + '</head>' 
        + '<body>' 
        + '<header class="clearfix"> <div id="logo"> <img src="http://www.hlw-dl.at/cms/images/hlw_ci/hlw-dl-logo.png"> </div><div id="company"> <h2 class="name">HLW Deutschlandsberg</h2> <div>Lagergasse 11, 8530 Deutschlandsberg</div><div>0 (043) 4242 24809</div><div><a href="mailto:direktion@hlw-deutschlandsberg.at">direktion@hlw-deutschlandsberg.at</a></div></div></div></header>' 
        + '<main> <div id="details" class="clearfix">' 
        + '<div id="client"> <div class="to">Rechnung für:</div><h2 class="name">' + Name + '</h2> <div class="address">Lagergasse 11, 8530 Deutschlandsberg</div><div class="email"><a href="mailto:test@gmail.com">test@gmail.com</a></div></div>'
        + '<div id="invoice"> <h1>Rechnung</h1> <div class="date">Rechnungsdatum: ' + Datum + '</div></div></div>'
        + '<table border="0" cellspacing="0" cellpadding="0">'
        + '<thead> <tr> <th class="no">#</th> <th class="desc">Beschreibung</th> <th class="pricePerUnit">Preis pro Einheit</th> <th class="unit">Anzahl</th> <th class="qty">Einheit</th> <th class="total">Insgesamt</th> </tr></thead>'
        + '<tbody> <tr> <td class="no">01</td><td class="desc"><h3>' + Produkt + '</h3>Das beste aus dem ganzen Lande</td><td class="pricePerUnit">' + Währung + PreisProEinheit + '</td><td class="unit">' + Menge + '</td><td class="qty">' + Einheit + '</td><td class="total">' + Währung + (Gesamtpreis / 1.2).toFixed(2) + '</td></tr></tbody>'
        + '<tfoot> <tr> <td colspan="2"></td><td colspan="2">Zwischensumme</td><td>' + Währung + (Gesamtpreis / 1.2).toFixed(2) + '</td></tr><tr> <td colspan="2"></td><td colspan="2">MWSt. 20%</td><td>' + Währung + (Gesamtpreis - (Gesamtpreis / 1.2)).toFixed(2) + '</td></tr><tr> <td colspan="2"></td><td colspan="2">Insgesamt</td><td>' + Währung + Gesamtpreis + '</td></tr></tfoot>'
        + '</table>'
        + '<div id="thanks">Vielen Dank für den Einkauf!</div>'
        + '<p style=text-align:center;font-size:30px;color:' + (Bezahlt == "true" ? 'green' : 'red')+'>Rechnung ' + (Bezahlt == "true" ? 'bezahlt' : 'ausständig') + '</p>'
        + '<button id="bttn_Print" onclick="printWindow()"> Ausdrucken </button> </main>'
        + '<footer> <p>Rechnung erstellt am: ' + new Date() + '</p></footer> </body></html>';
    }
}