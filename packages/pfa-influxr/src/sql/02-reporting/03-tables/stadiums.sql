CREATE TABLE IF NOT EXISTS reporting.stadiums (
  id_stadium          bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
  google_location     jsonb,
	name                varchar(50),
	location_address1   varchar(100)
	location_address2   varchar(100)
	location_city       varchar(50),
	location_state      varchar(50),
	location_zipcode    varchar(12),
	location_longitude  numeric,
	location_latitude   numeric,
	location_geo        public.GEOGRAPHY(Point, 4326)
);