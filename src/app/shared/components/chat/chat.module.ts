import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { ChatComponent } from "./chat.component";
import { AutosizeModule } from "ngx-autosize";

@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, FormsModule, IonicModule, AutosizeModule],
})
export class ChatModule {}
