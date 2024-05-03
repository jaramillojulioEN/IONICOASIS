import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashBoardPage } from './admin-dash-board.page';

describe('AdminDashBoardPage', () => {
  let component: AdminDashBoardPage;
  let fixture: ComponentFixture<AdminDashBoardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashBoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
