import * as path from 'path';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Headers, Http, Response, URLSearchParams, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export class ApiConfig {
  fullResponse = false;
}

@Injectable()
export class ApiService {
  constructor(private http: Http) { }

  private get headers(): Headers {
    return new Headers({
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
    });
  }

  private formatErrors(error: any) {
    let data;
    try {
      data = error.json();
    } catch (err) {
      data = { error: 'fail to parse' };
    }
    return Observable.throw(data);
  }

  private formatResponse(res: Response, config = new ApiConfig()) {
    const json = res.json();
    if (config.fullResponse) {
      return json;
    } else {
      return json.data;
    }
  }

  makeUrl(url) {
    return path.join(environment.apiUrl, url);
  }

  getInRoot(url: string, params: Object = {}, config?: ApiConfig): Observable<any> {
    return this.http.get(url, { headers: this.headers, search: params })
      .catch(this.formatErrors)
      .map((res: Response) => this.formatResponse(res, config));
  }

  get(url: string, params: Object = {}, config?: ApiConfig): Observable<any> {
    return this.http.get(this.makeUrl(url), { headers: this.headers, search: params })
      .catch(this.formatErrors)
      .map((res: Response) => this.formatResponse(res, config));
  }

  getAll(url: string, params: Object = {}, config?: ApiConfig): Observable<any> {
    params['size'] = Math.pow(2, 31) - 1;
    params['page'] = 1;
    return this.get(url, params, config);
  }

  getFile(url: string, params = {}, config?: ApiConfig): Observable<any> {
    return this.http.get(
      this.makeUrl(url),
      {
        headers: this.headers,
        search: params,
        responseType: ResponseContentType.Blob,
      })
      .map((res) => res.blob())
      .catch(this.formatErrors);
  }

  put(url: string, body: Object = {}): Observable<any> {
    return this.http.put(
      this.makeUrl(url),
      JSON.stringify(body),
      { headers: this.headers },
    )
      .catch(this.formatErrors)
      .map((res: Response) => this.formatResponse(res));
  }

  post(url: string, body: Object = {}): Observable<any> {
    return this.http.post(
      this.makeUrl(url),
      JSON.stringify(body),
      { headers: this.headers },
    )
      .catch(this.formatErrors)
      .map((res: Response) => this.formatResponse(res));
  }

  delete(url): Observable<any> {
    return this.http.delete(
      this.makeUrl(url),
      { headers: this.headers },
    )
      .catch(this.formatErrors)
      .map((res: Response) => this.formatResponse(res));
  }
}
