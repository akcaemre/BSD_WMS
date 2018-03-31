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
    }

    ngOnInit() {}
}
