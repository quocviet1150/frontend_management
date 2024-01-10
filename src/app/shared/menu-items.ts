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
        state: 'category', name: 'Loại', type: 'link', icon: 'category', role: 'admin'
    }
]

@Injectable()
export class MenuItems {
    getMenuItem(): Menu[] {
        return MENUITEMS;
    }
}