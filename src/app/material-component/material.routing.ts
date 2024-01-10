import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ProductComponent } from './product/product.component';


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
    }
];
