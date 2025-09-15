import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Header } from "../Common/header/header";
import { Footer } from "../Common/footer/footer";
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements AfterViewInit {
  @ViewChild('qrDisplay', { static: true }) qrDisplay!: ElementRef;
  @ViewChild('qrPlaceholder', { static: true }) qrPlaceholder!: ElementRef;

  ngAfterViewInit(): void {
    document.getElementById('generate-qr-btn')?.addEventListener('click', () => {
      this.qrPlaceholder.nativeElement.remove();

      // Correct QR code generation with only `width` in options
      QRCode.toDataURL('https://cardify.example.com/trilok', { width: 250 })
        .then((url) => {
          const img = document.createElement('img');
          img.src = url;
          img.classList.add('img-fluid', 'rounded');
          this.qrDisplay.nativeElement.appendChild(img);
        })
        .catch((err) => {
          console.error('QR Code generation failed:', err);
        });
    });
  }
}
