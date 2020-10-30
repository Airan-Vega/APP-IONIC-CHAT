import { Injectable } from "@angular/core";

import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { UserI } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // In this variable we store the data of the user who is currently logged in
  public userData: Observable<any> = null;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private angularFirestore: AngularFirestore
  ) {
    //It save the data of the user who is currently logged in
    this.userData = angularFireAuth.authState;
  }

  //User login
  public login(email: string, password: string): Promise<any> {
    return new Promise((resolve, rejected) => {
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then((user) => resolve(user))
        .catch((err) => rejected(err));
    });
  }

  //It close the user's session
  public logOut() {
    this.angularFireAuth.signOut().then(() => {
      this.router.navigate(["/login"]);
    });
  }

  //It register the user and save their data in a collection in the firebase database
  public register(
    name: string,
    lastNames: string,
    telephone: number,
    email: string,
    password: string
  ): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.angularFireAuth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          const uid = res.user.uid;
          const userData: UserI = {
            id: uid,
            name: name,
            lastNames: lastNames,
            telephone: telephone,
            email: email,
          };
          this.angularFirestore
            .collection("users")
            .doc<UserI>(uid)
            .set(userData, { merge: true });
          resolve(res);
        })
        .catch((err) => rejects(err));
    });
  }
}
