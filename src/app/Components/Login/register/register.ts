import { Toastr } from './../../../Service/toastr';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  constructor(private http: HttpClient, private toastr: Toastr) {}

  formData = {
    Username: '',
    Fullname: '',
    ProfileImageBase64: '',
    ProfileImageName: '',
    Password: '',
    ConfirmPassword: '',
    Email: '',
    MobileNo: '',
    State: '',
  };

  // Reactive Form
  registerForm = new FormGroup({
    Username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Fullname: new FormControl('', [Validators.required]),
    ProfileImage: new FormControl(null),
    Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    ConfirmPassword: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    MobileNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    State: new FormControl('', [Validators.required]),
    termsAgreed: new FormControl(false, [Validators.requiredTrue]),
    ProfileImageBase64: new FormControl(''),
    ProfileImageName: new FormControl(''),
  });

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

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        profileImageControl?.setErrors({ fileSize: true });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];

        this.formData.ProfileImageBase64 = base64String;
        this.formData.ProfileImageName = file.name;

        this.registerForm.patchValue({
          ProfileImageBase64: this.formData.ProfileImageBase64,
          ProfileImageName: this.formData.ProfileImageName,
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.formData.ProfileImageBase64 = '';
      this.formData.ProfileImageName = '';
    }
  }

  onSubmit() {
    if (
      this.registerForm.get('Username')?.value == '' ||
      this.registerForm.get('Username')?.value === null
    ) {
      this.toastr.showError('Username is Mandatory.');
      this.registerForm.get('Username')?.setErrors({ mismatch: true });
      return;
    }
    if (
      this.registerForm.get('Password')?.value !== this.registerForm.get('ConfirmPassword')?.value
    ) {
      this.toastr.showError('Password and Confirm Password do not match.');
      this.registerForm.get('ConfirmPassword')?.setErrors({ mismatch: true });
      return;
    } else if (
      this.registerForm.get('Password')?.value === this.registerForm.get('ConfirmPassword')?.value
    ) {
      this.registerForm.get('ConfirmPassword')?.setErrors(null);
    }

    if (this.registerForm.valid) {
      console.log('Form is valid and ready to submit:', this.formData);

      // Here you would make your HTTP call to the backend API:
      // this.http.post('YOUR_API_ENDPOINT', this.formData).subscribe(...)
    } else {
      console.log('Form is invalid. Please check the fields.');
      this.toastr.showError('Form is invalid. Please check the fields.');
      // Mark all controls as touched to show validation errors
      this.registerForm.markAllAsTouched();
    }
  }
}
