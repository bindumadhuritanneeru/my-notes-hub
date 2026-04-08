## Plan

### 1. Database Setup
- Create `notes` table with `user_id` foreign key to `auth.users`
- Create `user_activities` table to log user actions (create, edit, delete, chat)
- Enable RLS on both tables

### 2. Authentication
- Create Login/Register page as the entry point
- Protect all routes behind auth
- Add logout button to navbar

### 3. Migrate Notes to Database
- Update `src/lib/notes.ts` to use Supabase instead of localStorage
- All CRUD operations go through Supabase client

### 4. AI Chatbot
- Create edge function using Lovable AI Gateway to generate notes from topics
- Build chat UI component accessible from the app
- Chatbot can create notes directly into the database

### 5. Activity Tracking
- Log user actions (create, edit, delete, chat) to `user_activities` table
