import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreOAppComponent } from './sobre-o-app.component';

describe('SobreOAppComponent', () => {
  let component: SobreOAppComponent;
  let fixture: ComponentFixture<SobreOAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreOAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreOAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
