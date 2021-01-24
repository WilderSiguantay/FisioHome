import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetCitasComponent } from './set-citas.component';

describe('SetCitasComponent', () => {
  let component: SetCitasComponent;
  let fixture: ComponentFixture<SetCitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetCitasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
