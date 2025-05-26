import { Component, effect, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { IProduct } from '../../core/interfaces/IProduct';
import { ProductListComponent } from '../../shared/product-list/product-list.component';

@Component({
  selector: 'app-home',
  imports: [ProductListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private _products = inject(ProductService);
  products: IProduct[] = [];

  constructor() {
    this.getPendingProducts();
    this.getProducts();
  }

  async getPendingProducts() {
    await this._products.loadPendingProducts();
    const pendingProducts = this._products.pendingProducts$();
    if (pendingProducts.length > 0) {
      this.products = [...pendingProducts, ...this.products];
    }
  }

  getProducts() {
    this._products.getProducts().subscribe({
      next: (products) => {
        this.products = [...this.products, ...products];
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }
}
