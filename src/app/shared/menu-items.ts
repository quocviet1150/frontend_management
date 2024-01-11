import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    {
        state: 'dashboard', name: 'Trang chủ', type: 'link', icon: 'dashboard', role: ''
    },
    {
        state: 'category', name: 'Danh mục', type: 'link', icon: 'category', role: 'admin'
    },
    {
        state: 'product', name: 'Sản phẩm', type: 'link', icon: 'inventory_2', role: 'admin'
    },
    {
        state: 'bill', name: 'Quản lý đơn đặt hàng', type: 'link', icon: 'shopping_cart', role: ''
    }
]

@Injectable()
export class MenuItems {
    getMenuItem(): Menu[] {
        return MENUITEMS;
    }
}