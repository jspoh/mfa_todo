import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodosRoutingModule } from './todos-routing.module';
import { TodosComponent } from './todos.component';
import { Error404Module } from 'src/app/components/error404/error404.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TodosComponent
  ],
  imports: [
    CommonModule,
    TodosRoutingModule,
    Error404Module,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TodosModule { }
