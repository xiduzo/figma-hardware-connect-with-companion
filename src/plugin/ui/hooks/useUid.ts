import { useLocalStorage } from "../hooks";
import { LOCAL_STORAGE_KEYS } from "../types";
import { cuid } from "../utils/cuid";

export function useUid() {
  const [uid, setUid] = useLocalStorage(LOCAL_STORAGE_KEYS.TOPIC_UID, {
    initialValue: cuid(),
  });

  function createTopic(id: string) {
    return `fhc/${uid ?? cuid()}/${id}`;
  }

  function generateUid() {
    return cuid();
  }

  return { createTopic, generateUid, uid, setUid };
}
