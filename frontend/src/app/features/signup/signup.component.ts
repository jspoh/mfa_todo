import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: any;

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router, private userService: UserService) {
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
        next: (val) => {
          console.log(val);
          alert('Signup successful!')
          this.router.navigate([`/login`]);
        },
        error(err) {
          console.error(err);

          if (err.error.slice(0, 64) === "(pymysql.err.OperationalError) (1644, 'Username already exists')") {
            alert("Username already exists!");
          }
        },
      });
  }
}
