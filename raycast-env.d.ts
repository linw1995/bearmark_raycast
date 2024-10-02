/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** API Endpoint - the bearmark API endpoint */
  "API_ENDPOINT": string,
  /** API Key - the bearmark API key */
  "API_KEY"?: string,
  /** Broswer - The default browser name */
  "BROWSER": "Safari" | "Google Chrome"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `mark` command */
  export type Mark = ExtensionPreferences & {}
  /** Preferences accessible in the `search` command */
  export type Search = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `mark` command */
  export type Mark = {}
  /** Arguments passed to the `search` command */
  export type Search = {}
}


