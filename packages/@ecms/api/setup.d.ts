/**
 * APIs for the setup process
 */
import { competitorsInitializer, competitor_filtersInitializer, competitor_settingsInitializer, data_unitsInitializer, events_and_groupsInitializer, event_only_settingsInitializer, points_settingsInitializer, public_dashboardsInitializer, restrictionsInitializer, teamsInitializer, join_roles_user_groups, join_roles_usersInitializer } from "@ecms/models";
/**
 * Exclude properties ending with _id
 */
declare type OmitIDKeys<T> = Omit<T, `${string}_id`>;
/**
 * Base of settings for setting up competitors
 */
declare type BaseSetupCompetitor = Omit<competitor_settingsInitializer, "competitor_settings_id">;
interface SetupNewRecordGroup {
    name: string;
}
interface SetupUseOldRecordGroup {
    record_group_id: string;
}
/**
 * Specifies what needs to be specified when creating a new record store
 * Unit ID is inferred from unit settings, and current record holder entered with placeholder infomation
 */
interface SetupNewRecord<T extends "new" | "old"> {
    type: "createNew";
    record_name: string;
    record_group_target?: T;
    record_group?: T extends "new" ? SetupNewRecordGroup : SetupUseOldRecordGroup;
}
interface SetupUseOldRecord {
    /** The ID of the record store in the DB to link to */
    record_id: string;
    type: "createOld";
}
/**
 * Competitors defined by filtering from a parent group
 */
interface FilterCompetitors extends BaseSetupCompetitor {
    type: "filter_parent";
    filters: OmitIDKeys<competitor_filtersInitializer>[];
}
/**
 * Competitors defined by import
 */
interface ImportCompetitors extends BaseSetupCompetitor {
    type: "discrete";
    competitor_import_id: string;
}
/**
 * Competitor defined by explicitly listing them
 */
interface ExplicitCompetitorList extends BaseSetupCompetitor {
    type: "discrete";
    set_competitors: Array<Omit<OmitIDKeys<competitorsInitializer>, "id"> & {
        data: Record<string, any>;
        /** Index of team in the teams array - see {@link SetupEventOrGroup.teams} */
        team: number;
    }>;
}
/**
 * Represents a event or group currently being setup.
 * This is what is passed to the createSetup API route, and stored in the redis DB during setup
 */
export default interface SetupEventOrGroup extends Omit<events_and_groupsInitializer, "event_group_id" | `${string}_settings_id` | "public_dashboard_id" | "complete" | "archived"> {
    /**
     * Event ONLY settings
     */
    event_settings?: Omit<OmitIDKeys<event_only_settingsInitializer>, "record_store"> & {
        /** Define information about the Units for data IF data_tracked is "individual" (see {@link event_only_settingsInitializer.data_tracked}) */
        unit?: OmitIDKeys<data_unitsInitializer>;
        /** Define a record store IF we are linking to one OR createing one for this event */
        record_store?: SetupNewRecord<"new" | "old"> | SetupUseOldRecord;
    };
    /**
     * Teams to create in the event/group IF enable_teams is true
     */
    teams?: OmitIDKeys<teamsInitializer>[];
    /**
     * Matches to create between teams IF enable_teams is true AND event_settings.data_tracked is "matches".
     */
    matches?: {
        /** value of this propertry here is the index in the teams array */
        team_1: number;
        /** value of this propertry here is the index in the teams array */
        team_2: number;
    };
    /** Define the point system for this event/group */
    points?: Omit<points_settingsInitializer, "points_settings_id">;
    /**
     * Define an (optional) event dashboards to create for this event/group
     */
    dashboard?: Omit<public_dashboardsInitializer, "public_dashboard_id">;
    /**
     * Settings for competitors in this event/group, IF we are adding them
     */
    competitor_settings?: FilterCompetitors | ImportCompetitors | ExplicitCompetitorList;
    /**
     * Groups ONLY setting: setup any restrictions on competitors and how manu sub-events they can take part in
     */
    restrictions?: Array<OmitIDKeys<restrictionsInitializer> & {
        /** UUID of events (the key {@link events_and_groups.event_group_id}) that the restriction applies to */
        event_id: string[];
    }>;
    /** RBAC role access restrictions for group and individuals */
    access?: {
        groups: Omit<join_roles_user_groups, "param">[];
        users: Omit<join_roles_usersInitializer, "param">[];
    };
}
export {};
//# sourceMappingURL=setup.d.ts.map