import { Component, OnInit } from '@angular/core';
import { initTE, Input, Ripple } from 'tw-elements';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    initTE({ Input, Ripple });
  }
}
