import { Routes } from '@angular/router';
import { RouteGuardService } from '../services/route-guard.service';
import { BillComponent } from './bill/bill.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { UserComponent } from './user/user.component';
import { UploadImageComponent } from './dialog/upload-image/upload-image.component';
import { ImageComponent } from './image/image.component';


export const MaterialRoutes: Routes = [
    {
        path: 'category',
        component: CategoryComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'product',
        component: ProductComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'order',
        component: BillComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin','user']
        }
    },
    {
        path: 'bill',
        component: ViewBillComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin','user']
        }
    },
    {
        path: 'user',
        component: UserComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'image',
        component: ImageComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
];
