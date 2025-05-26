import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/IProduct';
import { IndexedDBService } from './indexed-db.service';
import { ConnectionService } from './connection.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _pendingProducts = signal<IProduct[]>([]);
  public readonly pendingProducts$ = this._pendingProducts.asReadonly();

  private _http = inject(HttpClient);
  private _indexedDB = inject(IndexedDBService);
  private _connection = inject(ConnectionService);

  connection$ = this._connection.isOnline$();

  constructor() {
    effect(() => {
      this.connection$ = this._connection.isOnline$();
      if (this.connection$) {
        this.syncIndexedDBAndServer();
      }
    });
  }

  async loadPendingProducts() {
    const products = await this._indexedDB.getAllData();
    this._pendingProducts.set(products);
  }

  async syncIndexedDBAndServer() {
    const data = await this._indexedDB.getAllData();

    if (data.length === 0) {
      console.log('No data to sync with the server.');
      return;
    }

    console.log('Syncing IndexedDB data with the server');
    this.postBatchProducts(data).subscribe({
      next: (response) => {
        console.log('Data synced successfully:', response);
        this._pendingProducts.set([]);
        this._indexedDB.deleteAllData();
      },
      error: (error) => {
        console.error('Error syncing data with the server:', error);
      },
    });
  }

  postProduct(product: IProduct) {
    if (!this.connection$) {
      return new Observable<IProduct>((subscriber) => {
        product.offline = true;

        this._indexedDB
          .addData(product)
          .then((id) => {
            product.id = id;
            this._pendingProducts.update((products) => [...products, product]);
            subscriber.next(product);
            subscriber.complete();
          })
          .catch((error) => {
            console.error('Error adding product to IndexedDB:', error);
            subscriber.error(error);
          });
      });
    }

    return this._http.post<IProduct>(`/products`, product);
  }

  postBatchProducts(products: IProduct[]) {
    return this._http.post<IProduct[]>(`/products/batch`, products);
  }

  getProducts() {
    return this._http.get<IProduct[]>(`/products`);
  }
}
