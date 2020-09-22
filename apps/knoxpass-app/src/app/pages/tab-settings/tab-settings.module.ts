import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsPage } from './tab-settings.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { SettingsPageRoutingModule } from './tab-settings-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: SettingsPage }]),
    SettingsPageRoutingModule,
  ],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
