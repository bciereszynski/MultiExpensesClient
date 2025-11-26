import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Authresponse } from './authresponse';

describe('Authresponse', () => {
  let component: Authresponse;
  let fixture: ComponentFixture<Authresponse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Authresponse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Authresponse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
