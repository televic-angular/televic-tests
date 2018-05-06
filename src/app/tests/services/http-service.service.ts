import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
// import { Observable } from 'rxjs/observable';
import { Observable } from 'rxjs/RX';

// import 'rxjs/add/observable/throw';
import { Celebrity } from '../tests.model';
import { catchError, map } from 'rxjs/operators';


@Injectable()
export class HttpServiceService {

  private celebritiesUrl = 'app/celebrities';  // URL to web api

  constructor(private http: Http) { }

  getHeroes(): Observable<Celebrity[]> {
    return this.http.get(this.celebritiesUrl).pipe(
      map(this.extractData),
      // tap(data => console.log(data)), // eyeball results in the console
      catchError(this.handleError)
    );
  }

  getHero(id: number | string) {
    return this.http.get('app/celebrities/?id=${id}').pipe(
      map((r: Response) => r.json().data as Celebrity[])
    );
  }

  addHero(name: string): Observable<Celebrity> {
    const body = JSON.stringify({ name });
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.celebritiesUrl, body, options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  updateHero(hero: Celebrity): Observable<Celebrity> {
    const body = JSON.stringify(hero);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.put(this.celebritiesUrl, body, options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    const body = res.json();
    return body.data || {};
  }

  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    const errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
