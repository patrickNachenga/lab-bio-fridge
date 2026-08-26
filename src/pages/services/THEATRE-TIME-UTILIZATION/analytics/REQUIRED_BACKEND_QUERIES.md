# Theatre Time Utilization - Analytics Page Backend GraphQL Queries

This document lists all 11 new GraphQL queries required by the **TheatreTimeAnalyticsPage.jsx**.
The frontend now uses these queries via `theatreGraphqlApi.js` (endpoints 18-28).

All responses follow the existing pattern: `{ status, code, message, data }`.

---

## 1. GetAnalyticsStats

**Hook:** `useGetAnalyticsStatsQuery`

**GraphQL:**
```graphql
query GetAnalyticsStats {
  getAnalyticsStats {
    status
    code
    message
    data {
      totalProcedures
      totalTheatreHours
      avgProcedureMinutes
      delayRate
      onTimePercentage
      mortalityRate
      missedEstimateRate
    }
  }
}
```

**Response `data` fields:**
| Field | Type | Description |
|-------|------|-------------|
| totalProcedures | Int | Total count of procedures in filtered period |
| totalTheatreHours | Float | Total cumulative hours across all procedures |
| avgProcedureMinutes | Float | Average procedure duration in minutes |
| delayRate | Float | Percentage of procedures with delay |
| onTimePercentage | Float | Percentage of procedures completed on-time |
| mortalityRate | Float | Percentage of procedures resulting in death |
| missedEstimateRate | Float | Percentage where actual duration > estimated |

**Frontend usage:** KPI cards (6 cards in Row 1).

---

## 2. GetProceduresOverTime

**Hook:** `useGetProceduresOverTimeQuery`

**GraphQL:**
```graphql
query GetProceduresOverTime($dateRange: String, $theatreUnitUid: String, $procedureUid: String) {
  getProceduresOverTime(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid, procedureUid: $procedureUid) {
    status
    code
    message
    data {
      items {
        date
        procedures
      }
    }
  }
}
```

**Filters:** `dateRange` (e.g. "This Week", "This Month"), `theatreUnitUid`, `procedureUid`
**Response `items`:** Array of `{ date: String, procedures: Int }`
**Frontend usage:** Line chart showing procedure count over time.

---

## 3. GetPatientTypeDistribution

**Hook:** `useGetPatientTypeDistributionQuery`

**GraphQL:**
```graphql
query GetPatientTypeDistribution($dateRange: String, $theatreUnitUid: String) {
  getPatientTypeDistribution(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid) {
    status
    code
    message
    data {
      items {
        name
        value
        color
      }
    }
  }
}
```

**Response `items`:** Array of `{ name: String, value: Int, color: String }` (e.g. `{ name: "Emergency", value: 35, color: "#dc2626" }`)
**Frontend usage:** Donut chart showing Emergency vs Elective split.

---

## 4. GetPatientOutcomes

**Hook:** `useGetPatientOutcomesQuery`

**GraphQL:**
```graphql
query GetPatientOutcomes($dateRange: String, $theatreUnitUid: String) {
  getPatientOutcomes(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid) {
    status
    code
    message
    data {
      items {
        name
        value
        color
      }
    }
  }
}
```

**Response `items`:** Array of `{ name: String, value: Int, color: String }` (e.g. `{ name: "Discharged", value: 92, color: "#16a34a" }`)
**Frontend usage:** Donut chart showing Discharged vs Deceased.

---

## 5. GetTheatreUtilization

**Hook:** `useGetTheatreUtilizationQuery`

**GraphQL:**
```graphql
query GetTheatreUtilization($dateRange: String, $theatreUnitUid: String) {
  getTheatreUtilization(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid) {
    status
    code
    message
    data {
      items {
        name
        utilization
      }
    }
  }
}
```

**Response `items`:** Array of `{ name: String, utilization: Float }` (utilization as percentage 0-100)
**Frontend usage:** Horizontal progress bars per theatre unit.

---

## 6. GetEstimatedVsActualDuration

**Hook:** `useGetEstimatedVsActualDurationQuery`

**GraphQL:**
```graphql
query GetEstimatedVsActualDuration($dateRange: String, $theatreUnitUid: String) {
  getEstimatedVsActualDuration(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid) {
    status
    code
    message
    data {
      items {
        procedure
        estimated
        actual
      }
    }
  }
}
```

**Response `items`:** Array of `{ procedure: String, estimated: Float, actual: Float }` (minutes)
**Frontend usage:** Composed chart (bar + line) comparing estimated vs actual duration.

---

## 7. GetDelaysOverTime

**Hook:** `useGetDelaysOverTimeQuery`

**GraphQL:**
```graphql
query GetDelaysOverTime($dateRange: String, $theatreUnitUid: String, $procedureUid: String) {
  getDelaysOverTime(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid, procedureUid: $procedureUid) {
    status
    code
    message
    data {
      items {
        date
        onTime
        delayed
      }
    }
  }
}
```

**Response `items`:** Array of `{ date: String, onTime: Int, delayed: Int }`
**Frontend usage:** Stacked bar chart showing on-time vs delayed procedures per day.

---

## 8. GetDurationDistribution

**Hook:** `useGetDurationDistributionQuery`

**GraphQL:**
```graphql
query GetDurationDistribution($dateRange: String, $theatreUnitUid: String) {
  getDurationDistribution(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid) {
    status
    code
    message
    data {
      items {
        name
        value
        color
      }
    }
  }
}
```

**Response `items`:** Array of `{ name: String, value: Int, color: String }` (e.g. `{ name: "60-120 min", value: 35, color: "#2563eb" }`)
**Frontend usage:** Donut chart showing procedure duration ranges.

---

## 9. GetProceduresByRegion

**Hook:** `useGetProceduresByRegionQuery`

**GraphQL:**
```graphql
query GetProceduresByRegion($dateRange: String, $theatreUnitUid: String) {
  getProceduresByRegion(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid) {
    status
    code
    message
    data {
      items {
        name
        count
      }
    }
  }
}
```

**Response `items`:** Array of `{ name: String, count: Int }` (region name + procedure count)
**Frontend usage:** Horizontal bar chart ranked by count.

---

## 10. GetTeamPerformance

**Hook:** `useGetTeamPerformanceQuery`

**GraphQL:**
```graphql
query GetTeamPerformance($dateRange: String, $theatreUnitUid: String) {
  getTeamPerformance(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid) {
    status
    code
    message
    data {
      items {
        team
        procedures
        avgDuration
        delayRate
        onTimePct
      }
    }
  }
}
```

**Response `items`:** Array of `{ team: String, procedures: Int, avgDuration: Float, delayRate: Float, onTimePct: Float }`
**Frontend usage:** Team performance table with totals row.

---

## 11. GetProceduresHeatmap

**Hook:** `useGetProceduresHeatmapQuery`

**GraphQL:**
```graphql
query GetProceduresHeatmap($dateRange: String, $theatreUnitUid: String) {
  getProceduresHeatmap(dateRange: $dateRange, theatreUnitUid: $theatreUnitUid) {
    status
    code
    message
    data {
      items {
        day
        hour
        count
      }
    }
  }
}
```

**Response `items`:** Array of `{ day: String, hour: String, count: Int }`
- `day`: "Monday" through "Sunday"
- `hour`: time slot strings like "08:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00"
- `count`: number of procedures in that day+hour slot

**Frontend usage:** Heatmap table showing procedure density by day and hour.

---

## Registering New API Endpoints

In `src/features/theatre/theatreGraphqlApi.js`, each new query is registered as:

```javascript
getAnalyticsStats: builder.query({
  query: (variables = {}) => ({
    body: {
      query: GET_ANALYTICS_STATS,
      variables: { dateRange: variables.dateRange, theatreUnitUid: variables.theatreUnitUid },
    },
    method: 'POST',
  }),
  transformResponse: (response) => transformGqlResponse(response, 'getAnalyticsStats'),
  providesTags: ['TheatreTimeRecord'],
}),
```

And exported as hooks (already done):
```javascript
export const { useGetAnalyticsStatsQuery } = theatreGraphqlApi;
// ... etc for all 11 queries
```

## API Base URL

```
POST http://localhost:8095/graphql
```
(Configured in `src/features/theatre/theatreGraphqlBaseQuery.js`)