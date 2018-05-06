import { TheSingleService as SingleService } from './singleService';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';

// Straight Jasmine testing without Angular's testing support
describe('SingleService', () => {
  let service: SingleService;
  beforeEach(() => {
    service = new SingleService();
  });

  it('#getValue should return real value', () => {
    expect(service.getValue()).toBe('value of theSingleService');
  });

  it('#getObservableValue should return value from observable',
    (done: DoneFn) => {
      service.getObservableValue().subscribe(value => {
        expect(value).toBe('observable value');
        done();
      });
    });

  it('#getPromiseValue should return value from a promise',
    (done: DoneFn) => {
      service.getPromiseValue().then(value => {
        expect(value).toBe('promise value');
        done();
      });
    });

  it('#getObservableDelayValue should return value from observable with delay',
    (done: DoneFn) => {
      // return of('observable delay value').pipe(delay(10));
      service.getObservableDelayValue().pipe(delay(10)).subscribe(value => {
        expect(value).toBe('observable delay value');
        done();
      });
    });
});
