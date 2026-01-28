This is the schema designed to support all the APIs required for implementation.

Locations ->

Locations table stores all locations in the network. Each location has a unique identifier, name, type and a city. The type of a location can only be one of four values: Producer, Warehouse, Retailer, or Hospital.

- Primary Key: id (UUID)
- Attributes: name (text), type (restricted to the four allowed values), city (text)

- Relationships:
- Storage Units are linked to Locations through location_id.
- Routes reference Locations as both the origin (from_location_id) and destination (to_location_id).
- Demands reference Locations through location_id.



Products ->

The Products table stores all items that can be transported or stored. Each product has a unique identifier, a name, and a defined temperature range.

- Primary Key: id (UUID)
- Attributes: name (text), minimum temperature (numeric), maximum temperature (numeric, must be greater than or equal to the minimum)

- Relationships:
- Demands reference Products through product_id.

- Constraints:
- min temp <= maxtemp


Storage Units ->

Each storage unit belongs to a warehouse location and has its own temperature range and maximum capacity.

- Primary Key: id (UUID)
- Attributes: location_id (foreign key referencing Locations), minimum temperature, maximum temperature, capacity (numeric, must be positive)

- Relationships:
- Each storage unit is linked to a warehouse location.

- Constraints:
- min temp <= max temp
- capacity must be positive
- the location_id it refers to must be a id to a warehouse.


Routes ->

The Routes table is a relation between two locations. Each route has a maximum capacity and a minimum shipment requirement.

- Primary Key: id (UUID)
- Attributes: from_id (foreign key referencing Locations), to_id (foreign key referencing Locations), capacity (numeric, must be positive), minimum shipment (numeric, must be non‑negative)

- Relationships:
- Routes connect producers to warehouses, and warehouses to retailers or hospitals.

- Constraints:
- capacity must be positive
- minimum shipment must be non negative
- from_id should refer to a location of type producer or warehouse only. If from_id is producer, to_id must refer to warehouse. If from_id refers to a warehouse id, to_id should refer to either a hospital_id or a retailer_id.


Demands ->

The Demands table records delivery commitments for products at specific locations and dates. Each demand specifies the minimum and maximum quantity required.
- Primary Key: id (UUID)
- Attributes: location_id (foreign key referencing Locations), product_id (foreign key referencing Products), date (date field), minimum quantity (numeric, non‑negative), maximum quantity (numeric, must be greater than or equal to the minimum)

- Relationships:
- Each demand is linked to both a location and a product.

- Constraints:
- minimum quantity must be smallan than maximum quantity
- minimum quantity should be non negative.
