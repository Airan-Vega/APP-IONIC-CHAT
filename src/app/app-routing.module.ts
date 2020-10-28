import { NgModule } from "@angular/core";
import {
  PreloadAllModules,
  RouterModule,
  Routes,
  CanActivate,
} from "@angular/router";

import { AuthGuard } from "./shared/guards/auth.guard";
import { NoLoginGuard } from "./shared/guards/no-login.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./views/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "login",
    canActivate: [NoLoginGuard],
    loadChildren: () =>
      import("./views/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "register",
    canActivate: [NoLoginGuard],
    loadChildren: () =>
      import("./views/register/register.module").then(
        (m) => m.RegisterPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
