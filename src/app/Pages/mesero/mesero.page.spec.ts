import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeseroPage } from './mesero.page';

describe('MeseroPage', () => {
  let component: MeseroPage;
  let fixture: ComponentFixture<MeseroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeseroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
