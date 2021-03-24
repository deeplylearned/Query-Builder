import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';
import { StepComponent } from './components/step/step.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SaveQueryPopupComponent } from './components/save-query-popup/save-query-popup.component';
import { ManageQueriesComponent } from './components/manage-queries/manage-queries.component';
import { QueryComponent } from './components/query/query.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { TestComponent } from './components/test/test.component';


// Lib
import { TableModule } from '../lib/table/table.module';
import { ResponseTypesPopupComponent } from './components/response-types-popup/response-types-popup.component';
import { DemoComponent } from './components/demo/demo.component';
import { DrillLevelsPopupComponent } from './components/drill-levels-popup/drill-levels-popup.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  // bgsColor: 'red',
  fgsColor: 'white',
  bgsPosition: POSITION.centerCenter,
  bgsSize: 50,
  fgsSize: 50,
  fgsPosition: POSITION.centerCenter,
  bgsType: SPINNER.threeStrings, // background spinner type
  fgsType: SPINNER.threeStrings, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 3, // progress bar thickness
  blur: 5,
  hasProgressBar: true,
  masterLoaderId: 'master',
  text: "Loading...",
  textColor: 'white',
  threshold: 500
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StepComponent,
    SaveQueryPopupComponent,
    ManageQueriesComponent,
    QueryComponent,
    ConfirmationDialogComponent,
    TestComponent,
    ResponseTypesPopupComponent,
    DemoComponent,
    DrillLevelsPopupComponent
  ],
  entryComponents: [
    SaveQueryPopupComponent,
    ManageQueriesComponent,
    ConfirmationDialogComponent,
    ResponseTypesPopupComponent,
    DrillLevelsPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastContainerModule,
    ToastrModule.forRoot(),
    NgSelectModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({showForeground: true}),
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
