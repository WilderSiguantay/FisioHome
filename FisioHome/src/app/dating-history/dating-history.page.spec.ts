import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatingHistoryPage } from './dating-history.page';

describe('DatingHistoryPage', () => {
  let component: DatingHistoryPage;
  let fixture: ComponentFixture<DatingHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatingHistoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatingHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
