import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { AppComponent } from './app.component';
import { PaymentsComponent } from './pages/payment/payments-component/payments-component';
import { ViewPaymentComponent } from './pages/payment/view-payment-component/view-payment-component';

const routes: Routes = [
  { path: 'payments', component: PaymentsComponent },
  { path: 'payments/:uid', component: ViewPaymentComponent },
  { path: '', redirectTo: '/payments', pathMatch: 'full' },
  { path: '**', redirectTo: '/payments' }
];

@NgModule({
  declarations: [
    // Standalone components must NOT be declared in an NgModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    // Angular Material Modules
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    // Import standalone components instead of declaring them
    AppComponent,
    PaymentsComponent,
    ViewPaymentComponent
  ],
  providers: []
  // No bootstrap here; app bootstraps via main.ts with bootstrapApplication(App, appConfig)
})
export class AppModule { }
