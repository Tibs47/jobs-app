import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  artikli: any[] = [];

  async ngOnInit() {
    const { data, error } = await supabase
      .from('ARTIKLI') // or your table name, e.g., 'products'
      .select('*');
    if (error) {
      console.error('Greška pri dohvaćanju artikala:', error.message);
    } else {
      this.artikli = data;
      console.log(this.artikli);
    }
  }
}
