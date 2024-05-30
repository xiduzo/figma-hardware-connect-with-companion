/** eslint-disable @typescript-eslint/no-unused-vars */
/** eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button, Fieldset, FormInput, Header } from "../../../components";
import { useSetWindowSize, useUid } from "../../../hooks";
import { AuthButton, ZodFormProvider, useAuth } from "../../../providers";
import { ShowToast } from "../../../types";
import { sendMessageToFigma } from "../../../utils/sendMessageToFigma";

const schema = z.object({
  uid: z
    .string()
    .min(5)
    .regex(/^[a-zA-Z-]+$/, {
      message: "Must be alphanumeric or hyphenated",
    }),
});
type FormValues = z.infer<typeof schema>;

export default function Page() {
  useSetWindowSize({ width: 300, height: 300 });

  const { user } = useAuth();
  const { setUid, uid, generateUid } = useUid();

  async function handleFormSubmit(data: FormValues) {
    await setUid(data.uid);
    sendMessageToFigma(ShowToast("Updated your identifier!"));
  }

  return (
    <>
      <Header title="Variable settings"></Header>
      <main className="flex h-60 flex-col justify-between">
        <section className="space-y-2">
          <ZodFormProvider
            schema={schema}
            disabled={!user}
            defaultValues={{ uid }}
            onValid={handleFormSubmit}
            onInvalid={console.log}
          >
            <Fieldset>
              <FormInput name="uid" label="your unique identifier" />
            </Fieldset>
            <Fieldset>
              {!user && (
                <AuthButton signInText="Sign in to customize identifier" />
              )}
              {user && <Button>Set my unique identifier</Button>}
            </Fieldset>
          </ZodFormProvider>
          <Button
            onClick={() => handleFormSubmit({ uid: generateUid() })}
            className="mt-4"
          >
            Set a random identifier
          </Button>
        </section>
      </main>
    </>
  );
}
