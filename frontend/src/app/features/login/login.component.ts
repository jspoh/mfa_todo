import { Component, OnInit } from '@angular/core';
import { initTE, Input, Ripple } from 'tw-elements';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any;

  constructor(fb: FormBuilder, private dataService: DataService, private router: Router) {
    this.loginForm = fb.group({
      username: [
        { value: '', disabled: false },
        [
          Validators.required, 
          // Validators.pattern(/^[a-zA-Z0-9]{5,}$/g)
        ],
      ],
      password: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()|:;'"><,.\/?_=+-]).{8,}$/g
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    initTE({ Input, Ripple });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const payload = this.loginForm.value;
    this.dataService
      .loginUser(payload)
      .pipe(take(1))
      .subscribe({
        next(value) {
          console.log(value);
        },
        error(err) {
          console.error(err);
        },
      });
  }
}
