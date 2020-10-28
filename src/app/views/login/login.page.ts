import { Component, OnInit } from "@angular/core";

import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  public email: string;
  public password: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  loginEmailPassword() {
    this.authService
      .login(this.email, this.password)
      .then(() => this.router.navigate(["/home"]))
      .catch(() => alert("The email or password is incorrect"));
  }
}
