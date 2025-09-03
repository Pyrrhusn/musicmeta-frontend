import ArtistBioPanel from "./ArtistBioPanel";
import SongTable from "../songs/SongTable";
import { VStack, StackDivider, Center } from "@chakra-ui/react";

export default function ArtistPanelWithSongs({
  artist,
  totalSongs,
  songs,
  isEditable,
  onSave,
  handleSongDelete,
  ...props
}) {
  return (
    <VStack divider={<StackDivider />} spacing={2} align="stretch" {...props}>
      <Center m={4}>
        <ArtistBioPanel
          {...artist}
          totalSongs={totalSongs}
          isEditable={isEditable}
          onSave={onSave}
        />
      </Center>
      <SongTable
        songs={songs}
        inArtist={true}
        isEditable={isEditable}
        handleSongDelete={handleSongDelete}
      />
    </VStack>
  );
}
