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
    this.websocketService.sendMessage({
      event: 'events',
      data: 'test',
    });
  }
}
