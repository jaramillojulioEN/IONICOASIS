import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LavadoPage } from './lavado.page';

describe('LavadoPage', () => {
  let component: LavadoPage;
  let fixture: ComponentFixture<LavadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LavadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
