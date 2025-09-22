import { Toastr } from './../../../Service/toastr';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { apiConfig } from '../../../Global/apiConfig';

// Custom validator to check if passwords match
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('Password');
  const confirmPassword = control.get('ConfirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

// Custom validator to prevent spaces and special characters in username
export const noSpecialCharsOrSpaces: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const forbidden = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const hasForbiddenChars = forbidden.test(control.value) || control.value?.includes(' ');
  return hasForbiddenChars ? { specialCharsOrSpaces: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  apiUrl = apiConfig.apiUrl;

  //Constructor to Inject the Services
  constructor(private http: HttpClient, private toastr: Toastr) {}

  // Reactive Form with tighter validations
  registerForm = new FormGroup(
    {
      Username: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        noSpecialCharsOrSpaces, // Custom validator for username
      ]),
      Fullname: new FormControl('', [Validators.required]),
      ProfileImage: new FormControl(null),
      ProfileImageBase64: new FormControl(''),
      ProfileImageName: new FormControl(''),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$'), // Example for strong password
      ]),
      ConfirmPassword: new FormControl('', [Validators.required]),
      Email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), // Basic email pattern
      ]),
      MobileNo: new FormControl('', [
        Validators.required,
        Validators.pattern('^[6-9][0-9]{9}$'), // 10 digits starting with 6-9
      ]),
      State: new FormControl('', [Validators.required]),
      termsAgreed: new FormControl(false),
    },
    { validators: passwordMatchValidator }
  ); // Group-level validator for password match

  onFileChange(event: any) {
    const file = event.target.files[0];
    const profileImageControl = this.registerForm.get('ProfileImage');

    profileImageControl?.setErrors(null);

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        profileImageControl?.setErrors({ fileType: true });
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSize) {
        profileImageControl?.setErrors({ fileSize: true });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.registerForm.patchValue({
          ProfileImageBase64: base64String,
          ProfileImageName: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.registerForm.patchValue({
        ProfileImageBase64: '',
        ProfileImageName: '',
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.registerForm.get('termsAgreed')?.value == false) {
        this.toastr.showError('You must agree to the terms and conditions.');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      //Call the API to register the User
      this.http
        .post<any>(`${this.apiUrl}Auth/Register`, this.registerForm.value, {headers})
        .subscribe({
          next: (res) => {
            if (res.state == 0) {
              this.toastr.showSuccess('Registration successful!');
            } else if (res.state == 1) {
              this.toastr.showError(res.errorMessage || 'Registration failed. Please try again.');
            }
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
      this.toastr.showError('Please correct the errors in the form before submitting.');
    }
  }
}
