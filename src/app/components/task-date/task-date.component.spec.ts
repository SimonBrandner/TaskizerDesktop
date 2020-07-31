import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDateComponent } from './task-date.component';

describe('TaskDateComponent', () => {
  let component: TaskDateComponent;
  let fixture: ComponentFixture<TaskDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
