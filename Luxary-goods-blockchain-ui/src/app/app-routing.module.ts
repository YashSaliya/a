import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductsComponent } from './add-products/add-products.component';
import { BuyerPageComponent } from './buyer-page/buyer-page.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SellerPageComponent } from './seller-page/seller-page.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  {
    path: 'addProduct',
    component: AddProductsComponent,
  },
  {
    path: 'buy',
    component: BuyerPageComponent,
  },
  {
    path: 'sell',
    component: SellerPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
