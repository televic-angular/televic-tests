import {async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  HttpModule, Http, XHRBackend, Response, ResponseOptions
} from '@angular/http';
import { of } from 'rxjs/observable/of';

import { Celebrity } from '../tests.model';
import { HttpServiceService } from './http-service.service';

const makeCelebrities = () => [
  { id: 1, name: 'Windstorm' },
  { id: 2, name: 'Bombasto' },
  { id: 3, name: 'Magneta' },
  { id: 4, name: 'Tornado' }
] as Celebrity[];

describe('HttpServiceService (using old HttpModule)', () => {
  let backend: MockBackend;
  let service: HttpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        HttpServiceService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  it('should be created', inject([HttpServiceService], (serv: HttpServiceService) => {
    expect(serv).toBeTruthy();
  }));

  it('can instantiate service via DI', () => {
    service = TestBed.get(HttpServiceService);
    expect(service instanceof HttpServiceService).toBe(true);
  });

  it('can instantiate service with "new"', () => {
    const http = TestBed.get(Http);
    expect(http).not.toBeNull('http should be provided');
    const serv = new HttpServiceService(http);
    expect(serv instanceof HttpServiceService).toBe(true, 'new service should be ok');
  });

  it('can provide the mockBackend as XHRBackend', () => {
    const be = TestBed.get(XHRBackend);
    expect(be).not.toBeNull('backend should be provided');
  });

  describe('when getHeroes(no testBed)', () => {
    let fakeCelebrities: Celebrity[];
    let http: Http;
    let response: Response;

    beforeEach(() => {

      backend = TestBed.get(XHRBackend);
      http = TestBed.get(Http);

      service = new HttpServiceService(http);
      fakeCelebrities = makeCelebrities();
      const options = new ResponseOptions({ status: 200, body: { data: fakeCelebrities } });
      response = new Response(options);
    });

    it('should have expected fake celebrities (then)', () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getHeroes().toPromise()
        // .then(() => Promise.reject('deliberate'))
        .then(celebrities => {
          expect(celebrities.length).toBe(fakeCelebrities.length,
            'should have expected no. of celebrities');
        })
        .catch(fail);
    });

    it('should have expected fake celebrities (Observable tap)', () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getHeroes().subscribe(
        celebrities => {
          expect(celebrities.length).toBe(fakeCelebrities.length,
            'should have expected no. of celebrities');
        },
        fail
      );
    });


    it('should be OK returning no celebrities', () => {
      const resp = new Response(new ResponseOptions({ status: 200, body: { data: [] } }));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

      service.getHeroes().subscribe(
        celebrities => {
          expect(celebrities.length).toBe(0, 'should have no celebrities');
        },
        fail
      );
    });

    it('should treat 404 as an Observable error', () => {
      const resp = new Response(new ResponseOptions({ status: 404 }));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

      service.getHeroes().subscribe(
        celebrities => fail('should not respond with celebrities'),
        err => {
          expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
          return of(null); // failure is the expected test result
        });
    });
  });
});
