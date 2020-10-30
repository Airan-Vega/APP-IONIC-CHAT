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
import { UsersService } from "../../services/users.service";

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
  private datas: any;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private chatsService: ChatsService,
    private authService: AuthService,
    private usersService: UsersService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chat = this.navParams.get("chat");
    this.getContentChat();
    this.currentUser();
  }

  //It mark the subscription as completed (unsubscribe)
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //It close the chat
  closeChat() {
    this.modalController.dismiss();
  }

  //It get all the chat messages from the database
  getContentChat() {
    this.chatsService
      .getChat(this.chat.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((chats) => {
        this.contentsChat = chats.messages;

        this.changeDetectorRef.markForCheck();
      });
  }

  //It Obtain the data of the user who is currently logged in
  dataCurrentUser(id: string) {
    this.usersService
      .getOneUser(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((dataUser) => {
        this.datas = {
          nameUser: dataUser.name,
          telephoneUser: dataUser.telephone,
        };

        this.changeDetectorRef.markForCheck();
      });
  }

  //Obtains the identification of the user who is currently connected,
  //saves his id in a variable and then executes the function dataCurrentUser
  currentUser(): Promise<any> {
    return new Promise((resolve) => {
      this.authService.userData
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((userID) => {
          resolve((this.uid = userID.uid));

          this.changeDetectorRef.markForCheck();
        });
    })
      .then(() => {
        this.dataCurrentUser(this.uid);
      })
      .catch((err) => console.log(err));
  }

  //It Save in the database the message and data of the user who has sent the message
  sendMessage() {
    this.authService.userData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userID) => {
        const message: MessageI = {
          nameUser: this.datas.nameUser,
          telephoneUser: this.datas.telephoneUser,
          uidUser: userID.uid,
          content: this.msg,
          date: new Date(),
        };

        this.chatsService.sendMessageFirebase(message, this.chat.id);
        this.msg = "";
        this.changeDetectorRef.markForCheck();
      });
  }

  //Improves the performance of ngfor
  trackByFn(index: number): number {
    return index;
  }
}
