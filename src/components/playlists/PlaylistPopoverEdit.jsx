import { memo, useCallback } from "react";
import { EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useToast,
  useDisclosure,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import LabelInput from "../LabelInput";

export default memo(function PlaylistsPopoverEdit({
  initialName,
  playlistId,
  savePlaylist,
  savePlaylistError,
  isMutating,
}) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const toast = useToast();

  const methods = useForm();
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onPlaylistSubmit = useCallback(
    async ({ name }) => {
      try {
        await savePlaylist({ id: playlistId, name });
        toast({
          title: "Playlist name updated!",
          status: "success",
          duration: 5000,
        });
        reset({ name: name });
        onClose();
      } catch (error) {
        console.log(error);
        toast({
          title: "An error occured!",
          status: "error",
          description: `${error.response.data.message || savePlaylistError}`,
          duration: 10000,
          isClosable: true,
        });
      }
    },
    [playlistId, savePlaylist, toast, reset, onClose, savePlaylistError]
  );

  const onReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
      <PopoverTrigger>
        <IconButton
          aria-label="Edit playlist name"
          icon={<EditIcon />}
          onClick={(event) => event.stopPropagation()}
        />
      </PopoverTrigger>
      <PopoverContent onClick={(event) => event.stopPropagation()}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Edit playlist name!</PopoverHeader>
        <PopoverBody>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onPlaylistSubmit)}>
              <LabelInput
                label="Name"
                name="name"
                type="text"
                validationRules={{
                  required: "Playlist name is required",
                  minLength: {
                    value: 1,
                    message: "Playlist name must be 1 to 100 characters long.",
                  },
                  maxLength: {
                    value: 100,
                    message: "Playlist name must be 1 to 100 characters long.",
                  },
                }}
                defaultValue={initialName}
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
                  colorScheme="green"
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
  );
});
