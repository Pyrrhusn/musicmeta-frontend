import { memo, useCallback, useMemo } from "react";
import { getGradientColorsForGenreName } from "./GenreColorGenerator";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
} from "@chakra-ui/react";

export default memo(function GenreCard({ genre, onCardClick }) {
  const handleCardClick = useCallback(() => {
    onCardClick(genre.genreId);
  }, [onCardClick, genre.genreId]);

  const { initialColor: bgGradientColorL, gradientColor: bgGradientColorR } =
    useMemo(() => {
      return getGradientColorsForGenreName(genre.genreName);
    }, [genre.genreName]);

  return (
    <Card
      align="left"
      bgGradient={`linear(to-r, ${bgGradientColorL}, ${bgGradientColorR})`}
      height="178px"
      variant="elevated"
      overflow="hidden"
      backdropFilter="auto"
      boxShadow="md"
      onClick={handleCardClick}
      cursor="pointer"
    >
      <CardHeader></CardHeader>
      <CardBody></CardBody>
      <CardFooter noOfLines={2}>
        <Heading size="lg" textShadow="4px 8px 10px black" color="white">
          {genre.genreName}
        </Heading>
      </CardFooter>
    </Card>
  );
});
