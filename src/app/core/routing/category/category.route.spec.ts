import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, UrlMatchResult, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, select } from '@ngrx/store';

import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { selectRouter } from 'ish-core/store/router';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import {
  generateCategoryUrl,
  generateLocalizedCategorySlug,
  matchCategoryRoute,
  ofCategoryUrl,
} from './category.route';

describe('Category Route', () => {
  const specials = { categoryPath: ['Specials'], uniqueId: 'Specials', name: 'Spezielles' } as Category;
  const topSeller = {
    categoryPath: ['Specials', 'Specials.TopSeller'],
    uniqueId: 'Specials.TopSeller',
    name: 'Angebote',
  } as Category;
  const limitedOffer = {
    categoryPath: ['Specials', 'Specials.TopSeller', 'Specials.TopSeller.LimitedOffer'],
    uniqueId: 'Specials.TopSeller.LimitedOffer',
    name: 'Black Friday',
  } as Category;

  expect.addSnapshotSerializer({
    test: val => val && val.consumed && val.posParams,
    print: (val: UrlMatchResult, serialize) =>
      serialize(
        Object.keys(val.posParams)
          .map(key => ({ [key]: val.posParams[key].path }))
          .reduce((acc, v) => ({ ...acc, ...v }), {})
      ),
  });

  let wrap: (url: string) => UrlSegment[];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    const router: Router = TestBed.get(Router);
    wrap = url => {
      const primary = router.parseUrl(url).root.children.primary;
      return primary ? primary.segments : [];
    };
  });

  describe('without anything', () => {
    it('should be created', () => {
      expect(generateCategoryUrl(undefined)).toMatchInlineSnapshot(`"/"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(undefined)))).toMatchInlineSnapshot(`undefined`);
    });
  });

  describe('with top level category without name', () => {
    const category = createCategoryView(categoryTree([{ ...specials, name: undefined }]), specials.uniqueId);

    it('should be created', () => {
      expect(generateCategoryUrl(category)).toMatchInlineSnapshot(`"/catSpecials"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category)))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials",
        }
      `);
    });
  });

  describe('with top level category', () => {
    const category = createCategoryView(categoryTree([specials]), specials.uniqueId);

    it('should be created', () => {
      expect(generateCategoryUrl(category)).toMatchInlineSnapshot(`"/Spezielles-catSpecials"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category)))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials",
        }
      `);
    });
  });

  describe('with deep category', () => {
    const category = createCategoryView(categoryTree([specials, topSeller, limitedOffer]), limitedOffer.uniqueId);

    it('should be created', () => {
      expect(generateCategoryUrl(category)).toMatchInlineSnapshot(`"/Black-Friday-catSpecials.TopSeller.LimitedOffer"`);
    });

    it('should not be a match for matcher', () => {
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category)))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
        }
      `);
    });
  });

  describe('compatibility', () => {
    it('should detect category route without product after it', () => {
      expect(matchCategoryRoute(wrap('/category/123'))).toHaveProperty('consumed');
    });

    it('should not detect category route with product after it', () => {
      expect(matchCategoryRoute(wrap('/category/123/product/123'))).toBeUndefined();
    });
  });

  describe('additional URL params', () => {
    it('should ignore additional URL params when supplied', () => {
      const category = createCategoryView(categoryTree([specials, topSeller, limitedOffer]), limitedOffer.uniqueId);
      expect(matchCategoryRoute(wrap(generateCategoryUrl(category) + ';lang=de_DE;redirect=1'))).toMatchInlineSnapshot(`
        Object {
          "categoryUniqueId": "Specials.TopSeller.LimitedOffer",
        }
      `);
    });
  });

  describe('generateLocalizedCategorySlug', () => {
    it('should generate slug for top level category', () => {
      const category = createCategoryView(categoryTree([specials]), specials.uniqueId);
      expect(generateLocalizedCategorySlug(category)).toMatchInlineSnapshot(`"Spezielles"`);
    });

    it('should generate slug for deep category', () => {
      const category = createCategoryView(categoryTree([specials, topSeller, limitedOffer]), limitedOffer.uniqueId);
      expect(generateLocalizedCategorySlug(category)).toMatchInlineSnapshot(`"Black-Friday"`);
    });

    it('should return empty string when category is unavailable', () => {
      expect(generateLocalizedCategorySlug(undefined)).toMatchInlineSnapshot(`""`);
    });
  });
});

describe('Category Route', () => {
  let router: Router;
  let store$: Store<{}>;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]),
        ngrxTesting({ routerStore: true }),
      ],
    });

    router = TestBed.get(Router);
    store$ = TestBed.get(Store);
  });

  describe('ofCategoryRoute', () => {
    it('should detect category route when categoryUniqueId is a param', done => {
      router.navigateByUrl('/category;categoryUniqueId=ABC');

      store$
        .pipe(
          ofCategoryUrl(),
          select(selectRouter)
        )
        .subscribe(data => {
          expect(data.state.params).toMatchInlineSnapshot(`
            Object {
              "categoryUniqueId": "ABC",
            }
          `);
          done();
        });
    });

    it('should not detect category route when sku and categoryUniqueId are params', done => {
      router.navigateByUrl('/category;sku=123;categoryUniqueId=ABC');

      store$.pipe(ofCategoryUrl()).subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });

    it('should not detect category route when categoryUniqueId is missing', done => {
      router.navigateByUrl('/other');

      store$.pipe(ofCategoryUrl()).subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });
});