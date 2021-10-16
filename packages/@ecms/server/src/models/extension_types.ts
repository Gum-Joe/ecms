// @generated
// Automatically generated. Don't change this file manually.

/** Module types - this ENUM governs the types of extensions there can be.

Currently there are only two:
1. dataSource - these are extensions that provide sources of data for charity events,
to collect things like how much money has been raised from a source of data like JustGiving
or Eventbrite

2. pointsSystem - extensions that contain the logic to calculate points teams or competitors have acheived
These are included in the ecms.type field of the package.json (extensions are written as node.js modules) */
type extension_types = 'dataSource' | 'pointsSystem';
export default extension_types;
