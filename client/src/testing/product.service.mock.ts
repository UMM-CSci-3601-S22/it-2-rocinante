/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, ProductCategory } from '../app/products/product';
import { ProductService } from '../app/products/product.service';

/**
 * A "mock" version of the `ProductService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockProductService extends ProductService {

  static testProducts: Product[] = [
    {
      _id: 'banana_id',
      productName: 'banana',
      description: '',
      brand: 'Dole',
      category: 'produce',
      store: 'Walmart',
      location: '',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    },
    {
      _id: 'milk_id',
      productName: 'Whole Milk',
      description: '',
      brand: 'Land O Lakes',
      category: 'dairy',
      store: 'SuperValu',
      location: '',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    },
    {
      _id: 'bread_id',
      productName: 'Wheat Bread',
      description: '',
      brand: 'Country Hearth',
      category: 'bakery',
      store: 'Walmart',
      location: '',
      notes: '',
      tags: [],
      lifespan: 0,
      threshold: 0,
      image: ''
    }
  ];

  static testID = 'test_id';

  deletedProduct: Product;

  constructor() {
    super(null);
  }

  override getProducts(filters: { category?: ProductCategory; store?: string }): Observable<Product[]> {
    // Just return the test users regardless of what filters are passed in
    return of(MockProductService.testProducts);
  }

  override getProductById(id: string): Observable<Product> {
    // If the specified ID is for the first test product,
    // return that product, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockProductService.testProducts[0]._id) {
      return of(MockProductService.testProducts[0]);
    } else {
      return of(null);
    }
  }

  override deleteProduct(id: string): Observable<Product> {
    if (id === MockProductService.testProducts[0]._id) { this.deletedProduct = MockProductService.testProducts[0]; }
    if (id === MockProductService.testProducts[1]._id) { this.deletedProduct = MockProductService.testProducts[1]; }
    if (id === MockProductService.testProducts[2]._id) { this.deletedProduct = MockProductService.testProducts[2]; }
    return of(this.deletedProduct);
  }

  override addProduct(newProduct: Product): Observable<string> {
    return of(MockProductService.testID);
  }

  override editProduct(productId: string, newData: Product): Observable<Product> {
    for (let testProduct of MockProductService.testProducts) {
      let id = testProduct._id;
      if (productId === id) {
        return of(newData);
      }
    }
  }
}
