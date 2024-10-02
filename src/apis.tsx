import { Toast, showToast, showHUD, PopToRootType } from "@raycast/api";
import { getPreferenceValues } from "@raycast/api";

import fetch from "node-fetch";

export type Bookmark = {
  id: number;
  title: string;
  url: string;
  tags: Array<string>;
  created_at: string;
  updated_at: string;
};

export function getBrowser(): string {
  let preferences = getPreferenceValues<Preferences>();
  return preferences.BROWSER;
}

export function getAPIEndpoint(): string {
  let preferences = getPreferenceValues<Preferences>();
  return preferences.API_ENDPOINT;
}

export function getHeaders(): Record<string, string> {
  let preferences = getPreferenceValues<Preferences>();
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (preferences.API_KEY) {
    headers["Authorization"] = preferences.API_KEY;
  }
  return headers;
}

export async function createBookmark(
  title: string,
  url: string,
  tags: Array<string>
) {
  let resp = await fetch(getAPIEndpoint() + "/bookmarks", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      title: title,
      url: url,
      tags: tags,
    }),
  });
  if (resp.status == 200) {
    showHUD(`bookmarked successfully!`, {
      clearRootSearch: true,
      popToRootType: PopToRootType.Immediate,
    });
  } else {
    let text = await resp.text();
    showToast({
      style: Toast.Style.Failure,
      title: "Failed!",
      message: `Failed to bookmark, code: ${resp.status}, resp: ${text}`,
    });
  }
}

export async function updateBookmark(
  bookmark: Bookmark,
  title: string,
  url: string,
  tags: Array<string>
) {
  let payload = {};
  if (bookmark.title != title) {
    payload = { ...payload, title: title };
  }
  if (bookmark.url != url) {
    payload = { ...payload, url: url };
  }
  // compared in unique set
  if (new Set(bookmark.tags) != new Set(tags)) {
    payload = { ...payload, tags: tags };
  }
  let resp = await fetch(`${getAPIEndpoint()}/bookmarks/${bookmark.id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (resp.status == 200) {
    showHUD(`Update bookmark successfully!`, {
      clearRootSearch: true,
      popToRootType: PopToRootType.Immediate,
    });
  } else {
    let text = await resp.text();
    showToast({
      style: Toast.Style.Failure,
      title: "Failed!",
      message: `Failed to update bookmark, code: ${resp.status}, resp: ${text}`,
    });
  }
}
