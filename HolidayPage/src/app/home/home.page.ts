import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonHeader,IonToolbar,IonTitle,IonContent,IonItem,IonLabel,IonInput,IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,IonHeader,IonToolbar,IonTitle,IonItem,IonInput,IonButton, IonContent, IonLabel],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  destination: string = '';

  constructor(private router: Router) {}

  search() {
    if (this.destination.trim()) {
      this.router.navigate(['/destinations'], { queryParams: { q: this.destination } });
    }
  }
}
