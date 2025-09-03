import SongTable from "../../components/songs/SongTable";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getAll, post } from "../../api";
import AsyncData from "../../components/AsyncData";
import { useCallback, useState } from "react";
import SongPlaylistsModal from "../../components/songs/SongPlaylistsModal";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { useAuth } from "../../contexts/Auth.context";

export default function Songs() {
  const { isAuthed } = useAuth();
  const [selectedSong, setSelectedSong] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { data: songs = [], isLoading, error } = useSWR("songs", getAll);

  const {
    data: playlists = [],
    isLoading: playlistsLoading,
    error: playlistsError,
  } = useSWR("playlists", getAll);

  const {
    trigger: addSongToPlaylistsTrigger,
    error: addSongToPlaylistsError,
    isMutating: addSongToPlaylistsMutating,
  } = useSWRMutation("playlists", post);

  const onAddToPlaylistCLick = useCallback(
    (songId) => {
      setSelectedSong(songId);
      onOpen();
    },
    [setSelectedSong, onOpen]
  );

  const handleSelectedPlaylists = useCallback(
    async (playlists) => {
      for (const playlistIds of playlists) {
        try {
          await addSongToPlaylistsTrigger({
            id: `${playlistIds}/songs`,
            songId: selectedSong,
            addedOnDate: new Date().toISOString().substring(0, 10),
          });
          addSongToPlaylistsMutating
            ? toast({
                title: "Adding song to playlist.",
                status: "loading",
                isClosable: true,
              })
            : toast({
                title: "Song added.",
                description: "View it under the playlists tab.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
        } catch (error) {
          console.log(error);
          toast({
            title: "Could not add song to a playlist.",
            status: "error",
            duration: 3000,
            isClosable: true,
            description: `${
              error.response.data.message || addSongToPlaylistsError
            }`,
          });
          continue;
        }
      }
    },
    [selectedSong, addSongToPlaylistsTrigger]
  );

  return (
    <AsyncData
      loading={isLoading || (isAuthed && playlistsLoading)}
      error={error || (isAuthed && playlistsError)}
    >
      <SongTable
        songs={songs}
        onAddToPlaylistCLick={isAuthed ? onAddToPlaylistCLick : null}
      />
      <SongPlaylistsModal
        playlists={playlists}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        handleAddToPlaylists={handleSelectedPlaylists}
      />
    </AsyncData>
  );
}
