import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasadoPage } from './pasado.page';

describe('PasadoPage', () => {
  let component: PasadoPage;
  let fixture: ComponentFixture<PasadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PasadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
