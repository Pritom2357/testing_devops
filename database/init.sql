CREATE TABLE location (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('PRODUCER', 'WAREHOUSE', 'RETAILER', 'HOSPITAL')),
    city TEXT NOT NULL
);

CREATE TABLE product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    min_temperature NUMERIC NOT NULL,
    max_temperature NUMERIC NOT NULL,
    CHECK (min_temperature <= max_temperature)
);

CREATE TABLE storage_unit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES location(id) ON DELETE CASCADE, -- need to ensure only refs rows that are warehouse(use trigger)
    min_temperature NUMERIC NOT NULL,
    max_temperature NUMERIC NOT NULL,
    capacity NUMERIC NOT NULL CHECK (capacity > 0),
    CHECK (min_temperature <= max_temperature)
);

CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_id UUID NOT NULL REFERENCES location(id) ON DELETE CASCADE,
    to_id UUID NOT NULL REFERENCES location(id) ON DELETE CASCADE,
    capacity NUMERIC NOT NULL CHECK (capacity > 0),
    min_shipment NUMERIC NOT NULL CHECK (min_shipment >= 0),
    CONSTRAINT chk_route CHECK (from_id <> to_id)
);



CREATE TABLE demands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES location(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    min_quantity NUMERIC NOT NULL CHECK (min_quantity >= 0),
    max_quantity NUMERIC NOT NULL CHECK (max_quantity >= min_quantity)
);

-- Trigger: Ensure storage_unit.location_id only references WAREHOUSE locations
CREATE OR REPLACE FUNCTION check_storage_unit_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM location 
        WHERE id = NEW.location_id AND type = 'WAREHOUSE'
    ) THEN
        RAISE EXCEPTION 'storage_unit.location_id must reference a location of type WAREHOUSE';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_storage_unit_location_check
BEFORE INSERT OR UPDATE ON storage_unit
FOR EACH ROW
EXECUTE FUNCTION check_storage_unit_location();


CREATE OR REPLACE FUNCTION check_route_locations()
RETURNS TRIGGER AS $$
DECLARE
    from_type TEXT;
    to_type TEXT;
BEGIN
    SELECT type INTO from_type FROM location WHERE id = NEW.from_id;
    SELECT type INTO to_type FROM location WHERE id = NEW.to_id;

    IF from_type = 'PRODUCER' AND to_type = 'WAREHOUSE' THEN
        RETURN NEW;
    ELSIF from_type = 'WAREHOUSE' AND to_type IN ('RETAILER', 'HOSPITAL') THEN
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'Invalid route: % -> % is not allowed. Valid routes: PRODUCER->WAREHOUSE or WAREHOUSE->RETAILER/HOSPITAL',
            from_type, to_type;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_route_locations_check
BEFORE INSERT OR UPDATE ON routes
FOR EACH ROW
EXECUTE FUNCTION check_route_locations();