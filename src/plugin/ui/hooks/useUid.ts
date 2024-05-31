/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLocalStorage } from "../hooks";
import { LOCAL_STORAGE_KEYS } from "../types";
import { cuid } from "../utils/cuid";

export function useUid() {
  const [uid, setUid] = useLocalStorage<string>(LOCAL_STORAGE_KEYS.TOPIC_UID, {
    initialValue: generateUid(),
  });

  function createTopic(id: string) {
    if (!uid) {
      return;
    }

    return `fhc/${uid}/${id}`;
  }

  function generateUid() {
    return cuid();
  }

  return { createTopic, generateUid, uid, setUid };
}
