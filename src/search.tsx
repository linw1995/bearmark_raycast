import {
  List,
  ActionPanel,
  Action,
  showToast,
  useNavigation,
  Form,
  Icon,
} from "@raycast/api";
import {
  FormValidation,
  useFetch,
  useForm,
  runAppleScript,
} from "@raycast/utils";
import { useState } from "react";

import { updateBookmark, getHeaders, getAPIEndpoint, getBrowser } from "./apis";
import type { Bookmark } from "./apis";

type SearchResult = Array<Bookmark>;

export default function () {
  const { push } = useNavigation();
  const [query, setQuery] = useState("");
  const { isLoading, data, pagination } = useFetch(
    ({ lastItem }) => {
      let params = new URLSearchParams({
        limit: "20",
      });
      if (lastItem) {
        params.set("before", lastItem.id.toString());
      }
      if (query.length > 0) {
        params.set("q", query);
      }
      return getAPIEndpoint() + "/bookmarks?" + params.toString();
    },
    {
      mapResult(result: SearchResult) {
        let data = {
          data: result,
          hasMore: result.length > 0,
        };
        if (!data.hasMore) {
          showToast({
            title: "No more bookmarks",
          });
        }
        return data;
      },
      keepPreviousData: true,
      initialData: [],
      headers: getHeaders(),
    }
  );
  const browser = getBrowser();
  return (
    <List
      isLoading={isLoading}
      pagination={pagination}
      onSearchTextChange={setQuery}
      isShowingDetail
    >
      {data.map((bookmark) => (
        <List.Item
          key={bookmark.id}
          title={bookmark.title}
          keywords={bookmark.tags}
          actions={
            <ActionPanel>
              <Action icon={Icon.Globe} title={`Open In ${browser}`} onAction={
                async () => {
                  await runAppleScript(
                    `tell application "${browser}" to open location "${bookmark.url}"`,
                    []
                  );
                }
              } />
              <Action.CopyToClipboard title="Copy URL" content={bookmark.url} />
              <Action
                icon={Icon.Pencil}
                title="Edit"
                onAction={() => push(<Editor bookmark={bookmark} />)}
              />
            </ActionPanel>
          }
          detail={
            <List.Item.Detail
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label
                    title="ID"
                    text={`${bookmark.id}`}
                  />
                  <List.Item.Detail.Metadata.Label
                    title="Title"
                    text={bookmark.title}
                  />
                  <List.Item.Detail.Metadata.Link
                    title="URL"
                    target={bookmark.url}
                    text={bookmark.url}
                  />
                  <List.Item.Detail.Metadata.TagList title="Tags">
                    {bookmark.tags.map((tag) => (
                      <List.Item.Detail.Metadata.TagList.Item
                        key={tag}
                        text={tag}
                      />
                    ))}
                  </List.Item.Detail.Metadata.TagList>
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label
                    title="Created At"
                    text={new Date(bookmark.created_at).toLocaleString()}
                  />
                  <List.Item.Detail.Metadata.Label
                    title="Updated At"
                    text={new Date(bookmark.updated_at).toLocaleString()}
                  />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      ))}
    </List>
  );
}

interface BookmarkFormValues {
  title: string;
  url: string;
  tags: string;
}

function Editor({ bookmark }: { bookmark: Bookmark }) {
  const { handleSubmit, itemProps } = useForm<BookmarkFormValues>({
    async onSubmit(values) {
      let tags = values.tags.split(",").map((t) => t.trim());
      await updateBookmark(bookmark, values.title, values.url, tags);
    },
    validation: {
      title: FormValidation.Required,
      url: FormValidation.Required,
    },
    initialValues: {
      title: bookmark.title,
      url: bookmark.url,
      tags: bookmark.tags.join(", "),
    },
  });
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        title="Title"
        placeholder="Enter title"
        {...itemProps.title}
      />
      <Form.TextField title="URL" placeholder="Enter URL" {...itemProps.url} />
      <Form.TextField
        title="Tags"
        placeholder="Enter Tags"
        {...itemProps.tags}
      />
    </Form>
  );
}
