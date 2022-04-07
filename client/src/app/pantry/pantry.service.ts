import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../products/product';
import { PantryItem } from './pantryItem';

@Injectable()
export class PantryService {
  readonly pantryUrl: string = environment.apiUrl + 'pantry';
  readonly pantryInfoUrl: string = environment.apiUrl + 'pantry/info';

  constructor(private httpClient: HttpClient) { }

  getPantryProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.pantryUrl, {
    });
  }

  getPantry(): Observable<PantryItem[]> {
    return this.httpClient.get<PantryItem[]>(this.pantryInfoUrl, {
    });
  }

  addPantryItem(newPantryItem: PantryItem): Observable<string> {
    // Send post request to add a new PantryItem to the user's pantry
    return this.httpClient.post<{ id: string }>(this.pantryUrl, newPantryItem).pipe(map(res => res.id));
  }
}
