import { TOPIC_PREFIX } from "../constants";
import { useLocalStorage } from "../hooks";
import { LOCAL_STORAGE_KEYS } from "../types";
import { cuid } from "../utils/cuid";

export function useUid() {
  const [uid, setUid] = useLocalStorage<string>(LOCAL_STORAGE_KEYS.TOPIC_UID, {
    initialValue: generateUid(),
  });

  function createTopic(id: string, type: 'get' | 'set' = 'set') {
    if (!uid) {
      return;
    }

    return `${TOPIC_PREFIX}/${uid}/${id}/${type}`;
  }

  function generateUid() {
    return cuid();
  }

  return { createTopic, generateUid, uid, setUid };
}
