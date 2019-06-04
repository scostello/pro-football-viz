CREATE TABLE IF NOT EXISTS reporting.schedule (
    id_game     bigint,
    season      integer,
    week        integer,
    day         varchar(3),
    date        date,
    visitor     varchar(3),
    home        varchar(3),
    stadium     varchar(50),
    surface     varchar(25)
);