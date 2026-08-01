import { useCallback, useEffect, useState } from "react";
import { getCharacters } from "../../services/characterApi";

const useCharacters = (projectId) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!projectId) {
      setCharacters([]);
      setError("");
      setLoading(true);
      return undefined;
    }

    const controller = new AbortController();

    const loadCharacters = async () => {
      try {
        setLoading(true);
        setError("");

        const characterData = await getCharacters(projectId, {
          signal: controller.signal,
        });

        setCharacters(Array.isArray(characterData) ? characterData : []);
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        setCharacters([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project characters.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCharacters();

    return () => {
      controller.abort();
    };
  }, [projectId, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((currentCount) => currentCount + 1);
  }, []);

  // Lets pages drop a deleted character without refetching the whole list.
  const removeCharacter = useCallback((characterId) => {
    setCharacters((currentCharacters) =>
      currentCharacters.filter(
        (character) => String(character.id) !== String(characterId),
      ),
    );
  }, []);

  return {
    characters,
    loading,
    error,
    retry,
    removeCharacter,
  };
};

export default useCharacters;
