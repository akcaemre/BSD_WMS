import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public static uid : string;

    constructor(private http: Http) {
        window.addEventListener("beforeunload", function() { localStorage.removeItem('isLoggedin')});

	AppComponent.setIP(location.host.split(':')[0]);

    }

    ngOnInit() {}

    /**
     * Returns the generated Link. 
     * Queryparams has to start with a '&'
     * @param site 
     * @param queryparams 
     */
    public static getLink(site : string, queryparams : string) {
	console.log(localStorage.getItem("IP"));
        return "http://" + localStorage.getItem("IP") + ":1337/" + site + "?uid=" + this.uid + queryparams;
    }

    public static setIP(ip : string) {
        localStorage.setItem("IP", ip);
    }
}
