import SongTable from "../songs/SongTable";
import { VStack, Box, Center, Heading, AbsoluteCenter } from "@chakra-ui/react";
import { getGradientColorsForGenreName } from "./GenreColorGenerator";

export default function GenreWithSongs({ genreAndSongs, ...props }) {
  const { initialColor: bgGradientColorL, gradientColor: bgGradientColorR } =
    getGradientColorsForGenreName(genreAndSongs.genreName);

  return (
    <VStack align="stretch" {...props} p="1em">
      <Center
        bgGradient={`linear(to-br, ${bgGradientColorL}, ${bgGradientColorR})`}
        width="100%"
        height="15em"
      >
        <Box
          width="55%"
          borderRadius="lg"
          boxShadow="lg"
          bg="blackAlpha.100"
          minHeight="max-content"
          height="70%"
          overflow="hidden"
          position="relative"
          backdropFilter="auto"
          backdropBlur="10px"
        >
          <AbsoluteCenter axis="both">
            <Heading as="h2" size="3xl" textAlign="center" color="white">
              {genreAndSongs.genreName}
            </Heading>
          </AbsoluteCenter>
        </Box>
      </Center>
      <SongTable songs={genreAndSongs.songs} inGenre={true} />
    </VStack>
  );
}
