import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Auth.context";
import { AbsoluteCenter, Spinner, Box, Text } from "@chakra-ui/react";
import { useMemo } from "react";

export default function PrivateRoute({
  requireArtist = false,
  requireAdmin = false,
}) {
  const { ready, isAuthed, isArtist, isAdmin } = useAuth();
  const { pathname } = useLocation();

  const loginPath = `/login?redirect=${pathname}`;

  const userHasRequiredRole = useMemo(() => {
    if (requireArtist && requireAdmin) {
      return requireAdmin === isAdmin || requireArtist === isArtist;
    }
    if (requireArtist) {
      return requireArtist === isArtist;
    }
    if (requireAdmin) {
      return requireAdmin === isAdmin;
    }
    return true;
  }, [requireAdmin, requireArtist, isAdmin, isArtist]);

  if (!ready) {
    return (
      <AbsoluteCenter axis="both">
        <Box justifyContent="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text fontSize="lg" as="b">
            Loading...
          </Text>
          <Text fontSize="lg">
            Please wait while we are checking your credentials and loading the
            application.
          </Text>
        </Box>
      </AbsoluteCenter>
    );
  }

  if (isAuthed && userHasRequiredRole) {
    return <Outlet />;
  }

  // if required roles is false, it goes to login page with redrirect
  // can be changed to display a FORBIDDEN page
  return <Navigate replace to={loginPath} />;
}
