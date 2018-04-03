import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public static uid : string;

    constructor() {
        window.addEventListener("beforeunload", function() { localStorage.removeItem('isLoggedin')});
        if(localStorage.getItem("IP") == undefined || localStorage.getItem("IP") == "")
            localStorage.setItem("IP", "localhost");
    }

    ngOnInit() {}

    /**
     * Returns the generated Link. 
     * Queryparams has to start with a '&'
     * @param site 
     * @param queryparams 
     */
    public static getLink(site : string, queryparams : string) {
        return "http://" + localStorage.getItem("IP") + ":1337/" + site + "?uid=" + this.uid + queryparams;
    }

    public static setIP(ip : string) {
        localStorage.setItem("IP", ip);
    }
}
