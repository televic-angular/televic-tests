// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed, ɵTestingCompiler } from '@angular/core/testing';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';



import { asyncData, asyncError } from '../../shared';
import { Celebrity } from '../tests.model';
import { HttpClientService } from './http-client.service';

/**
some of the aspects of service Testing:
aspects of testing http client：
-use spies to test function
-return succeed response / user-friendly error / succeed but no data
-called one time / multiple times
-use mock to test
-use stub to test
-beforeEach / afterEach
-request: Header
-request: call methods (put / post / get / delete /)
-request: body
-test Observable by using flush ,need subscribe first
-network error
-use httpTestingController + httpClient to test httpClient
-multiple requests
-test response: method
-test response: status
*/
describe('HttpClientService (with spies)', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let httpClientService: HttpClientService;

  beforeEach(() => {
    // Todo: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientService = new HttpClientService(<any>httpClientSpy);
  });

  it('should return expected celebrities (HttpClient called once)', () => {
    const expectedCelebrities: Celebrity[] = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

    httpClientSpy.get.and.returnValue(asyncData(expectedCelebrities));

    httpClientService.getCelebrities().subscribe(
      celebrities => expect(celebrities).toEqual(expectedCelebrities, 'expected celebrities'),
      fail  // from the framework, must provide
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });

  it('should return an error when the server returns a 404', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    httpClientService.getCelebrities().subscribe(
      celebrities => fail('expected an error, not celebrities'),
      error => expect(error.message).toContain('test 404 error')
    );
  });
});

describe('HTTPClientService (with mocks)', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let httpClientService: HttpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
      // Provide the service-under-test
      providers: [HttpClientService]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    httpClientService = TestBed.get(HttpClientService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /// HttpClientService method tests begin ///
  describe('#getCelebrities', () => {
    let expectedCelebrities: Celebrity[];

    beforeEach(() => {
      httpClientService = TestBed.get(HttpClientService);
      expectedCelebrities = [     // stub
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ] as Celebrity[];
    });

    it('should return expected celebrities (called once)', () => {
      httpClientService.getCelebrities().subscribe(
        celebrities => expect(celebrities).toEqual(expectedCelebrities, 'should return expected celebrities'),
        fail
      );

      // HttpClientService should have made one request to GET celebrities from expected URL
      const req = httpTestingController.expectOne(httpClientService.celebrityesUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock celebrities
      req.flush(expectedCelebrities);
    });

    it('should be OK returning no celebrities', () => {
      httpClientService.getCelebrities().subscribe(
        celebrities => expect(celebrities.length).toEqual(0, 'should have empty celebrities array'),
        fail
      );

      const req = httpTestingController.expectOne(httpClientService.celebrityesUrl);
      req.flush([]); // Respond with no celebrities
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';
      httpClientService.getCelebrities().subscribe(
        celebrities => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(httpClientService.celebrityesUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected celebrities (called multiple times)', () => {
      httpClientService.getCelebrities().subscribe();
      httpClientService.getCelebrities().subscribe();
      httpClientService.getCelebrities().subscribe(
        celebrities => expect(celebrities).toEqual(expectedCelebrities, 'should return expected celebrities'),
        fail
      );

      const requests = httpTestingController.match(httpClientService.celebrityesUrl);
      expect(requests.length).toEqual(3, 'calls to getCelebrities()');

      // Respond to each request with different mock hero results
      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'bob' }]);
      requests[2].flush(expectedCelebrities);
    });
  });

  describe('#updateCelebrity', () => {
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${httpClientService.celebrityesUrl}/?id=${id}`;

    it('should update a hero and return it', () => {

      const updateCelebrity: Celebrity = { id: 1, name: 'A' };

      httpClientService.updateCelebrity(updateCelebrity).subscribe(
        data => expect(data).toEqual(updateCelebrity, 'should return the hero'),
        fail
      );

      // HttpClientService should have made one request to PUT hero
      const req = httpTestingController.expectOne(httpClientService.celebrityesUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateCelebrity);

      // Expect server to return the hero after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateCelebrity });
      req.event(expectedResponse);
    });

    it('should turn 404 error into user-facing error', () => {
      const msg = 'Deliberate 404';
      const updateCelebrity: Celebrity = { id: 1, name: 'A' };
      httpClientService.updateCelebrity(updateCelebrity).subscribe(
        celebrities => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(httpClientService.celebrityesUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';

      const updateCelebrity: Celebrity = { id: 1, name: 'A' };
      httpClientService.updateCelebrity(updateCelebrity).subscribe(
        celebrities => fail('expected to fail'),
        error => expect(error.message).toContain(emsg)
      );

      const req = httpTestingController.expectOne(httpClientService.celebrityesUrl);

      // Create mock ErrorEvent, raised when something goes wrong at the network level.
      // Connection timeout, DNS error, offline, etc
      const errorEvent = new ErrorEvent('so sad', {
        message: emsg,
        // The rest of this is optional and not used.
        // Just showing that you could provide this too.
        filename: 'HttpClientService.ts',
        lineno: 42,
        colno: 21
      });

      // Respond with mock error
      req.error(errorEvent);
    });
  });

  // TODO: test other HttpClientService methods
});


/**
 * Extended interactions between a data service and the HttpClient can be complex and difficult to mock with spies.
 * The HttpClientTestingModule can make these testing scenarios more manageable.
 */

import { HttpHeaders } from '@angular/common/http';
// below are some more tests for httpClient
interface Data {
  name: string;
}

const testUrl = '/data';

describe('HttpClient testing', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  // Tests begin
  it('can test HttpClient.get', () => {
    const testData: Data = { name: 'Test Data' };

    // Make an HTTP GET request
    httpClient.get<Data>(testUrl)
      .subscribe(data =>
        // When observable resolves, result should match test data
        expect(data).toEqual(testData)
      );

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpTestingController.expectOne('/data');

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(testData);

    // Finally, assert that there are no outstanding requests.
    // httpTestingController.verify();
  });

  it('can test HttpClient.get with matching header', () => {
    const testData: Data = { name: 'Test Data' };

    // Make an HTTP GET request with specific header
    httpClient.get<Data>(testUrl, {
      headers: new HttpHeaders({ 'Authorization': 'my-auth-token' })
    })
      .subscribe(data =>
        expect(data).toEqual(testData)
      );

    // Find request with a predicate function.
    // Expect one request with an authorization header
    const req = httpTestingController.expectOne(
      requ => requ.headers.has('Authorization')
    );
    req.flush(testData);
  });

  it('can test multiple requests', () => {
    const testData: Data[] = [
      { name: 'bob' }, { name: 'carol' },
      { name: 'ted' }, { name: 'alice' }
    ];

    // Make three requests in a row
    httpClient.get<Data[]>(testUrl)
      .subscribe(d => expect(d.length).toEqual(0, 'should have no data'));

    httpClient.get<Data[]>(testUrl)
      .subscribe(d => expect(d).toEqual([testData[0]], 'should be one element array'));

    httpClient.get<Data[]>(testUrl)
      .subscribe(d => expect(d).toEqual(testData, 'should be expected data'));

    // get all pending requests that match the given URL
    const requests = httpTestingController.match(testUrl);
    expect(requests.length).toEqual(3);

    // Respond to each request with different results
    requests[0].flush([]);
    requests[1].flush([testData[0]]);
    requests[2].flush(testData);
  });

  it('can test for 404 error', () => {
    const emsg = 'deliberate 404 error';

    httpClient.get<Data[]>(testUrl).subscribe(
      data => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(emsg, 'message');
      }
    );

    const req = httpTestingController.expectOne(testUrl);

    // Respond with mock error
    req.flush(emsg, { status: 404, statusText: 'Not Found' });
  });

  it('can test for network error', () => {
    const emsg = 'simulated network error';

    httpClient.get<Data[]>(testUrl).subscribe(
      data => fail('should have failed with the network error'),
      (error: HttpErrorResponse) => {
        expect(error.error.message).toEqual(emsg, 'message');
      }
    );

    const req = httpTestingController.expectOne(testUrl);

    // Create mock ErrorEvent, raised when something goes wrong at the network level.
    // Connection timeout, DNS error, offline, etc
    const errorEvent = new ErrorEvent('so sad', {
      message: emsg,
      // The rest of this is optional and not used.
      // Just showing that you could provide this too.
      filename: 'HttpClientService.ts',
      lineno: 42,
      colno: 21
    });

    // Respond with mock error
    req.error(errorEvent);
  });

  it('httpTestingController.verify should fail if HTTP response not simulated', () => {
    // Sends request
    httpClient.get('some/api').subscribe();

    // verify() should fail because haven't handled the pending request.
    expect(() => httpTestingController.verify()).toThrow();

    // Now get and flush the request so that afterEach() doesn't fail
    const req = httpTestingController.expectOne('some/api');
    req.flush(null);
  });

  // Proves that verify in afterEach() really would catch error
  // if test doesn't simulate the HTTP response.
  //
  // Must disable this test because can't catch an error in an afterEach().
  // Uncomment if you want to confirm that afterEach() does the job.
  // it('afterEach() should fail when HTTP response not simulated',() => {
  //   // Sends request which is never handled by this test
  //   httpClient.get('some/api').subscribe();
  // });
});
