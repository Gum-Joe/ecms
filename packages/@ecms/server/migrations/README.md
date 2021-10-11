# SQL Setup Script
These scripts setup the ECMS Database using SQL Script and Knex to manage provisions.

The scripts are written for PostgresSQL

## Why so many scripts?
Due to the complexity of the database structure (see ERD.png and ERD_REARRANGED.png in this folder), there are many foreign keys in many different tables and a table can only be made once the tables its foreign keys reference are created.

So, using the ERD I figured out which tables need to made first (ERD_REARRANGED.png is when I rearranged ERD.png to help with this, with tables with no foreign keys on the outside generally).

The order decided was:
0.	Baseline setup – create ENUM types and ensure Postgres extensions ECMS needs (like ltree for roles) are present
1.	Create user, user groups and roles table – logical to start as it can star by itself
2.	Create installed_modules table – also represents a distinct part of the system
3.	Create the tables related to records (such as the records tables)
a.	This involved creating data_units and record_group first as the records table refers to these
4.	Create the public dashboard table as this itself is a separate part of the system as well
5.	Create teams table, so we could create:
b.	Competitor tables
c.	Points tables
d.	(matches can’t yet be made as they depend on events_and_groups)
6.	The event_only_settings, as event_and_groups refers to this
7.	Event_and_groups itself
8.	Matches (depends on event_and_groups)
9.	Restrictions (depends on event_and_groups)
10.	Data sources  (depends on event_and_groups)
11.	All the join tables to finish it off and tie everything together
