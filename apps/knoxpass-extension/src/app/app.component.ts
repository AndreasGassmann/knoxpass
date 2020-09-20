import { Component } from '@angular/core';
import { generateGUID } from '@knoxpass/api-interfaces';

@Component({
  selector: 'knoxpass-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'knoxpass-extension';

  constructor() {
    generateGUID().then((res) => {
      this.title = res;
    });
  }
}
