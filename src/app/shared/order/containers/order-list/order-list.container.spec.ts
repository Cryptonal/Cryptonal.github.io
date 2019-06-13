import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { PipesModule } from 'ish-core/pipes.module';
import { LoadingComponent } from '../../../../shared/common/components/loading/loading.component';
import { OrderListComponent } from '../../components/order-list/order-list.component';

import { OrderListContainerComponent } from './order-list.container';

describe('Order List Container', () => {
  let component: OrderListContainerComponent;
  let fixture: ComponentFixture<OrderListContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(LoadingComponent), MockComponent(OrderListComponent), OrderListContainerComponent],
      imports: [PipesModule],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order list component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-list')).toBeTruthy();
  });
});