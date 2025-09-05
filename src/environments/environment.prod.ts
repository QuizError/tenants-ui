export const environment = {
  production: true,
  // Update this with your production API URL
  apiUrl: 'http://backend.tmis.divinesolutions.co.tz',
  
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
    name: 'Tenant Management Information System',
    version: '1.0.0',
    defaultCurrency: 'TZS',
    defaultDateFormat: 'dd/MM/yyyy HH:mm'
  }
};
