/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect } from "react";
import { SetUiOptions } from "../types";
import { sendMessageToFigma } from "../utils";

export function useSetWindowSize(
  options: Pick<ShowUIOptions, "height" | "width">,
) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    sendMessageToFigma(SetUiOptions(options));
  }, [options]);
}
