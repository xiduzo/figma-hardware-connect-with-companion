import { useLocalStorage } from "../hooks";
import { LOCAL_STORAGE_KEYS } from "../types";
import { cuid } from "../utils/cuid";

export function useVariableId() {
  const [uid] = useLocalStorage(LOCAL_STORAGE_KEYS.TOPIC_UID, {
    initialValue: cuid(),
  });

  function createTopic(id: string) {
    return `fhc/${uid ?? cuid()}/${id}`;
  }

  return { createTopic };
}
