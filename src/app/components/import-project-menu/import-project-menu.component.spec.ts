import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProjectMenuComponent } from './import-project-menu.component';

describe('ImportProjectMenuComponent', () => {
  let component: ImportProjectMenuComponent;
  let fixture: ComponentFixture<ImportProjectMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportProjectMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportProjectMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
