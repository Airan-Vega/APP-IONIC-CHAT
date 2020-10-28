import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  public name: string;
  public lastNames: string;
  public telephone: number;
  public email: string;
  public password: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  registerUser() {
    this.authService
      .register(
        this.name,
        this.lastNames,
        this.telephone,
        this.email,
        this.password
      )
      .then(() => this.router.navigate(["/home"]))
      .catch((err) => console.log(err));
  }
}
