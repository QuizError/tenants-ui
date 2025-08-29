import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { LayoutsComponent } from './pages/layouts-component/layouts-component';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';
import { EmployeeComponent } from './pages/employee-component/employee-component';
import { GroupOwnershipComponent } from './pages/ownership/group-ownership-component/group-ownership-component';
import { PropertyComponent } from './pages/properties/property-component/property-component';
import { AddPropertyComponent } from './pages/properties/add-property-component/add-property-component';
import { ViewPropertyComponent } from './pages/properties/view-property-component/view-property-component';
import { UpdatePropertyComponent } from './pages/properties/update-property-component/update-property-component';
import { AddUnitComponent } from './pages/units/add-unit-component/add-unit-component';
import { UpdateUnitComponent } from './pages/units/update-unit-component/update-unit-component';
import { UnitsComponent } from './pages/units/units-component/units-component';
import { ViewUnitComponent } from './pages/units/view-unit-component/view-unit-component';
import { ClientsComponent } from './pages/clients/clients-component/clients-component';
import { AddClientComponent } from './pages/clients/add-client-component/add-client-component';
import { UpdateClientComponent } from './pages/clients/update-client-component/update-client-component';
import { ViewClientComponent } from './pages/clients/view-client-component/view-client-component';
import { RentalsComponent } from './pages/rentals/rentals-component/rentals-component';
import { AddRentalComponent } from './pages/rentals/add-rental-component/add-rental-component';
import { BillsComponent } from './pages/bill/bills-component/bills-component';
import { ViewBillComponent } from './pages/bill/view-bill-component/view-bill-component';
import { PaymentsComponent } from './pages/payment/payments-component/payments-component';
import { ViewPaymentComponent } from './pages/payment/view-payment-component/view-payment-component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutsComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'employee',
                component: EmployeeComponent
            },
            {
                path: 'ownership-groups',
                component: GroupOwnershipComponent
            },
            {
                path: 'properties',
                component: PropertyComponent
            },
            {
                path: 'add-property',
                component: AddPropertyComponent
            },
            {
                path: 'view-property/:uid',
                component: ViewPropertyComponent
            },
            {
                path: 'update-property/:uid',
                component: UpdatePropertyComponent
            },
            {
                path: 'units',
                component: UnitsComponent
            },
            {
                path: 'add-unit',
                component: AddUnitComponent
            },
            {
                path: 'units/update/:uid',
                component: UpdateUnitComponent
            },
            {
                path: 'view-unit/:uid',
                component: ViewUnitComponent
            },
            {
                path: 'clients',
                component: ClientsComponent
            },
            {
                path: 'add-client',
                component: AddClientComponent
            },
            {
                path: 'update-client/:uid',
                component: UpdateClientComponent
            },
            {
                path: 'clients/:uid',
                component: ViewClientComponent
            },
            {
                path: 'rentals',
                component: RentalsComponent
            },
            {
                path: 'add-rental',
                component: AddRentalComponent
            },
            {
                path: 'bills',
                component: BillsComponent
            },
            {
                path: 'bills/:id',
                component: ViewBillComponent
            },
            {
                path: 'payments',
                component: PaymentsComponent
            },
            {
                path: 'payments/:uid',
                component: ViewPaymentComponent
            }
        ]
    }
];
