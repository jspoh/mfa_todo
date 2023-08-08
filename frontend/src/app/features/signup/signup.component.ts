import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: any;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.signupForm = this.fb.group({
      name: [{ value: '', disabled: false }, [Validators.required]],
      username: [
        { value: '', disabled: false },
        [Validators.required, 
          Validators.pattern(/^[a-zA-Z0-9]{5,30}$/)
        ],
      ],
      password: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()|:;'"><,.\\/?_=+-]).{8,}$/
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  onSignup() {
    if (this.signupForm.invalid) {
      alert('Invalid form!');
      return;
    }

    this.dataService
      .signupUser(this.signupForm.value)
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
