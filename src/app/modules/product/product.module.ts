import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainModule } from '../main/main.module';
import { ProductListSkeletonComponent } from './components/product-list-skeleton/product-list-skeleton.component';
import { ProductFormSkeletonComponent } from './components/product-form-skeleton/product-form-skeleton.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    ProductListSkeletonComponent,
    ProductFormSkeletonComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MainModule
  ]
})
export class ProductModule { }
