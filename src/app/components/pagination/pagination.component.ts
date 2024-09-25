import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit{

  @Input() page!: number;
  @Input() totalPages!: number;
  @Input() pageSize!: number;
  @Input() totalRecords!: number;
  @Input() pagesToShow: number = 5;
  @Input() loading!: boolean;

  @Output() goPrev = new EventEmitter<any>()
  @Output() goNext = new EventEmitter<any>()
  @Output() goPage = new EventEmitter<any>()

  ngOnInit(): void {
    this.getPages()
  }

  onPrev(){
    this.goPrev.emit(true)
  }
  onNext(){
    this.goNext.emit(true)
  }
  onPage(n:number){
    this.goPage.emit(n)
  }



  getPages(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(this.page - 1, 1);
    const endPage = Math.min(startPage + 2, this.totalPages);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

}
