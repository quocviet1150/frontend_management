import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { RouteGuardService } from '../services/route-guard.service';


export const MaterialRoutes: Routes = [
    {
        path: 'category',
        component: CategoryComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    }
];
