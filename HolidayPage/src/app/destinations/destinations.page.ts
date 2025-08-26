import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,  
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner
  ],
  templateUrl: './destinations.page.html',
  styleUrls: ['./destinations.page.scss']
})
export class DestinationsPage implements OnInit {
  query: string = '';
  results: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.query = this.route.snapshot.queryParamMap.get('q') || '';
    if (this.query) {
      this.fetchDestinations(this.query);
    } else {
      this.loading = false;
      this.error = 'No destination provided';
    }
  }

  fetchDestinations(query: string) {
    this.loading = true;
    this.http.get<any[]>(`https://restcountries.com/v3.1/name/${query}`)
      .subscribe({
        next: (data) => {
          this.results = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'No results found';
          this.loading = false;
        }
      });
  }
}
