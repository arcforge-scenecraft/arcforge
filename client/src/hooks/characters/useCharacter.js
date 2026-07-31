/*useCharacter.js is responsible for fetching one specific character using both projectId and characterId. It is used by the Character Detail and Edit Character pages.*/

import { useEffect, useState } from "react";

import { getCharacter } from "../../services/characterApi";

function useCharacter(projectId, characterId) {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        setCharacter(null);

        const data = await getCharacter(projectId, characterId);

        if (isMounted) {
          setCharacter(data || null);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        if (err.message === "Character not found.") {
          setCharacter(null);
          setNotFound(true);
          setError("");
          return;
        }

        console.error("Failed to load character:", err);

        setCharacter(null);
        setNotFound(false);
        setError(
          err instanceof Error ? err.message : "Unable to load this character.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCharacter();

    return () => {
      isMounted = false;
    };
  }, [projectId, characterId, retryCount]);

  const retry = () => {
    setRetryCount((currentCount) => currentCount + 1);
  };

  return {
    character,
    loading,
    error,
    notFound,
    retry,
  };
}

export default useCharacter;
