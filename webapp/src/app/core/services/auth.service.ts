import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subject, of } from 'rxjs';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  isOnline: boolean;
  isInit: boolean = false;
  email: string;
  onlineChanges = new Subject<boolean>();

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.angularFireAuth.authState.subscribe(userData => {
      this.isInit = true;
      this.isOnline = !!userData && !!userData.email;
      if (this.isOnline) {
        this.email = userData.email;
      } else {
        this.router.navigate(['/login']);
      }
      this.onlineChanges.next(this.isOnline);
    });
  }

  logInWithGoogle(): Observable<void> {
    return new Observable(observer => {
      this.angularFireAuth.auth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider(),
      )
        .then(() => observer.next())
        .catch(() => observer.error());
    });
  }

  logOut(): Observable<void> {
    return new Observable(observer => {
      this.angularFireAuth.auth.signOut()
        .then(() => observer.next())
        .catch(() => observer.error());
    });
  }

  getOnline(): Observable<boolean> {
    if (this.isInit) {
      return of(this.isOnline);
    } else {
      return this.onlineChanges;
    }
  }
}
