import {
  Wrap,
  WrapItem,
  Container,
  Text,
  Input,
  VStack,
  Button,
  Textarea,
} from "@chakra-ui/react";
import UserAvatar from "./UserAvatar";
import { useCallback, useState } from "react";

export default function ArtistBioPanel({
  userId,
  username,
  birthDate,
  isArtist,
  about,
  pictureLocation,
  totalSongs,
  isEditable,
  onSave,
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [editBirthDate, setEditBirthDate] = useState(birthDate);
  const [editAbout, setEditAbout] = useState(about);

  const handleSave = useCallback(() => {
    onSave({
      username: editUsername ? editUsername : username,
      birthDate: editBirthDate,
      about: editAbout,
    });
    setIsEditing(false);
  }, [onSave, setIsEditing, editUsername, editBirthDate, editAbout]);

  const handleToggleEditing = useCallback(() => {
    setIsEditing(!isEditing);
  }, [setIsEditing, isEditing]);

  const handleAboutTextChange = useCallback(
    (e) => {
      const value = e.target.value;
      setEditAbout(!value || value.trim() === "" ? undefined : value);
    },
    [setEditAbout]
  );

  const handleBirthDateChange = useCallback(
    (e) => {
      const value = e.target.value;
      setEditBirthDate(!value || value.trim() === "" ? undefined : value);
    },
    [setEditBirthDate]
  );

  return (
    <Wrap {...props}>
      <WrapItem>
        <UserAvatar name={username} size="2xl" image={pictureLocation} />
      </WrapItem>
      <WrapItem>
        <Container>
          {isEditing ? (
            <VStack spacing={4}>
              <Input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Username"
                type="text"
                minLength="1"
                maxLength="50"
                isRequired={true}
              />
              <Input
                type="date"
                value={editBirthDate ? editBirthDate : ""}
                onChange={handleBirthDateChange}
                placeholder="Date of birth"
                max={new Date().toISOString().substring(0, 10)}
                isRequired={false}
              />
              <Textarea
                value={editAbout}
                onChange={handleAboutTextChange}
                placeholder="About"
                maxLength="420"
                isRequired={false}
              />
              <Wrap>
                <Button onClick={handleToggleEditing}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </Wrap>
            </VStack>
          ) : (
            <>
              <Text fontWeight="bold" fontSize="3xl">
                {username}
              </Text>
              <Text mb={1}>
                {!birthDate || birthDate === ""
                  ? ""
                  : new Date(birthDate).toLocaleDateString({
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
              </Text>
              <Text mb={1} as="b">
                Total songs: {totalSongs}
              </Text>
              <Text>
                Bio:{" "}
                <Text fontStyle="italic" as="span">
                  {about}
                </Text>
              </Text>
              {isEditable && (
                <Button mt={2} onClick={handleToggleEditing}>
                  Edit
                </Button>
              )}
            </>
          )}
        </Container>
      </WrapItem>
    </Wrap>
  );
}
