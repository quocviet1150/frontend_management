import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { MaterialModule } from '../shared/material-module';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { CategoryComponent } from './category/category.component';
import { DialogCategoryComponent } from './dialog/dialog-category/dialog-category.component';
import { ProductComponent } from './product/product.component';
import { DialogProductComponent } from './dialog/dialog-product/dialog-product.component';
import { BillComponent } from './bill/bill.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { UserComponent } from './user/user.component';
import { DialogUserComponent } from './dialog/dialog-user/dialog-user.component';
import { UploadImageComponent } from './dialog/upload-image/upload-image.component';
import { ImageComponent } from './image/image.component';
import { InformationComponent } from '../information/information.component';
import { InformationViewComponent } from '../information-view/information-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [],
  declarations: [
    ViewBillProductsComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    CategoryComponent,
    DialogCategoryComponent,
    ProductComponent,
    DialogProductComponent,
    BillComponent,
    ViewBillComponent,
    UserComponent,
    DialogUserComponent,
    UploadImageComponent,
    ImageComponent,
    InformationComponent,
    InformationViewComponent
  ]
})
export class MaterialComponentsModule {}
