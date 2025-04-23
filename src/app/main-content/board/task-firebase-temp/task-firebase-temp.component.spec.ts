import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFirebaseTempComponent } from './task-firebase-temp.component';

describe('TaskFirebaseTempComponent', () => {
  let component: TaskFirebaseTempComponent;
  let fixture: ComponentFixture<TaskFirebaseTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFirebaseTempComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskFirebaseTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
