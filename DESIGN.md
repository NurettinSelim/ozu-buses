
# ÇM44-1 Bus and Shuttle Time Tracker Design Document

## 1. System Overview
**Objective**: Provide Ozyegin University community with reliable schedule-based tracking for:
- ÇM44-1 bus route timetables
- Campus shuttle schedules

**Key Principles**:
- Schedule-only display (no real-time tracking)
- Mobile-first responsive design
- Minimalist user interface
- Offline-first capability

## 2. System Architecture
### 2.1 Component Diagram
```
Frontend (Next.js 15)
├── Schedule Display
├── Time Calculator
└── Filter System

Data Layer
├── JSON Schedule Files
├── Local Storage (User Prefs)
└── Future API Endpoints

Build System
├── Tailwind CSS 3.4
├── TypeScript 5
└── Next.js 15
```

## 3. Core Features

### 3.1 Schedule Display
- Daily timetables for 2 transport types
- Holiday schedule detection
- 12/24h time format support

### 3.2 Next Available Calculator
- Real-time countdown to next departure
- Filter by:
  - Current location
  - Destination
  - Transport type

## 4. Data Model

### 4.1 Schedule Structure
```typescript
interface TransportSchedule {
  route: 'ÇM44-1' | 'Campus Shuttle';
  days: 'weekday' | 'weekend' | 'holiday';
  stops: {
    [stopName: string]: string[]; // Array of departure times
  };
  effectiveFrom: Date;
  effectiveUntil: Date;
}
```

## 5. User Interface Design

### 5.1 Core Components
1. `ScheduleTable`: Responsive timetable display
2. `NextBusIndicator`: Real-time next departure
3. `ScheduleFilter`: Time/route filtering controls

### 5.2 Design System
- Color schemes: Light/Dark mode
- Typography: Geist font stack
- Spacing: 4px base unit

## 6. Performance Considerations
1. Static schedule data pre-loading
2. Client-side caching strategies
3. Dynamic import for non-critical components
4. Lighthouse performance target: ≥95/100

## 7. Security
1. Read-only schedule data
2. Sanitized user inputs
3. CSP headers for XSS protection
4. Regular dependency audits

## 8. Roadmap Alignment

### Phase 1 Completion
- Implement time formatting utilities
- Add schedule data validation

### Phase 2 Preparation
- Mobile-responsive layout testing

## 9. Testing Strategy
1. Unit Tests: Schedule calculations
2. E2E Tests: User workflow validation
3. Visual Regression: UI consistency
4. Performance: Lighthouse CI

## 10. Deployment
- Vercel platform hosting
- CI/CD via GitHub Actions
- Monitoring: Vercel Analytics
