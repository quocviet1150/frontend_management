import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxLoadingComponent, ngxLoadingAnimationTypes } from 'ngx-loading';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#1976d2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  @ViewChild('ngxLoading', { static: false })
  ngxLoadingComponent!: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false })
  customLoadingTemplate!: TemplateRef<any>;
  @ViewChild('emptyLoadingTemplate', { static: false })
  emptyLoadingTemplate!: TemplateRef<any>;
  showingTemplate = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = true;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public loadingTemplate!: TemplateRef<any>;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: '3px',
  };
  constructor(
    private sanitizer: DomSanitizer,
    private viewContainerRef: ViewContainerRef
  ) { 

   }
   ngOnInit(): void {
    this.loading = false;
   }

  public toggleColours(): void {
    this.coloursEnabled = !this.coloursEnabled;
  
    if (this.coloursEnabled) {
      this.primaryColour = PrimaryRed;
      this.secondaryColour = SecondaryBlue;
    } else {
      this.primaryColour = PrimaryWhite;
      this.secondaryColour = SecondaryGrey;
    }
  
    // Kiểm tra trạng thái của this.loading trước khi gọi showAlert()
    if (!this.loading) {
      this.showAlert();
    }
  }
  
  toggleTemplate(): void {
    if (this.showingTemplate) {
      this.loadingTemplate = this.emptyLoadingTemplate;
    } else {
      this.loadingTemplate = this.customLoadingTemplate;
    }
  
    this.showingTemplate = !this.showingTemplate;
  
    // Kiểm tra trạng thái của this.loading trước khi gọi showAlert()
    if (!this.loading) {
      this.showAlert();
    }
  }
  
  public showAlert(): void {
    alert('ngx-loading rocks!');
  }

  title = 'Frontend';
}
