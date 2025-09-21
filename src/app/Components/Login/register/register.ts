import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // Reactive Form
  registerForm = new FormGroup({
    Username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Fullname: new FormControl('', [Validators.required]),
    ProfileImage: new FormControl(null), // For file uploads, you often handle this separately
    Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    ConfirmPassword: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    MobileNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    State: new FormControl('', [Validators.required]),
    termsAgreed: new FormControl(false, [Validators.requiredTrue]),
  });

  constructor() {}

  onSubmit() {
    if (this.registerForm.valid) {
      // Logic to handle form submission
      // e.g., send data to a backend API
      console.log('Form is valid and ready to submit:', this.registerForm.value);

      // You can add your HTTP call here
      // this.http.post('YOUR_API_ENDPOINT', this.registerForm.value).subscribe(...)

    } else {
      console.log('Form is invalid. Please check the fields.');
      // You can add logic to display validation errors to the user
    }
  }
}
