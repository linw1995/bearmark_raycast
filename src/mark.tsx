import { Action, ActionPanel, Form } from "@raycast/api";
import {
  usePromise,
  runAppleScript,
  useForm,
  FormValidation,
} from "@raycast/utils";
import { createBookmark } from "./apis";

interface CreateBookmarkFormValues {
  title: string;
  url: string;
  tags: string;
}

export default function () {
  const { handleSubmit, itemProps, setValue } =
    useForm<CreateBookmarkFormValues>({
      async onSubmit(values) {
        let tags = values.tags.split(",").map((t) => t.trim());
        await createBookmark(values.title, values.url, tags);
      },
      validation: {
        title: FormValidation.Required,
        url: FormValidation.Required,
      },
    });

  const { isLoading } = usePromise(async () => {
    const url = await runAppleScript(
      `tell application "Safari" to return URL of current tab of front window`,
      []
    );
    const title = await runAppleScript(
      `tell application "Safari" to return name of current tab of front window`,
      []
    );
    setValue("url", url);
    setValue("title", title);
  });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Bookmark" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        title="Title"
        placeholder="Enter title"
        {...itemProps.title}
      />
      <Form.TextField title="URL" placeholder="Enter URL" {...itemProps.url} />
      <Form.TextField title="Tags" {...itemProps.tags} />
    </Form>
  );
}
