import React from "react";
import { Icon } from "./Icon";

export function TypeIcon({ resolvedType }: Pick<Variable, "resolvedType">) {
  switch (resolvedType) {
    case "COLOR":
      return <Icon icon="SwatchIcon" />;
    case "BOOLEAN":
      return <Icon icon="StopCircleIcon" />;
    case "FLOAT":
      return <Icon icon="HashtagIcon" />;
    case "STRING":
      return <Icon icon="LanguageIcon" />;
    default:
      return <Icon icon="QuestionMarkCircleIcon" />;
  }
}
