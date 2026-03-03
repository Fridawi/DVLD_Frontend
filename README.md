DVLD Frontend - React + TypeScript
This is the frontend application for the Driving & Vehicles Licensing Department (DVLD). It provides a dashboard to manage drivers, licenses, and applications.

🛠 Tech Stack & Tools
React 19 & TypeScript: Core framework and type safety.

Vite: Build tool for fast development.

Redux Toolkit (RTK): Global state management.

RTK Query: For API data fetching and caching (integrated with Redux).

Tailwind CSS 4: For styling and responsive UI.

React Router Dom: For navigation and routing.

React Hook Form + Zod: For form handling and schema-based validation.

Headless UI: For unstyled accessible UI components (like Modals/Dropdowns).

Sonner: For toast notifications.

Lucide React: For icons.

Date-fns & React Datepicker: For handling and picking dates.

📂 Project Structure
src/api: RTK Query base API slice.

src/app: Redux store configuration.

src/features: Modular features (Auth, Applications, Drivers, etc.).

src/components: Reusable UI elements.

src/hooks: Custom React hooks.

src/types: TypeScript interfaces.

🚀 Getting Started
Clone the repo:

Bash
git clone <your-repo-url>
Install dependencies:

Bash
npm install
Environment Setup:
Create a .env file in the root:

VITE_API_BASE_URL=https://localhost:7001/api
Run Dev Server:

Bash
npm run dev
📝 Features Implemented
Authentication: Login/Logout using JWT stored in the state.

Data Tables: Listing drivers and licenses with server-side pagination.

Form Validation: Complex forms validated using Zod schemas.

Notifications: Real-time feedback using Sonner toasts.
