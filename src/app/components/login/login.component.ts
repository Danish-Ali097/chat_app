import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService:AuthService) {
    this.form = this.fb.group({
      isEmailLogin: [true, Validators.required],
      email: ['', Validators.email],
      code: [''],
      phone: [''],
      password:['',[Validators.required]]
    });

    // Subscribe to changes in isEmailLogin to update validators accordingly
    this.form.get('isEmailLogin')?.valueChanges.subscribe(isEmailLogin => {
      this.updateValidators(isEmailLogin);
    });

    // Initialize validators based on the initial value of isEmailLogin
    this.updateValidators(this.form.get('isEmailLogin')?.value);
  }

  updateValidators(isEmailLogin: boolean) {
    const emailControl = this.form.get('email');
    const codeControl = this.form.get('code');
    const phoneControl = this.form.get('phone');

    if (isEmailLogin) {
      emailControl?.setValidators([Validators.required, Validators.email]);
      codeControl?.clearValidators();
      phoneControl?.clearValidators();
    } else {
      emailControl?.clearValidators();
      codeControl?.setValidators(Validators.required);
      phoneControl?.setValidators(Validators.required);
    }

    // Update the value and validity of the controls
    emailControl?.updateValueAndValidity();
    codeControl?.updateValueAndValidity();
    phoneControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.authService.login(this.form.value)
      .subscribe();
    }
  }
}
