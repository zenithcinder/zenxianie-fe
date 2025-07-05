# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Zenxianie Frontend

A modern web application for managing parking spaces in [REDACTED].

## Features

- Real-time parking space monitoring
- Interactive map for parking lot selection
- User and admin authentication
- Parking lot status management (active/maintenance/closed)
- Reservation system
- Responsive design with dark/light mode support

## Tech Stack

- React + TypeScript
- Vite
- TanStack Query (React Query)
- React Router
- Tailwind CSS
- Shadcn UI Components
- Leaflet for Maps

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE="Zenxianie "
VITE_SHORT_APP_DESC="Parking Management System"
VITE_TEST_MODE=true # Set to false in production
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

The application expects a RESTful API with the following endpoints and data structures.

### Base URL

```
http://localhost:3000/api
```

### Authentication

All endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

##### POST /api/login
Unified login endpoint for both users and admins.

Request:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "user": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string",
    "role": "user" | "admin",
    "status": "active" | "inactive",
    "avatarUrl": "string"
  },
  "token": "string"
}
```

Note: The response includes a `role` field that determines whether the user is a regular user or an admin. The frontend will handle routing to the appropriate dashboard based on this role.

#### Users

##### GET /users
Get all users.

Response:
```json
[
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "username": "string",
    "email": "string",
    "role": "user" | "admin",
    "status": "active" | "inactive"
  }
]
```

##### GET /users/:id
Get a single user.

Response:
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string",
  "role": "user" | "admin",
  "status": "active" | "inactive"
}
```

##### POST /users
Create a new user.

Request:
```json
{
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user" | "admin",
  "status": "active" | "inactive"
}
```

##### PATCH /users/:id
Update a user.

Request:
```json
{
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string",
  "role": "user" | "admin",
  "status": "active" | "inactive"
}
```

##### DELETE /users/:id
Delete a user.

#### Parking Lots

##### GET /parking-lots
Get all parking lots.

Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "location": {
      "lat": number,
      "lng": number
    },
    "address": "string",
    "totalSpaces": number,
    "availableSpaces": number,
    "status": "active" | "maintenance" | "closed"
  }
]
```

##### GET /parking-lots/:id
Get a single parking lot.

Response:
```json
{
  "id": "string",
  "name": "string",
  "location": {
    "lat": number,
    "lng": number
  },
  "address": "string",
  "totalSpaces": number,
  "availableSpaces": number,
  "status": "active" | "maintenance" | "closed"
}
```

##### POST /parking-lots
Create a new parking lot.

Request:
```json
{
  "name": "string",
  "location": {
    "lat": number,
    "lng": number
  },
  "address": "string",
  "totalSpaces": number,
  "availableSpaces": number,
  "status": "active" | "maintenance" | "closed"
}
```

##### PATCH /parking-lots/:id
Update a parking lot.

Request:
```json
{
  "name": "string",
  "location": {
    "lat": number,
    "lng": number
  },
  "address": "string",
  "totalSpaces": number,
  "availableSpaces": number,
  "status": "active" | "maintenance" | "closed"
}
```

##### DELETE /parking-lots/:id
Delete a parking lot.

#### Reservations

##### GET /reservations
Get all reservations.

Response:
```json
[
  {
    "id": "string",
    "parkingLotId": "string",
    "parkingLotName": "string",
    "userId": "string",
    "userName": "string",
    "vehiclePlate": "string",
    "notes": "string",
    "startTime": "string (ISO date)",
    "endTime": "string (ISO date)",
    "status": "active" | "completed" | "cancelled",
    "createdAt": "string (ISO date)"
  }
]
```

##### GET /reservations/:id
Get a single reservation.

Response:
```json
{
  "id": "string",
  "parkingLotId": "string",
  "parkingLotName": "string",
  "userId": "string",
  "userName": "string",
  "vehiclePlate": "string",
  "notes": "string",
  "startTime": "string (ISO date)",
  "endTime": "string (ISO date)",
  "status": "active" | "completed" | "cancelled",
  "createdAt": "string (ISO date)"
}
```

##### POST /reservations
Create a new reservation.

Request:
```json
{
  "parkingLotId": "string",
  "vehiclePlate": "string",
  "notes": "string",
  "startTime": "string (ISO date)",
  "endTime": "string (ISO date)"
}
```

##### PATCH /reservations/:id
Update a reservation.

Request:
```json
{
  "vehiclePlate": "string",
  "notes": "string",
  "startTime": "string (ISO date)",
  "endTime": "string (ISO date)",
  "status": "active" | "completed" | "cancelled"
}
```

##### DELETE /reservations/:id
Delete a reservation.

#### Reports

##### GET /reports/summary
Get report summary.

Response:
```json
{
  "totalRevenue": number,
  "dailyReservations": number,
  "parkingUtilization": number,
  "averageDuration": number,
  "revenueChange": number,
  "reservationChange": number,
  "utilizationChange": number,
  "durationChange": number
}
```

##### GET /reports/daily-reservations
Get daily reservations data.

Response:
```json
[
  {
    "date": "string (YYYY-MM-DD)",
    "reservations": number
  }
]
```

##### GET /reports/revenue
Get revenue data.

Response:
```json
[
  {
    "date": "string (YYYY-MM-DD)",
    "revenue": number
  }
]
```

##### GET /reports/peak-hours
Get peak hours data.

Response:
```json
[
  {
    "hour": "string (HH:00)",
    "usage": number
  }
]
```

##### GET /reports/user-demographics
Get user demographics data.

Response:
```json
[
  {
    "name": "string",
    "value": number
  }
]
```

## State Management

The application uses React Query for state management of API data. Each service has its own set of queries and mutations:

### Users
- Query key: `['users']`
- Mutations: create, update, delete

### Parking Lots
- Query key: `['parkingLots']`
- Mutations: create, update, delete

### Reservations
- Query key: `['reservations']`
- Mutations: create, update, delete

### Reports
- Query keys: 
  - `['reports', 'summary']`
  - `['reports', 'daily-reservations']`
  - `['reports', 'revenue']`
  - `['reports', 'peak-hours']`
  - `['reports', 'user-demographics']`

## Error Handling

The API should return appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 204: No Content (for successful deletions)
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error response format:
```json
{
  "error": {
    "message": "string",
    "code": "string",
    "details": object
  }
}
```

## Authentication

The application uses JWT tokens for authentication. The API should provide:

1. Login endpoint (`POST /auth/login`):
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "access": "string (JWT token)",
  "refresh": "string (refresh token)"
}
```

2. Token refresh endpoint (`POST /auth/refresh`):
```json
{
  "refresh": "string (refresh token)"
}
```

Response:
```json
{
  "access": "string (new JWT token)"
}
```

## Development

### Project Structure

```
src/
├── components/         # Reusable components
│   ├── admin/         # Admin-specific components
│   ├── user/          # User-specific components
│   └── ui/            # UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── layout/            # Layout components
├── lib/               # Utility functions
├── mocks/             # Mock data and handlers
├── pages/             # Page components
│   ├── admin/         # Admin pages
│   └── user/          # User pages
└── types/             # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
