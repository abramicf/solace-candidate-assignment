# Solace Advocates Directory

A modern web application built with Next.js that provides a searchable, paginated directory of healthcare advocates.

## One - Fixed Bugs

1.  Fixed hydration error that shows up on initial page load [in this commit](https://github.com/abramicf/solace-candidate-assignment/commit/2e616e07b55139bb8e8a77d1ada4543d811e4466)
2.  Fixed bug that occurs on filtering [in this commit](https://github.com/abramicf/solace-candidate-assignment/commit/592f688bd358301087f18db57fce9f52ea778d06).  NOTE - this code later on got moved to the backend and refactored as discussed below, but this fixed the bug at the offset
3.  Looked into double call to the API that occur on initial page load.  This appears to be expected behavior that arises from running React in dev mode.
4.  Fixed issue where span and input box were not clearning when the Reset Search button was hit [in this commit] (https://github.com/abramicf/solace-candidate-assignment/commit/ca3243f22d018e1a71324abf286ceb929b606f12).  NOTE - onclick later got refactored, but this fixed the bug at the offset
5.  Removed browser warning message [in this commit](https://github.com/abramicf/solace-candidate-assignment/commit/16ed419d6f664df226091e972b7ed5e5c55c43fd)

## Two - Added New Functionality




## Features

### 1. Infinite Scroll Table
- Displays advocate information in a responsive table format
- Loads data incrementally as the user scrolls (2 records at a time)
- Maintains smooth performance with large datasets
- Sticky header for better navigation
- Columns include: First Name, Last Name, City, Degree, Specialties, Years of Experience, and Phone Number

### 2. Real-time Search
- Instant search functionality across all fields
- Server-side search implementation for better performance
- Debounced search to minimize API calls (300ms delay)
- Search works across:
  - First Name
  - Last Name
  - City
  - Degree
  - Years of Experience
  - Specialties

### 3. UI/UX Features
- Custom color scheme using Tailwind CSS
  - Primary color (Deep Green): #285E50
  - Secondary color (Warm Gold): #D7A13B
  - Neutral colors for text and backgrounds
- Custom Mollie Glaston font integration
- Responsive design
- Loading states for better user feedback
- Reset functionality to clear search
- Total count display

## Technical Implementation

### Frontend (Next.js)
- Built with Next.js 14 and React 18
- TypeScript for type safety
- Tailwind CSS for styling
- Client-side state management using React hooks
- Intersection Observer API for infinite scrolling

### Backend (Next.js API Routes)
- PostgreSQL database with Drizzle ORM
- Efficient pagination using LIMIT and OFFSET
- Case-insensitive search using ILIKE
- Proper error handling
- Type-safe database schema

### Database Schema
```typescript
const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("payload").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});
```

## API Endpoints

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

## Setup and Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Start PostgreSQL (if using Docker)
docker compose up -d

# Create database
# Create a 'solaceassignment' database

# Push migration
npx drizzle-kit push

# Seed the database
curl -X POST http://localhost:3000/api/seed
```

4. Start the development server:
```bash
npm run dev
```

## Performance Considerations

1. **Search Optimization**
   - Server-side search implementation
   - Debounced search to prevent excessive API calls
   - Case-insensitive search using database indexes

2. **Data Loading**
   - Incremental loading through infinite scroll
   - Small page size (2 records) for smooth performance
   - Loading states for better UX

3. **UI Performance**
   - Tailwind CSS for optimized styling
   - Proper React key usage for efficient rendering
   - Optimized font loading with font-display: swap

## Future Improvements

1. **Features**
   - Advanced filtering options
   - Sortable columns
   - Export functionality
   - Detailed advocate profiles

2. **Technical**
   - Add unit and integration tests
   - Implement caching layer
   - Add error boundary components
   - Improve accessibility features

3. **Performance**
   - Implement server-side caching
   - Add request rate limiting
   - Optimize database indexes
   - Add performance monitoring
