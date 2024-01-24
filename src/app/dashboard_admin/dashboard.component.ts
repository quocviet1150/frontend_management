import { Component, AfterViewInit } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
import { DashboardService } from '../services/dashboard.service';
import { GlobalConstants } from '../shared/global-constants';
import { HttpClient } from '@angular/common/http';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard_admin.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	responseMessage: any;
	// data: any;
	// dataUser: any;
	data: any;
	barchart: any;

	ngAfterViewInit() { }

	constructor(
		private dashboardService: DashboardService,
		private snackbarService: SnackbarService,
		private http: HttpClient
	) {
	}

	type = 'bar';
	options = {
		responsive: true,
		maintainAspectRatio: true,
		scales: {
			yAxes: [{
				ticks: {
					max: 15,
					min: 0
				}
			}]
		}
	};

	ngOnInit() {
		this.dashboardData();
	}

	dashboardData() {
		this.dashboardService.getDetails().subscribe(
			(data: any) => {
				this.barchart = data;

				if (this.barchart?.barchart && this.barchart?.barchart.length >= 2) {
					this.data = {
						labels: this.barchart?.barchart[0],
						datasets: this.barchart?.barchart[1].map((dataset: any, index: number) => ({
							label: `Số lượng`,
							data: dataset.map((value: string) => parseInt(value, 10)),
							backgroundColor: index === 0 ? "#7FFFD4" : "#6970d5",
						})),
					};
				}
			},
			(error: any) => {
				if (error.error?.message) {
					this.responseMessage = error.error?.responseMessage;
				} else {
					this.responseMessage = GlobalConstants.genericError;
				}

				this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
			}
		);
	}

}
