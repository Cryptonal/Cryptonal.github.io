import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { SearchProductsSuccess } from 'ish-core/store/shopping/search';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { SetPagingInfo } from 'ish-core/store/shopping/viewconf';
import { BreadcrumbComponent } from '../../shared/common/components/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '../../shared/common/components/loading/loading.component';
import { ProductListPagingComponent } from '../../shared/product/components/product-list-paging/product-list-paging.component';

import { SearchNoResultComponent } from './components/search-no-result/search-no-result.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchPageContainerComponent } from './search-page.container';

describe('Search Page Container', () => {
  let component: SearchPageContainerComponent;
  let fixture: ComponentFixture<SearchPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductListPagingComponent),
        MockComponent(SearchNoResultComponent),
        MockComponent(SearchResultComponent),
        SearchPageContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render search no result component if search has no results', () => {
    const newProducts = [];
    store$.dispatch(new SearchProductsSuccess({ searchTerm: 'search' }));
    store$.dispatch(new SetPagingInfo({ newProducts, currentPage: 0, totalItems: newProducts.length }));
    fixture.detectChanges();
    expect(element.querySelector('ish-search-no-result')).toBeTruthy();
    expect(element.querySelector('ish-search-result')).toBeFalsy();
  });

  it('should render search result component if search has results', () => {
    const newProducts = ['testSKU1', 'testSKU2'];
    store$.dispatch(new SearchProductsSuccess({ searchTerm: 'search' }));
    store$.dispatch(new SetPagingInfo({ newProducts, currentPage: 0, totalItems: newProducts.length }));
    fixture.detectChanges();
    expect(element.querySelector('ish-search-result')).toBeTruthy();
    expect(element.querySelector('ish-search-no-result')).toBeFalsy();
  });
});