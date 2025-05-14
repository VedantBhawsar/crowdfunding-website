# Crowdfunding Website

A full-featured blockchain-based crowdfunding platform that enables creators to raise funds for their projects while offering rewards to backers. The platform leverages Ethereum blockchain technology for transparent and secure transactions, with a user-friendly web interface built on the MERN stack (MongoDB, Express, React, Node.js) within a Next.js framework.

## Project Status

**Status: COMPLETED**

The project has been successfully completed with all core features implemented and tested. The platform is now ready for deployment with the following accomplishments:

1. **Feature Completion**: Campaign management, reward system, user authentication, and blockchain integration
2. **Code Quality**: Clean, maintainable codebase with proper linting and formatting
3. **Security**: Properly configured environment variables for sensitive information
4. **Provider Integration**: All Ethereum wallet providers successfully integrated
5. **Testing**: Critical user flows tested for smooth operation

## Technology Stack

### Frontend

- **Next.js 14**: React framework with server-side rendering and routing
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible component primitives
- **Wagmi**: Ethereum wallet integration
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Backend

- **Next.js API Routes**: Serverless functions for backend logic
- **Prisma ORM**: Database access and management
- **MongoDB**: NoSQL database for storing application data
- **NextAuth.js**: Authentication solution
- **Nodemailer**: Email sending functionality

### Blockchain Integration

- **Ethers.js (v5.7.2)**: Ethereum blockchain interaction
- **Web3.js**: Additional blockchain utility library
- **Smart Contracts**: ERC20 token implementation for rewards

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/crowdfunding-website.git
cd crowdfunding-website
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Copy the environment variables:

```bash
cp env.example .env.local
```

4. Update the environment variables in `.env.local` with your credentials

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Environment Variables

For security and deployment flexibility, the following environment variables should be configured:

- Authentication: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- OAuth Providers: `GITHUB_ID`, `GITHUB_SECRET`, etc.
- Database: `DATABASE_URL`
- Blockchain Configuration: `ETHEREUM_NETWORK`, `ETHEREUM_PROVIDER_URL`, etc.
- Email Configuration: `NODEMAILER_EMAIL`, `NODEMAILER_PASSWORD`
- Cron Jobs Security: `CRON_SECRET`

See the `env.example` file for a complete list of required variables.

## Deployment

The application is configured for deployment on Vercel with serverless functions and cron jobs.

## License

[MIT](https://choosealicense.com/licenses/mit/)
