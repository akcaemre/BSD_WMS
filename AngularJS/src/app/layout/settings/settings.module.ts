import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
    imports: [
        CommonModule, 
        SettingsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
    ],
    declarations: [
        SettingsComponent    ]
})
export class SettingsModule {}
