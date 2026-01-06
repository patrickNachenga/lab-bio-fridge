# Quick Start Guide - Orphanage Management System

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

---

## Accessing the System

1. **Navigate to Home**: `http://localhost:5173/`
2. **View All Services**: The home page displays all available modules
3. **Access Orphanage Modules**: Click on any orphanage service card

---

## Main Modules

### 📊 Dashboard
- **Route**: `/orphanage`
- **Purpose**: System overview and quick navigation
- **Features**: KPI cards, recent visits, quick links

### 🏠 Facilities Management
- **Route**: `/orphanage/facilities`
- **Purpose**: Manage orphanage locations
- **Features**: List, create, edit, delete facilities

### 👨‍👩‍👧‍👦 Children Registry
- **Route**: `/orphanage/children`
- **Purpose**: Manage child records
- **Features**: Complete profile, age tracking, facility assignment

### 👥 Staff Management
- **Route**: `/orphanage/staff`
- **Purpose**: Manage staff members
- **Features**: Directory, roles, facility assignments

### 🏥 Hospital Visits
- **Route**: `/orphanage/hospital-visits`
- **Purpose**: Track healthcare visits
- **Features**: Record visits, schedule follow-ups, assign doctors

### 💊 Prescriptions
- **Route**: `/orphanage/prescriptions`
- **Purpose**: Manage medical prescriptions
- **Features**: Create prescriptions, add medicines, track dosage

### 🔔 Health Reminders
- **Route**: `/orphanage/reminders`
- **Purpose**: Track health reminders
- **Features**: View reminders, mark as completed

### 🏨 Partner Hospitals
- **Route**: `/orphanage/hospitals`
- **Purpose**: Manage partner hospitals
- **Features**: Add/edit hospitals, contact management

---

## Sample Data

The system comes with realistic sample data:

- **3 Facilities**: Kilimani, Msafini, Kisumu
- **5 Children**: Multiple ages and genders
- **4 Staff Members**: Different roles (Caretaker, Doctor, Admin)
- **3 Partner Hospitals**: Major healthcare partners
- **Hospital Visits**: Complete visit history
- **Prescriptions**: Medicine tracking examples
- **Health Reminders**: Follow-up schedules

---

## Common Tasks

### Add a New Child
1. Navigate to Children (`/orphanage/children`)
2. Click "+ Add Child"
3. Fill in child details (name, DOB, gender, facility)
4. Click Save

### Record a Hospital Visit
1. Navigate to Hospital Visits (`/orphanage/hospital-visits`)
2. Click "+ Record Visit"
3. Select child, hospital, doctor, and caretaker
4. Fill in visit date and notes
5. Click Save

### Create a Prescription
1. Navigate to Prescriptions (`/orphanage/prescriptions`)
2. Click "+ New Prescription"
3. Select hospital visit and doctor
4. Add medicines with dosage information
5. Click Save

### Add a Facility
1. Navigate to Facilities (`/orphanage/facilities`)
2. Click "+ Add Facility"
3. Fill in facility details
4. Click Save

---

## Navigation

### Top Navigation
- Home link returns to services page
- User profile (top right)
- Theme toggle (if available)

### Sidebar Menu (when using full layout)
- Main menu with expandable sections
- Quick links to all modules
- User menu with logout

### Breadcrumbs
- Shows current page location
- Click to navigate back

---

## Common Features

### Tables
- **Search**: Use search boxes to filter data
- **Sort**: Click column headers to sort
- **Actions**: View/Edit/Delete buttons for each row
- **Pagination**: Navigate through pages

### Forms
- **Validation**: Required fields are marked
- **Error Messages**: Clear error descriptions
- **Submit**: Save button to submit form
- **Cancel**: Cancel button to go back

### Status Badges
- **Green**: Active/Completed
- **Yellow**: Pending/In Progress
- **Red**: Inactive/Cancelled
- **Blue**: Information/Assigned

---

## Tips & Tricks

1. **Quick Access**: Use breadcrumbs for quick navigation
2. **Data Search**: Most lists have search functionality
3. **Age Auto-Calculate**: Child age is automatically calculated
4. **Status Tracking**: Track visit and prescription status
5. **Related Records**: Click child name to see health records
6. **Form Defaults**: Forms remember recent selections

---

## File Locations

### Pages
```
src/pages/services/ORPHANAGE/
├── dashboard/
├── facilities/
├── children/
├── staff/
├── hospital_visits/
├── prescriptions/
├── reminders/
└── hospitals/
```

### Routes
```
src/router/
├── AppRoutes.jsx (main routes)
├── orphanageRoutes.jsx (orphanage routes)
└── authRoutes.jsx (authentication)
```

### Data
```
src/data/
├── orphanageSampleData.js (mock data)
├── orphanageMenu.json (navigation)
└── servicesList.json (module listing)
```

---

## Styling Guide

### Colors
- **Primary**: Blue (#1976d2)
- **Success**: Green (#28a745)
- **Warning**: Yellow (#ffc107)
- **Danger**: Red (#dc3545)
- **Info**: Light Blue (#17a2b8)

### Responsive Breakpoints
- **Mobile**: < 576px
- **Tablet**: 576px - 992px
- **Desktop**: > 992px

---

## Keyboard Shortcuts

- **Tab**: Navigate form fields
- **Enter**: Submit form
- **Escape**: Close modals/dialogs
- **Ctrl+S**: Save (when applicable)

---

## Troubleshooting

### Page not loading
- Check browser console for errors
- Ensure port 5173 is available
- Clear browser cache

### Data not showing
- Check if you're logged in
- Verify permissions in user role
- Check sample data in `orphanageSampleData.js`

### Form validation errors
- Check all required fields are filled
- Verify data format (dates, numbers)
- See error messages below fields

### Build errors
- Run `npm install` to update dependencies
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (18+ recommended)

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

---

## Environment Setup

Create `.env` file for custom configuration:

```env
# API Configuration (for future backend)
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Application Settings
VITE_APP_NAME=Orphanage Management System
VITE_APP_VERSION=1.0.0
```

---

## Documentation

- **Full System Docs**: See `ORPHANAGE_SYSTEM.md`
- **API Integration**: See `API_INTEGRATION_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

---

## Support

For help with:
- **Routes & Navigation**: Check `src/router/orphanageRoutes.jsx`
- **Component Structure**: Check individual page files
- **Data Models**: See `orphanageSampleData.js`
- **Styling**: Check `src/css/` directory

---

## Next Steps

1. ✓ System is ready to use with sample data
2. ☐ Connect to backend API (see API_INTEGRATION_GUIDE.md)
3. ☐ Implement real authentication
4. ☐ Add advanced features (reports, analytics)
5. ☐ Deploy to production

---

## Project Structure Overview

```
orphanage/
├── src/
│   ├── pages/
│   │   └── services/ORPHANAGE/  ← Main application
│   ├── router/
│   │   ├── orphanageRoutes.jsx  ← Routing
│   │   └── AppRoutes.jsx        ← Main routes
│   ├── data/
│   │   ├── orphanageSampleData.js  ← Mock data
│   │   ├── orphanageMenu.json      ← Navigation
│   │   └── servicesList.json       ← Services
│   └── ...
├── ORPHANAGE_SYSTEM.md          ← Full documentation
├── API_INTEGRATION_GUIDE.md      ← Backend integration
├── IMPLEMENTATION_SUMMARY.md     ← What was built
├── QUICK_START.md               ← This file
└── package.json
```

---

## Version Info

- **React**: 18.2.0
- **Vite**: 6.3.2
- **Bootstrap**: 5.x
- **Redux**: 9.2.0
- **React Router**: 6.20.1

---

**Status**: Production Ready for Frontend Development
**Last Updated**: 2024-01-04
