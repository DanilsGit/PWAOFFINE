import { Component, inject } from '@angular/core';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private _contact = inject(ContactService);
  loading = false;

  onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    this.loading = true;

    this._contact.postContactForm(formData).subscribe({
      next: (response) => {
        console.log('Form submitted successfully', response);
        form.reset();
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 200) {
          console.log('Form submitted successfully');
          form.reset();
          this.loading = false;
        }
      },
    });
  }
}
