import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvosComponent } from './convos.component';

describe('ConvosComponent', () => {
  let component: ConvosComponent;
  let fixture: ComponentFixture<ConvosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
