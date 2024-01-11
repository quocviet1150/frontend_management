import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ProductComponent } from './product/product.component';
import { BillComponent } from './bill/bill.component';


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
        path: 'bill',
        component: BillComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin','user']
        }
    }
];
