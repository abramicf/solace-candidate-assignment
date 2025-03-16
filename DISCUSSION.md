# Discussion

Hello!  Thank you for viewing my work and for 


## One - Fixed Bugs

1.  Fixed hydration error that shows up on initial page load [in this commit](https://github.com/abramicf/solace-candidate-assignment/commit/2e616e07b55139bb8e8a77d1ada4543d811e4466)
2.  Fixed bug that occurs on filtering [in this commit](https://github.com/abramicf/solace-candidate-assignment/commit/592f688bd358301087f18db57fce9f52ea778d06).  NOTE - this code later on got moved to the backend and refactored as discussed below, but this fixed the bug at the offset
3.  Looked into double call to the API that occur on initial page load.  This appears to be expected behavior that arises from running React in dev mode.
4.  Fixed issue where span and input box were not clearning when the Reset Search button was hit [in this commit](https://github.com/abramicf/solace-candidate-assignment/commit/ca3243f22d018e1a71324abf286ceb929b606f12).  NOTE - onclick later got refactored, but this fixed the bug at the offset
5.  Removed browser warning message [in this commit](https://github.com/abramicf/solace-candidate-assignment/commit/16ed419d6f664df226091e972b7ed5e5c55c43fd)

## Two - Added New Functionality

1.  After enabling the database, setup lazy loading 'infinate scroll' for the table.  Once lazy loading was set up, also set up backend filtering so that filtered results would be complete and lazy loaded as well.  I set the limit to 2 in order to test the functionality locally - generally a larger offset would be selected.  NOTE - backend searching/filtering is not yet available for specialties and phone numbers

This included changes to the advocates endpoint, which are documented below:

### GET /api/advocates
Fetches paginated advocate data with optional search functionality.

Query Parameters:
- `limit` (number): Number of records per page (default: 10)
- `offset` (number): Starting position for pagination (default: 0)
- `search` (string): Search term to filter results

Response Format:
```typescript
{
  data: Advocate[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  }
}
```

2.  More robust seaching/filtering (ability to search case insensitive values)

## Three - Added formatting

1.  Used Solace website as a general guide
2.  Using Tailwind, formatted the page using Solace's colors, and highlighting the row when it's hovered over
3.  Made phone number more human readable
4.  Disabled button when text not entered into input and changed formatting when button was not disabled
5.  Added total count display
6.  Added capability for Mollie Glaston font, which appears to be Solace's signature font.  Files need to be purchased and downloaded and loaded into the app - app currently renders in backup 'cursive' font.

## Four - What I would work on next

1.  Potential bug on edge case
2.  For readability and reusability I'd have simple subcomponents that create the individual th and td elements so that the formatting does not need to be repeated
3.  There is likely additional simplification in the formatting using tailwind that can be accomplished through inheritance
4.  Download the Mollie Glaston font (currently the urls return 404 because the files are not present because they need to be purchsed)

