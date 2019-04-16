import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { PipesModule } from 'ish-core/pipes.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { ProductRowComponent } from './product-row.component';

describe('Product Row Component', () => {
  let component: ProductRowComponent;
  let fixture: ComponentFixture<ProductRowComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FeatureToggleModule, PipesModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent({
          selector: 'ish-lazy-product-add-to-quote',
          template: 'Lazy Product Add To Quote Component',
          inputs: ['displayType', 'disabled', 'class', 'product', 'quantity'],
        }),
        MockComponent({
          selector: 'ish-product-add-to-basket',
          template: 'Product Add To Basket Component',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-add-to-compare',
          template: 'Product Add To Compare Component',
          inputs: ['isInCompareList'],
        }),
        MockComponent({
          selector: 'ish-product-image',
          template: 'Product Image Component',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-inventory',
          template: 'Product Inventory Component',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-label',
          template: 'Product Label Component',
          inputs: ['product'],
        }),
        MockComponent({
          selector: 'ish-product-price',
          template: 'Product Price Component',
          inputs: ['product', 'showInformationalPrice'],
        }),
        MockComponent({
          selector: 'ish-product-quantity',
          template: 'Product Quantity Component',
          inputs: ['product', 'parentForm', 'controlName'],
        }),
        MockComponent({
          selector: 'ish-product-variation-select',
          template: 'Product Variation Select Component',
          inputs: ['variationOptions'],
        }),
        ProductRowComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRowComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = { sku: 'sku' } as ProductView;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
