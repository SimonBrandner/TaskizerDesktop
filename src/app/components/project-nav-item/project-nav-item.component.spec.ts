import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNavItemComponent } from './project-nav-item.component';

describe('ProjectNavItemComponent', () => {
  let component: ProjectNavItemComponent;
  let fixture: ComponentFixture<ProjectNavItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectNavItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
