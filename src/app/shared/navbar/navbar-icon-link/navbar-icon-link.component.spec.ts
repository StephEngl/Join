import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarIconLinkComponent } from './navbar-icon-link.component';

describe('NavbarIconLinkComponent', () => {
  let component: NavbarIconLinkComponent;
  let fixture: ComponentFixture<NavbarIconLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarIconLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarIconLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
