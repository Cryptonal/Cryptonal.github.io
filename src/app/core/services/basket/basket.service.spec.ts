import { HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Address } from 'ish-core/models/address/address.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ApiService } from '../api/api.service';

import { BasketItemUpdateType, BasketService } from './basket.service';

describe('Basket Service', () => {
  let basketService: BasketService;
  let apiService: ApiService;

  const basketMockData = {
    data: {
      id: 'test',
      calculationState: 'UNCALCULATED',
      buckets: [
        {
          lineItems: [],
          shippingMethod: {},
          shipToAddress: {},
        },
      ],
      payment: {
        name: 'testPayment',
        id: 'paymentId',
      },
      totals: {},
    },
  };

  const lineItemData = {
    id: 'test',
    quantity: {
      type: 'Quantity',
      unit: '',
      value: 1,
    },
  };

  const itemMockData = {
    sku: 'test',
    quantity: 10,
  };

  beforeEach(() => {
    apiService = mock(ApiService);
    basketService = new BasketService(instance(apiService));
  });

  it("should get basket data when 'getBasket' is called", done => {
    when(apiService.get(`baskets/${basketMockData.data.id}`, anything())).thenReturn(of(basketMockData));

    basketService.getBasket(basketMockData.data.id).subscribe(data => {
      expect(data.id).toEqual(basketMockData.data.id);
      verify(apiService.get(`baskets/${basketMockData.data.id}`, anything())).once();
      done();
    });
  });

  it('should load a basket by token when requested and successful', done => {
    when(apiService.get(anything(), anything())).thenReturn(of(basketMockData));

    basketService.getBasketByToken('dummy').subscribe(data => {
      verify(apiService.get(anything(), anything())).once();
      const [path, options] = capture<string, { headers: HttpHeaders }>(apiService.get).last();
      expect(path).toEqual('baskets/current');
      expect(options.headers.get(ApiService.TOKEN_HEADER_KEY)).toEqual('dummy');
      expect(data).toHaveProperty('id', 'test');
      done();
    });
  });

  it('should not throw errors when getting a basket by token is unsuccessful', done => {
    when(apiService.get(anything(), anything())).thenReturn(throwError(new Error()));

    basketService.getBasketByToken('dummy').subscribe(fail, fail, done);
  });

  it("should create a basket data when 'createBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of(basketMockData));

    basketService.createBasket().subscribe(data => {
      expect(data.id).toEqual(basketMockData.data.id);
      verify(apiService.post(`baskets`, anything(), anything())).once();
      done();
    });
  });

  it("should update data to basket of a specific basket when 'updateBasket' is called", done => {
    when(apiService.patch(anything(), anything(), anything())).thenReturn(of(basketMockData));
    const payload = { invoiceToAddress: '123456' };

    basketService.updateBasket(basketMockData.data.id, payload).subscribe(() => {
      verify(apiService.patch(`baskets/${basketMockData.data.id}`, payload, anything())).once();
      done();
    });
  });

  it("should get active baskets of the current user when 'getBaskets' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({}));

    basketService.getBaskets().subscribe(() => {
      verify(apiService.get(`baskets`, anything())).once();
      done();
    });
  });

  it("should post item to basket when 'addItemsToBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of({}));

    basketService.addItemsToBasket(basketMockData.data.id, [itemMockData]).subscribe(() => {
      verify(apiService.post(`baskets/${basketMockData.data.id}/items`, anything(), anything())).once();
      done();
    });
  });

  it("should patch updated data to basket line item of a basket when 'updateBasketItem' is called", done => {
    when(apiService.patch(anyString(), anything(), anything())).thenReturn(of({}));

    const payload = { quantity: { value: 2 } } as BasketItemUpdateType;
    basketService.updateBasketItem(basketMockData.data.id, lineItemData.id, payload).subscribe(() => {
      verify(
        apiService.patch(`baskets/${basketMockData.data.id}/items/${lineItemData.id}`, payload, anything())
      ).once();
      done();
    });
  });

  it("should remove line item from spefic basket when 'deleteBasketItem' is called", done => {
    when(apiService.delete(anyString(), anything())).thenReturn(of({}));

    basketService.deleteBasketItem(basketMockData.data.id, lineItemData.id).subscribe(() => {
      verify(apiService.delete(`baskets/${basketMockData.data.id}/items/${lineItemData.id}`, anything())).once();
      done();
    });
  });

  it("should create a basket address when 'createBasketAddress' is called", done => {
    when(apiService.post(anyString(), anything(), anything())).thenReturn(of({ data: {} as Address }));

    basketService.createBasketAddress(basketMockData.data.id, BasketMockData.getAddress()).subscribe(() => {
      verify(apiService.post(`baskets/${basketMockData.data.id}/addresses`, anything(), anything())).once();
      done();
    });
  });

  it("should update a basket address when 'updateBasketAddress' is called", done => {
    when(apiService.patch(anyString(), anything(), anything())).thenReturn(of({ data: {} as Address }));

    const address = BasketMockData.getAddress();

    basketService.updateBasketAddress(basketMockData.data.id, address).subscribe(() => {
      verify(
        apiService.patch(`baskets/${basketMockData.data.id}/addresses/${address.id}`, anything(), anything())
      ).once();
      done();
    });
  });

  it("should get eligible shipping methods for a basket when 'getBasketEligibleShippingMethods' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

    basketService.getBasketEligibleShippingMethods(basketMockData.data.id).subscribe(() => {
      verify(apiService.get(`baskets/${basketMockData.data.id}/eligible-shipping-methods`, anything())).once();
      done();
    });
  });

  it("should get basket eligible payment methods for a basket when 'getBasketEligiblePaymentMethods' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ data: [] }));

    basketService.getBasketEligiblePaymentMethods(basketMockData.data.id).subscribe(() => {
      verify(apiService.get(`baskets/${basketMockData.data.id}/eligible-payment-methods`, anything())).once();
      done();
    });
  });

  it("should set a payment to the basket when 'setBasketPayment' is called", done => {
    when(apiService.put(`baskets/${basketMockData.data.id}/payments/open-tender`, anything(), anything())).thenReturn(
      of([])
    );

    basketService.setBasketPayment(basketMockData.data.id, basketMockData.data.payment.name).subscribe(() => {
      verify(apiService.put(`baskets/${basketMockData.data.id}/payments/open-tender`, anything(), anything())).once();
      done();
    });
  });

  it("should create a payment instrument for the basket when 'createBasketPayment' is called", done => {
    when(
      apiService.post(
        `baskets/${basketMockData.data.id}/payment-instruments?include=paymentMethod`,
        anything(),
        anything()
      )
    ).thenReturn(of([]));

    const paymentInstrument = {
      id: undefined,
      paymentMethod: 'ISH_DirectDebit',
      parameters_: [
        {
          name: 'accountHolder',
          value: 'Patricia Miller',
        },
        {
          name: 'IBAN',
          value: 'DE430859340859340',
        },
      ],
    };

    basketService.createBasketPayment(basketMockData.data.id, paymentInstrument).subscribe(() => {
      verify(
        apiService.post(
          `baskets/${basketMockData.data.id}/payment-instruments?include=paymentMethod`,
          anything(),
          anything()
        )
      ).once();
      done();
    });
  });

  it("should delete a payment instrument from basket when 'deleteBasketInstrument' is called", done => {
    when(apiService.delete(anyString(), anything())).thenReturn(of({}));

    basketService.deleteBasketPaymentInstrument(basketMockData.data.id, 'paymentInstrumentId').subscribe(() => {
      verify(
        apiService.delete(`baskets/${basketMockData.data.id}/payment-instruments/paymentInstrumentId`, anything())
      ).once();
      done();
    });
  });
});