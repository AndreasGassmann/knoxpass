import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '@knoxpass/api-interfaces';
import { PushService } from '../../services/push/push.service';

@Component({
  selector: 'knoxpass-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  constructor(
    private readonly pushService: PushService,
    private readonly websocketService: WebsocketService
  ) {}

  public async ngOnInit() {
    this.pushService.register();
    this.websocketService.connect();
    setTimeout(() => {
      this.websocketService.sendMessage({
        event: 'relay',
        data: {
          recipient:
            '9a4717952ffcf6d37da5bacd7617fc97b1bf8cfd7ff95fc0a098133210040033',
          message: 'test1',
        },
      });
    }, 1000);
  }
}
