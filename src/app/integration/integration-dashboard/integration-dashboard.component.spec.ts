import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationDashboardComponent } from './integration-dashboard.component';

describe('IntegrationDashboardComponent', () => {
  let component: IntegrationDashboardComponent;
  let fixture: ComponentFixture<IntegrationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
