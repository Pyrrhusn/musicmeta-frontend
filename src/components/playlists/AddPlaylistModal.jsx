import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  ButtonGroup,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import LabelInput from "../LabelInput";
import { useCallback } from "react";

export default function AddPlaylistModal({
  addPlaylist,
  addPlaylistError,
  addPlaylistMutating: isMutating,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const methods = useForm();
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onAddPlaylist = useCallback(
    async ({ name }) => {
      try {
        await addPlaylist({
          name,
          creationDate: new Date().toISOString().substring(0, 10),
        });
        reset();
        onClose();
      } catch (error) {
        console.log(error);
        toast({
          title: "An error occured!",
          status: "error",
          description: `${error.response.data.message || addPlaylistError}`,
          duration: 10000,
          isClosable: true,
        });
      }
    },
    [addPlaylist, reset, onClose, toast, addPlaylistError]
  );

  const onReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <>
      <Button colorScheme="pink" leftIcon={<AddIcon />} mr={6} onClick={onOpen}>
        Create playlist
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new playlist!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onAddPlaylist)}>
                <LabelInput
                  label="Playlist name"
                  name="name"
                  type="text"
                  validationRules={{
                    required: "Playlist name is required",
                    minLength: {
                      value: 1,
                      message:
                        "Playlist name must be 1 to 100 characters long.",
                    },
                    maxLength: {
                      value: 100,
                      message:
                        "Playlist name must be 1 to 100 characters long.",
                    },
                  }}
                />
                <ButtonGroup display="flex" justifyContent="flex-end" mb={2}>
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
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
