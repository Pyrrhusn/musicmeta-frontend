import {
  Flex,
  ListItem,
  Box,
  Text,
  HStack,
  IconButton,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { ChevronRightIcon, DeleteIcon } from "@chakra-ui/icons";
import PlaylistPopoverEdit from "./PlaylistPopoverEdit";

export default function PlaylistsListItem({
  playlistId,
  ownerId,
  name,
  creationDate,
  songCount,
  onPlaylistClick,
  handleAlertDialogOpen,
  savePlaylist,
  savePlaylistError,
  isMutating,
}) {
  const handlePlaylistClick = useCallback(() => {
    onPlaylistClick(playlistId);
  }, [onPlaylistClick, playlistId]);

  const handleAlertDialogOpenFromListItem = useCallback(
    (event) => {
      event.stopPropagation();
      handleAlertDialogOpen(playlistId);
    },
    [playlistId, handleAlertDialogOpen]
  );

  return (
    <ListItem
      cursor="pointer"
      key={playlistId}
      onClick={handlePlaylistClick}
      m={2}
      width="max-content"
      mr={8}
    >
      <Box
        alignItems="center"
        _hover={{
          bgColor: useColorModeValue("blackAlpha.300", "whiteAlpha.300"),
        }}
        borderRadius={6}
        bgColor={useColorModeValue("blackAlpha.200", "whiteAlpha.100")}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          pt={2}
          pb={2}
          pl={4}
          pr={4}
          gap={12}
        >
          <Box>
            <Text fontSize="lg" as="b">
              {name}
            </Text>
            <Text>
              Created on: {new Date(creationDate).toLocaleDateString()}
            </Text>
          </Box>
          <HStack gap={2}>
            <PlaylistPopoverEdit
              initialName={name}
              playlistId={playlistId}
              savePlaylist={savePlaylist}
              savePlaylistError={savePlaylistError}
              isMutating={isMutating}
            />
            <IconButton
              aria-label="Delete playlist"
              icon={<DeleteIcon />}
              onClick={handleAlertDialogOpenFromListItem}
            />
          </HStack>
          <HStack gap={6}>
            <Text fontSize="lg" as="b">
              Total Songs: {songCount}
            </Text>
            <ChevronRightIcon boxSize={6} />
          </HStack>
        </Flex>
      </Box>
      <Spacer />
    </ListItem>
  );
}
