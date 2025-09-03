import {
  Outlet,
  NavLink as ReactRouterNavLink,
  useNavigate,
} from "react-router-dom";
import {
  Flex,
  Link as ChakraLink,
  ButtonGroup,
  Spacer,
  Button,
  HStack,
  StackDivider,
  IconButton,
  useColorMode,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useCallback } from "react";
import { useAuth } from "../contexts/Auth.context";
import LabelInput from "./LabelInput";
import { useForm, FormProvider } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { save } from "../api";
import UserAvatar from "./users/UserAvatar";

export default function Navbar() {
  const { isAuthed, isArtist, isAdmin, user } = useAuth();
  const { toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const toast = useToast();

  const methods = useForm();
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const goToLogin = useCallback(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  const goToLogout = useCallback(() => {
    navigate("/logout", { replace: true });
  }, [navigate]);

  const goToRegister = useCallback(() => {
    navigate("/register", { replace: true });
  }, [navigate]);

  const goToSongForm = useCallback(() => {
    navigate("/songs/add");
  }, [navigate]);

  const goToArtistProfile = useCallback(() => {
    navigate("/artists/me");
  }, [navigate]);

  const {
    trigger: saveGenre,
    error: saveGenreError,
    isMutating,
  } = useSWRMutation("genres", save);

  const onGenreSubmit = useCallback(
    async ({ genreName }) => {
      try {
        await saveGenre({ genreName });
        // toast.promise also possible - but doesn't have good error handling
        toast({
          title: "New genre created!",
          status: "success",
          duration: 5000,
          description: "Refresh or go to genres tab to view genre.",
        });
        reset();
        onClose();
      } catch (error) {
        console.log(error);
        toast({
          title: "An error occured!",
          status: "error",
          description: `${error.response.data.message || saveGenreError}`,
          duration: 10000,
          isClosable: true,
        });
      }
    },
    [saveGenre, toast, reset, onClose]
  );

  const onReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <>
      <Flex
        minWidth="max-content"
        alignItems="center"
        gap={6}
        p={4}
        bgColor={useColorModeValue("whiteAlpha.600", "blackAlpha.400")}
        pos="sticky"
        top="0"
        backdropFilter="auto"
        backdropBlur="8px"
        backdropBrightness="75%"
        zIndex="1"
      >
        <IconButton
          aria-label="Toggle color mode"
          icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
          onClick={toggleColorMode}
        />
        <ChakraLink
          as={ReactRouterNavLink}
          to="/songs"
          fontSize="xl"
          fontWeight="bold"
          style={({ isActive }) => {
            return {
              textDecoration: isActive ? "underline 2px teal" : "",
            };
          }}
        >
          Songs
        </ChakraLink>
        <ChakraLink
          as={ReactRouterNavLink}
          to="/genres"
          fontSize="xl"
          fontWeight="bold"
          style={({ isActive }) => {
            return {
              textDecoration: isActive ? "underline 2px teal" : "",
            };
          }}
        >
          Genres
        </ChakraLink>
        {isAuthed && (
          <ChakraLink
            as={ReactRouterNavLink}
            to="/playlists"
            fontSize="xl"
            fontWeight="bold"
            style={({ isActive }) => {
              return {
                textDecoration: isActive ? "underline 2px teal" : "",
              };
            }}
          >
            Playlists
          </ChakraLink>
        )}
        {/* ^ requires auth */}
        <Spacer />
        <HStack
          align="center"
          spacing={4}
          divider={
            <StackDivider
              borderColor={useColorModeValue("blackAlpha.300", "")}
            />
          }
        >
          {/* add check if logged in user is artist or admin */}
          {isAuthed && (isAdmin || isArtist) && (
            <ButtonGroup>
              <Button
                colorScheme="orange"
                leftIcon={<AddIcon />}
                onClick={goToSongForm}
              >
                New Song
              </Button>
              <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen} isLazy>
                <PopoverTrigger>
                  <Button colorScheme="orange" leftIcon={<AddIcon />}>
                    New Genre
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Create a new genre!</PopoverHeader>
                  <PopoverBody>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onGenreSubmit)}>
                        <LabelInput
                          label="Genre name"
                          name="genreName"
                          type="text"
                          validationRules={{
                            required: "Genre name is required",
                            minLength: {
                              value: 1,
                              message:
                                "Name of genre must be 1 to 25 characters.",
                            },
                            maxLength: {
                              value: 25,
                              message:
                                "Name of genre must be 1 to 25 characters.",
                            },
                          }}
                        />
                        <ButtonGroup
                          display="flex"
                          justifyContent="flex-end"
                          mb={2}
                          variant="outline"
                        >
                          <Button
                            colorScheme="red"
                            onClick={onReset}
                            isDisabled={isSubmitting}
                          >
                            Reset
                          </Button>
                          <Button
                            colorScheme="teal"
                            isLoading={isSubmitting || isMutating}
                            isDisabled={isSubmitting}
                            type="submit"
                          >
                            Save
                          </Button>
                        </ButtonGroup>
                      </form>
                    </FormProvider>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </ButtonGroup>
          )}
          {isAuthed ? (
            <>
              <Button colorScheme="blue" onClick={goToLogout}>
                Logout
              </Button>
              {user && isArtist && (
                <UserAvatar
                  name={user.username}
                  image={user.pictureLocation}
                  size="md"
                  ml={4}
                  onClick={goToArtistProfile}
                  cursor="pointer"
                />
              )}
            </>
          ) : (
            <ButtonGroup>
              <Button colorScheme="blue" onClick={goToRegister}>
                Sign Up
              </Button>
              <Button colorScheme="blue" onClick={goToLogin}>
                Login
              </Button>
            </ButtonGroup>
          )}
          {/* <ChakraLink as={ReactRouterLink} to='/users/??'>Profile</ChakraLink>  */}
        </HStack>
      </Flex>
      <Outlet />
    </>
  );
}
