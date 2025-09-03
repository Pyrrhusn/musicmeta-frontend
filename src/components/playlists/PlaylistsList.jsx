import {
  UnorderedList,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import PlaylistsListItem from "./PlaylistsListItem";

export default function PlaylistsList({
  playlists,
  onPlaylistClick,
  handlePlaylistEdit: {
    savePlaylist,
    savePlaylistError,
    savePlaylistMutating: isMutating,
  },
  handlePlaylistDelte: {
    deletePlaylist,
    deletePlaylistError,
    deletePlaylistMutating,
  },
}) {
  const [toDeletePlaylistId, setToDeletePlaylistId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleAlertDialogOpen = useCallback(
    (playlistId) => {
      setToDeletePlaylistId(playlistId);
      onOpen();
    },
    [onOpen, setToDeletePlaylistId]
  );

  const handlePlaylistDelete = useCallback(async () => {
    try {
      await deletePlaylist(toDeletePlaylistId);
      onClose();
    } catch (error) {
      console.log(error);
    }
  }, [deletePlaylist, toDeletePlaylistId, onClose]);

  return (
    <Box width="100%" overflow="hidden">
      <UnorderedList
        display="flex"
        flexDirection="column"
        height="20vh"
        overflowX="scroll"
        overflowY="hidden"
        flexWrap="wrap"
        styleType="'•  '"
        pl={4}
        pr={4}
        alignContent="flex-start"
        alignItems="center"
      >
        {playlists.map((playlist) => {
          return (
            <PlaylistsListItem
              key={playlist.playlistId}
              {...playlist}
              onPlaylistClick={onPlaylistClick}
              handleAlertDialogOpen={handleAlertDialogOpen}
              savePlaylist={savePlaylist}
              savePlaylistError={savePlaylistError}
              isMutating={isMutating}
            />
          );
        })}
      </UnorderedList>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Playlist?
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              isDisabled={deletePlaylistMutating}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handlePlaylistDelete}
              ml={3}
              isDisabled={deletePlaylistMutating}
              isLoading={deletePlaylistMutating}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
