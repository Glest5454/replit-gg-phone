# Samsung Galaxy S25 Phone Script

## Overview

This is a full-stack Samsung Galaxy S25 phone simulation designed for FiveM roleplay servers. The project features a complete phone interface with multiple apps including banking, social media, contacts, camera, and various utilities. Built with modern web technologies, it provides an immersive mobile phone experience within the FiveM gaming environment.

The application simulates a realistic smartphone interface with Samsung One UI design elements, complete with lock screen functionality, home screen navigation, and fully functional applications. It's designed to integrate seamlessly with QBCore or ESX framework servers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using **React 18** with **TypeScript** and **Vite** as the build tool. The UI framework leverages **Tailwind CSS** for styling with **shadcn/ui** components for consistent design patterns. The phone interface uses a custom hook-based state management system (`usePhone`) to handle screen navigation, notifications, and phone state.

Key architectural decisions:
- **Component-based architecture**: Each phone app is a separate React component for modularity
- **Custom theming system**: Samsung One UI inspired design with CSS custom properties for light/dark modes
- **Responsive design**: Optimized for the fixed phone viewport dimensions (320x640px)
- **State management**: React hooks for local state, TanStack Query for server state

### Backend Architecture  
The server-side uses **Express.js** with **TypeScript** for the REST API. The architecture follows a layered approach with clear separation between routes, storage, and business logic.

- **RESTful API design**: Standard HTTP methods for CRUD operations on phone-related entities
- **Storage abstraction**: Interface-based storage layer that can be implemented with different database backends
- **Type-safe schema validation**: Zod schemas for request/response validation
- **Development tooling**: Hot reloading with Vite integration for seamless development

### Data Storage Solutions
The application uses **Drizzle ORM** with **PostgreSQL** as the primary database solution. The database schema supports all phone functionality including users, contacts, messages, transactions, social media posts, notes, and media.

Database design rationale:
- **Relational structure**: Proper foreign key relationships for data integrity
- **UUID primary keys**: Better for distributed systems and security
- **JSON fields**: Flexible storage for user settings and preferences
- **Timestamp tracking**: Created/updated timestamps for audit trails

### Authentication and Authorization
The system is designed to integrate with FiveM server frameworks (QBCore/ESX) for user authentication. Phone users are linked to in-game characters via `citizen_id` field.

- **Framework integration**: Uses server framework's existing authentication
- **Session management**: Leverages FiveM's built-in session handling
- **User isolation**: Each phone user has isolated data access

## External Dependencies

### Database Integration
- **@neondatabase/serverless**: Serverless PostgreSQL driver for database connectivity
- **Drizzle ORM**: Type-safe database operations with automatic migration support
- **connect-pg-simple**: PostgreSQL session store integration

### UI Framework Dependencies
- **@radix-ui/**: Comprehensive set of unstyled, accessible UI primitives
- **@tanstack/react-query**: Server state management and caching
- **Tailwind CSS**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating variant-based component APIs

### FiveM Server Framework Integration
- **QBCore Framework**: Primary framework support for roleplay servers  
- **ESX Framework**: Alternative framework support
- **oxmysql**: Database connector commonly used in FiveM servers

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking for better code quality
- **React Hook Form**: Form handling with validation
- **Wouter**: Lightweight routing library for single-page applications