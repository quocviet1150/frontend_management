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
        state: 'home', name: 'Trang thống kê', type: 'link', icon: 'dashboard', role: 'admin'
    },
    {
        state: 'category', name: 'Danh mục sản phẩm', type: 'link', icon: 'category', role: 'admin'
    },
    {
        state: 'product', name: 'Sản phẩm', type: 'link', icon: 'inventory_2', role: 'admin'
    },
    {
        state: 'order', name: 'Quản lý đơn đặt hàng', type: 'link', icon: 'shopping_cart', role: ''
    },
    {
        state: 'bill', name: 'Quản lý hóa đơn', type: 'link', icon: 'backup_table', role: 'admin'
    },
    {
        state: 'user', name: 'Quản lý người dùng', type: 'link', icon: 'people', role: 'admin'
    },
    {
        state: 'image', name: 'Quản lý dũ liệu', type: 'link', icon: 'image', role: 'admin'
    }
]

@Injectable()
export class MenuItems {
    getMenuItem(): Menu[] {
        return MENUITEMS;
    }
}