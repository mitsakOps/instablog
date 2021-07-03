import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import * as Parse from 'parse';
let parse = require('parse');
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

parse.initialize(environment.PARSE.APP_ID);
parse.serverURL = environment.PARSE.SERVER_URL;

@Injectable({ providedIn: 'root' })
export class AuthService {
  //Initialize to empty string until a new session token is retrieved
  private authToken = '';
  private userStatus: BehaviorSubject<boolean>;

  constructor(private router: Router) {
    //Initialize to false until a user logs in
    this.userStatus = new BehaviorSubject<boolean>(false);
  }

  // Login and get current user's token
  login(username, password) {
    return new Promise<void>(async (resolve, reject) => {
      parse.User.logIn(username, password).then(
        (success) => {
          // DEBUG
          console.log('SUCCESSFULL LOGIN!');

          // Get the current session token
          this.authToken = this.getAuthToken();

          // Change the user status to logged in
          this.userStatus.next(true);
          resolve();

          // Redirect to homepage
          this.router.navigate(['/']);
        },
        (err) => {
          // DEBUG
          console.log('LOGIN FAILURE...');
          this.authToken = this.getAuthToken();
          reject(err);
        }
      );
    });
  }

  // Log the user out
  logout() {
    parse.User.logOut();

    // Change the user's status to logged out
    this.userStatus.next(false);

    // Redirect to homepage
    // this.router.navigate(['/']);
  }

  // Get current user's token
  getAuthToken() {
    let loggedUser = parse.User.current();
    if (loggedUser) {
      // DEBUG
      console.log('TOKEN IS: ', loggedUser.getSessionToken());
      return loggedUser.getSessionToken();
    } else {
      console.log('SESSION TOKEN NOT EXISTENT...');
      return;
    }
  }

  // Check if the user is logged in or not
  checkUserStatus() {
    return this.userStatus;
  }
}