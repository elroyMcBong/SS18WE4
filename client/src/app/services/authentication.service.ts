﻿import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {AuthenticationClient} from '../rest';
import {SessionStorageService} from './session-storage.service';

@Injectable()
export class AuthenticationService {
  constructor(private readonly restClient: AuthenticationClient, private readonly sessionStorageService: SessionStorageService) {
  }

  get isLoggedIn(): boolean {
    return this.sessionStorageService.loggedIn;
  }

  login(username: string, password: string): Observable<any> {

    let newTokenRequired = false;
    //check if token is still valid
    if(this.sessionStorageService.jwtExpired())
    {
          console.log("token expired!");
          newTokenRequired = true;
          this.sessionStorageService.setJWT(null);
         
    }


    let val= this.restClient.authenticate({
      username: username, password: password
    }).map(response => {

      if(newTokenRequired) //new token from response gets saved in localstorage
        this.sessionStorageService.setJWT(response.token);

      this.sessionStorageService.setLoggedIn(true)});

      //testwise:
      console.log("current token: "+this.sessionStorageService.getJWt());

    return val;
  }

  logout(): void {
    this.sessionStorageService.setLoggedIn(false);
  }
}
