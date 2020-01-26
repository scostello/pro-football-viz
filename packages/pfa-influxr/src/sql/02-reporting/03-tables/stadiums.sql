CREATE TABLE IF NOT EXISTS reporting.stadiums (
  id_stadium            bigint PRIMARY KEY DEFAULT public.id_generator() NOT NULL,
	stadium_name          varchar(100),
	capacity			        int,
	year_opened			      int,
	google_location       jsonb,
	street1               varchar(100),
	street2               varchar(100),
	city                  varchar(100),
	state                 varchar(100),
	zipcode               varchar(12),
	county_fips	          int,
	longitude             numeric,
	latitude              numeric,
	geo                   public.GEOGRAPHY(Point, 4326)
);