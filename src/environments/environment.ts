// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // API base URL - update this with your development API URL
  // apiUrl: 'http://backend.tmis.divinesolutions.co.tz',
  apiUrl: 'http://localhost:9231',
  
  // API endpoints
  endpoints: {
    payments: '/payments',
    bills: '/bills',
    // Add other endpoints as needed
  },
  
  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 100]
  },
  
  // Application settings
  app: {
    name: 'TMIS',
    version: '1.0.0',
    defaultCurrency: 'TZS',
    defaultDateFormat: 'dd/MM/yyyy HH:mm'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
