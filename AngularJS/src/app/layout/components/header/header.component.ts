import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    private static uname : string;

    constructor(private translate: TranslateService, public router: Router) { }
    ngOnInit() {
        if(HeaderComponent.uname)
            document.getElementById("uname").innerHTML = " " + HeaderComponent.uname + " ";
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    public static setUsername(newUsername : string) {
        HeaderComponent.uname = newUsername;
    }

    public static getUsername() { return HeaderComponent.uname; }
}
