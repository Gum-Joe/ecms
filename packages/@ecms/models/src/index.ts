// @generated
// Automatically generated. Don't change this file manually.

import competitor_additions, { competitor_additionsInitializer } from './competitor_additions';
import competitor_data, { competitor_dataInitializer, competitor_dataId } from './competitor_data';
import competitor_edits, { competitor_editsInitializer } from './competitor_edits';
import competitor_filters, { competitor_filtersInitializer, competitor_filtersId } from './competitor_filters';
import competitor_removals, { competitor_removalsInitializer } from './competitor_removals';
import competitor_settings, { competitor_settingsInitializer, competitor_settingsId } from './competitor_settings';
import competitors, { competitorsInitializer, competitorsId } from './competitors';
import data_source_keys, { data_source_keysInitializer, data_source_keysId } from './data_source_keys';
import data_sources, { data_sourcesInitializer, data_sourcesId } from './data_sources';
import data_units, { data_unitsInitializer, data_unitsId } from './data_units';
import event_only_settings, { event_only_settingsInitializer, event_only_settingsId } from './event_only_settings';
import events_and_groups, { events_and_groupsInitializer, events_and_groupsId } from './events_and_groups';
import installed_modules, { installed_modulesInitializer, installed_modulesId } from './installed_modules';
import join_competitor_events_group, { join_competitor_events_groupInitializer } from './join_competitor_events_group';
import join_events_groups_teams, { join_events_groups_teamsInitializer } from './join_events_groups_teams';
import join_restrictions_events, { join_restrictions_eventsInitializer } from './join_restrictions_events';
import join_roles_user_groups, { join_roles_user_groupsInitializer } from './join_roles_user_groups';
import join_roles_users, { join_roles_usersInitializer } from './join_roles_users';
import join_users_groups, { join_users_groupsInitializer } from './join_users_groups';
import matches, { matchesInitializer, matchesId } from './matches';
import points_settings, { points_settingsInitializer, points_settingsId } from './points_settings';
import public_dashboard_presets, { public_dashboard_presetsInitializer, public_dashboard_presetsId } from './public_dashboard_presets';
import public_dashboards, { public_dashboardsInitializer, public_dashboardsId } from './public_dashboards';
import record_group, { record_groupInitializer, record_groupId } from './record_group';
import records, { recordsInitializer, recordsId } from './records';
import restrictions, { restrictionsInitializer, restrictionsId } from './restrictions';
import roles, { rolesInitializer, rolesId } from './roles';
import store_overall_points, { store_overall_pointsInitializer, store_overall_pointsId } from './store_overall_points';
import teams, { teamsInitializer, teamsId } from './teams';
import user_groups, { user_groupsInitializer, user_groupsId } from './user_groups';
import users, { usersInitializer, usersId } from './users';
import competitor_setting_types from './competitor_setting_types';
import event_or_group from './event_or_group';
import extension_install_sources from './extension_install_sources';
import extension_types from './extension_types';
import filter_matchers from './filter_matchers';
import filter_types from './filter_types';
import login_types from './login_types';
import trackable_data from './trackable_data';

type Model =
  | competitor_additions
  | competitor_data
  | competitor_edits
  | competitor_filters
  | competitor_removals
  | competitor_settings
  | competitors
  | data_source_keys
  | data_sources
  | data_units
  | event_only_settings
  | events_and_groups
  | installed_modules
  | join_competitor_events_group
  | join_events_groups_teams
  | join_restrictions_events
  | join_roles_user_groups
  | join_roles_users
  | join_users_groups
  | matches
  | points_settings
  | public_dashboard_presets
  | public_dashboards
  | record_group
  | records
  | restrictions
  | roles
  | store_overall_points
  | teams
  | user_groups
  | users

interface ModelTypeMap {
  'competitor_additions': competitor_additions;
  'competitor_data': competitor_data;
  'competitor_edits': competitor_edits;
  'competitor_filters': competitor_filters;
  'competitor_removals': competitor_removals;
  'competitor_settings': competitor_settings;
  'competitors': competitors;
  'data_source_keys': data_source_keys;
  'data_sources': data_sources;
  'data_units': data_units;
  'event_only_settings': event_only_settings;
  'events_and_groups': events_and_groups;
  'installed_modules': installed_modules;
  'join_competitor_events_group': join_competitor_events_group;
  'join_events_groups_teams': join_events_groups_teams;
  'join_restrictions_events': join_restrictions_events;
  'join_roles_user_groups': join_roles_user_groups;
  'join_roles_users': join_roles_users;
  'join_users_groups': join_users_groups;
  'matches': matches;
  'points_settings': points_settings;
  'public_dashboard_presets': public_dashboard_presets;
  'public_dashboards': public_dashboards;
  'record_group': record_group;
  'records': records;
  'restrictions': restrictions;
  'roles': roles;
  'store_overall_points': store_overall_points;
  'teams': teams;
  'user_groups': user_groups;
  'users': users;
}

type ModelId =
  | competitor_dataId
  | competitor_filtersId
  | competitor_settingsId
  | competitorsId
  | data_source_keysId
  | data_sourcesId
  | data_unitsId
  | event_only_settingsId
  | events_and_groupsId
  | installed_modulesId
  | matchesId
  | points_settingsId
  | public_dashboard_presetsId
  | public_dashboardsId
  | record_groupId
  | recordsId
  | restrictionsId
  | rolesId
  | store_overall_pointsId
  | teamsId
  | user_groupsId
  | usersId

interface ModelIdTypeMap {
  'competitor_data': competitor_dataId;
  'competitor_filters': competitor_filtersId;
  'competitor_settings': competitor_settingsId;
  'competitors': competitorsId;
  'data_source_keys': data_source_keysId;
  'data_sources': data_sourcesId;
  'data_units': data_unitsId;
  'event_only_settings': event_only_settingsId;
  'events_and_groups': events_and_groupsId;
  'installed_modules': installed_modulesId;
  'matches': matchesId;
  'points_settings': points_settingsId;
  'public_dashboard_presets': public_dashboard_presetsId;
  'public_dashboards': public_dashboardsId;
  'record_group': record_groupId;
  'records': recordsId;
  'restrictions': restrictionsId;
  'roles': rolesId;
  'store_overall_points': store_overall_pointsId;
  'teams': teamsId;
  'user_groups': user_groupsId;
  'users': usersId;
}

type Initializer =
  | competitor_additionsInitializer
  | competitor_dataInitializer
  | competitor_editsInitializer
  | competitor_filtersInitializer
  | competitor_removalsInitializer
  | competitor_settingsInitializer
  | competitorsInitializer
  | data_source_keysInitializer
  | data_sourcesInitializer
  | data_unitsInitializer
  | event_only_settingsInitializer
  | events_and_groupsInitializer
  | installed_modulesInitializer
  | join_competitor_events_groupInitializer
  | join_events_groups_teamsInitializer
  | join_restrictions_eventsInitializer
  | join_roles_user_groupsInitializer
  | join_roles_usersInitializer
  | join_users_groupsInitializer
  | matchesInitializer
  | points_settingsInitializer
  | public_dashboard_presetsInitializer
  | public_dashboardsInitializer
  | record_groupInitializer
  | recordsInitializer
  | restrictionsInitializer
  | rolesInitializer
  | store_overall_pointsInitializer
  | teamsInitializer
  | user_groupsInitializer
  | usersInitializer

interface InitializerTypeMap {
  'competitor_additions': competitor_additionsInitializer;
  'competitor_data': competitor_dataInitializer;
  'competitor_edits': competitor_editsInitializer;
  'competitor_filters': competitor_filtersInitializer;
  'competitor_removals': competitor_removalsInitializer;
  'competitor_settings': competitor_settingsInitializer;
  'competitors': competitorsInitializer;
  'data_source_keys': data_source_keysInitializer;
  'data_sources': data_sourcesInitializer;
  'data_units': data_unitsInitializer;
  'event_only_settings': event_only_settingsInitializer;
  'events_and_groups': events_and_groupsInitializer;
  'installed_modules': installed_modulesInitializer;
  'join_competitor_events_group': join_competitor_events_groupInitializer;
  'join_events_groups_teams': join_events_groups_teamsInitializer;
  'join_restrictions_events': join_restrictions_eventsInitializer;
  'join_roles_user_groups': join_roles_user_groupsInitializer;
  'join_roles_users': join_roles_usersInitializer;
  'join_users_groups': join_users_groupsInitializer;
  'matches': matchesInitializer;
  'points_settings': points_settingsInitializer;
  'public_dashboard_presets': public_dashboard_presetsInitializer;
  'public_dashboards': public_dashboardsInitializer;
  'record_group': record_groupInitializer;
  'records': recordsInitializer;
  'restrictions': restrictionsInitializer;
  'roles': rolesInitializer;
  'store_overall_points': store_overall_pointsInitializer;
  'teams': teamsInitializer;
  'user_groups': user_groupsInitializer;
  'users': usersInitializer;
}

export type {
  competitor_additions, competitor_additionsInitializer,
  competitor_data, competitor_dataInitializer, competitor_dataId,
  competitor_edits, competitor_editsInitializer,
  competitor_filters, competitor_filtersInitializer, competitor_filtersId,
  competitor_removals, competitor_removalsInitializer,
  competitor_settings, competitor_settingsInitializer, competitor_settingsId,
  competitors, competitorsInitializer, competitorsId,
  data_source_keys, data_source_keysInitializer, data_source_keysId,
  data_sources, data_sourcesInitializer, data_sourcesId,
  data_units, data_unitsInitializer, data_unitsId,
  event_only_settings, event_only_settingsInitializer, event_only_settingsId,
  events_and_groups, events_and_groupsInitializer, events_and_groupsId,
  installed_modules, installed_modulesInitializer, installed_modulesId,
  join_competitor_events_group, join_competitor_events_groupInitializer,
  join_events_groups_teams, join_events_groups_teamsInitializer,
  join_restrictions_events, join_restrictions_eventsInitializer,
  join_roles_user_groups, join_roles_user_groupsInitializer,
  join_roles_users, join_roles_usersInitializer,
  join_users_groups, join_users_groupsInitializer,
  matches, matchesInitializer, matchesId,
  points_settings, points_settingsInitializer, points_settingsId,
  public_dashboard_presets, public_dashboard_presetsInitializer, public_dashboard_presetsId,
  public_dashboards, public_dashboardsInitializer, public_dashboardsId,
  record_group, record_groupInitializer, record_groupId,
  records, recordsInitializer, recordsId,
  restrictions, restrictionsInitializer, restrictionsId,
  roles, rolesInitializer, rolesId,
  store_overall_points, store_overall_pointsInitializer, store_overall_pointsId,
  teams, teamsInitializer, teamsId,
  user_groups, user_groupsInitializer, user_groupsId,
  users, usersInitializer, usersId,
  competitor_setting_types,
  event_or_group,
  extension_install_sources,
  extension_types,
  filter_matchers,
  filter_types,
  login_types,
  trackable_data,

  Model,
  ModelTypeMap,
  ModelId,
  ModelIdTypeMap,
  Initializer,
  InitializerTypeMap
};
