import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";

import { NavParams, ModalController } from "@ionic/angular";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MessageI } from "../../models/message";
import { ChatsService } from "../../services/chats.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy {
  public chat: any;
  public contentsChat: any[] = [];
  public msg: string;
  public uid: string;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private chatsService: ChatsService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chat = this.navParams.get("chat");
    this.getContentChat();
    this.currentUser();
  }

  // we mark the subscription as completed (unsubscribe)
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeChat() {
    this.modalController.dismiss();
  }

  getContentChat() {
    this.chatsService
      .getChat(this.chat.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((chats) => {
        this.contentsChat = chats.messages;

        this.changeDetectorRef.markForCheck();
      });
  }

  currentUser() {
    this.authService.userData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userID) => {
        this.uid = userID.uid;

        this.changeDetectorRef.markForCheck();
      });
  }

  sendMessage() {
    this.authService.userData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userID) => {
        const message: MessageI = {
          uidUser: userID.uid,
          content: this.msg,
          date: new Date(),
        };
        this.chatsService.sendMessageFirebase(message, this.chat.id);
        this.msg = "";
        this.changeDetectorRef.markForCheck();
      });
  }
}
