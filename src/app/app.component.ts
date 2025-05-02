import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
      admin: false,
    },
    {
      colName: 'name',
      colDesc: 'Artikl',
      colWidth: '300px',
      textAlign: '',
      admin: false,
    },
    {
      colName: 'description',
      colDesc: 'Opis',
      colWidth: '450px',
      textAlign: '',
      admin: false,
    },
    {
      colName: 'active',
      colDesc: 'Aktivno',
      colWidth: '90px',
      textAlign: '',
      admin: true,
    },
    {
      colName: 'price',
      colDesc: 'Cijena',
      colWidth: '90px',
      textAlign: 'right',
      admin: false,
    },
    {
      colName: 'currency',
      colDesc: 'Valuta',
      colWidth: '90px',
      textAlign: '',
      admin: false,
    },
    {
      colName: 'in_stock',
      colDesc: 'U skladištu',
      colWidth: '150px',
      textAlign: 'right',
      admin: true,
    },
    {
      colName: 'unit',
      colDesc: 'Mj. jedinica',
      colWidth: '150px',
      textAlign: '',
      admin: false,
    },
    {
      colName: 'created_at',
      colDesc: 'Kreirano',
      colWidth: '250px',
      textAlign: '',
      admin: true,
    },
    {
      colName: 'last_update',
      colDesc: 'Ažurirano',
      colWidth: '250px',
      textAlign: '',
      admin: true,
    },
  ];

  public title = 'Admin';
  public artikli: any[] = [];
  public sortCol = { colName: '', direction: false };

  public showFilter = false;
  public filterApplied = false;
  public filterData: { [key: string]: any } = {};

  public showNewRow = false;
  public newRow: { [key: string]: any } = {};

  public tooltipPosition = { top: '0px', left: '0px' };
  public showTooltip = false;
  public tooltipMessage = '';

  async ngOnInit() {
    this.sortCol = { colName: '', direction: false };
    this.getArticles();
  }

  public toggleRoles(role: string) {
    if(role === 'K') {
      this.showNewRow = false;
      this.title = 'Korisnik';
    } else if (role === 'A'){
      this.title = 'Admin';
    }
  }

  public async getArticles() {
    let query = supabase
      .from('ARTIKLI')
      .select('*');

    if(this.filterApplied) {
      for (const key in this.filterData) {
        const value = this.filterData[key];
        if (value !== '' && value !== null && value !== undefined) {
          query = query.ilike(key, `%${value}%`);
        }
      }
    }

    if(this.sortCol.colName !== '') {
      query = query.order(this.sortCol.colName, { ascending: this.sortCol.direction });
    }

    const { data, error } = await query;
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Dogodila se greška',
        text: error.message,
        showConfirmButton: true
      });
    } else {
      this.artikli = data;
      console.log(this.artikli);
    }
  }

  public sortArticles(column: string) {
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
    this.getArticles();
  }

  public filterArticles() {
    this.filterApplied = true;
    if(!this.showFilter) {
      this.showFilter = true;
    } else {
      this.getArticles();
    }
  }

  public clearFilter() {
    this.filterApplied = false;
    for (const key in this.filterData) {
      if (this.filterData.hasOwnProperty(key)) {
        this.filterData[key] = '';
      }
    }
    this.getArticles();
  }

  public removeArticle(id: number, name: string) {
    Swal.fire({
      title: 'Jeste li sigurni da želite obrisati artikl?',
      html: name,
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Obriši',
      confirmButtonColor: 'var(--red-color)',
      showCancelButton: true,
      cancelButtonText: 'Odustani'
    }).then((result) => {
      if(result.isConfirmed) {
        this.confirmRemove(id);
      }
    });
  }

  public async confirmRemove(id: number) {
    const { error } = await supabase
    .from('ARTIKLI')
    .delete()
    .eq('id', id);
    this.getArticles();
  }

  public async addArticle() {
    console.log(this.newRow);
  
    const { data, error } = await supabase
    .from('ARTIKLI')
    .insert([this.newRow])
    .select();

    if (!error) {
      Swal.fire({
        icon: 'success',
        title: 'Artikl dodan!',
        showConfirmButton: false,
        timer: 2000
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Dogodila se greška',
        text: error.message,
        showConfirmButton: true
      });
    }
    this.getArticles();
  }

  //tooltips START
  public toggleTooltip(show: boolean, event?: MouseEvent, tip?: string) {
    if (show && event && tip) {
      this.showTooltip = true;
      this.tooltipMessage = tip || '';
    } else {
      if (event) {
        this.tooltipPosition.top = event?.clientY + 20 + 'px';
        this.tooltipPosition.left = event?.clientX - 10 + 'px';
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
