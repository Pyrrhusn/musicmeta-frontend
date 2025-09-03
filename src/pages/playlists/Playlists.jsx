import PlaylistsList from "../../components/playlists/PlaylistsList";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { deleteById, getAll, getById, save, post } from "../../api";
import AsyncData from "../../components/AsyncData";
import { useCallback, useState } from "react";
import {
  HStack,
  Heading,
  Spacer,
  Box,
  Center,
  Text,
  Card,
  CardBody,
  VStack,
} from "@chakra-ui/react";
import AddPlaylistModal from "../../components/playlists/AddPlaylistModal";
import SongTable from "../../components/songs/SongTable";

export default function Playlists() {
  const [playlistSongs, setPlaylistSongs] = useState(null);

  const {
    data: playlists = [],
    isLoading: playlistsLoading,
    error: playlistsError,
  } = useSWR("playlists", getAll);

  const {
    trigger: playlistSongsTrigger,
    error: playlistSongsError,
    isMutating,
  } = useSWRMutation("playlists", getById);

  const {
    trigger: savePlaylist,
    error: savePlaylistError,
    isMutating: savePlaylistMutating,
  } = useSWRMutation("playlists", save);

  const {
    trigger: deletePlaylist,
    error: deletePlaylistError,
    isMutating: deletePlaylistMutating,
  } = useSWRMutation("playlists", deleteById);

  const {
    trigger: addPlaylist,
    error: addPlaylistError,
    isMutating: addPlaylistMutating,
  } = useSWRMutation("playlists", post);

  const {
    trigger: deletePlaylistSong,
    error: deletePlaylistSongError,
    isMutating: deletePlaylistSongMutating,
  } = useSWRMutation("playlists", deleteById);

  const onPlaylistClick = useCallback(
    async (playlistId) => {
      const playlistWithSongs = await playlistSongsTrigger(playlistId);
      setPlaylistSongs(playlistWithSongs);
    },
    [playlistSongsTrigger, setPlaylistSongs]
  );

  const onDeleteInPlaylist = useCallback(
    async (songId) => {
      await deletePlaylistSong(`${playlistSongs.playlistId}/songs/${songId}`);
      setPlaylistSongs((prevPlaylistSongs) => ({
        ...prevPlaylistSongs,
        songs: prevPlaylistSongs.songs.filter((s) => s.songId !== songId),
      }));
    },
    [playlistSongs, deletePlaylistSong, setPlaylistSongs]
  );

  return (
    <Box width="100vw" overflow="hidden">
      <HStack p={4} pb={2}>
        <Heading as="h1" ml={6} size="xl">
          All playlists
        </Heading>
        <Spacer />
        <AddPlaylistModal
          addPlaylist={addPlaylist}
          addPlaylistError={addPlaylistError}
          isMutating={addPlaylistMutating}
        />
      </HStack>
      <AsyncData loading={playlistsLoading} error={playlistsError}>
        <PlaylistsList
          playlists={playlists}
          onPlaylistClick={onPlaylistClick}
          // where should handlers be defined in parent (page) or component itself --best practice??
          // these used to be defined in the components, useful for encapsulation but not reusability
          // this way there were less render updates, perhaps there's a performance impact??
          handlePlaylistEdit={{
            savePlaylist,
            savePlaylistError,
            savePlaylistMutating,
          }}
          handlePlaylistDelte={{
            deletePlaylist,
            deletePlaylistError,
            deletePlaylistMutating,
          }}
        />
      </AsyncData>
      <Heading as="h1" ml={10} mt={4} size="xl">
        Songs in playlist
      </Heading>
      {playlistSongs ? (
        <AsyncData loading={isMutating} error={playlistSongsError}>
          <Center mt={6}>
            <VStack alignItems="stretch" width="95%">
              <Card mb={2} variant="filled">
                <CardBody textAlign="center">
                  <Text as="b" fontSize="2xl" mb={2}>
                    {playlistSongs.name}
                  </Text>
                  <Text fontSize="lg">
                    Created on:{" "}
                    {new Date(playlistSongs.creationDate)
                      .toISOString()
                      .substring(0, 10)}
                  </Text>
                </CardBody>
              </Card>
              <SongTable
                songs={playlistSongs.songs}
                inPlaylist={true}
                onDeleteInPlaylist={onDeleteInPlaylist}
              />
            </VStack>
          </Center>
        </AsyncData>
      ) : (
        <Text fontSize="lg" ml={10} mt={4}>
          Select a playlist above.
        </Text>
      )}
    </Box>
  );
}
