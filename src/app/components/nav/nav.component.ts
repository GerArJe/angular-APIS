import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu = false;
  counter = 0;
  token = '';
  profile: User | null = null;

  constructor(
    private storeService: StoreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.storeService.myCart$.subscribe((products) => {
      this.counter = products.length;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService
      .login('sebas@mail.com', '123456')
      .pipe(
        switchMap((auth) => {
          this.token = auth.access_token;
          return this.authService.profile(auth.access_token);
        })
      )
      .subscribe((user) => {
        this.profile = user;
      });
  }

  getProfile() {
    this.authService.profile(this.token).subscribe((user) => {
      this.profile = user;
    });
  }
}
