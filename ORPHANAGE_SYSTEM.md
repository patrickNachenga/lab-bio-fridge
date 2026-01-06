# Orphanage Management System

A comprehensive React-based application for managing orphanage facilities, children, staff, and healthcare records.

## Project Overview

This system has been completely refactored from a multi-service hospital management platform to a focused orphanage management solution. It provides comprehensive tools for managing:

- **Facilities**: Multiple orphanage locations
- **Children**: Orphan registry with personal information
- **Staff**: Facility personnel management
- **Healthcare**: Hospital visits, prescriptions, and medical tracking
- **Reminders**: Automated health reminders for follow-ups

## Technology Stack

- **Frontend**: React 18.2.0
- **State Management**: Redux + Redux Toolkit
- **Styling**: Bootstrap 5, Custom CSS
- **Routing**: React Router v6
- **UI Components**: Material-UI, Lucide React
- **Build Tool**: Vite
- **Form Handling**: Formik + Yup
- **PDF Viewing**: React PDF Viewer

## Project Structure

```
src/
├── pages/
│   └── services/
│       └── ORPHANAGE/
│           ├── dashboard/          # Dashboard & overview
│           ├── facilities/          # Facility management (CRUD)
│           ├── children/            # Children registry
│           ├── staff/               # Staff management
│           ├── hospital_visits/     # Visit tracking
│           ├── prescriptions/       # Medical prescriptions
│           ├── reminders/           # Health reminders
│           └── hospitals/           # Partner hospitals
├── router/
│   ├── AppRoutes.jsx               # Main routing
│   └── orphanageRoutes.jsx         # Orphanage routes
├── data/
│   ├── orphanageSampleData.js      # Mock data for all entities
│   ├── orphanageMenu.json          # Navigation menu
│   └── servicesList.json           # Services listing
└── ...
```

## Data Models

### 1. FACILITY
```javascript
{
  id: UUID,
  facility_code: string (unique),
  name: string,
  address: string,
  phone: string,
  children_count: number,
  staff_count: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

### 2. CHILD
```javascript
{
  id: UUID,
  child_unique_number: string (unique),
  full_name: string,
  date_of_birth: date,
  gender: enum (Male, Female),
  facility_id: FK to FACILITY,
  status: enum (active, inactive),
  admission_date: date,
  created_at: timestamp
}
```

### 3. CHILD_FACILITY_ASSIGNMENT
```javascript
{
  id: UUID,
  child_id: FK to CHILD,
  facility_id: FK to FACILITY,
  start_date: datetime,
  end_date: datetime (nullable)
}
```

### 4. STAFF
```javascript
{
  id: UUID,
  full_name: string,
  role: enum (Caretaker, Medical Officer, Administrator, Teacher, Cook),
  phone: string,
  email: string,
  is_external: boolean,
  facility_id: FK to FACILITY,
  status: enum (active, inactive),
  hire_date: date,
  created_at: timestamp
}
```

### 5. STAFF_FACILITY_ASSIGNMENT
```javascript
{
  id: UUID,
  staff_id: FK to STAFF,
  facility_id: FK to FACILITY,
  start_date: datetime,
  end_date: datetime (nullable)
}
```

### 6. HOSPITAL
```javascript
{
  id: UUID,
  name: string,
  address: string,
  phone: string,
  created_at: timestamp
}
```

### 7. HOSPITAL_VISIT
```javascript
{
  id: UUID,
  child_assignment_id: FK to CHILD_FACILITY_ASSIGNMENT,
  hospital_id: FK to HOSPITAL,
  caretaker_id: FK to STAFF,
  doctor_id: FK to STAFF,
  visit_date: datetime,
  next_visit_date: date,
  status: enum (pending, completed, cancelled),
  created_by: enum (admin, staff),
  notes: text,
  created_at: timestamp
}
```

### 8. PRESCRIPTION
```javascript
{
  id: UUID,
  hospital_visit_id: FK to HOSPITAL_VISIT,
  doctor_id: FK to STAFF,
  confirmed_at: datetime,
  notes: text,
  medicines: array of PRESCRIPTION_MEDICINE
}
```

### 9. MEDICINE
```javascript
{
  id: UUID,
  name: string,
  unit: string (mg, ml, etc),
  standard_dosage: number
}
```

### 10. PRESCRIPTION_MEDICINE
```javascript
{
  id: UUID,
  prescription_id: FK to PRESCRIPTION,
  medicine_id: FK to MEDICINE,
  dosage: float,
  frequency_per_day: int,
  duration_days: int,
  start_date: date
}
```

### 11. REMINDER
```javascript
{
  id: UUID,
  child_assignment_id: FK to CHILD_FACILITY_ASSIGNMENT,
  reminder_type: enum (hospital_visit, medication),
  reference_id: UUID (references hospital visit or prescription),
  remind_at: datetime,
  is_completed: boolean,
  created_at: timestamp
}
```

## Features

### 1. Dashboard
- System overview with key statistics
- Recent hospital visits
- Quick access links to all modules
- Welcome message for logged-in users

### 2. Facilities Management
- View all facilities
- Add new facilities
- Edit facility details
- Track children and staff per facility

### 3. Children Registry
- Complete child profile management
- Track age, gender, facility assignment
- Health records overview
- Admission and status tracking

### 4. Staff Management
- Staff directory
- Role-based management
- Track internal and external staff
- Facility assignments

### 5. Hospital Visits
- Record hospital visits
- Track visit status (pending, completed, cancelled)
- Assign caretaker and doctor
- Schedule follow-up visits
- Add visit notes

### 6. Prescriptions
- Create prescriptions from hospital visits
- Add multiple medicines to a prescription
- Track dosage, frequency, and duration
- Medicine database with standard formulations

### 7. Health Reminders
- Auto-generated from hospital visits and prescriptions
- Track completion status
- Manage reminder schedules

### 8. Partner Hospitals
- Maintain list of partner hospitals
- Track hospital contact information
- Add/remove hospitals

## Routes

### Public Routes
- `/` - Home/Services page

### Protected Routes
All routes require authentication. Permission-based access control is implemented.

- `/orphanage` - Dashboard
- `/orphanage/facilities` - Facilities list
- `/orphanage/facilities/open/:uid` - Facility details/edit
- `/orphanage/children` - Children registry
- `/orphanage/children/open/:uid` - Child details/edit
- `/orphanage/staff` - Staff management
- `/orphanage/staff/open/:uid` - Staff details/edit
- `/orphanage/hospital-visits` - Hospital visits list
- `/orphanage/hospital-visits/open/:uid` - Visit details/edit
- `/orphanage/prescriptions` - Prescriptions list
- `/orphanage/prescriptions/open/:uid` - Prescription details/edit
- `/orphanage/reminders` - Health reminders list
- `/orphanage/hospitals` - Partner hospitals list

## Sample Data

The application includes comprehensive sample data in `/src/data/orphanageSampleData.js`:

- 3 Facilities (Kilimani, Msafini, Kisumu)
- 5 Children across facilities
- 4 Staff members with different roles
- 3 Partner hospitals
- 3 Hospital visit records
- 2 Prescriptions with medicines
- 3 Health reminders

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

```bash
npm run build
```

### Linting

```bash
npm lint
```

## Authentication

The system uses role-based access control with the following roles:

- **admin**: Full system access, can manage all resources
- **staff**: Can view children, facilities, and healthcare records
- **Request_Handler**: Special role for approval workflows (legacy)

## Permissions

Permissions are checked for specific actions:

- `view_facility` - View facilities
- `change_facility` - Edit facilities
- `view_child` - View children
- `change_child` - Edit child records
- `view_staff` - View staff
- `change_staff` - Edit staff
- `view_hospital_visit` - View hospital visits
- `change_hospital_visit` - Edit hospital visits
- `view_prescription` - View prescriptions
- `change_prescription` - Edit prescriptions
- `view_reminder` - View reminders
- `view_hospital` - View partner hospitals

## Future Enhancements

1. **API Integration**: Connect to backend API endpoints
2. **Real Database**: Replace mock data with actual database
3. **Analytics**: Add advanced reporting and analytics
4. **Document Management**: Store and manage health documents
5. **SMS Notifications**: Send reminders via SMS
6. **Multi-language Support**: Add language localization
7. **Mobile App**: Create mobile version
8. **Advanced Search**: Implement full-text search
9. **Batch Operations**: Import/export child records
10. **Audit Trail**: Track all system changes

## File Changes Made

### Deleted/Removed:
- All other service routes (e-approval, ICT assets, oxygen, etc.)
- Services folder contents (except orphanage)
- Multi-service configurations

### Created:
- `/src/router/orphanageRoutes.jsx` - Orphanage routing
- `/src/pages/services/ORPHANAGE/` - All orphanage pages
- `/src/data/orphanageSampleData.js` - Mock data
- `/src/data/orphanageMenu.json` - Navigation menu
- Updated `/src/data/servicesList.json` - Services listing
- Updated `/src/router/AppRoutes.jsx` - Main routes
- Updated `/package.json` - Project name
- Updated `/src/pages/Services.jsx` - Home page content

## Configuration

The system uses several configuration files:

- `orphanageMenu.json` - Navigation menu structure
- `servicesList.json` - Available services/modules
- `orphanageSampleData.js` - Mock data for development

## Support & Documentation

For detailed information about specific modules, refer to the respective component files in `/src/pages/services/ORPHANAGE/`.

## License

All rights reserved
