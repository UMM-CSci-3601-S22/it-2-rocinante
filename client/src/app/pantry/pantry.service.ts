/* eslint-disable @typescript-eslint/ban-types */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../products/product';

@Injectable()
export class PantryService {
  readonly pantryUrl: string = environment.apiUrl + 'pantry';

  constructor(private httpClient: HttpClient) {}

  getPantryItems(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.pantryUrl, {
    });
  }


}
