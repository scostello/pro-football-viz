CREATE TABLE IF NOT EXISTS stage_pfr.scrape_jobs (
  id 				    SERIAL PRIMARY KEY NOT NULL,
	job_name		  varchar(100),
	status			  varchar(50) DEFAULT 'IDLE',
	css_selector	varchar(100),
	as_xml			  xml,
	as_json			  jsonb,
	created_at		timestamptz NOT NULL DEFAULT NOW(),
	updated_at		timestamptz
);