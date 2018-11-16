import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { QuotingSharedModule } from '../../../quoting/quoting-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { ProductDetailComponent } from '../../components/product/product-detail/product-detail.component';
import { ShoppingSharedModule } from '../../shopping-shared.module';

import { ProductPageContainerComponent } from './product-page.container';
import { productPageRoutes } from './product-page.routes';

@NgModule({
  imports: [
    FormsSharedModule,
    QuotingSharedModule,
    RouterModule.forChild(productPageRoutes),
    SharedModule,
    ShoppingSharedModule,
  ],
  declarations: [ProductDetailComponent, ProductPageContainerComponent],
})
export class ProductPageModule {}
