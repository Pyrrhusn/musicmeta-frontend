import {
  Tr,
  Td,
  Image,
  Box,
  Text,
  HStack,
  Link as ChakraLink,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import GenreRowData from "../genres/GenreRowData";
import { memo, useCallback } from "react";
import { DeleteIcon, StarIcon, AddIcon, EditIcon } from "@chakra-ui/icons";
import { useAuth } from "../../contexts/Auth.context";

export default memo(function SongTableItem({
  songId,
  artistId,
  title,
  artist: { username },
  length,
  releaseDate,
  artLocation,
  genres,
  onDeleteInPlaylist = null,
  onAddToPlaylistCLick = null,
  usersRating = null,
  addedOnDate = null,
  isEditable = false,
  handleSongDelete = null,
}) {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();

  const handleDeleteInPlaylist = useCallback(async () => {
    await onDeleteInPlaylist(songId);
  }, [onDeleteInPlaylist]);

  const handleAddToPlaylist = useCallback(() => {
    onAddToPlaylistCLick(songId);
  }, [onAddToPlaylistCLick, songId]);

  const handleEditSong = useCallback(() => {
    navigate(`/songs/edit/${songId}`);
  }, [navigate, songId]);

  const onSongDelete = useCallback(async () => {
    await handleSongDelete(songId);
  }, [handleSongDelete, songId]);

  return (
    <Tr>
      <Td>
        <HStack spacing={4}>
          <Image
            borderRadius="8px"
            boxSize="50px"
            src={artLocation}
            alt="default song cover art"
            fallbackSrc="/fallbackArt.svg"
            border="2px"
            borderColor="gray.500"
          />
          <Box>
            <Text as="b">{title}</Text>
            <Text key={artistId}>
              <ChakraLink as={ReactRouterLink} to={`/artists/${artistId}`}>
                {username}
              </ChakraLink>
            </Text>
          </Box>
        </HStack>
      </Td>
      {onDeleteInPlaylist && addedOnDate ? (
        <Td>{new Date(addedOnDate).toLocaleDateString()}</Td>
      ) : (
        <Td>{new Date(releaseDate).toLocaleDateString()}</Td>
      )}
      {genres && (
        <Td>
          <GenreRowData genres={genres} />
        </Td>
      )}
      <Td>{length}</Td>
      {usersRating && (
        <Td>
          <Center gap={2}>
            {!usersRating[0]?.rating || usersRating[0]?.rating === "0"
              ? "/"
              : usersRating[0].rating}{" "}
            <StarIcon />
          </Center>
        </Td>
      )}
      {isEditable && isAuthed && (
        <Td>
          <IconButton
            aria-label="Edit song"
            icon={<EditIcon />}
            onClick={handleEditSong}
          />
          {handleSongDelete && (
            <IconButton
              aria-label="Delete song"
              icon={<DeleteIcon />}
              onClick={onSongDelete}
              ml={2}
            />
          )}
        </Td>
      )}
      {isAuthed && onAddToPlaylistCLick && (
        <Td>
          <IconButton
            aria-label="Add song to playlist(s)"
            icon={<AddIcon />}
            onClick={handleAddToPlaylist}
          />
        </Td>
      )}
      {onDeleteInPlaylist && (
        <Td>
          <IconButton
            aria-label="Remove song from playlist"
            icon={<DeleteIcon />}
            onClick={handleDeleteInPlaylist}
          />
        </Td>
      )}
    </Tr>
  );
});
