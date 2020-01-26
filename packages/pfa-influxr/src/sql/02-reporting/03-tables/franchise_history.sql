--Tm,From,To,W,L,T,W-L%,AV,Passer,Rusher,Receiver,Coaching,Yr plyf,W plyf,L plyf,W-L%,Chmp,SBwl,Conf,Div

CREATE TABLE IF NOT EXISTS stage_pfr.franchise_history_raw (
  team_name  varchar,
  from  int,
  to    int,
  wins  int,
  losses int,
  ties  int,
  win_loss_percentage numeric,
  average_value varchar,
  passer varchar,
  rusher varchar,
  receiver varchar,
  coaching varchar,
  total_playoff_years             int NOT NULL DEFAULT 0,
	total_playoff_wins              int NOT NULL DEFAULT 0,
	total_playoff_losses            int NOT NULL DEFAULT 0,
  playoff_win_loss_percentage     numeric,
  total_league_championship_wins  int NOT NULL DEFAULT 0,
	total_superbowl_wins            int NOT NULL DEFAULT 0,
	total_conference_champions      int NOT NULL DEFAULT 0,
	total_division_champions        int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reporting.franchise_history (
  id_franchise                    bigint,
	name_full                       varchar(100),
	mascot                          varchar(50),
	active_from                     int NOT NULL,
	active_to                       int NOT NULL,
	total_wins                      int NOT NULL,
	total_losses                    int NOT NULL,
	total_ties                      int NOT NULL,
	total_playoff_years             int NOT NULL DEFAULT 0,
	total_playoff_wins              int NOT NULL DEFAULT 0,
	total_playoff_losses            int NOT NULL DEFAULT 0,
	total_league_championship_wins  int NOT NULL DEFAULT 0,
	total_superbowl_wins            int NOT NULL DEFAULT 0,
	total_conference_champions      int NOT NULL DEFAULT 0,
	total_division_champions        int NOT NULL DEFAULT 0
);