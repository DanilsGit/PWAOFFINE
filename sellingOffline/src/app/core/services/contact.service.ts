import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private _http = inject(HttpClient);
  constructor() {}

  postContactForm(data: FormData) {
    return this._http.post(environment.formSubmitUrl, data);
  }
}
