import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginMovilPage } from './login-movil.page';

describe('LoginMovilPage', () => {
  let component: LoginMovilPage;
  let fixture: ComponentFixture<LoginMovilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginMovilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginMovilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
