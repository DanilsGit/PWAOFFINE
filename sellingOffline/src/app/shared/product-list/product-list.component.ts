import { Component, Input } from '@angular/core';
import { IProduct } from '../../core/interfaces/IProduct';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  @Input({ required: true }) products: IProduct[] = [];
  backendUrl = environment.backendUrl;
}
