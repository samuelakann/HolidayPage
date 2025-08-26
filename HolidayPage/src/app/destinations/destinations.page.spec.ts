import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinationsPage } from './destinations.page';

describe('DestinationsPage', () => {
  let component: DestinationsPage;
  let fixture: ComponentFixture<DestinationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
