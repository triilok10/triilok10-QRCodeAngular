import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { apiConfig } from '../../../Global/apiConfig';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  apiUrl = apiConfig.apiUrl;

  constructor(private http: HttpClient) {}

  //Reactive Form
  loginForm = new FormGroup({
    Username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {

    if (this.loginForm.valid) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      this.http.post<any>(`${this.apiUrl}Auth/login`, this.loginForm.value, { headers }).subscribe({
        next: (res) => {
          console.log('Login success:', res);
        },
        error: (err) => {
          console.error('Login failed:', err);
        },
      });
    }
  }
}
