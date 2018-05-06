import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { Celebrity } from '../tests.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HttpClientService {

  readonly celebrityesUrl = 'api/celebrityes';  // URL to web api

  constructor(private http: HttpClient) { }

  /** GET celebrityes from the server */
  getCelebrities(): Observable<Celebrity[]> {
    return this.http.get<Celebrity[]>(this.celebrityesUrl)
      .pipe(
        tap(celebrityes => this.log(`fetched celebrityes`)),
        catchError(this.handleError('getCelebrityes'))
    ) as Observable<Celebrity[]>;
  }

  /** GET celebrity by id. Return `undefined` when id not found */
  getCelebrity<Data>(id: number | string): Observable<Celebrity> {
    if (typeof id === 'string') {
      id = parseInt(id as string, 10);
    }
    const url = `${this.celebrityesUrl}/?id=${id}`;
    return this.http.get<Celebrity[]>(url)
      .pipe(
        map(celebrityes => celebrityes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} celebrity id=${id}`);
        }),
        catchError(this.handleError<Celebrity>(`getCelebrity id=${id}`))
      );
  }

  /** POST: add a new celebrity to the server */
  addCelebrity(theCelebrity: Celebrity): Observable<Celebrity> {
    return this.http.post<Celebrity>(this.celebrityesUrl, theCelebrity, httpOptions).pipe(
      tap((celebrity: Celebrity) => this.log(`added celebrity w/ id=${celebrity.id}`)),
      catchError(this.handleError<Celebrity>('addCelebrity'))
    );
  }
  /** DELETE: delete the celebrity from the server */
  deleteCelebrity(celebrity: Celebrity | number): Observable<Celebrity> {
    const id = typeof celebrity === 'number' ? celebrity : celebrity.id;
    const url = `${this.celebrityesUrl}/${id}`;

    return this.http.delete<Celebrity>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted celebrity id=${id}`)),
      catchError(this.handleError<Celebrity>('deleteCelebrity'))
    );
  }

  /** PUT: update the celebrity on the server */
  updateCelebrity(celebrity: Celebrity): Observable<any> {
    return this.http.put(this.celebrityesUrl, celebrity, httpOptions).pipe(
      tap(_ => this.log(`updated celebrity id=${celebrity.id}`)),
      catchError(this.handleError<any>('updateCelebrity'))
    );
  }
  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param operation - name of the operation that failed
   */
  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;

      // TODO: better job of transforming error for user consumption
      throw new Error(`${operation} failed: ${message}`);
    };

  }

  private log(message: string) {
    console.log('CelebrityService: ' + message);
  }

}
