# Decentralized Crowdfunding Platform Project Context

## Project Overview
This is a modern, decentralized crowdfunding platform built with Next.js, featuring blockchain integration for secure and transparent fundraising. The platform allows users to create, fund, and manage campaigns while maintaining transparency through blockchain technology.

## Technical Stack
- Frontend: Next.js 14 (App Router)
- Styling: Tailwind CSS with custom configurations
- Blockchain Integration: Smart contracts (implementation details to be confirmed)
- Database: Prisma ORM with PostgreSQL
- Authentication: Custom auth system with protected routes
- Deployment: Vercel with automatic deployments
- State Management: React Context API
- UI Components: Custom components with shadcn/ui

## Project Structure
```
src/
├── app/              # Next.js app directory
│   ├── (site)/      # Main site routes
│   │   ├── (auth)   # Authentication routes
│   │   ├── about    # About page
│   │   ├── account  # User account pages
│   │   ├── campaign # Campaign management
│   │   ├── campaigns# Campaign listing
│   │   ├── how-it-works # Guide pages
│   │   ├── settings  # User settings
│   │   └── supports  # Support pages
│   ├── api/         # API routes
│   │   ├── auth     # Authentication endpoints
│   │   ├── campaigns# Campaign management endpoints
│   │   ├── categories # Category management
│   │   ├── onboarding # Onboarding endpoints
│   │   ├── profile   # Profile management
│   │   ├── rewards   # Reward system
│   │   ├── upload    # File upload
│   │   ├── user      # User management
│   │   └── wallet    # Wallet integration
│   └── onboarding/  # Onboarding flow
├── components/      # Reusable UI components
│   ├── campaign     # Campaign-related components
│   ├── landing      # Landing page components
│   ├── navbar.tsx   # Navigation component
│   ├── footer.tsx   # Footer component
│   ├── profile-form.tsx # Profile form
│   ├── providers    # Context providers
│   └── ui           # UI components (shadcn/ui)
├── config/         # Configuration files
├── context/        # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and libraries
└── types/         # TypeScript type definitions
```

## Key Components

### 1. Authentication System
```
User Registration → Email Verification → Login → Protected Routes
```
- Custom authentication system
- Protected routes with middleware
- Session management
- Email verification flow

### 2. Campaign Management
```
Create Campaign → Campaign Details → Fund Campaign → Withdraw Funds → Track Progress
```
- Campaign creation wizard
- Multi-step funding process
- Withdrawal management
- Progress tracking
- Reward system integration

### 3. Blockchain Integration
```
Smart Contracts → Transaction Processing → State Updates → UI Sync
```
- Smart contract integration
- Transaction monitoring
- State synchronization
- Event handling

## Flowcharts

### User Flow
```
User
  ↓
Onboarding Flow
  ↓
Email Verification
  ↓
Authentication
  ↓
Dashboard
  ↓
Create/View Campaigns
  ↓
Fund/Manage Campaigns
```

### Campaign Lifecycle
```
Create Campaign
  ↓
Campaign Active
  ↓
Receive Funds
  ↓
Goal Reached/Expired
  ↓
Withdraw Funds/Refund
```

### Blockchain Transaction Flow
```
User Action
  ↓
Transaction Creation
  ↓
Smart Contract Call
  ↓
Transaction Confirmation
  ↓
State Update
  ↓
UI Sync
```

## API Endpoints
```
/api/auth         # Authentication endpoints
/api/campaigns    # Campaign management
/api/categories   # Category management
/api/onboarding   # Onboarding flow
/api/profile      # Profile management
/api/rewards      # Reward system
/api/upload       # File uploads
/api/user         # User management
/api/wallet       # Wallet integration
```

## UI Components
```
Campaign Components
├── CampaignCard
├── CampaignDetails
├── FundingForm
├── WithdrawForm
├── RewardSelector

Landing Components
├── HeroSection
├── Features
├── Statistics
├── Testimonials

UI Components
├── Button
├── Card
├── Input
├── Select
├── Table
├── Toast
└── Dialog
```

## Important Files
- `src/app/layout.tsx`: Main application layout with theme provider
- `src/app/api/`: API endpoints for all functionality
- `src/components/`: Reusable UI components
- `prisma/`: Database schema and migrations
- `seeding.js`: Database seeding script for initial data
- `src/context/`: React context providers for state management
- `src/hooks/`: Custom React hooks for common functionality

## Development Setup
1. Install dependencies: `npm install`
2. Set up environment variables
3. Run database migrations: `npx prisma migrate dev`
4. Start development server: `npm run dev`

## Security Considerations
- Input validation at both frontend and backend
- Rate limiting on API endpoints
- Transaction verification through blockchain
- Secure authentication with session management
- XSS protection
- CSRF protection
- Secure file uploads

## Performance Optimization
- Image optimization using Next.js built-in features
- Code splitting with dynamic imports
- Lazy loading of components
- Caching strategies for API responses
- Optimized database queries

## Future Enhancements
- Additional verification methods (KYC)
- Advanced analytics dashboard
- Mobile optimization
- Social sharing features
- Advanced search and filtering
- Multi-language support
- Advanced reward system
- Integration with more blockchain networks

## Notes
- The project uses ESLint and Prettier for code quality
- Husky is configured for git hooks
- TypeScript is used for type safety
- Vercel is the deployment platform
- Uses shadcn/ui for consistent UI components
- Implements responsive design for all pages
- Follows accessibility best practices
- Includes comprehensive error handling
- Implements offline-first capabilities
