import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiegoMartinsComponent } from './diego-martins.component';

describe('DiegoMartinsComponent', () => {
  let component: DiegoMartinsComponent;
  let fixture: ComponentFixture<DiegoMartinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiegoMartinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiegoMartinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
