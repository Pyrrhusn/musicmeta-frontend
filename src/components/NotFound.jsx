import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  AbsoluteCenter,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { TriangleUpIcon } from "@chakra-ui/icons";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <Box width="100%" height="90vh">
      <AbsoluteCenter axis="both" w="70vw">
        <Alert
          status="warning"
          variant="top-accent"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <AlertIcon boxSize={12} mt={2} />
          <AlertTitle mt={4} mb={2} fontSize="2xl">
            Not found!
          </AlertTitle>
          <AlertDescription fontSize="lg">
            Oops!{" "}
            <Text color="orange.400" textDecor="dotted underline" as="span">
              {pathname}
            </Text>{" "}
            isn’t where it should be. It's probably hanging out with Waldo.
          </AlertDescription>
          <Button
            mt={4}
            variant="solid"
            colorScheme="teal"
            rightIcon={<TriangleUpIcon />}
            as={Link}
            to="/"
            replace
          >
            Go back home
          </Button>
        </Alert>
      </AbsoluteCenter>
    </Box>
  );
}
