# API Integration Guide

This document outlines all the API endpoints that need to be implemented to replace the mock data in `orphanageSampleData.js`.

## Base URL
```
{API_BASE_URL}/api/v1
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer {access_token}
```

---

## 1. FACILITIES MANAGEMENT

### GET /facilities
List all facilities
- **Query Parameters**: `page=1&per_page=20&search=query`
- **Response**: Paginated facility list

### GET /facilities/{id}
Get facility details
- **Response**: Single facility object

### POST /facilities
Create new facility
- **Body**:
```json
{
  "facility_code": "ORF-XXX-001",
  "name": "Facility Name",
  "address": "Address",
  "phone": "+254..."
}
```

### PUT /facilities/{id}
Update facility
- **Body**: Same as POST

### DELETE /facilities/{id}
Delete facility

---

## 2. CHILDREN MANAGEMENT

### GET /children
List all children
- **Query Parameters**: `page=1&per_page=20&facility_id=xxx&search=query`
- **Response**: Paginated children list

### GET /children/{id}
Get child details
- **Response**: Child object with assignments and health records

### POST /children
Create new child record
- **Body**:
```json
{
  "full_name": "Child Name",
  "child_unique_number": "CHD-XXX-2024-001",
  "date_of_birth": "2012-03-15",
  "gender": "Male",
  "facility_id": "fac-001"
}
```

### PUT /children/{id}
Update child record
- **Body**: Same as POST

### DELETE /children/{id}
Delete child record

### GET /children/{id}/health-records
Get child's health records
- **Response**: Hospital visits and prescriptions

---

## 3. STAFF MANAGEMENT

### GET /staff
List all staff
- **Query Parameters**: `page=1&per_page=20&facility_id=xxx&role=Medical Officer`
- **Response**: Paginated staff list

### GET /staff/{id}
Get staff details
- **Response**: Staff object with assignments

### POST /staff
Create new staff record
- **Body**:
```json
{
  "full_name": "Staff Name",
  "role": "Caretaker",
  "phone": "+254...",
  "email": "staff@example.com",
  "facility_id": "fac-001",
  "is_external": false
}
```

### PUT /staff/{id}
Update staff record
- **Body**: Same as POST

### DELETE /staff/{id}
Delete staff record (soft delete)

---

## 4. HOSPITAL VISITS

### GET /hospital-visits
List all hospital visits
- **Query Parameters**: `page=1&per_page=20&child_id=xxx&status=pending`
- **Response**: Paginated visits list

### GET /hospital-visits/{id}
Get visit details
- **Response**: Visit object with prescription details

### POST /hospital-visits
Create new hospital visit
- **Body**:
```json
{
  "child_id": "child-001",
  "hospital_id": "hosp-001",
  "doctor_id": "staff-002",
  "caretaker_id": "staff-001",
  "visit_date": "2024-01-02T10:30:00Z",
  "next_visit_date": "2024-02-02",
  "status": "pending",
  "notes": "Visit notes..."
}
```

### PUT /hospital-visits/{id}
Update hospital visit
- **Body**: Same as POST

### DELETE /hospital-visits/{id}
Delete hospital visit

### POST /hospital-visits/{id}/complete
Mark visit as completed
- **Body**:
```json
{
  "status": "completed"
}
```

---

## 5. PRESCRIPTIONS

### GET /prescriptions
List all prescriptions
- **Query Parameters**: `page=1&per_page=20&child_id=xxx&status=active`
- **Response**: Paginated prescriptions list

### GET /prescriptions/{id}
Get prescription details
- **Response**: Prescription with medicines

### POST /prescriptions
Create new prescription
- **Body**:
```json
{
  "hospital_visit_id": "visit-001",
  "doctor_id": "staff-002",
  "notes": "Prescription notes...",
  "medicines": [
    {
      "medicine_id": "med-001",
      "dosage": 500,
      "frequency_per_day": 3,
      "duration_days": 7,
      "start_date": "2024-01-02"
    }
  ]
}
```

### PUT /prescriptions/{id}
Update prescription
- **Body**: Same as POST

### DELETE /prescriptions/{id}
Delete prescription

### POST /prescriptions/{id}/add-medicine
Add medicine to prescription
- **Body**:
```json
{
  "medicine_id": "med-001",
  "dosage": 500,
  "frequency_per_day": 3,
  "duration_days": 7,
  "start_date": "2024-01-02"
}
```

### DELETE /prescriptions/{id}/medicines/{medicine_id}
Remove medicine from prescription

---

## 6. MEDICINES

### GET /medicines
List all medicines
- **Query Parameters**: `page=1&per_page=50&search=paracetamol`
- **Response**: Paginated medicines list

### GET /medicines/{id}
Get medicine details

### POST /medicines
Create new medicine
- **Body**:
```json
{
  "name": "Paracetamol",
  "unit": "mg",
  "standard_dosage": 500
}
```

### PUT /medicines/{id}
Update medicine

### DELETE /medicines/{id}
Delete medicine

---

## 7. REMINDERS

### GET /reminders
List all reminders
- **Query Parameters**: `page=1&per_page=20&child_id=xxx&is_completed=false`
- **Response**: Paginated reminders list

### GET /reminders/{id}
Get reminder details

### POST /reminders
Create new reminder
- **Body**:
```json
{
  "child_id": "child-001",
  "reminder_type": "hospital_visit",
  "reference_id": "visit-001",
  "remind_at": "2024-02-02T10:00:00Z"
}
```

### PUT /reminders/{id}/complete
Mark reminder as completed
- **Body**:
```json
{
  "is_completed": true
}
```

### DELETE /reminders/{id}
Delete reminder

---

## 8. HOSPITALS

### GET /hospitals
List all partner hospitals
- **Query Parameters**: `page=1&per_page=50&search=query`
- **Response**: Paginated hospitals list

### GET /hospitals/{id}
Get hospital details

### POST /hospitals
Create new hospital
- **Body**:
```json
{
  "name": "Hospital Name",
  "address": "Address",
  "phone": "+254..."
}
```

### PUT /hospitals/{id}
Update hospital
- **Body**: Same as POST

### DELETE /hospitals/{id}
Delete hospital

---

## 9. DASHBOARD STATISTICS

### GET /dashboard/statistics
Get dashboard overview statistics
- **Response**:
```json
{
  "total_facilities": 3,
  "total_children": 105,
  "total_staff": 32,
  "active_children": 98,
  "pending_visits": 5,
  "active_prescriptions": 15,
  "recent_visits": [...],
  "upcoming_reminders": [...]
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Server Error

---

## Implementation Steps

1. **Setup API Client**
   - Update `src/api.jsx` to include orphanage endpoints
   - Configure base URL from environment variables

2. **Replace Mock Data**
   - Update each page component to fetch from API
   - Remove imports from `orphanageSampleData.js`

3. **Add Error Handling**
   - Implement error boundaries
   - Add retry logic for failed requests
   - Show user-friendly error messages

4. **Add Loading States**
   - Show spinners while fetching
   - Disable buttons during submission
   - Show skeleton loaders for data

5. **Implement Validation**
   - Server-side validation
   - Form validation with Formik/Yup
   - Display validation errors

6. **Add Pagination**
   - Implement page-based pagination
   - Update table pagination controls
   - Handle large datasets

---

## Environment Configuration

Add to `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000
```

---

## Testing

Once API is integrated, update tests to:
- Mock API calls with MSW (Mock Service Worker)
- Test error scenarios
- Test pagination and filtering
- Test form submissions

---

## Security Considerations

1. **Token Management**
   - Store JWT securely (HttpOnly cookies preferred)
   - Implement token refresh
   - Handle token expiration

2. **Input Validation**
   - Validate all form inputs
   - Sanitize user data
   - Prevent XSS attacks

3. **CORS**
   - Configure CORS properly
   - Validate origin headers
   - Use credentials when necessary

4. **Rate Limiting**
   - Implement request throttling
   - Handle rate limit responses
   - Show user-friendly messages

---

## Performance Optimization

1. **Caching**
   - Cache facility and hospital lists
   - Implement query caching
   - Clear cache on mutations

2. **Pagination**
   - Use server-side pagination
   - Load data on demand
   - Reduce payload size

3. **Request Optimization**
   - Batch related requests
   - Use GraphQL if available
   - Minimize payload

---

## Documentation

Each API endpoint should document:
- Purpose and use case
- Required permissions/roles
- Request/response examples
- Error scenarios
- Rate limits (if applicable)
