import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminordenesPage } from './adminordenes.page';

describe('AdminordenesPage', () => {
  let component: AdminordenesPage;
  let fixture: ComponentFixture<AdminordenesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminordenesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
