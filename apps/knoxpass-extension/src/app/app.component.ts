import { Component } from '@angular/core';
import { generateGUID } from '@knoxpass/api-interfaces';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'knoxpass-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'knoxpass-extension';

  constructor(private platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      generateGUID().then((res) => {
        this.title = res;
      });
    });
  }
}
