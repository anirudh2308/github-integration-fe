import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridGlobalSearchComponent } from './ag-grid-global-search.component';

describe('AgGridWrapperComponent', () => {
  let component: AgGridGlobalSearchComponent;
  let fixture: ComponentFixture<AgGridGlobalSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgGridGlobalSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgGridGlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
