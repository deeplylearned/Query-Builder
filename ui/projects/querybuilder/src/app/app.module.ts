import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ToastContainerModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FilterPreviewComponent } from './components/filter-preview/filter-preview.component';
import { AggFilterPreviewComponent } from './components/agg-filter-preview/agg-filter-preview.component';
import { ContentComponent } from './components/content/content.component';
import { AggAttrListComponent } from './components/agg-attr-list/agg-attr-list.component';
import { FilternamePipe } from './pipes/filtername.pipe';
import { AttrListComponent } from './components/attr-list/attr-list.component';
import { PrettyPipe } from './pipes/pretty.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FilterPreviewComponent,
    AggFilterPreviewComponent,
    ContentComponent,
    AggAttrListComponent,
    FilternamePipe,
    AttrListComponent,
    PrettyPipe
  ],
  entryComponents: [
    AggAttrListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastContainerModule,
    ToastrModule.forRoot(),
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
