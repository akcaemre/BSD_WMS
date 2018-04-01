import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public static uid : string;

    constructor() {
        //window.addEventListener("beforeunload", function() { localStorage.removeItem('isLoggedin')});
        localStorage.setItem("IP", "localhost");
    }

    /**
     * Returns the generated Link. 
     * Queryparams has to start with a '&'
     * @param site 
     * @param queryparams 
     */
    public static getLink(site : string, queryparams : string) {
        return "http://" + localStorage.getItem("IP") + ":1337/" + site + "?uid=5abfa0b55b980f1cde63d321" + queryparams;
    }

    public static setIP(ip : string) {
        localStorage.setItem("IP", ip);
    }

    ngOnInit() {}
}
