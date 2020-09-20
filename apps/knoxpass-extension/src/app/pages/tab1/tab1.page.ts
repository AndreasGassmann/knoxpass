import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '@knoxpass/api-interfaces';

@Component({
  selector: 'knoxpass-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  constructor(private readonly websocketService: WebsocketService) {}

  public async ngOnInit() {
    this.websocketService.connect();
    // setTimeout(() => {}, 1000);
  }
}
