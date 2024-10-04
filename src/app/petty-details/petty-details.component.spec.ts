import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyDetailsComponent } from './petty-details.component';

describe('PettyDetailsComponent', () => {
  let component: PettyDetailsComponent;
  let fixture: ComponentFixture<PettyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PettyDetailsComponent]
    });
    fixture = TestBed.createComponent(PettyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
