import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatillosPage } from './platillos.page';

describe('PlatillosPage', () => {
  let component: PlatillosPage;
  let fixture: ComponentFixture<PlatillosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatillosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
