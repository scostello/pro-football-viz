CREATE TABLE IF NOT EXISTS reporting.twitter (
  tweet_id          integer,
  twitter_handle    varchar,
  first_name        varchar,
  last_name         varchar,
  player            bigint,
  created_at        date,
  tweet_text        varchar,
  source            varchar,
  times_favorited   integer,
  times_retweeted   integer
);

  tweet_id, twitter_handle, first_name, last_name, player, created_at, tweet_text, source, times_favorited, times_retweeted