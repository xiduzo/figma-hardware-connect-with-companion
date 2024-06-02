/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect } from "react";
import { SetUiOptions } from "../types";
import { sendMessageToFigma } from "../utils";

export function useSetWindowSize(
  options: Pick<ShowUIOptions, "height" | "width">,
) {
  useEffect(() => {
    sendMessageToFigma(SetUiOptions(options));
  }, [options]);
}
