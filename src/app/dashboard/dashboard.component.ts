import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { ProductService } from '../services/product.service';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	@ViewChild('loader') loader!: ElementRef;

	responseMessage: any;
	data: any;
	dataUser: any;
	barchart: any;
	loading: boolean = false;

	ngAfterViewInit() { }

	constructor(
		private productService: ProductService,
		private snackbarService: SnackbarService,
	) {
	}

	type = 'bar';
	options = {
		responsive: true,
		maintainAspectRatio: true,
		scales: {
			yAxes: [{
				ticks: {
					max: 1000,
					min: 0
				}
			}]
		}
	};

	ngOnInit() {
		this.dashboardData();
	}
	dashboardData() {
		this.loading = true;
		this.productService.getDetails().subscribe(
			(data: any) => {
				this.barchart = data;
				if (this.barchart && this.barchart.length === 2) {
					const labels = this.barchart[0];
					const values = this.barchart[1].map((value: string) => parseInt(value, 10));

					this.data = {
						labels: labels,
						datasets: [{
							label: "Số lượng",
							data: values,
							backgroundColor: "#7FFFD4",
						}],
					};
				}
				setTimeout(() => {
					this.loading = false;
				}, 500);
			},
			(error: any) => {
				setTimeout(() => {
					this.loading = false;
				}, 500);
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
