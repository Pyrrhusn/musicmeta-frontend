import { Table, Thead, Tbody, Th, Tr, TableContainer } from "@chakra-ui/react";
import SongTableRow from "./SongTableRow";

export default function SongTable({
  songs,
  inPlaylist = false,
  inGenre = false,
  inArtist = false,
  onDeleteInPlaylist = null,
  onAddToPlaylistCLick = null,
  isEditable = false,
  handleSongDelete = null,
}) {
  return (
    <TableContainer p={2}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            {inPlaylist ? <Th>Date added</Th> : <Th>Release date</Th>}
            {!inGenre && <Th>Genres</Th>}
            <Th>Duration</Th>
            {inPlaylist && <Th>Rating</Th>}
            {inPlaylist && <Th>Remove</Th>}
            {onAddToPlaylistCLick && <Th>Playlist</Th>}
            {isEditable && <Th>Edit {handleSongDelete && "/ Delete"}</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {songs &&
            songs.map((song) => (
              <SongTableRow
                key={song.songId}
                {...song}
                {...(inArtist && { artist: { username: "" } })}
                onDeleteInPlaylist={onDeleteInPlaylist}
                onAddToPlaylistCLick={onAddToPlaylistCLick}
                isEditable={isEditable}
                handleSongDelete={handleSongDelete}
              />
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
// options colum or add icon to add it to a playlist
