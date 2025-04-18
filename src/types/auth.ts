
// Define the application roles
// Note: 'user' is included in AppRole but we're using type assertion when inserting
// into the database to match the database's accepted values
export type AppRole = 'superadmin' | 'admin' | 'evaluator' | 'user';
