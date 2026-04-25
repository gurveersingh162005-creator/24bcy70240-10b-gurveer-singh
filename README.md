# 10b-me Fullstack Auth & Posts Application

This project demonstrates a production-grade, full-stack application built with Next.js 16 (App Router), complete with secure HTTP-only cookie authentication, RESTful APIs, business logic services, and a comprehensive database schema.

## Tech Stack Overview
- **Framework**: Next.js (App Router, v16)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: MongoDB (via mongoose)
- **State Management**: Zustand
- **Authentication**: JWT (jose), HTTP-only Cookies (cookie), Password Hashing (argon2)
- **API Flow & Validation**: axios, http-status-codes, zod, react-hook-form
- **Architecture**: Separated Business Logic (services/), Utility Helpers (lib/api-utils.ts)

## Step-by-Step Implementation Guide

1. **Initialize the Base Next.js Project**
   We use pnpm for faster, strictly-linked dependency management.
   ```
   pnpm create next-app@latest 10b-me
   ```
   Configuration Choices:
   - TypeScript: Yes
   - ESLint: Yes
   - Tailwind CSS: Yes
   - App Router: Yes

2. **Install Core Dependencies**
   Add all required libraries:
   ```
   # Database & Auth
   pnpm add mongoose argon2 jose cookie jsonwebtoken
   pnpm add -D @types/cookie

   # API Request & Standards
   pnpm add axios http-status-codes

   # State Management
   pnpm add zustand

   # Forms & Validation
   pnpm add react-hook-form zod @hookform/resolvers

   # UI Utilities
   pnpm add lucide-react sonner clsx tailwind-merge next-themes @base-ui/react tw-animate-css
   ```

3. **Setup Shadcn UI Components**
   Initialize your UI system and add the required raw components.
   ```
   pnpm dlx shadcn@latest init
   # Accept default prompts

   pnpm dlx shadcn@latest add badge button card field input label separator sonner spinner
   ```

4. **Configure Environment Variables**
   Create `.env.local` to securely store your keys:
   ```
   MONGO_URI=mongodb+srv://<db_user>:<db_password>@cluster0.abcde.mongodb.net/10b_fullstack
   JWT_SECRET=your_long_super_secure_random_string_here
   ```

5. **Define Your MongoDB Models (models/)**
   This project implements relational data conceptually linking Users, Posts, and Comments.
   Your Task: Create three Mongoose models (models/User.ts, models/Post.ts, models/Comment.ts).
   - **User**: Requires name (String), email (String, unique), password (String, hashed).
   - **Post**: Requires userId (String with index: true), title (String), description (String), plus timestamps.
   - **Comment**: Requires postId (String with index: true), userId (String), and content (String), plus timestamps.
   Important: Always ensure you export via `mongoose.models.<Name> ?? mongoose.model('<Name>', Schema)` to prevent hot-reload crashes.

6. **Centralize API Utilities (lib/)**
   Instead of writing JWT sign/verify logic in every route, centralize it to keep your APIs DRY (Don't Repeat Yourself).
   - `lib/db.ts`: Write a standard cached Mongoose connection (`connectDB()`).
   - `lib/jwt.ts`: Use jose to write `signToken(payload)` and `verifyToken(token)`.
   - `lib/api-utils.ts`: 
     - `createAuthCookie(response, user)`: Given a NextResponse, generate a JWT and attach it to the Set-Cookie header via the cookie package (httpOnly: true, secure: true in production).
     - `getSession()`: Extracts and decrypts the JWT token either from the Authorization header or the Next.js headers().get("cookie"). Returns null if unauthorized.

7. **Create the Service Layer (services/)**
   Do not clutter your API routes with complex database queries. Separate the "business logic" from the HTTP logic.
   Your Task: Create `services/posts.ts` and `services/comments.ts`.
   - `posts.ts` should export reusable functions like `paginatePosts`, `getAllPostsExcluding()`, `createPost()`, `deletePost()`. Note that `getAllPostsExcluding` queries Posts, then maps the userId arrays to manually fetch User documents and attach "authorName".
   - `comments.ts` should contain `getCommentsByPost(postId)`, `createComment()`, etc.

8. **Build the Protected API Routes**
   Notice how clean the routes are when logic is abstracted! Use `http-status-codes` (e.g. `StatusCodes.OK`) to remove magic numbers.
   - **Auth Routes** (`/api/auth/register`, `/api/auth/login`): Parse the body. Handle password hashing via argon2. Call `createAuthCookie(NextResponse.json(...))` before returning the response.
   - **Posts Routes** (`/api/posts`, `/api/posts/mine`, `/api/posts/[id]`): First line: `const session = await getSession(); if (!session) return unauthorized();` Then parse query parameters (`req.nextUrl.searchParams.get("page")`) or slugs. Call your `services/posts.ts` methods and return JSON.

9. **State Management (store/useAuthStore.ts)**
   Create a Zustand store (`useAuthStore`) that holds user: { id, email, name } and token.
   Keep the persist middleware. You still need `_hasHydrated` boolean logic to prevent SSR mismatches, but remember that the server relies on the HttpOnly Cookie, while the client uses Zustand to drive instant UI reactions (like showing the user's name in `NavUser.tsx`).

10. **Build the Frontend Experience**
    Use axios for data fetching on the client side since it elegantly handles catching errors.
    - **Components**:
      - `AppHeader & NavUser`: Drives navigation, clears the `useAuthStore`, and handles logout visually.
      - `Login / Register Forms`: React Hook Form connected to Zod schemas hitting `/api/auth/*`.
      - `PostsList & PostsPagination`: Consumes the `/api/posts` API with page and limit queries. Use state variables page and trigger an `axios.get` whenever page changes.
      - `CommentsSection`: Renders recursively/linearly based on what `/api/posts/[id]/comments` yields.

11. **Orchestrate Your Next.js Pages**
    Structure your application routing:
    - `app/layout.tsx`: Wrap the app in `<Toaster />` for global sonner notifications.
    - `app/page.tsx`: A dashboard that only renders `<PostsList />` if the user is hydrated and logged in.
    - `app/my-posts/page.tsx`: Shows only the user's personal posts (`/api/posts/mine`).
    - `app/posts/[id]/page.tsx`: Single post view loading the Post header + `<CommentsSection />`.

12. **Go Live!**
    Run your application:
    ```
    pnpm run dev
    ```
    Try registering a user. Monitor your browser's DevTools checking the Application > Cookies tab to confirm httpOnly flags set properly. Try creating posts, paginating, and dropping comments!
