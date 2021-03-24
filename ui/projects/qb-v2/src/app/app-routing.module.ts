import { QueryComponent } from './components/query/query.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  { path: '', redirectTo: 'query', pathMatch: 'full' },
  { path: 'query', component: QueryComponent, runGuardsAndResolvers: 'always' },
  { path: 'test', component: TestComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
