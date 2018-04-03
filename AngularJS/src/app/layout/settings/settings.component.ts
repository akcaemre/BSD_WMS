import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { Http } from '@angular/http';
import { Input } from '@angular/compiler/src/core';
import { AppComponent } from '../../app.component';
import { HeaderComponent } from '../../layout/components/header/header.component';
import { tryParse } from 'selenium-webdriver/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-login',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    animations: [routerTransition()]
})
export class SettingsComponent implements OnInit {
    private ip : string;
    private email : string;
    private username : string;
    private password : string;
    private passwordConf : string;
    private userEntries : Array<User>;

    constructor(public router: Router, private http : Http) {
        window.addEventListener('load', function() {
            var forms = document.getElementsByClassName('needs-validation');
            var validation = Array.prototype.filter.call(forms, function(form) {
              form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
                form.classList.add('was-validated');
              }, false);
            });
          }, false);
     }

    ngOnInit() {
        this.refreshUserList();
    }

    deleteUser() {
        for(var idx = 0; idx <= this.userEntries.length; idx++)  {
            var b : any = document.getElementById("btnRadio" + idx);
            if(b.checked) {
                this.http.delete(AppComponent.getLink("delete", 
                "&table=users&email=" + this.userEntries[idx].getEmail())).subscribe(data => {
                    this.setError(this.userEntries[idx].getEmail() + " wurde gelöscht", "green");
                    this.refreshUserList();
                },
                error => {
                    this.setError(this.userEntries[idx].getEmail() + " wurde nicht gelöscht. -> " + error, "red");
                });
                return;
            }
        }
    }

    private refreshUserList() {
        document.getElementById("tbody_Users").innerHTML = "";
        this.userEntries = new Array<User>();
        var idx = 0;
        this.http.get(AppComponent.getLink("read", "&table=users")).subscribe(res =>{
            res.json().map(e => {
                this.userEntries.push(new User(e.username, e.email));
                document.getElementById("tbody_Users").innerHTML += "<td>" + e.email + "</td><td>" + e.username + "</td><td><input id=\"btnRadio" + idx + "\" type=\"radio\" name=\"optionsRadio\" /></td>";
                idx++;
            })
        });
    }

    register() {
        if (this.email === undefined
        ||  this.username === undefined
        ||  this.password === undefined
        ||  this.passwordConf === undefined
        ||  this.email === ""
        ||  this.username === ""
        ||  this.password === ""
        ||  this.passwordConf === "") {
            return;
        }

        if(this.password !== this.passwordConf) {
            this.setError("Passwörter stimmen nicht überein!", "red");
            return;
        }

        this.http.post(
            AppComponent.getLink("signin", ""),
            {
                "email": this.email,
                "username": this.username,
                "password": this.password,
                "passwordConf": this.passwordConf            
            }).map(res => res.json()).subscribe(
            (data) => {
                this.setError("Status: Erfolgreich registriert!", "green");
                this.refreshUserList();
            },
            (err) => {
                this.setError("Status: Fehlgeschlagen! Meldung: " + err, "red")
            });
    }

    private setError(msg : string, color : string) {
        document.getElementById("out").innerHTML = "Status: " + msg;
        document.getElementById("out").setAttribute("style", "color:" + color);
    }

    setIP() {
        if(this.ip === "localhost") {
            document.getElementById("p_outputIP").innerHTML = "Erfolgreich verändert! Neue IP: " + this.ip;
            return;
        }

        try {
            if(!this.checkIP(this.ip)) {
                document.getElementById("p_outputIP").innerHTML = "Die IP Adresse ist ungültig! [0-255].[0-255].[0-255].[0-255]";
                return;
            }
            AppComponent.setIP(this.ip);
            document.getElementById("p_outputIP").innerHTML = "Erfolgreich verändert! Neue IP: " + this.ip;
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

export class User {
    private email : string;
    private username : string;
    
    constructor(paramUsername : string, paramEmail : string) {
        this.email = paramEmail;
        this.username = paramUsername;
    }

    public getEmail() { return this.email; }
    public getUsername() { return this.username; }
}