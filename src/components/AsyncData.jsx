import Loader from "./Loader";
import Error from "./Error";
import { AbsoluteCenter, VStack, Box, Flex } from "@chakra-ui/react";

export default function AsyncData({ loading, error, children }) {
  if (loading) {
    return (
      <Box height="90vh">
        <AbsoluteCenter axis="both">
          <Loader />
        </AbsoluteCenter>
      </Box>
    );
  }

  if (error) {
    return (
      <Flex alignItems="stretch" width="100%" direction="column">
        <Error error={error} />
        {children}
      </Flex>
    );
  }

  return children;
}
