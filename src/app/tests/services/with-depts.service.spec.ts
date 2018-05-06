import { TestBed, inject } from '@angular/core/testing';

import { WithDeptsService } from './with-depts.service';
import { ApiService } from '../../shared';
import { TheSingleService as SingleService } from './singleService';

export class FakeSingleService extends SingleService {
  value = 'faked service value';
}

/**
 * below are ways of test dependance services without TestBed,
 * more methods with testBed: ../test-bed/test-bed.componenent.spec
 */
describe('WithDeptsService without Angular testing support', () => {
/*   beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SingleService,
        WithDeptsService
      ]
    });
  });
  it('should be created', inject([WithDeptsService], (service: WithDeptsService) => {
    expect(service).toBeTruthy();
  }));
*/

  let withDeptsService: WithDeptsService;

  it('#getValue should return real value from the real service', () => {
    withDeptsService = new WithDeptsService(new SingleService());
    expect(withDeptsService.getValue()).toBe('value of theSingleService');
  });

  it('#getValue should return faked value from a fakeService', () => {
    withDeptsService = new WithDeptsService(new FakeSingleService());
    expect(withDeptsService.getValue()).toBe('faked service value');
  });

  it('#getValue should return faked value from a fake object', () => {
    const fake = { getValue: () => 'fake value' };
    withDeptsService = new WithDeptsService(fake as SingleService);
    expect(withDeptsService.getValue()).toBe('fake value');
  });

  it('#getValue should return stubbed value from a spy', () => {
    // create `getValue` spy on an object representing the SingleService
    const valueServiceSpy =
      jasmine.createSpyObj('SingleService', ['getValue']);

    // set the value to return when the `getValue` spy is called.
    const stubValue = 'stub value';
    valueServiceSpy.getValue.and.returnValue(stubValue);

    withDeptsService = new WithDeptsService(valueServiceSpy as SingleService);

    expect(withDeptsService.getValue())
      .toBe(stubValue, 'service returned stub value');    // ???
    expect(valueServiceSpy.getValue.calls.count())
      .toBe(1, 'spy method was called once');
    expect(valueServiceSpy.getValue.calls.mostRecent().returnValue)
      .toBe(stubValue);
  });

});


describe('withDeptservice (no beforeEach) optimized', () => {

  function setup() {
    /**
     * const singleServiceSpy = jasmine.createSpyObj('SingleService', ['getValue']);
     * const stubValue = 'stub value';
     * const withDeptsService = new WithDeptsService(singleServiceSpy);
     * singleServiceSpy.getValue.and.returnValue(stubValue);
     *
     * expect(withDeptsService.getValue()).toBe(stubValue, 'service returned stub value');
     */
    const singleServiceSpy =
      jasmine.createSpyObj('SingleService', ['getValue']);
    const stubValue = 'stub value';
    const withDeptsService = new WithDeptsService(singleServiceSpy);

    singleServiceSpy.getValue.and.returnValue(stubValue);
    return { withDeptsService, stubValue, singleServiceSpy };
  }

  it('#getValue should return stubbed value from a spy', () => {
    const { withDeptsService, stubValue, singleServiceSpy } = setup();

    expect(withDeptsService.getValue()).toBe(stubValue, 'service returned stub value');
    expect(singleServiceSpy.getValue.calls.count()).toBe(1, 'spy method was called once');
    expect(singleServiceSpy.getValue.calls.mostRecent().returnValue).toBe(stubValue);
  });

});
