import { Injectable } from "@angular/core";

import { AngularFirestore } from "@angular/fire/firestore";
import { firestore } from "firebase/app";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ChatI } from "../models/chat";
import { MessageI } from "../models/message";

@Injectable({
  providedIn: "root",
})
export class ChatsService {
  constructor(private angularFirestore: AngularFirestore) {}

  //We return a collection of data from the firebase database and observe changes in real time
  public getChats(): Observable<ChatI[]> {
    return this.angularFirestore
      .collection("chats")
      .snapshotChanges()
      .pipe(
        map((chats) => {
          return chats.map((a) => {
            const data = a.payload.doc.data() as ChatI;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  //We return a single document from the firewall database, select the document by ID and observe
  //changes to the document in real time
  public getChat(chatID: string): Observable<any> {
    return this.angularFirestore.collection("chats").doc(chatID).valueChanges();
  }

  public sendMessageFirebase(message: MessageI, chatID: string) {
    this.angularFirestore
      .collection("chats")
      .doc(chatID)
      .update({
        messages: firestore.FieldValue.arrayUnion(message),
      });
  }
}
