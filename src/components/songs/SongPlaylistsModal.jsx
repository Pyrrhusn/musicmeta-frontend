import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Checkbox,
  CheckboxGroup,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

export default function SongPlaylistsModal({
  playlists,
  handleAddToPlaylists,
  isOpen,
  onOpen,
  onClose,
}) {
  const [selectedPlaylists, setSelectedPlaylists] = useState(new Set());

  const handleSave = useCallback(() => {
    handleAddToPlaylists(Array.from(selectedPlaylists));
    onClose();
  }, [selectedPlaylists, handleAddToPlaylists, onClose]);

  const handleCheckboxChange = useCallback(
    (playlistId) => {
      setSelectedPlaylists((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(playlistId)) {
          newSelected.delete(playlistId);
        } else {
          newSelected.add(playlistId);
        }
        return newSelected;
      });
    },
    [setSelectedPlaylists]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInRight"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Playlist(s)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CheckboxGroup>
            <VStack align="start">
              {playlists.map((playlist) => {
                return (
                  <Checkbox
                    key={playlist.playlistId}
                    isChecked={selectedPlaylists.has(playlist.playlistId)}
                    onChange={() => handleCheckboxChange(playlist.playlistId)}
                  >
                    <Text fontSize="lg">{playlist.name}</Text>
                  </Checkbox>
                );
              })}
            </VStack>
          </CheckboxGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
