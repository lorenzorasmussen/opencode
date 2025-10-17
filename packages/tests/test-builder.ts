/**
 * @fileoverview Test Builder Agent Functionality
 * This file demonstrates the Builder agent's code implementation capabilities
 */

/**
 * Represents a user in the system
 */
interface User {
  /** Unique identifier for the user */
  id: number;
  /** Full name of the user */
  name: string;
  /** Email address of the user */
  email: string;
}

/**
 * Service class for managing users in memory
 * Demonstrates CRUD operations for user management
 */
class UserService {
  /** In-memory storage for users */
  private users: User[] = [];

  /**
   * Creates a new user with the provided name and email
   * @param name - The full name of the user
   * @param email - The email address of the user
   * @returns The newly created user object
   */
  createUser(name: string, email: string): User {
    const user: User = {
      id: this.users.length + 1,
      name,
      email
    };
    this.users.push(user);
    return user;
  }

  /**
   * @param id - The unique identifier of the user to update
   * @param updates - Partial user object with fields to update (excluding id)
   * @returns The updated user object if found, undefined otherwise
   */
  updateUser(id: number, updates: Partial<Omit<User, 'id'>>): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  /**
   * Retrieves a user by their unique ID
   * @param id - The unique identifier of the user to retrieve
   * @returns The user object if found, undefined otherwise
   */
  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  /**
   * Retrieves all users in the system
   * @returns Array of all user objects
   */
  getAllUsers(): User[] {
    return [...this.users]; // Return a copy to prevent external modification
  }

  /**
   * Deletes a user by their unique ID
   * @param id - The unique identifier of the user to delete
   * @returns True if the user was deleted, false if not found
   */
  deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}

// Test the UserService
function testUserService(): void {
  const service = new UserService();

  console.log('Testing Builder Agent - UserService Implementation');

  // Create users
  const user1 = service.createUser('Alice Johnson', 'alice@example.com');
  const user2 = service.createUser('Bob Smith', 'bob@example.com');

  console.log('Created users:', [user1, user2]);

  // Get user by ID
  const foundUser = service.getUserById(1);
  console.log('Found user with ID 1:', foundUser);

  // Get all users
  const allUsers = service.getAllUsers();
  console.log('All users:', allUsers);

  // Update user
  const updatedUser = service.updateUser(1, { name: 'Alice Cooper' });
  console.log('Updated user:', updatedUser);

  // Delete user
  const deleted = service.deleteUser(2);
  console.log('Deleted user 2:', deleted);

  console.log('Final users:', service.getAllUsers());
}

// Export for potential testing
export { UserService, User };

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testUserService();
}