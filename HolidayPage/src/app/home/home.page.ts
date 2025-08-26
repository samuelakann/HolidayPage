import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';

interface Country {
  name: { common: string; official: string };
  region: string;
  population: number;
  capital?: string[];
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  destination: string = '';
  currentCountry: Country | null = null;
  loadingLocation: boolean = false;
  locationError: string = '';

  private OPENWEATHER_KEY = 'e06e6dd79dcd1680d8facb99f3660385'; // replace with your key

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.getUserCountry();
  }

  search() {
    if (this.destination.trim()) {
      this.router.navigate(['/destinations'], { queryParams: { q: this.destination } });
    }
  }

  async getUserCountry() {
    this.loadingLocation = true;
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // OpenWeatherMap reverse geocoding
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.OPENWEATHER_KEY}`;
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          if (data.length > 0) {
            const countryISO = data[0].country; // e.g., "ES"
            this.fetchCountryInfo(countryISO);
          } else {
            this.locationError = 'Could not determine your country';
            this.loadingLocation = false;
          }
        },
        error: (err) => {
          console.error('OpenWeatherMap Geocoding API error:', err);
          this.locationError = 'Geocoding API failed';
          this.loadingLocation = false;
        }
      });
    } catch (err) {
      console.error('Geolocation error:', err);
      this.locationError = 'Geolocation failed';
      this.loadingLocation = false;
    }
  }

  fetchCountryInfo(isoCode: string) {
    // REST Countries API can fetch by alpha code
    this.http.get<Country[]>(`https://restcountries.com/v3.1/alpha/${isoCode}`).subscribe({
      next: (data) => {
        this.currentCountry = data[0];
        this.loadingLocation = false;
      },
      error: (err) => {
        console.error('REST Countries API error:', err);
        this.locationError = 'Could not fetch country info';
        this.loadingLocation = false;
      }
    });
  }
}
