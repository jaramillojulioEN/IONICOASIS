import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalrPage } from './signalr.page';

describe('SignalrPage', () => {
  let component: SignalrPage;
  let fixture: ComponentFixture<SignalrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
