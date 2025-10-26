# OpenCode API Documentation

This document provides comprehensive API documentation for the OpenCode project components and services.

## Table of Contents

1. [React Components](#react-components)
2. [Authentication Service](#authentication-service)

## React Components

### Button

A reusable button component with primary and secondary variants.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | The text to display on the button |
| `onClick` | `() => void` | Yes | - | Callback function to execute when button is clicked |
| `disabled` | `boolean` | No | `false` | Whether the button is disabled |
| `variant` | `'primary' \| 'secondary'` | No | `'primary'` | Visual style variant of the button |

#### Example

```tsx
<Button
  label="Click me"
  onClick={() => console.log('Button clicked')}
  variant="primary"
/>
```

### Counter

A simple counter component that displays a count and provides increment/decrement buttons.

#### Props

None - this component manages its own state.

#### Example

```tsx
<Counter />
```

### SimpleButton

A basic button component that accepts children and optional click handler.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | The content to display inside the button |
| `onClick` | `() => void` | No | - | Optional callback function to execute when button is clicked |
| `disabled` | `boolean` | No | `false` | Whether the button is disabled |

#### Example

```tsx
<SimpleButton onClick={() => alert('Clicked!')}>
  Click me
</SimpleButton>
```

### SimpleButtonComponent

A straightforward button component that displays text and handles clicks.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `text` | `string` | Yes | - | The text to display on the button |
| `onClick` | `() => void` | Yes | - | Callback function to execute when button is clicked |

#### Example

```tsx
<SimpleButtonComponent
  text="Submit"
  onClick={() => handleSubmit()}
/>
```

### TestButton

A simple test button component that logs clicks and supports optional click handlers.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onClick` | `() => void` | No | - | Optional callback function to execute when button is clicked |

#### Example

```tsx
<TestButton onClick={() => console.log('Custom click handler')} />
```

### BasicButton

A basic button component that accepts children and a click handler.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - | The content to display inside the button |
| `onClick` | `() => void` | Yes | - | Callback function to execute when button is clicked |

#### Example

```tsx
<BasicButton onClick={() => console.log('Clicked!')}>
  Click me
</BasicButton>
```

### NewSimpleButton

A new simple button component with optional click handler.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onClick` | `() => void` | No | - | Optional callback function to execute when button is clicked |
| `children` | `React.ReactNode` | Yes | - | The content to display inside the button |

#### Example

```tsx
<NewSimpleButton onClick={() => alert('Clicked!')}>
  Click me
</NewSimpleButton>
```

### TestComponent

A test component to demonstrate Builder agent functionality.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `message` | `string` | Yes | - | The message to display |
| `count` | `number` | No | `0` | Optional count to show |

#### Example

```tsx
<TestComponent message="Hello World" count={42} />
```

## TypeScript Services

### UserService

A service class for managing users in memory, demonstrating CRUD operations.

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `createUser(name: string, email: string)` | `name`: User name, `email`: User email | `User` | Creates a new user |
| `getUserById(id: number)` | `id`: User ID | `User \| undefined` | Retrieves a user by ID |
| `getAllUsers()` | None | `User[]` | Returns all users |
| `updateUser(id: number, updates: Partial<User>)` | `id`: User ID, `updates`: Fields to update | `User \| null` | Updates a user |
| `deleteUser(id: number)` | `id`: User ID | `boolean` | Deletes a user |

#### Example

```typescript
import { UserService } from './test-builder';

const service = new UserService();

// Create a user
const user = service.createUser('John Doe', 'john@example.com');

// Get all users
const users = service.getAllUsers();

// Update a user
service.updateUser(1, { name: 'Jane Doe' });

// Delete a user
service.deleteUser(1);
```

## Authentication Service

The authentication service provides session-based user authentication via REST API endpoints.

### Base URL
```
http://localhost:3000
```

### Endpoints

#### POST /login

Authenticates a user with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "user": "string"
}
```

**Response (Failure - 401):**
```json
{
  "message": "Invalid credentials"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "pass1"}'
```

#### POST /logout

Destroys the current user session.

**Response (Success - 200):**
```json
{
  "message": "Logout successful"
}
```

**Response (Failure - 500):**
```json
{
  "message": "Logout failed"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/logout
```

#### GET /session

Checks if there is an active user session.

**Response (Active Session - 200):**
```json
{
  "message": "Session active",
  "user": "string"
}
```

**Response (No Session - 200):**
```json
{
  "message": "No active session"
}
```

**Example:**
```bash
curl http://localhost:3000/session
```

### Demo Users

The service includes the following demo users for testing:

- Username: `user1`, Password: `pass1`
- Username: `user2`, Password: `pass2`

### Security Notes

- This is a demo implementation using in-memory storage
- Passwords are properly hashed using bcrypt (recommended for production)
- Session data is stored server-side
- In production, implement proper database storage and additional security measures

### Starting the Service

```bash
cd auth_system
node app.js
```

The server will start on port 3000.