import useSWR from "swr";
import GenreCardsGrid from "../../components/genres/GenreCardsGrid";
import AsyncData from "../../components/AsyncData";
import { getAll, getById } from "../../api";
import { Flex, useBoolean } from "@chakra-ui/react";
import GenreWithSongs from "../../components/genres/GenreWithSongs";
import { useCallback, useState } from "react";
import useSWRMutation from "swr/mutation";

export default function Genres() {
  const [showSongs, setShowSongs] = useBoolean();
  const [genreSongs, setGenreSongs] = useState({});

  const { data: genres = [], isLoading, error } = useSWR("genres", getAll);
  const {
    trigger: genreSongsTrigger,
    error: genreSongsError,
    isMutating,
  } = useSWRMutation("genres", getById);

  const onCardClick = useCallback(
    async (genreId) => {
      const songs = await genreSongsTrigger(genreId);
      setGenreSongs(songs);
      setShowSongs.on();
    },
    [genreSongsTrigger, setGenreSongs, setShowSongs]
  );

  return (
    <Flex alignItems="start">
      <AsyncData loading={isLoading} error={error}>
        <GenreCardsGrid
          genres={genres}
          onCardClick={onCardClick}
          width={showSongs ? "30%" : "100%"}
          transition="width 0.3s"
        />
      </AsyncData>
      {showSongs && (
        <AsyncData loading={isMutating} error={genreSongsError}>
          <GenreWithSongs
            genreAndSongs={genreSongs}
            width="70%"
            transition="width 0.3s"
          />
        </AsyncData>
      )}
    </Flex>
  );
}
