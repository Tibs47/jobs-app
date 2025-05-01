import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public tableInfo = [
    {
      colName: 'category',
      colDesc: 'Kategorija',
      colWidth: '200px',
      textAlign: '',
    },
    {
      colName: 'name',
      colDesc: 'Artikl',
      colWidth: '300px',
      textAlign: '',
    },
    {
      colName: 'description',
      colDesc: 'Opis',
      colWidth: '450px',
      textAlign: '',
    },
    {
      colName: 'active',
      colDesc: 'Aktivno',
      colWidth: '90px',
      textAlign: '',
    },
    {
      colName: 'price',
      colDesc: 'Cijena',
      colWidth: '90px',
      textAlign: 'right',
    },
    {
      colName: 'currency',
      colDesc: 'Valuta',
      colWidth: '90px',
      textAlign: '',
    },
    {
      colName: 'in_stock',
      colDesc: 'U skladištu',
      colWidth: '150px',
      textAlign: '',
    },
    {
      colName: 'unit',
      colDesc: 'Mj. jedinica',
      colWidth: '150px',
      textAlign: '',
    },
    {
      colName: 'created_at',
      colDesc: 'Kreirano',
      colWidth: '250px',
      textAlign: '',
    },
    {
      colName: 'last_update',
      colDesc: 'Ažurirano',
      colWidth: '250px',
      textAlign: '',
    },
  ];

  public title = 'Admin';
  public artikli: any[] = [];
  public sortCol = { colName: '', direction: false };

  public showFilter = false;
  public filterData: { [key: string]: any } = {};

  public tooltipPosition = { top: '0px', left: '0px' };
  public showTooltip = false;
  public tooltipMessage = '';

  async ngOnInit() {
    this.sortCol = { colName: '', direction: false };
    const { data, error } = await supabase
      .from('ARTIKLI')
      .select('*');
    if (error) {
      console.error('Greška pri dohvaćanju artikala:', error.message);
    } else {
      this.artikli = data;
      console.log(this.artikli);
    }
  }

  public async sortArticles(column: string) {
    if(this.sortCol.colName === column) {
      if(this.sortCol.direction === true) {
        this.sortCol.direction = false;
      } else {
        this.sortCol.direction = true;
      }
    } else {
      this.sortCol.colName = column;
      this.sortCol.direction = false;
    }
    const { data, error } = await supabase
    .from('ARTIKLI')
    .select('*')
    .order(this.sortCol.colName, { ascending: this.sortCol.direction });
    if (error) {
      console.error('Greška pri dohvaćanju artikala:', error.message);
    } else {
      this.artikli = data;
      console.log(this.artikli);
    }
  }

  public async removeArticle(id: number) {
    console.log(id);
  }

  public filterArticles() {

  }

  public clearFilter() {
    for (const key in this.filterData) {
      if (this.filterData.hasOwnProperty(key)) {
        this.filterData[key] = '';
      }
    }
    this.ngOnInit();
  }

  //tooltips START
  public toggleTooltip(show: boolean, event?: MouseEvent, tip?: string) {
    if (show && event && tip) {
      this.showTooltip = true;
      this.tooltipMessage = tip || '';
    } else {
      if (event) {
        this.tooltipPosition.top = event?.clientY + 20 + 'px';
        this.tooltipPosition.left = event?.clientX - 20 + 'px';
        if (event?.clientX - 20 < 0) {
          this.tooltipPosition.left = '0px';
        }
      } else {
        this.showTooltip = false;
      }
    }
  }
  //tooltips END
}
