import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CreateProductComponent } from './modules/product/create-product/create-product.component';
import { ContactComponent } from './modules/contact/contact.component';
import { HomeComponent } from './modules/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'create-product',
    component: CreateProductComponent,
    title: 'Create',
  },
  {
    path: 'landing-product/:id',
    component: AppComponent,
    title: 'Landing Product',
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact',
  },
];
