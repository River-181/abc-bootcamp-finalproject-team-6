# Overview

This is a full-stack React application featuring a virtual character pet system with sleep and wellness tracking, enhanced with Arduino-inspired sensor detection capabilities. The application uses a modern tech stack with Express.js backend, React frontend with TypeScript, and PostgreSQL database. The user interface is built with shadcn/ui components and Tailwind CSS, providing a polished mobile-first experience for interacting with a customizable virtual character. The app includes advanced sensor detection using web browser APIs to replicate Arduino microphone and vibration sensor functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming and character animations
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for character state management
- **Database ORM**: Drizzle ORM with type-safe database operations
- **Validation**: Zod schemas shared between frontend and backend
- **Storage**: Abstracted storage interface with in-memory implementation (MemStorage)

## Data Storage
- **Database**: PostgreSQL configured through Drizzle Kit
- **Schema**: Single `character_states` table with user-specific character data
- **Migrations**: Drizzle Kit handles database migrations and schema changes
- **Connection**: Neon Database serverless connection via environment variables

## API Structure
- **GET /api/character/:userId**: Retrieve character state for a specific user
- **PATCH /api/character/:userId**: Update character properties (mood, color, wellness data)
- **POST /api/character/:userId/pet**: Trigger character petting interaction
- **POST /api/character/:userId/feed**: Feed the character with automatic sensor-triggered responses

## Sensor System Architecture
- **Audio Detection**: Web Audio API with real-time frequency analysis, voice feature extraction (amplitude, variation, consistency, confidence scoring)
- **Motion Detection**: DeviceMotion API with accelerometer data processing, vibration intensity classification, baseline calibration system
- **Hybrid Detection Logic**: Arduino-inspired dual sensor integration with automatic character interaction triggers
- **Permission Handling**: iOS DeviceMotion permission requests with user gesture requirements, graceful degradation for unsupported platforms

## Development Environment
- **Build System**: Vite with React plugin for frontend, esbuild for backend bundling
- **Development Tools**: 
  - TSX for running TypeScript in development
  - Replit-specific plugins for error handling and development banner
  - Hot module replacement for fast development cycles
- **Type Safety**: Shared TypeScript types between client and server via shared directory

## Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: End-to-end TypeScript with shared schemas and types
- **Component Architecture**: Modular UI components with consistent design system
- **State Management**: Server state handled by React Query, local UI state by React hooks
- **Error Handling**: Centralized error handling with toast notifications

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **express**: Web framework for Node.js backend
- **react**: Frontend UI library with hooks

## UI and Styling
- **@radix-ui/react-***: Headless UI component primitives (dialog, dropdown, toast, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **clsx**: Conditional className utility

## Development Tools
- **vite**: Frontend build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and schema management tool
- **esbuild**: Fast JavaScript bundler for backend production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Validation and Forms
- **zod**: Schema validation library
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## Additional Utilities
- **wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation library
- **nanoid**: Unique ID generation
- **lucide-react**: Icon library

# Recent Changes (August 12, 2025)

## Character Image Integration
- Replaced CSS-drawn characters with actual PNG character images (yellow, green, red variants)
- Implemented dynamic character image switching based on color state
- Maintained existing animation effects (breathing, bouncing) with real images

## Arduino Sensor System Implementation
- **Voice Detection**: Real-time audio analysis using Web Audio API with microphone input
- **Vibration Detection**: Motion sensor integration using DeviceMotion API for mobile devices
- **Sensor Features**: 
  - Voice amplitude, variation, consistency, and confidence scoring
  - Vibration intensity classification (light, strong, shock)
  - Continuous monitoring with baseline calibration
- **Auto-Interactions**: Voice triggers character petting, vibration triggers character care
- **UI Components**: Real-time sensor data visualization with status indicators and LED-style feedback
- **Permission Handling**: iOS DeviceMotion permission management with user gesture requirements

## Technical Implementation
- Custom React hook `useSensorDetection` for sensor data processing
- Sensor panel component with real-time data display and controls
- Integration with existing character interaction system
- Error handling and graceful degradation for unsupported browsers/devices