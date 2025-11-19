- **Twilio WhatsApp API** for messaging  
- **Upstash Redis** for rate-limiting  
- **PostgreSQL** for database storage  
- **Prisma** as the ORM  
Environment Variables

Create a `.env` (for local development) or `.env.production` (for Docker/production) in the project root with the following:
# PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Twilio WhatsApp
TWILIO_ACCOUNT_SID="your sid"
TWILIO_AUTH_TOKEN="your auth token"
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Upstash Redis (for rate-limiting)
UPSTASH_REDIS_REST_URL="your redis url"
UPSTASH_REDIS_REST_TOKEN="your redis token"

Replace the values with your credentials.

1. Twilio Setup

Create a free Twilio account: https://www.twilio.com/try-twilio

Go to the WhatsApp Sandbox

Copy your Account SID, Auth Token, and Sandbox WhatsApp number

Add them to your .env or .env.production file

2. Upstash Redis Setup

Create a free Upstash Redis instance: https://console.upstash.com/

Copy the REST URL and Token

Add them to your .env or .env.production file

Upstash is cloud-based — no need to run a Redis container locally. Use these credentials even in local development.


# Running with Docker (Recommended)
Build and start containers

docker-compose up --build


This will:

Build the Next.js app

Start the PostgreSQL database

Run Prisma migrations automatically

Start the app at http://localhost:3000

Stop containers

docker-compose down

# Running without Docker (Local Development)
1. Install dependencies

npm ci
# or
yarn
# or
pnpm install

2. Run Prisma migrations
npx prisma migrate dev --name init

3. Generate Prisma client
npx prisma generate

4. Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

5. Access the app

Open http://localhost:3000
in your browser.
 
Deploy

You can deploy on Vercel directly.

For Docker-based production, ensure .env.production contains all required variables and run:

docker-compose up --build -d
This will:

Build the production image

Start the PostgreSQL database

Run Prisma migrations

Start the app in detached mode
 
   
  
   
  
