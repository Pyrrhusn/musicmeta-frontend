import { Spinner, Center } from "@chakra-ui/react";

export default function Loader() {
  return (
    <Center>
      <Spinner size="xl" speed="0.7s" thickness="3px" m={6} />
    </Center>
  );
}
