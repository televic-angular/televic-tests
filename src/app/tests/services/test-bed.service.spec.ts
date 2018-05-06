import { TestBed, inject } from '@angular/core/testing';

import { TestBedService } from './test-bed.service';
import { WithDeptsService } from './with-depts.service';
import { TheSingleService as SingleService } from './singleService';

describe('TestBedService1', () => {

  let service: TestBedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestBedService]
    });
  });

  it('should use TestBedService', () => {
    service = TestBed.get(TestBedService);
    expect(service.getValue()).toBe('value of TestBedService');
  });

/*   it('should be created', inject([TestBedService], (service: TestBedService) => {
    expect(service).toBeTruthy();
  })); */
});

describe('TestBedService2', () => {
  let service: TestBedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestBedService]
    });
    service = TestBed.get(TestBedService);
  });

  it('should use TestBedService', () => {
    expect(service.getValue()).toBe('value of TestBedService');
  });
});

describe('TestBedService3', () => {

  let withDeptsService: WithDeptsService;
  let singleServiceSpy: jasmine.SpyObj<SingleService>;
  let testBedServiceSpy: jasmine.SpyObj<TestBedService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SingleService', ['getValue']);
    const spy2 = jasmine.createSpyObj('TestBedService', ['getValue']);

    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        WithDeptsService,
        { provide: SingleService, useValue: spy },

        { provide: TestBedService, useValue: spy2 }
      ]
    });
    // Inject both the service-to-test and its (spy) dependency
    withDeptsService = TestBed.get(WithDeptsService);
    singleServiceSpy = TestBed.get(SingleService);

    testBedServiceSpy = TestBed.get(TestBedService);
  });

  it('#getValue should return stubbed value from a spy', () => {
    const stubValue = 'stub value';
    singleServiceSpy.getValue.and.returnValue(stubValue);

    expect(withDeptsService.getValue()).toBe(stubValue, 'service returned value of theSingleService');
    expect(singleServiceSpy.getValue.calls.count()).toBe(1, 'spy method was called once');
    expect(singleServiceSpy.getValue.calls.mostRecent().returnValue).toBe(stubValue);
  });

  // TODO
/*
  it('testBedService, #getValue should return stubbed value from a spy', () => {
    const stubValue = 'stub value';
    singleServiceSpy.getValue.and.returnValue(stubValue);

    expect(withDeptsService.getValue()).toBe(stubValue, 'service returned value of theSingleService');
    expect(testBedServiceSpy.getValue.calls.count()).toBe(0, 'spy method was called once');
    expect(testBedServiceSpy.getValue.calls.mostRecent().returnValue).toBe(stubValue);
  }); */


});
