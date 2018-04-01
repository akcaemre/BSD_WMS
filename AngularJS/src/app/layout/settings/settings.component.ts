import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { Http } from '@angular/http';
import { Input } from '@angular/compiler/src/core';
import { AppComponent } from '../../app.component';
import { HeaderComponent } from '../../layout/components/header/header.component';
import { tryParse } from 'selenium-webdriver/http';

@Component({
    selector: 'app-login',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    animations: [routerTransition()]
})
export class SettingsComponent implements OnInit {
    private in : HTMLInputElement;
    private email : HTMLInputElement;
    private username : HTMLInputElement;
    private password : HTMLInputElement;
    private passwordConf : HTMLInputElement;

    constructor(public router: Router, private http : Http) { }

    ngOnInit() {
        this.in = document.getElementById("input_IP") as HTMLInputElement;
        this.email = document.getElementById("input_email") as HTMLInputElement;
        this.username = document.getElementById("input_username") as HTMLInputElement;
        this.password = document.getElementById("input_password") as HTMLInputElement;
        this.passwordConf = document.getElementById("input_passwordConf") as HTMLInputElement;
        this.fillUsers();
    }

    private fillUsers() {
        
        this.http.get(AppComponent.getLink("read", "&table=users")).subscribe(res =>{
            res.json().map(e => {
                document.getElementById("tbody_Users").innerHTML += "<td>" + e.email + "</td><td>" + e.username + "</td>";
            })
        });
    }

    register() {
        if(this.email.value === ""
        || this.username.value === ""
        || this.password.value === ""
        || this.passwordConf.value === "") {
            console.log("Bitte füllen Sie alle Felder aus!");
            return;
        }

        if(this.password.value !== this.passwordConf.value) {
            console.log("Die Passwörter stimmen nicht überein!");
            return;
        }
    }

    setIP() {
        if(this.in.value === "localhost") {
            document.getElementById("p_outputIP").innerHTML = "Erfolgreich verändert! Neue IP: " + this.in.value;
            return;
        }

        try {
            if(!this.checkIP(this.in.value)) {
                document.getElementById("p_outputIP").innerHTML = "Die IP Adresse ist ungültig! [0-255].[0-255].[0-255].[0-255]";
                return;
            }
            AppComponent.setIP(this.in.value);
            document.getElementById("p_outputIP").innerHTML = "Erfolgreich verändert! Neue IP: " + this.in.value;
        } catch (err) {
            document.getElementById("p_outputIP").innerHTML = "Ein Fehler ist aufgetreten! Errormeldung: " + err;
        }
    }

    private checkIP (toCheck : string) {
        var toReturn = false;

        try { 
            var splitted = toCheck.split('.');
            toReturn = (parseInt(splitted[0]) >= 0 && parseInt(splitted[0]) <= 255)
                    && (parseInt(splitted[1]) >= 0 && parseInt(splitted[1]) <= 255)
                    && (parseInt(splitted[2]) >= 0 && parseInt(splitted[2]) <= 255)
                    && (parseInt(splitted[3]) >= 0 && parseInt(splitted[3]) <= 255);
        } catch (err) {
            throw err("Die IP Adresse ist ungültig! ([0-255].[0-255].[0-255].[0-255])");
        }

        return toReturn;
    }
}
