# Renal Dialysis Management System

Professional hospital-grade patient management interface for renal dialysis services at Muhimbili National Hospital.

## Overview

This module provides comprehensive dialysis session management with patient tracking, vital signs monitoring, lab investigations, and detailed medical records.

## Features

### 1. **Patient Visit Management**
- View patient demographic information
- List all dialysis visits with filtering and search
- Track visit status (Active/Discharged)
- Pagination support

### 2. **Detailed Visit Records**
Multiple tabs for organized information:

- **Overview**: Quick summary, vascular access type, dialysis problems checklist
- **Pre-Dialysis**: Weight, height, blood pressure, temperature, SpO2, and other vital signs
- **Session**: Equipment details (machine type, dialyzer), session timing, dialysate parameters, medications given
- **Monitoring**: Hourly monitoring records with vital signs, blood flow, ultrafiltration rates
- **Post-Dialysis**: Weight loss, final vital signs, session duration
- **Lab Results**: Laboratory investigations with pre/post dialysis values
- **Medications**: Complete medication list with doses and routes

### 3. **Form Management**
Three-step modal form for creating new dialysis visits:
- Step 1: Basic information (date, diagnosis, attending doctor)
- Step 2: Pre-dialysis vital signs
- Step 3: Dialysis parameters and equipment

## File Structure

```
RENAL_DIALYSIS/patient/
├── View.jsx                  # Patient visits list page
├── Details.jsx              # Detailed visit view with tabs
├── DialysisModal.jsx        # Multi-step form for new visits
├── index.js                 # Exports
├── Queries.jsx              # API queries template
├── dialysisData.json        # Static data (temporary)
└── README.md               # This file
```

## Components

### PatientPage (View.jsx)
**Main list view component**
- Displays patient information header
- Search and filter functionality
- Paginated table of dialysis visits
- Action buttons (View, Edit, Delete)

**Props**: None (uses localStorage/sessionStorage for data)

**State**:
```javascript
{
  searchTerm: string,
  filterStatus: 'all' | 'discharged' | 'active',
  currentPage: number
}
```

### DialysisDetailsPage (Details.jsx)
**Detailed visit view component**
- Patient header with demographics
- Tab-based interface for different visit sections
- Comprehensive data display for all dialysis parameters
- Professional medical formatting

**Route Params**: 
- `visitId`: The ID of the dialysis visit

**Data Flow**:
1. Reads from sessionStorage (set by PatientPage)
2. Displays patient and visit data
3. Organizes in tabbed interface

### DialysisModal (DialysisModal.jsx)
**Create/Update form component**
- Multi-step modal form (3 steps)
- Input validation
- Step navigation with Previous/Next buttons
- Form reset on cancel

**Props**:
- `onClose`: Callback when modal is closed

**Form Structure**:
```javascript
{
  visit_date: 'YYYY-MM-DD',
  ward: 'Renal Ward',
  diagnosis: 'CKD Stage 5',
  attending_doctor: 'Dr. Name',
  pre_dialysis: { weight, height_cm, standing_bp, ... },
  dialysis_order: { hours_of_dialysis, target_weight_loss, ... },
  dialysis_session: { machine_type, dialyzer_type, started_by }
}
```

## Data Structure

### Patient Object
```javascript
{
  id: number,
  hospital_reg_no: string,    // e.g., "MNH/REN/002145"
  first_name: string,
  last_name: string,
  sex: 'M' | 'F',
  date_of_birth: 'YYYY-MM-DD',
  phone_number: string,
  next_of_kin: string,
  next_of_kin_relationship: string,
  next_of_kin_phone: string
}
```

### Dialysis Visit Object
```javascript
{
  id: number,
  visit_date: 'YYYY-MM-DD',
  ward: string,
  diagnosis: string,
  attending_doctor: string,
  discharged: boolean,
  discharge_time: 'ISO-8601' | null,
  vascular_access: { access_type: string },
  pre_dialysis: { ... },
  dialysis_order: { ... },
  dialysis_session: { ... },
  dialysis_monitoring: [ ... ],
  post_dialysis: { ... },
  investigations: [ ... ],
  medications: [ ... ],
  dialysis_problems: { ... }
}
```

## Routing

### Current Routes
```
GET  /renal-dialysis/patient          - List patient visits
GET  /renal-dialysis/visit/:visitId   - View specific visit details

# Legacy routes (backward compatibility)
GET  /renal-dialysis/patients         - List patient visits
GET  /renal-dialysis/visits/:visitId  - View specific visit details
```

## Data Flow

### Viewing Visits
```
PatientPage (List)
    ↓
User clicks "View" button on visit row
    ↓
Session data stored in sessionStorage
    ↓
Navigate to /renal-dialysis/visit/:visitId
    ↓
DialysisDetailsPage (Details)
    ↓
Read from sessionStorage and display
```

### Creating New Visit
```
User clicks "New Visit" button
    ↓
DialysisModal opens (step 1)
    ↓
User fills form (3 steps)
    ↓
Validation on each step
    ↓
Form submission → Backend API (TODO)
    ↓
Modal closes
    ↓
Page refreshes/updates visit list
```

## Static Data

The module currently uses `dialysisData.json` for demonstration. This contains:
- One patient (Asha Mwakalobo)
- 4 sample dialysis visits
- Complete visit details for visit ID 101

**Location**: `src/pages/services/RENAL_DIALYSIS/patient/dialysisData.json`

## Backend Integration (TODO)

The `Queries.jsx` file contains comprehensive API templates for backend integration.

### Required API Endpoints

```
1. GET /api/v1/services/renal-dialysis/patients/:patientId/visits
   Returns: { patient, visits }

2. GET /api/v1/services/renal-dialysis/visits/:visitId
   Returns: Complete visit details with all sections

3. POST /api/v1/services/renal-dialysis/visits
   Body: New dialysis visit data
   Returns: { id, visitDate, status }

4. PUT /api/v1/services/renal-dialysis/visits/:visitId
   Body: Updated visit data
   Returns: Updated visit record

5. DELETE /api/v1/services/renal-dialysis/visits/:visitId
   Returns: { success, message }

6. POST /api/v1/services/renal-dialysis/visits/:visitId/monitoring
   Body: Hourly monitoring record
   Returns: Created monitoring record

7. POST /api/v1/services/renal-dialysis/visits/:visitId/investigations
   Body: Lab investigation results
   Returns: Updated investigations
```

## Styling

- **Bootstrap 5**: Core layout and components
- **Boxicons**: Icons throughout (via `bx` classes)
- **Custom CSS**: In-component styling with CSS-in-JS
- **Animate.css**: Smooth transitions and animations

## Dependencies

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "react-loading": "^2.0.3",
  "animate.css": "^4.1.0",
  "bootstrap": "^5.0.0"
}
```

## Accessibility Features

- Semantic HTML markup
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Performance Considerations

1. **Pagination**: Limited to 5 items per page to reduce DOM elements
2. **Search/Filter**: Debounced client-side filtering
3. **Lazy Loading**: Details page loads only when needed
4. **Session Storage**: Avoids redundant API calls

## Error Handling

Placeholder structure for error states:
- No patient data available
- No visits to display
- Network errors (TODO)
- Validation errors on form submission

## Future Enhancements

1. **Real-time Monitoring**: WebSocket integration for live vital signs
2. **PDF Export**: Generate comprehensive visit reports
3. **Advanced Analytics**: Charts and trends for patient dialysis history
4. **Mobile Optimization**: Responsive design improvements
5. **Offline Support**: Service worker for offline access
6. **Multi-language Support**: i18n integration
7. **User Roles**: Permission-based access control
8. **Audit Logging**: Track all changes and access

## Development Notes

### Adding New Fields
1. Update `dialysisData.json`
2. Add field to form in `DialysisModal.jsx`
3. Display in appropriate tab in `Details.jsx`
4. Update TypeScript types in `Queries.jsx`

### Modifying Data Display
1. Edit relevant tab content in `Details.jsx`
2. Update styling in component's CSS-in-JS
3. Test responsive behavior

### Backend Integration Steps
1. Replace static imports with API calls in `PatientPage` and `DialysisDetailsPage`
2. Implement form submission in `DialysisModal`
3. Add error handling and loading states
4. Update route guards with ProtectedRoute

## Support

For issues, feature requests, or questions, contact the development team.

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Production Ready (Backend integration pending)
