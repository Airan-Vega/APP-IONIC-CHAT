import { Injectable } from "@angular/core";

import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { UserI } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private angularFirestore: AngularFirestore) {}

  //It returns the datas of a single user from the database. It filters by the id
  public getOneUser(idUser): Observable<UserI> {
    return this.angularFirestore
      .collection("users")
      .doc<UserI>(idUser)
      .valueChanges();
  }
}
