-- gid,seas,wk,day,date,v,h,stad,surf

CREATE TABLE IF NOT EXISTS armchair_analysis.schedule (
    game_id     integer,
    season      integer,
    week        integer,
    day         varchar(3),
    date        date,
    visitor     varchar(3),
    home        varchar(3),
    stadium     varchar(50),
    surface     varchar(25)
);

COPY schedule
FROM '/tmp/nfl_00-18/SCHEDULE.csv' DELIMITER ',' CSV HEADER;