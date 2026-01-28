Architecture Overview  ->

We decompose the system into domain-aligned microservices eacch with a specific data domain and responsibility. We follow API-driven communication, domain-driven design, single responsibility principle and database-per-service ownership.
We will use monorepo for initial phase.

In the future, we might implement a service mesh. Howerver currently FrostByte's workload are validation-heavy and deterministic. If traffic increases, we can think of adopting to mesh. In the initial phase, API communication will be better for debugging, readibility and observance.

Similiarly, if services are owned by different teams, we can move to polyrepo. For this, we would need the data and exact workload of FrostByte to determine whether monorepo or polyrepo structure would be better.

Currently, I've kept network summary in the validation service because it is static, and do not enforce any rule or own any tables in database schema. We can add a network service if network becomes stateful (real time positions of vehicles, dynamic capacity updates etc), or if multiple tasks are needed for this i.e analytics, report production etc.


- All data ownership is isolated in our structure.
- Each microservice will run in its own container with its own database container.
- Validation Service is computation-only.


Microservices ->
- Location Service
- Product Service
- Storage Service
- Route Service
- Demand Service
- Validation service


1. Location Service

Responsibilities -
- Create and list locations
- Enforce validity of location types

Entity- 
- location

APIs:
- POST /locations [create a location]
- GET /locations  [list location]

Database Schema -
CREATE TABLE location (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('PRODUCER', 'WAREHOUSE', 'RETAILER', 'HOSPITAL')),
    city TEXT NOT NULL
);


2. Product Service

Responsibilities -
- Create and manage products
- Enforce valid temperature range constraint

Entity- 
- product

APIs:
- POST /products [create a product]
- GET /product  [list product]

Database Schema -
CREATE TABLE product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    min_temperature NUMERIC NOT NULL,
    max_temperature NUMERIC NOT NULL,
    CHECK (min_temperature <= max_temperature)
);


3. Storage Service

Responsibilities -
- Create storage units
- Check that only an location of type warehouse can own a storage unit
- Track capacity limits
- Check temperature constraint

Entity- 
- storage_unit

Dependency-
- Location Service (read only) [to check type]

APIs:
- POST /storage-units [create a storage unit]
- GET /storage-units  [list storage units]

Database Schema -
CREATE TABLE storage_unit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES location(id) ON DELETE CASCADE, -- need to ensure only refs rows that are warehouse(use trigger)
    min_temperature NUMERIC NOT NULL,
    max_temperature NUMERIC NOT NULL,
    capacity NUMERIC NOT NULL CHECK (capacity > 0),
    CHECK (min_temperature <= max_temperature)
);


4. Route Service

Responsibilities -
- Define directed routes
- Enforce the constraint that only certain location pairing routes are allowed.
- Track route capacity
- Track minimum shipment requirement

Entity- 
- routes

Dependency -
- Location service (for validation)

APIs:
- POST /routes [create a route]
- GET /routes  [list routes]

Database Schema -
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_id UUID NOT NULL REFERENCES location(id) ON DELETE CASCADE, -- need to write trigger
    to_id UUID NOT NULL REFERENCES location(id) ON DELETE CASCADE,
    capacity NUMERIC NOT NULL CHECK (capacity > 0),
    min_shipment NUMERIC NOT NULL CHECK (min_shipment >= 0),
    CONSTRAINT chk_route CHECK (
        fromLocationId <> toLocationId
    )
);


5. Demand Service

Responsibilities -
- Take and store daily delivery requirements
- Check quantity constraint

Entity- 
- demands


Dependency:
- Location Service
- Product Service

APIs:
- POST /demands [create a demand]
- GET /demands  [list demand]

Database Schema -
CREATE TABLE demands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES location(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    min_quantity NUMERIC NOT NULL CHECK (min_quantity >= 0),
    max_quantity NUMERIC NOT NULL CHECK (max_quantity >= min_quantity)
);


6. Validation Service

Responsibilities -
- Check capacity violations before execution
- Check if all tasks are feasible - max and min capacity of routes, max capacity of storage units
- Check states across services
- give summary of network

Entity- 
- none


APIs:
- POST /temps/validate [temperature constraints]
- GET /network/summary  [network insight]
- POST /network/validate [capacity feasibility]


Furthermore, we think adding an optimization service might be good for the tasks.
Optimization Service (Optional):

Responsibilities -
- Priority based demand satisfaction. For example, hospital would have a better priority over retailers.
- constraint based flow optimization (flow networks can be used)
- for each demand, there will be a status enum - optimal, medium, infeasible.

Dependency:
- Demand Service
- Storage Service
- Route Service



APIs to Microservices:

We will group by apis and connect them to microservices.

Locations - Location Service
Products - Product Service
Storage Units - Storage Service
Routes - Route Service
Demands - Demand Service
Network Summary - Validation Service
Temp Validation - Validation Service
Logistics Validation - Validation Service



Database Schemas to Microservices:

Each service owns its schema exclusively. Validation service has no schema of its own.

location - Locatiob Service
product - Product Service
storage_unit - Storage Service
routes - Route Service
demands - Demand Service