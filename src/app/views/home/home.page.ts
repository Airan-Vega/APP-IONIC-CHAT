import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import {ActionSheetController, ModalController} from '@ionic/angular';
import {Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';
import {ChatsService} from '../../shared/services/chats.service';
import { ChatI } from '../../shared/models/chat';
import {ChatComponent} from '../../shared/components/chat/chat.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit, OnDestroy{

  public chats$:ChatI[] = [];

  private unsubscribe$ = new Subject<void>(); 

  constructor(
    private authService:AuthService, 
    private chatsService:ChatsService, 
    private changeDetectorRef:ChangeDetectorRef,
    private modalController:ModalController,
    private actionSheetController: ActionSheetController
    ) {}
  
  ngOnInit() {
    this.getAllChats(); 
  }

  // we mark the subscription as completed (unsubscribe)
  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAllChats(){
    this.chatsService.getChats()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(chats  => {
        this.chats$ = chats;
        this.changeDetectorRef.markForCheck();
      });
  }

  openChat(chat){
    this.modalController.create({
      component: ChatComponent,
      componentProps: {
        chat: chat
      }
    }).then(modal => modal.present())
  }

  logOff(){
    this.authService.logOut();
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [{
        text: 'LogOut',
        role: 'destructive',
        icon: 'log-out',
        handler: () => {
          this.logOff();
        }
      }]
    });
    await actionSheet.present();
  }
}
