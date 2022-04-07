import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PantryItem } from 'src/app/pantry/pantryItem';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-product-to-pantry',
  templateUrl: './add-product-to-pantry.component.html',
  styleUrls: ['./add-product-to-pantry.component.scss']
})
export class AddProductToPantryComponent implements OnInit {

  addProductForm: FormGroup;

  product: PantryItem;

  addProductValidationMessages = {
    purchaseDate: [
      {type: 'required', message: 'Product\'s name is required'},
    ],
  };


  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router) {
  }

  createForms() {
    this.addProductForm = this.fb.group({
      purchaseDate: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  ngOnInit(): void {
  }

}
