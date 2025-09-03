import { isAxiosError } from "axios";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Center,
  Stack,
} from "@chakra-ui/react";

export default function Error({ error }) {
  if (isAxiosError(error)) {
    return (
      <Center>
        <Alert status="error" m={6} flexDirection="column">
          <Stack direction="row">
            <Center>
              <AlertIcon boxSize={6} mr={4} />
              <Box>
                <AlertTitle fontSize="xl">
                  Oops, something went wrong!
                </AlertTitle>
                <AlertDescription>
                  {error.response?.data?.message || error.message}
                  {error.response?.data?.details && (
                    <>
                      :
                      <br />
                      {JSON.stringify(error.response.data.details)}
                    </>
                  )}
                </AlertDescription>
              </Box>
            </Center>
          </Stack>
        </Alert>
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Alert status="error" m={6} flexDirection="column">
          <Stack direction="row">
            <Center>
              <AlertIcon boxSize={6} mr={4} />
              <Box>
                <AlertTitle fontSize="xl">
                  An unexpected error occured!
                </AlertTitle>
                <AlertDescription>
                  {error.message || JSON.stringify(error)}
                </AlertDescription>
              </Box>
            </Center>
          </Stack>
        </Alert>
      </Center>
    );
  }

  return null;
}
