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

  //It return the chat collection from the database and observe changes in real time
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

  //It return a single document from the firebase database, select the document by ID and observe
  //changes to the document in real time
  public getChat(chatID: string): Observable<any> {
    return this.angularFirestore.collection("chats").doc(chatID).valueChanges();
  }

  //The messages that are sent are stored in the database
  public sendMessageFirebase(message: MessageI, chatID: string) {
    this.angularFirestore
      .collection("chats")
      .doc(chatID)
      .update({
        messages: firestore.FieldValue.arrayUnion(message),
      });
  }
}
