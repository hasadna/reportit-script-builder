import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface FirebaseScript {
  yaml: string;
}

@Injectable()
export class FirebaseService {
  constructor(
    private db: AngularFirestore,
  ) { }

  getScript(id: string): Observable<string> {
    return this.db.collection(`/script`)
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(action => {
          const firebaseScript = action.payload.data() as FirebaseScript;
          return firebaseScript.yaml;
        }),
      );
  }

  setScript(id: string, yaml: string): Observable<void> {
    return new Observable(observer => {
      this.db
        .collection(`/script`)
        .doc(id)
        .update({ yaml: yaml })
        .then(() => observer.next())
        .catch(() => observer.error());
    });
  }
}
