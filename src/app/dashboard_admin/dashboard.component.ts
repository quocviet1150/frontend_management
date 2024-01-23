import { Component, AfterViewInit } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
import { DashboardService } from '../services/dashboard.service';
import { GlobalConstants } from '../shared/global-constants';
import { HttpClient } from '@angular/common/http';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
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
					max: 100,
					min: 0
				}
			}]
		}
	};

	ngOnInit() {
		this.dashboardData();
	}

	dashboardData() {
		debugger
		this.dashboardService.getDetails().subscribe(
			(data: any) => {
				this.barchart = this.data.barchart;

				if (this.barchart && this.barchart.length >= 2) {
					this.data = {
						labels: this.barchart[0], // Months
						datasets: [
							{
								label: "Angular 11",
								data: this.barchart[1][0], // Assuming the first dataset
								backgroundColor: "#f38b4a"
							}
						]
					};
				}
			},
			(error: any) => {
				console.log(error);

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
