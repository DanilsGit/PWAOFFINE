import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../core/interfaces/IProduct';
import { ProductListComponent } from '../../../shared/product-list/product-list.component';
@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    ProductListComponent,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent {
  private _formBuilder = inject(FormBuilder);
  private _products = inject(ProductService);
  pendingProducts: IProduct[] = [];
  form: FormGroup;

  constructor() {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });

    effect(() => {
      this.pendingProducts = this._products.pendingProducts$();
    });

    this.getPendingProducts();
  }

  async getPendingProducts() {
    await this._products.loadPendingProducts();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.size > 5 * 1024 * 1024) {
        console.log('File size exceeds 5MB:');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.controls['image'].setValue(reader.result);
      };
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      // Handle form submission error
      console.error('Form is invalid');
      return;
    }
    this._products.postProduct(this.form.value).subscribe({
      next: () => {
        this.form.reset();
      },
      error: (error) => {
        console.error('Error creating product:', error);
      },
    });
  }
}
