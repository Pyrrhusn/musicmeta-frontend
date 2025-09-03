import { useEffect } from "react";
import { useAuth } from "../contexts/Auth.context";
import { AbsoluteCenter, Text, Box, Spinner } from "@chakra-ui/react";

export default function Logout() {
  const { isAuthed, logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  if (isAuthed) {
    return (
      <Box height="90vh">
        <AbsoluteCenter>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text fontSize="lg" fontWeight="bold" as="h1">
            Logging out...
          </Text>
        </AbsoluteCenter>
      </Box>
    );
  }

  return (
    <Box height="90vh">
      <AbsoluteCenter>
        <Text fontSize="lg" fontWeight="bold" as="h1">
          You were successfully logged out.
        </Text>
      </AbsoluteCenter>
    </Box>
  );
}
