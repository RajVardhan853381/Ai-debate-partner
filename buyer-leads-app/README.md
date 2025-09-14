# Buyer Leads Manager

A comprehensive Next.js application for managing real estate buyer leads with full CRUD operations, search/filtering, CSV import/export, and user authentication.

## Features

### Core Functionality
- **Lead Management**: Create, read, update, and delete buyer leads
- **Search & Filtering**: Real-time search with debounced input and multiple filter options
- **Pagination**: Server-side pagination with URL-synced state
- **CSV Import/Export**: Bulk import with validation and filtered export
- **User Authentication**: Simple magic link authentication system
- **Data Validation**: Comprehensive validation using Zod on both client and server
- **Change History**: Track all changes to leads with detailed history

### Data Model
- **Buyers**: Complete lead information including contact details, property preferences, budget, timeline, and status
- **Users**: Simple user management for authentication
- **Buyer History**: Audit trail for all lead changes

### Technical Features
- **Next.js 15** with App Router and TypeScript
- **Database**: SQLite with Drizzle ORM and migrations
- **Validation**: Zod schemas for type-safe validation
- **UI**: Tailwind CSS with responsive design
- **Testing**: Jest with comprehensive test coverage
- **Rate Limiting**: Built-in rate limiting for API endpoints
- **Error Handling**: Error boundaries and graceful error handling

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd buyer-leads-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   npx drizzle-kit generate
   
   # Apply migrations to create the database
   DATABASE_URL="file:./dev.db" npx drizzle-kit push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Authentication
- Enter your email and name to sign in
- No password required - simple demo authentication
- Session persists across browser refreshes

### Managing Leads

#### Creating a Lead
1. Click "Add New Lead" from the main page
2. Fill in the required fields (marked with *)
3. Optional fields include email, budget range, notes, and tags
4. BHK is required only for Apartment and Villa property types
5. Budget max must be greater than or equal to budget min

#### Viewing and Editing Leads
1. Click on any lead in the list to view details
2. Click "Edit" to modify the lead
3. Changes are tracked in the history section
4. Concurrency protection prevents conflicts when multiple users edit

#### Searching and Filtering
- **Search**: Type in the search box to find leads by name, phone, or email
- **Filters**: Use dropdown filters for city, property type, status, and timeline
- **Sorting**: Click column headers to sort by name or update date
- **Pagination**: Navigate through pages of results

#### CSV Import/Export
1. **Import**: Go to the import page and upload a CSV file
   - Maximum 200 rows per import
   - Validation errors are shown with row numbers
   - Only valid rows are imported
2. **Export**: Click "Export CSV" to download current filtered results

### CSV Format
Required columns: `fullName`, `phone`, `city`, `propertyType`, `purpose`, `timeline`, `source`

Optional columns: `email`, `bhk`, `budgetMin`, `budgetMax`, `notes`, `tags`, `status`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Sign in with email and name
- `GET /api/auth/login` - Get current user
- `POST /api/auth/logout` - Sign out

### Buyers
- `GET /api/buyers` - List buyers with filters and pagination
- `POST /api/buyers` - Create a new buyer
- `GET /api/buyers/[id]` - Get buyer details with history
- `PUT /api/buyers/[id]` - Update buyer
- `DELETE /api/buyers/[id]` - Delete buyer

### Import/Export
- `POST /api/buyers/import` - Import buyers from CSV
- `GET /api/buyers/export` - Export buyers to CSV

## Development

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── buyers/            # Buyer management pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── buyers/           # Buyer-related components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── db/               # Database schema and connection
│   ├── services/         # Business logic services
│   ├── validations/      # Zod validation schemas
│   └── __tests__/        # Test files
└── hooks/                # Custom React hooks
```

### Database Schema

#### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `createdAt`, `updatedAt` (Timestamps)

#### Buyers Table
- `id` (UUID, Primary Key)
- `fullName` (String, 2-80 chars)
- `email` (String, Optional)
- `phone` (String, 10-15 digits)
- `city` (Enum: Chandigarh, Mohali, Zirakpur, Panchkula, Other)
- `propertyType` (Enum: Apartment, Villa, Plot, Office, Retail)
- `bhk` (Enum: 1, 2, 3, 4, Studio, Optional)
- `purpose` (Enum: Buy, Rent)
- `budgetMin`, `budgetMax` (Integer, Optional)
- `timeline` (Enum: 0-3m, 3-6m, >6m, Exploring)
- `source` (Enum: Website, Referral, Walk-in, Call, Other)
- `status` (Enum: New, Qualified, Contacted, Visited, Negotiation, Converted, Dropped)
- `notes` (Text, Optional, Max 1000 chars)
- `tags` (JSON Array, Optional)
- `ownerId` (UUID, Foreign Key to Users)
- `createdAt`, `updatedAt` (Timestamps)

#### Buyer History Table
- `id` (UUID, Primary Key)
- `buyerId` (UUID, Foreign Key to Buyers)
- `changedBy` (UUID, Foreign Key to Users)
- `changedAt` (Timestamp)
- `diff` (JSON, Change details)

### Validation Rules

#### Client-Side Validation
- All validation rules are enforced using Zod schemas
- Real-time validation feedback in forms
- Prevents invalid data submission

#### Server-Side Validation
- All API endpoints validate input data
- Database constraints ensure data integrity
- Ownership checks prevent unauthorized access

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Database Management
```bash
# Generate new migration
npx drizzle-kit generate

# Apply migrations
DATABASE_URL="file:./dev.db" npx drizzle-kit push

# View database schema
npx drizzle-kit studio
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-secure-jwt-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Database Options
- **Development**: SQLite (file-based)
- **Production**: PostgreSQL, MySQL, or any Drizzle-supported database

## Security Features

- **Rate Limiting**: Prevents abuse of API endpoints
- **Input Validation**: Comprehensive validation on both client and server
- **SQL Injection Protection**: Drizzle ORM provides built-in protection
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookies and proper headers

## Performance Optimizations

- **Server-Side Rendering**: Initial page load with SSR
- **Debounced Search**: Reduces API calls during typing
- **Pagination**: Limits data transfer and improves performance
- **Database Indexing**: Optimized queries with proper indexing
- **Caching**: Browser caching for static assets

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Clear focus indicators
- **Form Labels**: All form inputs have associated labels

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**Note**: This is a demo application. For production use, consider implementing additional security measures, proper user authentication, and database optimization based on your specific requirements.