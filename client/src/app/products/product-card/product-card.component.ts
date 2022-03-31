import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;

  editURL: string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.product._id);
    this.editURL = `/products/edit/${this.product._id}`;
  }

}
