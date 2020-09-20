import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';
import { PushService } from '../../services/push/push.service';

import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [Tab1Page],
        imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
        providers: [
          { provide: PushService, useValue: { register: () => undefined } },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(Tab1Page);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
