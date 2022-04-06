/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Product, ProductCategory } from '../product';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { PantryService } from 'src/app/pantry/pantry.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PantryItem } from 'src/app/pantry/pantryItem';

@Component({
  selector: 'app-product-list-component',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: []
})

export class ProductListComponent implements OnInit, OnDestroy {
  // MatDialog
  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;

  @ViewChild('dialogRefAdd')
  dialogRefAdd!: TemplateRef<any>;

  // Stored arrays of products
  public serverFilteredProducts: Product[];
  public filteredProducts: Product[];

  // fields used by input searches
  public name: string;
  public productBrand: string;
  public productCategory: ProductCategory;
  public productStore: string;
  public productLimit: number;

  // Store subscription from getProducts
  getProductsSub: Subscription;
  getUnfilteredProductsSub: Subscription;

  // Boolean for if there are active filters
  public activeFilters: boolean;

  // A list of the categories to be displayed, requested by the customer
  public categories: ProductCategory[] = [
    'bakery',
    'produce',
    'meat',
    'dairy',
    'frozen foods',
    'canned goods',
    'drinks',
    'general grocery',
    'miscellaneous',
    'seasonal',
  ];

  // Stores the products sorted by their category
  public categoryNameMap = new Map<ProductCategory, Product[]>();

  // variables used for adding product to pantry
  public tempDate: string;
  addDateForm: FormGroup;
  dateValidationMessages = {

    date: [
      {type: 'required', message: 'Product category is required'},
      {type: 'pattern', message: 'Date must be of form "dd/mm/yyyy"'},
    ]
  };

  // temp variables to use for deletion
  public tempId: string;
  public tempName: string;
  public tempDialog: any;
  public tempDeleted: Product;


  constructor(private productService: ProductService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private pantryService: PantryService,
    private fb: FormBuilder,
    private router: Router) { }

  getProductsFromServer(): void {
    this.unsub();
    this.getProductsSub = this.productService.getProducts({
      category: this.productCategory,
      store: this.productStore
    }).subscribe(returnedProducts => {
      this.serverFilteredProducts = returnedProducts;
      this.initializeCategoryMap();
      this.updateFilter();
    }, err => {
      console.log(err);
    });
    if (this.productCategory || this.productStore) {
      this.activeFilters = true;
    }
    else {
      this.activeFilters = false;
    }
  }

  // Sorts products based on their category
  initializeCategoryMap() {
    for (let givenCategory of this.categories) {
      this.categoryNameMap.set(givenCategory,
        this.productService.filterProducts(this.serverFilteredProducts, { category: givenCategory }));
    }
  }

  openDeleteDialog(pname: string, id: string) {
    this.tempId = id;
    this.tempName = pname;
    this.tempDialog = this.dialog.open(this.dialogRef, { data: { name: this.tempName, _id: this.tempId } },);
    this.tempDialog.afterClosed().subscribe((res) => {

      // Data back from dialog
      console.log({ res });
    });
  }

  public updateFilter(): void {
    this.filteredProducts = this.productService.filterProducts(
      this.serverFilteredProducts, { product_name: this.name, brand: this.productBrand, limit: this.productLimit });
    if (this.name || this.productBrand || this.productCategory || this.productStore) {
      this.activeFilters = true;
    }
    else {
      this.activeFilters = false;
    }

  }

  ngOnInit(): void {
    this.getProductsFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getProductsSub) {
      this.getProductsSub.unsubscribe();
    }
  }

  // Removes the product and updates the categoryNameMap to reflect the deletion
  removeProduct(id: string): Product {
    this.productService.deleteProduct(id).subscribe(
      prod => {
        this.serverFilteredProducts = this.serverFilteredProducts.filter(product => product._id !== id);
        this.tempDeleted = prod;
        this.updateFilter();
        this.initializeCategoryMap();
      }
    );
    this.tempDialog.close();
    this.snackBar.open(`${this.tempDeleted.product_name} deleted`, 'OK', {
      duration: 5000,
    });
    return this.tempDeleted;
  }

  openAddDialog(pname: string, id: string) {
    this.tempId = id;
    this.tempName = pname;
    this.createForm();
    this.tempDialog = this.dialog.open(this.dialogRefAdd, { data: { name: this.tempName, _id: this.tempId } },);
    this.tempDialog.afterClosed().subscribe((res) => {

      // Data back from dialog
      console.log({ res });
    });
  }

  createForm() {
    this.addDateForm = this.fb.group({
      date: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$')
      ])),
    });
  }

  // Getting the client machines current date, converting to dd/mm/yyyy and setting it as tempDate
  defaultDate(): string {
    let localDate: Date;
    localDate = new Date();
    let dd = String(localDate.getDate());
    let mm = String(localDate.getMonth() + 1);
    const yyyy = String(localDate.getFullYear());

    if (localDate.getDate() < 10) {
      dd = '0' + dd;
    }
    if (localDate.getMonth()+1 < 10) {
      mm = '0' + mm;
    }

    this.tempDate = dd + '/' + mm + '/' + yyyy;
    return this.tempDate;

  }

  addProductToPantry(id: string): void {
    this.tempDate = '';

    /* let newPantryItem: PantryItem;
    newPantryItem._id = id;
    newPantryItem.purchaseDate =
    this.pantryService.addPantryItem(newPantryItem).subscribe(
      prod => {
        this.serverFilteredProducts = this.serverFilteredProducts.filter(product => product._id !== id);
        this.tempDeleted = prod;
        this.updateFilter();
        this.initializeCategoryMap();
      }
    );
    this.tempDialog.close();
    this.snackBar.open(`${this.tempDeleted.product_name} deleted`, 'OK', {
      duration: 5000,
    });
    return this.tempDeleted; */
  }

}
