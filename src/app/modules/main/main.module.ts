import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { ModalComponent } from './components/modal/modal.component';


@NgModule({
  declarations: [
    HeaderComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ],
  exports: [
    ModalComponent,
    HeaderComponent
  ]
})
export class MainModule { }
