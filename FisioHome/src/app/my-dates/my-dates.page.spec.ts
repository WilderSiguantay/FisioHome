import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyDatesPage } from './my-dates.page';

describe('MyDatesPage', () => {
  let component: MyDatesPage;
  let fixture: ComponentFixture<MyDatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDatesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyDatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
