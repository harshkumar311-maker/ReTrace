# ReTrace Backend

An Intelligent Lost and Found Item Recovery System Using Automated Item Matching — backend service.

## 1. Project description

ReTrace lets people report lost items and found items, stores every report
in MySQL, and automatically compares a lost report against all active
found reports using a weighted, dynamic matching algorithm. Nothing about
a specific item type is hard-coded — the same engine matches phones,
laptops, bags, wallets, documents, or anything else, purely from the
generic fields on each report.

## 2. Technologies

- Java 17
- Spring Boot 3.2.5 (Web, Data JPA, Validation)
- Maven
- MySQL 8
- Jakarta Bean Validation
- Lombok (getters/setters/builders only — no business logic hidden in it)
- JUnit 5 + Mockito + AssertJ (tests)

## 3. Requirements

- JDK 17+
- Maven 3.9+
- MySQL 8.x running locally (or reachable) with a user that can create/alter tables
- Port 8080 free (backend) and, if you're running the React frontend, port 5173

## 4. MySQL database setup

You don't need to manually create tables — Hibernate does that via
`ddl-auto=update` — but you do need the schema/user to exist.

```sql
CREATE DATABASE IF NOT EXISTS retrace_db;
-- Optional: a dedicated user instead of root
CREATE USER 'retrace_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON retrace_db.* TO 'retrace_user'@'localhost';
FLUSH PRIVILEGES;
```

If you'd rather not create the database by hand, the JDBC URL already
includes `createDatabaseIfNotExist=true`, so MySQL will create it
automatically the first time the app connects — as long as the configured
user has the `CREATE` privilege at the server level.

## 5. application.properties configuration

Located at `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/retrace_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

retrace.matching.threshold=50
```

Replace `YOUR_MYSQL_PASSWORD` with your real password before running —
or, better, don't edit the file at all and override it at launch instead:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.datasource.password=your_password_here"
```

or via an environment variable:

```bash
export SPRING_DATASOURCE_PASSWORD=your_password_here
mvn spring-boot:run
```

`retrace.matching.threshold` is the one number to change if you want the
matching engine to be stricter (raise it) or looser (lower it) — nothing
else in the code needs to change.

## 6. How to run the backend

```bash
cd retrace-backend
mvn clean install
mvn spring-boot:run
```

The app starts on **http://localhost:8080**. Confirm it's up:

```bash
curl http://localhost:8080/api/test
# {"message":"ReTrace Backend is Working!"}
```

To build a runnable jar instead:

```bash
mvn clean package
java -jar target/retrace-backend-0.0.1-SNAPSHOT.jar
```

## 7. API endpoints

Base path: `/api`

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/test` | Health check |
| POST | `/api/items/lost` | Report a lost item |
| POST | `/api/items/found` | Report a found item |
| GET | `/api/items/lost` | List all lost items |
| GET | `/api/items/found` | List all found items |
| GET | `/api/items` | List items with optional filters (`category`, `subcategory`, `brand`, `color`, `location`, `status`, `reportType`) |
| GET | `/api/items/{id}` | Get one item by ID |
| GET | `/api/items/matches/{lostItemId}` | Ranked list of possible matches for a lost item |
| GET | `/api/matches/{lostItemId}` | Same matching, bundled with the lost item's own details |
| POST | `/api/claims` | File a claim linking a lost item + a found item |
| GET | `/api/claims/{id}` | Get one claim |
| GET | `/api/claims` | List all claims |
| PATCH | `/api/claims/{id}/status` | Update a claim's status (`PENDING`/`APPROVED`/`REJECTED`) |

## 8. Example request/response

**Report a lost item**

```
POST /api/items/lost
Content-Type: application/json

{
  "category": "Electronics",
  "subcategory": "Phone",
  "brand": "Apple",
  "model": "iPhone 15",
  "color": "Blue",
  "location": "Library",
  "description": "Blue iPhone lost near the second floor reading room"
}
```

Response (`201 Created`):

```json
{
  "id": 1,
  "reportType": "LOST",
  "category": "Electronics",
  "subcategory": "Phone",
  "brand": "Apple",
  "model": "iPhone 15",
  "color": "Blue",
  "location": "Library",
  "description": "Blue iPhone lost near the second floor reading room",
  "status": "ACTIVE",
  "additionalDetails": null,
  "createdAt": "2026-09-26T10:15:00",
  "updatedAt": "2026-09-26T10:15:00"
}
```

Save that `id` — it's what you pass to the matching endpoint.

**Report a found item** — same shape, `POST /api/items/found`.

**Get matches**

```
GET /api/items/matches/1
```

```json
[
  {
    "lostItemId": 1,
    "foundItemId": 2,
    "score": 100,
    "matchedFields": ["category", "subcategory", "brand", "model", "color", "location"],
    "foundItem": {
      "id": 2,
      "reportType": "FOUND",
      "category": "Electronics",
      "subcategory": "Phone",
      "brand": "Apple",
      "model": "iPhone 15",
      "color": "Blue",
      "location": "Library",
      "description": "Phone found in library",
      "status": "ACTIVE",
      "createdAt": "2026-09-26T10:20:00",
      "updatedAt": "2026-09-26T10:20:00"
    }
  }
]
```

**Validation error example**

```
POST /api/items/lost
{ "brand": "Apple" }
```

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "category": "Category is required",
    "subcategory": "Subcategory is required",
    "location": "Location is required"
  }
}
```

## 9. Matching algorithm explanation

Implemented in `service/MatchScorer.java` — a small, dependency-free class
(no Spring/JPA imports at all) that takes plain strings in and returns a
score + matched-field list. `MatchingServiceImpl` is the only thing that
calls it, feeding it fields pulled from the `Item` entities.

**Weights (100 points total):**

| Field | Weight |
|---|---|
| category | 30 |
| subcategory | 20 |
| brand | 15 |
| model | 15 |
| color | 10 |
| location | 10 |

**Rules:**
- Comparison is case-insensitive and trims whitespace (`" Electronics "` == `"electronics"`).
- A field only contributes its weight if **both** sides have a non-blank value **and** those values are equal. A missing value on either side contributes 0 for that field — it's never treated as an error and never partially credited.
- The final score is the sum of matched weights — always out of a fixed 100, not rescaled based on how many fields were filled in.
- `MatchingServiceImpl` only returns found items whose score is **≥** `retrace.matching.threshold` (default 50), sorted highest score first.
- Only found items with `status = ACTIVE` are ever considered. Once a match is confirmed (e.g. a claim is approved — this MVP doesn't automate that transition yet, see Limitations), you'd move the found item to `MATCHED` so it stops showing up as a new possible match.

**Worked examples** (verified by hand, see below):

| Lost | Found | Score | Matched fields |
|---|---|---|---|
| Electronics/Phone/Apple/iPhone 15/Blue/Library | identical | **100** | all 6 |
| Electronics/Phone/Apple/iPhone 15/Blue/Library | Electronics/Phone/Apple/iPhone 14/Black/Cafeteria | **65** | category, subcategory, brand |
| Electronics/Laptop/HP/Victus RTX2050/—/Hostel | identical, color blank both sides | **90** | category, subcategory, brand, model, location |
| `"Electronics"` vs `"electronics"` (full match, mixed case) | — | **100** | all 6 |

## 10. How to test using Postman

1. Import a new collection, base URL `http://localhost:8080`.
2. **Health check** — `GET {{baseUrl}}/api/test`.
3. **Report lost** — `POST {{baseUrl}}/api/items/lost` with the JSON body from section 8. Copy the returned `id` into a Postman environment variable, e.g. `lostId`.
4. **Report found** — `POST {{baseUrl}}/api/items/found` with a similar/matching body. Save the returned id as `foundId`.
5. **Get matches** — `GET {{baseUrl}}/api/items/matches/{{lostId}}`. You should see `foundId` in the results with a score.
6. **File a claim** — `POST {{baseUrl}}/api/claims`:
   ```json
   { "lostItemId": {{lostId}}, "foundItemId": {{foundId}}, "claimantName": "Aarav Mehta", "claimantEmail": "aarav@example.com", "message": "This is mine." }
   ```
7. **Approve the claim** — `PATCH {{baseUrl}}/api/claims/{claimId}/status` with body `{ "status": "APPROVED" }`.
8. **Try a validation failure** — `POST {{baseUrl}}/api/items/lost` with `{}` and confirm you get a 400 with an `errors` map.

Two more scenarios straight from testing:

- Lost `iPhone 18` vs Found `iphone 18` (different case, same everything else) → score 100.
- Lost `HP Victus RTX2050` vs Found `HP Victus RTX2050` → score 90 (color wasn't provided on either side, so it simply doesn't contribute — it's not a penalty, just a field that couldn't be compared).

## 11. How to connect the React frontend

The frontend should run on `http://localhost:5173` (or `5174`/`5175` —
both are already allowed by CORS). Point its fetch calls at
`http://localhost:8080/api/...` instead of a mock/local service layer.
The flow the frontend needs to implement:

```
User submits "Report Lost Item" form
        ↓
POST http://localhost:8080/api/items/lost
        ↓
Backend responds with the created item, including its id
        ↓
Frontend navigates to /matches?lostId={id}
        ↓
GET http://localhost:8080/api/items/matches/{id}
        ↓
Backend returns ranked matches
        ↓
Frontend renders them
```

The generated `id` from the POST response is the only identifier the
frontend needs to carry forward — don't cache it in `localStorage` as the
source of truth; use it directly from the response and pass it via the
URL/route state.

**Note on field richness:** this backend's `Item` model is intentionally
the flat, generic shape from the spec (category, subcategory, brand,
model, color, location, description). If your frontend collects
category-specific fields beyond that (serial numbers, case color,
keychain description, etc.), send them as a JSON string in the optional
`additionalDetails` field — it's stored and returned, but never used by
the matching algorithm.

## 12. Common errors and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| `Communications link failure` / connection refused on startup | MySQL isn't running, or wrong port | Start MySQL; confirm `spring.datasource.url` port (3306 by default) |
| `Access denied for user 'root'@'localhost'` | Wrong password in `application.properties` | Update the password, or set `SPRING_DATASOURCE_PASSWORD` env var |
| `Unknown database 'retrace_db'` | DB doesn't exist and user lacks CREATE privilege | Run the `CREATE DATABASE` statement in section 4 manually |
| CORS error in the browser console | Frontend running on a port other than 5173/5174/5175 | Add the port to `CorsConfig.ALLOWED_ORIGINS` |
| `404` on `/api/items/matches/{id}` | The id belongs to a FOUND item, not a LOST one | Matches can only be generated starting from a LOST item's id (by design — see section 8 of the spec) |
| Every match request returns an empty list | No found items are `ACTIVE`, or none score ≥ threshold | Check `GET /api/items/found`; lower `retrace.matching.threshold` if needed |
| `mvn` not found | Maven not installed | Install Maven 3.9+, or use an IDE with bundled Maven support |
| Lombok getters/setters "not found" in your IDE | IDE doesn't have the Lombok plugin enabled | Install/enable the Lombok plugin for your IDE and enable annotation processing |

## Assumptions made

- `Item`'s schema follows the spec's flat field list exactly; the optional `additionalDetails` text column was added purely to give a richer frontend somewhere to put extra category-specific data without changing the matching algorithm or the required fields.
- The two matching endpoints (`/api/items/matches/{lostItemId}` and `/api/matches/{lostItemId}`) intentionally return different shapes — the first is a plain ranked list (matches the spec's primary example), the second bundles the lost item's own details alongside the same ranked list, matching section 10's request for a screen that shows lost + found + score + matched fields together.
- Claim status transitions (PENDING → APPROVED/REJECTED) are manual via the PATCH endpoint; approving a claim does **not** automatically flip the found item's status to MATCHED in this MVP (see Limitations).
- `reportType` and `status` query params on `GET /api/items` expect the exact enum spelling (`LOST`, `FOUND`, `ACTIVE`, etc.) — a mismatched case (e.g. `active`) returns a clean 400 rather than a 500, but won't be coerced to match.

## Limitations

- **I could not compile or run this project in the environment I built it in** — no internet access, no Maven, and no JDK compiler (`javac`) were available there, only a JRE. I verified the matching algorithm's arithmetic by hand-porting its exact logic to a throwaway script and running it against your own worked examples (see section 9) — but the Java project itself has not been built or executed by me. **Please run `mvn clean package` and `mvn test` yourself before relying on this**, and treat this as thoroughly-reviewed-but-unexecuted code rather than a verified build.
- Approving a claim doesn't automatically transition the found item to `MATCHED`/`RESOLVED` — that's a one-line addition in `ClaimServiceImpl.updateClaimStatus` if you want it (look up the found item and update its status when the new claim status is `APPROVED`).
- No authentication/authorization layer — anyone can call any endpoint, including PATCHing a claim's status. Fine for an MVP/college project, not for production.
- No pagination on the list endpoints (`/api/items`, `/api/items/lost`, `/api/items/found`, `/api/claims`) — fine at small scale, would need `Pageable` support if the dataset grows.
- The matching engine only compares a LOST item against FOUND items (one direction). There's no endpoint to go the other way (find lost items that might match a given found item), though `MatchScorer` would support it trivially if needed.
