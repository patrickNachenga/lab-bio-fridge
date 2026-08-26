# Theatre Time Dashboard — Required Backend GraphQL Queries

This document lists **every GraphQL query** the frontend dashboard (`TheatreTimeDashboard.jsx`) needs, with the exact field names and response shapes the charts/components expect.

**Backend endpoints are now implemented.** This doc serves as reference for the frontend wiring.

---

## ✅ Already Exists

### 1. `getTheatreTimeRecords` — Used for Stat Card #1 & Recent Forms Table

```graphql
query GetTheatreTimeRecords($pagination: PaginationInput!) {
  getTheatreTimeRecords(pagination: $pagination) {
    status code message
    data {
      totalCount
      items { uid patientMrn procedureDate }
    }
  }
}
```

---

## ✅ New Queries Available

### 2. `getDashboardStats` → DashboardStatsNode

```graphql
query GetDashboardStats {
  getDashboardStats {
    data {
      totalRecords          # Count of all records
      delayRate             # % of records with had_delay=True (e.g. 23.5)
      avgProcedureMinutes   # Average duration_minutes (e.g. 87.0)
      missedEstimateRate    # % where variance_minutes > 0 (e.g. 15.2)
    }
  }
}
```

__Maps to:__ 3 Stat Cards — Delay Rate, Avg Procedure Time, Missed Estimate

### 3. `getDelayDistribution` → DelayDistributionListNode

```graphql
query GetDelayDistribution {
  getDelayDistribution {
    data {
      items {
        label    # Delay category name (e.g. "Team Availability")
        count    # Number of records with that delay
        color    # Hex color for chart slice
      }
    }
  }
}
```

__Maps to:__ Doughnut Chart. Includes "No Delay" count and color-coded slices.

### 4. `getTheatreUnitActivity` → TheatreUnitActivityListNode

```graphql
query GetTheatreUnitActivity {
  getTheatreUnitActivity {
    data {
      items {
        label   # Theatre unit name (e.g. "Main Theatre 1")
        count   # Number of procedures in that unit
        color   # Hex color for bar
      }
    }
  }
}
```

__Maps to:__ Bar Chart — procedures per theatre unit.

---

## Frontend Wiring Summary

All 4 queries now wired in `src/pages/services/THEATRE-TIME-UTILIZATION/dashboard/TheatreTimeDashboard.jsx`:

```jsx
const { data: recordsResponse } = useGetTheatreTimeRecordsQuery({ limit: 8 });
const { data: statsResponse }   = useGetDashboardStatsQuery();
const { data: delayResponse }   = useGetDelayDistributionQuery();
const { data: unitResponse }    = useGetTheatreUnitActivityQuery();