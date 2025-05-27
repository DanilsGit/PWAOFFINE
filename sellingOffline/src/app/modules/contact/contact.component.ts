import { Component, inject } from '@angular/core';
import { ContactService } from '../../core/services/contact.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private _contact = inject(ContactService);
  private _toast = inject(ToastrService);
  loading = false;

  onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    this.loading = true;

    this._contact.postContactForm(formData).subscribe({
      next: (response) => {
        form.reset();
        this.loading = false;
        this._toast.success('Form submitted successfully!');
      },
      error: (error) => {
        if (error.status === 200) {
          this._toast.success('Form submitted successfully!');

          form.reset();
          this.loading = false;
        }
      },
    });
  }
}
