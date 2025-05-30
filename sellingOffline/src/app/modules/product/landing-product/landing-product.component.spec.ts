import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingProductComponent } from './landing-product.component';

describe('LandingProductComponent', () => {
  let component: LandingProductComponent;
  let fixture: ComponentFixture<LandingProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
