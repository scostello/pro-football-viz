CREATE TABLE IF NOT EXISTS armchair_analysis.twitter (
  tweet_id          integer,
  twitter_handle    varchar,
  first_name        varchar,
  last_name         varchar,
  player            varchar(7),
  created_at        varchar,
  tweet_text        varchar,
  source            varchar,
  times_favorited   integer,
  times_retweeted   integer
);

COPY twitter
FROM '/tmp/nfl_00-18/TWITTER.csv' DELIMITER ',' CSV HEADER;