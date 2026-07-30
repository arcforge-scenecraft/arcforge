/*useCharacters.js is responsible for fetching all characters belonging to a project using only projectId. It is used by the Project Detail and Character Roster pages.*/

import { useCallback, useEffect, useState } from "react";

import { getCharacters } from "../../services/characterApi";

const useCharacters = (projectId) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadCharacters = async () => {
      try {
        setLoading(true);
        setError("");

        const characterData = await getCharacters(projectId);

        if (isActive) {
          setCharacters(Array.isArray(characterData) ? characterData : []);
        }
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        console.error("Failed to load project characters:", loadError);

        setCharacters([]);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project characters.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadCharacters();

    return () => {
      isActive = false;
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
