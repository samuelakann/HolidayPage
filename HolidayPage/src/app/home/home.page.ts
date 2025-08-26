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
  languages?: Record<string,string>;
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
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      
      this.http.get<any>('https://ipapi.co/json/').subscribe({
        next: (data) => {
          const countryName = data.country_name; // e.g., "Spain"
          this.fetchCountryInfo(countryName);
        },
        error: () => {
          this.locationError = 'Could not determine your country';
          this.loadingLocation = false;
        }
      });

    } catch (err) {
      console.error(err);
      this.locationError = 'Geolocation failed';
      this.loadingLocation = false;
    }
  }

  fetchCountryInfo(name: string) {
    this.http.get<Country[]>(`https://restcountries.com/v3.1/name/${name}`)
      .subscribe({
        next: (data) => {
          this.currentCountry = data[0];
          this.loadingLocation = false;
        },
        error: () => {
          this.locationError = 'Could not fetch country info';
          this.loadingLocation = false;
        }
      });
  }
}
