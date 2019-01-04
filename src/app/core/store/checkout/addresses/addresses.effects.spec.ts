import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { userReducer } from 'ish-core/store/user/user.reducer';
import { Address } from '../../../models/address/address.model';
import { AddressService } from '../../../services/address/address.service';
import { LoginUserSuccess, LogoutUser } from '../../user';
import { checkoutReducers } from '../checkout-store.module';

import * as addressesActions from './addresses.actions';
import { AddressesEffects } from './addresses.effects';

describe('Addresses Effects', () => {
  let actions$: Observable<Action>;
  let addressServiceMock: AddressService;
  let effects: AddressesEffects;
  let store$: Store<{}>;

  beforeEach(() => {
    addressServiceMock = mock(AddressService);

    when(addressServiceMock.getCustomerAddresses(anyString())).thenReturn(of([{ urn: 'test' } as Address]));
    when(addressServiceMock.createCustomerAddress(anyString(), anything())).thenReturn(of({ urn: 'test' } as Address));

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
          user: userReducer,
        }),
      ],
      providers: [
        AddressesEffects,
        provideMockActions(() => actions$),
        { provide: AddressService, useFactory: () => instance(addressServiceMock) },
      ],
    });

    effects = TestBed.get(AddressesEffects);
    store$ = TestBed.get(Store);
    store$.dispatch(new LoginUserSuccess({ customerNo: 'patricia' } as Customer));
  });

  describe('loadAddresses$', () => {
    it('should call the addressService for loadAddresses', done => {
      const action = new addressesActions.LoadAddresses();
      actions$ = of(action);

      effects.loadAddresses$.subscribe(() => {
        verify(addressServiceMock.getCustomerAddresses('patricia')).once();
        done();
      });
    });

    it('should map to action of type LoadAddressesSuccess', () => {
      const action = new addressesActions.LoadAddresses();
      const completion = new addressesActions.LoadAddressesSuccess([{ urn: 'test' } as Address]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAddresses$).toBeObservable(expected$);
    });
  });

  describe('createCustomerAddress$', () => {
    it('should call the addressService for createCustomerAddress', done => {
      const payload = { urn: '123' } as Address;
      const action = new addressesActions.CreateCustomerAddress(payload);
      actions$ = of(action);

      effects.createCustomerAddress$.subscribe(() => {
        verify(addressServiceMock.createCustomerAddress('patricia', anything())).once();
        done();
      });
    });

    it('should map to action of type CreateCustomerSuccess', () => {
      const payload = { urn: '123' } as Address;
      const action = new addressesActions.CreateCustomerAddress(payload);
      const completion = new addressesActions.CreateCustomerAddressSuccess({ urn: 'test' } as Address);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createCustomerAddress$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type CreateCustomerFail', () => {
      when(addressServiceMock.createCustomerAddress(anyString(), anything())).thenReturn(
        throwError({ message: 'invalid' })
      );
      const payload = { urn: '123' } as Address;
      const action = new addressesActions.CreateCustomerAddress(payload);
      const completion = new addressesActions.CreateCustomerAddressFail({ message: 'invalid' } as HttpError);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createCustomerAddress$).toBeObservable(expected$);
    });
  });

  describe('resetAddressesAfterLogout$', () => {
    it('should map to action of type ResetAddresses if LogoutUser action triggered', () => {
      const action = new LogoutUser();
      const completion = new addressesActions.ResetAddresses();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.resetAddressesAfterLogout$).toBeObservable(expected$);
    });
  });
});
