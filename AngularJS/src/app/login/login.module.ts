import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AlertComponent } from '../layout/bs-component/components/alert/alert.component';

@NgModule({
    imports: [
        CommonModule, 
        LoginRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
    ],
    declarations: [
        LoginComponent,
        AlertComponent
    ]
})
export class LoginModule {}
