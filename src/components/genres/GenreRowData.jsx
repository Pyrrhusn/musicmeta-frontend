import { Tag, TagLabel, Wrap, WrapItem } from "@chakra-ui/react";
import getColorForGenreName from "./GenreColorGenerator";
import { memo } from "react";

export default memo(function GenreRowData({ genres }) {
  return (
    <Wrap>
      {genres.map((genre) => (
        <WrapItem key={genre.genreId}>
          <Tag
            variant="subtle"
            colorScheme={getColorForGenreName(genre.genreName, false)}
          >
            <TagLabel>{genre.genreName}</TagLabel>
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  );
});
