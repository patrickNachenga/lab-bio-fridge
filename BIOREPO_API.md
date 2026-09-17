# BIO-REPO API contract

Base URL: `/api/v1`  
Authentication: `Authorization: Bearer <access-token>`  
All list endpoints accept `page`, `page_size`, `search`, `ordering` and relevant filter parameters. Mutations return the created/updated resource. Errors use:

```json
{ "code": "POSITION_OCCUPIED", "message": "Position is already occupied", "field": "position_id", "details": {} }
```

## 1. Authentication and current user

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Sign in and return access/refresh tokens |
| POST | `/auth/refresh` | Rotate access token |
| POST | `/auth/logout` | Revoke refresh token |
| GET | `/auth/me` | Current user, roles and permissions |
| GET | `/auth/permissions` | Effective permissions for the current user |

## 2. Organization and people

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/institutions` | List/create institutions |
| GET/PATCH/DELETE | `/institutions/{id}` | Read/update/archive institution |
| GET/POST | `/departments` | List/create departments |
| GET/PATCH/DELETE | `/departments/{id}` | Read/update/archive department |
| GET/POST | `/units` | List/create hospital/repository units |
| GET/PATCH/DELETE | `/units/{id}` | Read/update/archive unit |
| GET/POST | `/designations` | List/create staff designations |
| GET/PATCH/DELETE | `/designations/{id}` | Read/update/archive designation |
| GET/POST | `/people` | List/create people |
| GET/PATCH/DELETE | `/people/{id}` | Read/update/archive person |
| GET/POST | `/roles` | List/create roles |
| GET/PATCH/DELETE | `/roles/{id}` | Read/update/archive role |

## 3. Master data and lookups

The lookup endpoints use the same shape: `{ id, code, name, description, active, sort_order }`.

| Method | Endpoint | Lookup |
|---|---|---|
| GET/POST | `/lookups/sample-types` | Blood, serum, DNA, tissue, etc. |
| GET/POST | `/lookups/sample-natures` | Fresh, frozen, extracted, archived |
| GET/POST | `/lookups/sample-conditions` | Good, damaged, compromised |
| GET/POST | `/lookups/sample-sources` | Project, hospital, external, laboratory |
| GET/POST | `/lookups/sample-origins` | Human, animal, environmental, clinical |
| GET/POST | `/lookups/container-types` | Cryovials, plates, bags and layouts |
| GET/POST | `/lookups/storage-unit-types` | ULT freezer, refrigerator, LN2, etc. |
| GET/POST | `/lookups/storage-node-types` | Block, partition, drawer, rack, shelf, box |
| GET/POST | `/lookups/temperature-ranges` | Ambient, 2–8°C, −20°C, −80°C, LN2 |
| GET/POST | `/lookups/units-of-measure` | mL, µL, mg, vial, aliquot |
| GET/POST | `/lookups/approval-types` | Ethics, IRB, permit, regulatory |
| GET/POST | `/lookups/agreement-types` | MTA, DTA, other agreement |
| GET | `/lookups/all` | Return all active lookups for app bootstrap |
| PATCH/DELETE | `/lookups/{group}/{id}` | Update/archive a lookup value |

## 4. Facilities and dynamic storage

`StorageNode` is generic. It always has `storage_unit_id`, `parent_id`, `node_type_id`, `code`, `name`, `sequence`, `capacity`, and `status`. Do not expose fixed columns/racks in the API.

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/facilities` | List/create facilities |
| GET/PATCH/DELETE | `/facilities/{id}` | Read/update/archive facility |
| GET/POST | `/storage-units` | List/create freezers/refrigerators |
| GET | `/storage-units/{id}` | Unit metadata and capacity summary |
| PATCH | `/storage-units/{id}` | Update metadata/status |
| DELETE | `/storage-units/{id}` | Archive unit; reject if samples remain |
| GET | `/storage-units/{id}/tree` | Full dynamic node tree |
| POST | `/storage-units/{id}/generate-structure` | Generate nodes from level configuration |
| GET/POST | `/storage-units/{id}/nodes` | List/create direct child nodes |
| GET/PATCH/DELETE | `/storage-nodes/{id}` | Read/update/archive a node |
| GET | `/storage-nodes/{id}/children` | Direct children with summaries |
| GET | `/storage-nodes/{id}/ancestors` | Path from unit to node |
| GET/POST | `/storage-containers` | List/create boxes/containers |
| GET/PATCH/DELETE | `/storage-containers/{id}` | Container barcode, type and status |
| GET | `/storage-containers/{id}/positions` | Generated positions and occupancy |
| GET/PATCH | `/storage-positions/{id}` | Position metadata/status |
| GET | `/storage-units/{id}/capacity` | Total/occupied/reserved/available capacity |
| GET | `/storage-positions/available` | Search available positions by temperature/type/allocation |

`POST /storage-units/{id}/generate-structure` accepts `{ levels: [{ node_type_code, count, rows, columns }] }`. The first level may be `BLOCK`; every subsequent level is generated below each parent.

## 5. Projects, approvals and agreements

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/projects` | List/create projects |
| GET/PATCH/DELETE | `/projects/{id}` | Read/update/archive project |
| POST | `/projects/{id}/submit` | Submit project for approval |
| POST | `/projects/{id}/approve` | Approve project |
| POST | `/projects/{id}/close` | Close project |
| GET/POST | `/projects/{id}/members` | Assign project people and roles |
| PATCH/DELETE | `/projects/{id}/members/{member_id}` | Update/remove project member |
| GET/POST | `/projects/{id}/approvals` | Ethical/regulatory approvals |
| GET/PATCH/DELETE | `/project-approvals/{id}` | Approval lifecycle |
| GET/POST | `/projects/{id}/agreements` | MTA/DTA/agreement records |
| GET/PATCH/DELETE | `/project-agreements/{id}` | Agreement lifecycle |

## 6. Storage booking and allocation

Booking is separate from sample placement. Allocation capacity is reserved; occupied capacity is calculated from active placements.

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/storage-requests` | List/create storage requests |
| GET/PATCH | `/storage-requests/{id}` | Read/update request |
| POST | `/storage-requests/{id}/submit` | Submit for approval |
| POST | `/storage-requests/{id}/approve` | Approve request |
| POST | `/storage-requests/{id}/reject` | Reject with reason |
| POST | `/storage-requests/{id}/recommendations` | Smart available-space recommendations |
| GET/POST | `/storage-allocations` | List/create approved allocations |
| GET | `/storage-allocations/{id}` | Allocation and live usage |
| PATCH | `/storage-allocations/{id}` | Adjust permitted metadata |
| POST | `/storage-allocations/{id}/activate` | Activate allocation |
| POST | `/storage-allocations/{id}/release` | Release unused capacity |
| GET/POST | `/storage-allocations/{id}/areas` | Allowed nodes/positions |
| DELETE | `/storage-allocations/{id}/areas/{area_id}` | Remove allowed area |
| GET/POST | `/storage-extensions` | Request additional capacity |
| POST | `/storage-extensions/{id}/approve` | Approve extension and update allocation |
| POST | `/storage-extensions/{id}/reject` | Reject extension |
| GET | `/projects/{id}/storage-summary` | Allocated vs occupied vs available |

Placement must validate project ownership, allocation status, temperature compatibility, position availability, and sample authorization. Failure must return a stable error code; never silently replace an existing sample.

## 7. Samples, aliquots and containers

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/samples` | Search/register repository samples |
| GET/PATCH | `/samples/{id}` | Read/update non-location metadata |
| POST | `/samples/{id}/receive` | Mark sample received |
| POST | `/samples/{id}/authorize-placement` | Authorize sample for an allocation |
| GET | `/samples/{id}/current-location` | Fast current location |
| GET | `/samples/{id}/location-history` | Immutable location history |
| GET/POST | `/samples/{id}/aliquots` | List/create aliquots |
| GET/PATCH | `/aliquots/{id}` | Read/update aliquot |
| GET/POST | `/sample-containers` | List/create sample containers |
| GET/PATCH | `/sample-containers/{id}` | Container metadata/barcode |
| GET | `/samples/{id}/quantity` | Current quantity by unit |
| GET/POST | `/samples/{id}/quantity-transactions` | Volume/quantity history |
| GET | `/samples/{id}/history` | Combined sample timeline |
| GET | `/samples/export` | Export filtered inventory |

## 8. Project and hospital/clinical samples

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/project-samples` | Project-to-sample association |
| GET/PATCH | `/project-samples/{id}` | Project sample metadata |
| GET/POST | `/patients` | Restricted patient registry |
| GET/PATCH | `/patients/{id}` | Restricted patient record |
| GET/POST | `/clinical-samples` | Clinical sample metadata and source unit |
| GET/PATCH | `/clinical-samples/{id}` | Clinical sample record |
| GET/POST | `/clinical-requests` | Clinical/research requests |
| GET/PATCH | `/clinical-requests/{id}` | Request lifecycle |
| GET | `/clinical-samples/{id}/privacy-view` | Minimum-necessary clinical view |

Patient endpoints require a separate clinical permission and must not be included in ordinary repository sample responses.

## 9. Placement, movement, checkout and return

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/placements` | Place a received/authorized sample |
| GET | `/placements/{id}` | Placement record |
| POST | `/sample-movements` | Move sample atomically from one position to another |
| GET | `/sample-movements` | Search movement history |
| GET | `/sample-movements/{id}` | Movement detail |
| POST | `/samples/{id}/checkout` | Temporary removal with custodian/due date |
| POST | `/samples/{id}/return` | Return checked-out sample to a position |
| POST | `/samples/{id}/transfer` | Authorized project/institution transfer |
| POST | `/samples/{id}/remove` | Remove from storage without destruction |

Movement transactions must be atomic: close the old current location, create the new current location, append immutable history, and write an audit event in one database transaction.

## 10. Operations and disposal

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/aliquoting` | Create child aliquots and quantity transactions |
| POST | `/volume-transactions` | Add, consume, split or adjust volume |
| POST | `/disposals` | Request disposal/destruction |
| POST | `/disposals/{id}/approve` | Approve disposal |
| POST | `/disposals/{id}/complete` | Complete disposal and close location |
| GET | `/disposals` | Disposal register |
| GET | `/samples/{id}/chain-of-custody` | Custody report |

## 11. Environment and equipment

| Method | Endpoint | Purpose |
|---|---|---|
| GET/POST | `/temperature-readings` | Ingest/query readings |
| GET | `/storage-units/{id}/temperature-series` | Time series for charts |
| GET/POST | `/temperature-excursions` | List/create excursions |
| POST | `/temperature-excursions/{id}/acknowledge` | Acknowledge alert |
| POST | `/temperature-excursions/{id}/resolve` | Resolve with investigation |
| GET/POST | `/maintenance` | Maintenance records |
| GET/PATCH | `/maintenance/{id}` | Maintenance lifecycle |
| GET/POST | `/calibrations` | Calibration records |
| GET/PATCH | `/calibrations/{id}` | Calibration lifecycle |

## 12. Alerts, audit and security

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/alerts` | Active and historical alerts |
| POST | `/alerts/{id}/acknowledge` | Acknowledge alert |
| POST | `/alerts/{id}/resolve` | Resolve alert |
| GET | `/audit-events` | Filterable immutable audit trail |
| GET | `/audit-events/{id}` | Audit event detail |
| GET | `/audit-events/export` | Authorized audit export |
| GET | `/access-logs` | Login/access security logs |
| GET | `/data-access-logs` | Sensitive data access logs |

Audit events should be generated server-side for every mutation; clients must not be allowed to submit `performed_by`, timestamps, or audit entries as trusted values.

## 13. Dashboard and analytics

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/dashboard/summary` | KPI cards: units, samples, projects, alerts, capacity |
| GET | `/dashboard/capacity` | Utilization by storage unit and node |
| GET | `/dashboard/samples-by-type` | Sample type distribution |
| GET | `/dashboard/samples-by-project` | Project usage distribution |
| GET | `/dashboard/temperature` | Latest readings and 24-hour trends |
| GET | `/dashboard/recent-movements` | Recent movement feed |
| GET | `/dashboard/recent-activity` | Recent audit activity |
| GET | `/analytics/storage-utilization` | Utilization over a date range |
| GET | `/analytics/project-usage` | Project allocation/occupancy over time |
| GET | `/analytics/sample-intake` | Intake trend and source breakdown |

`GET /dashboard/summary` should return a single payload for the initial dashboard load:

```json
{
  "storage_units": { "total": 4, "active": 3, "maintenance": 1 },
  "samples": { "total": 360, "stored": 350, "checked_out": 10 },
  "projects": { "total": 6, "active": 4, "awaiting_approval": 1 },
  "capacity": { "total": 10000, "occupied": 6200, "reserved": 900, "available": 2900 },
  "alerts": { "active": 3, "critical": 1 },
  "generated_at": "2026-08-30T12:00:00Z"
}
```

## 14. API rules required for implementation

1. Use UUIDs internally and human-readable codes/barcodes as unique business identifiers.
2. Archive master data and physical nodes instead of deleting records referenced by history.
3. Enforce uniqueness for unit codes, node codes under a parent, barcodes, sample codes and active position placements.
4. Use database transactions and row locks for placement, movement, allocation and quantity operations.
5. Calculate occupied capacity from active placements; never trust a client-provided counter.
6. Return paginated lists and support CSV/XLSX exports asynchronously for large inventories.
7. Require idempotency keys for placement, movement, disposal and quantity mutation requests.
8. Version the contract under `/api/v1`; future endpoint changes require a new version or additive fields.
