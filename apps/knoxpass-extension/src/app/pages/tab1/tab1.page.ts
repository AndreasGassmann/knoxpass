import { Component, OnInit } from '@angular/core';
import { PushService } from '../../services/push/push.service';

@Component({
  selector: 'knoxpass-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  constructor(private readonly pushService: PushService) {}

  public ngOnInit() {
    this.pushService.register();
  }
}
