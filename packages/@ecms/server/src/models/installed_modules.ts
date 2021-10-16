// @generated
// Automatically generated. Don't change this file manually.

import extension_types from './extension_types';
import extension_install_sources from './extension_install_sources';

export type installed_modulesId = string & { " __flavor"?: 'installed_modules' };

/**
 * Contains an index of the modules installed by the system.
 */
export default interface installed_modules {
  /** Primary key. Index: pk_installed_modules */
  module_id: installed_modulesId;

  /** NPM Package Name. e.g  from its package.json */
  package_name: string;

  /** ENUM: dataSource or pointsSystem (see baseline setup) */
  type: extension_types;

  /** ECMS Object from package.json */
  ecmsobject: unknown;

  version: string;

  /** What was entered into npm to install the package. */
  npm_install_arg: string;

  /** Where it was installed from.
CONSTRAIN to ENUM: "git", "local" or "npm" */
  installed_from: extension_install_sources;
}

/**
 * Contains an index of the modules installed by the system.
 */
export interface installed_modulesInitializer {
  /**
   * Default value: gen_random_uuid()
   * Primary key. Index: pk_installed_modules
   */
  module_id?: installed_modulesId;

  /** NPM Package Name. e.g  from its package.json */
  package_name: string;

  /** ENUM: dataSource or pointsSystem (see baseline setup) */
  type: extension_types;

  /** ECMS Object from package.json */
  ecmsobject: unknown;

  version: string;

  /** What was entered into npm to install the package. */
  npm_install_arg: string;

  /** Where it was installed from.
CONSTRAIN to ENUM: "git", "local" or "npm" */
  installed_from: extension_install_sources;
}
