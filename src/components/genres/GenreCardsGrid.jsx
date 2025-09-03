import { SimpleGrid } from "@chakra-ui/react";
import GenreCard from "./GenreCard";

export default function GenreCardsGrid({ genres, onCardClick, ...props }) {
  return (
    <SimpleGrid minChildWidth="190px" spacing="1em" padding="1em" {...props}>
      {genres.map((genre) => {
        return (
          <GenreCard
            key={genre.genreId}
            genre={genre}
            onCardClick={onCardClick}
          />
        );
      })}
    </SimpleGrid>
  );
}
