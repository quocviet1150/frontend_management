import { Component, AfterViewInit } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
import { DashboardService } from '../services/dashboard.service';
import { GlobalConstants } from '../shared/global-constants';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	responseMessage: any;
	data: any;
	dataUser: any;

	ngAfterViewInit() { }

	constructor(
		private dashboardService: DashboardService,
		private snackbarService: SnackbarService,
	) {
		this.dashboardData();
	}

	dashboardData() {
		this.dashboardService.getDetails().subscribe((response: any) => {
			this.data = response;
		}, (error: any) => {
			console.log(error);
			if (error.error?.message) {
				this.responseMessage = error.error?.responseMessage;
			} else {
				this.responseMessage = GlobalConstants.genericError;
			}
			this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error)
		})
	}

}
