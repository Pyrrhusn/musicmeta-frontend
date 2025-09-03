import { memo, useState, useCallback, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Stack,
  Container,
  Heading,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Image,
  Center,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import { AsyncSelect } from "chakra-react-select";
import { getAll, save, post } from "../../api";
import useSWRMutation from "swr/mutation";
import Error from "../Error";
import LabelInput from "../LabelInput";

const validationRules = {
  title: {
    required: "Title is required.",
    minLength: { value: 1, message: "Enter at least one letter." },
    maxLength: { value: 100, message: "Maximum is 100 characters." },
  },
  length: {
    // special input type - time with seconds precision
    required: "Song duration is required.",
    pattern: { value: /^\d\d:\d\d:\d\d$/ },
  },
  releaseDate: { required: "Date of release is required." }, // special input time - date see mdn
  genres: { required: "Enter at least one genre." },
};

const defaultArtUrl = "/fallbackArt.svg";

export default memo(function SongForm({ song = null }) {
  // for future: to edit data of a song by passing defaultValue?? --best practice?
  const methods = useForm();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
    setValue,
  } = methods;

  const watchedArtUrl = watch("artLocation", defaultArtUrl);
  const [isValidArtUrl, setIsValidArtUrl] = useState(true);
  const toast = useToast();

  const { trigger: genreOptionsTrigger, error: genreOptionsError } =
    useSWRMutation("genres", getAll);
  const { trigger: saveSong, error: saveSongError } = useSWRMutation(
    "songs",
    song ? save : post
  );

  useEffect(() => {
    if (
      // check on non-empty object
      song &&
      (Object.keys(song).length !== 0 || song.constructor !== Object)
    ) {
      setValue("title", song.title);
      setValue(
        "releaseDate",
        new Date(song.releaseDate).toLocaleDateString("en-CA")
      );
      setValue("length", song.length);
      setValue("artLocation", song.artLocation);
    } else {
      reset();
    }
  }, [song, setValue, reset]);

  const genreOptions = useCallback(
    (inputValue) => {
      return new Promise(async (resolve) => {
        const genres = await genreOptionsTrigger();
        const options = genres
          .map(({ genreId, genreName }) => ({
            id: genreId,
            value: genreName.toLowerCase(),
            label: genreName,
          }))
          .filter((g) => g.value.includes(inputValue.toLowerCase()));
        resolve(options);
      });
    },
    [genreOptionsTrigger]
  );

  const onSubmit = useCallback(
    async ({ genre, ...songData }) => {
      try {
        if (!songData.artLocation || !isValidArtUrl) {
          songData.artLocation = defaultArtUrl;
        }
        if (song) {
          const { title, releaseDate } = songData;
          await saveSong({
            id: song.songId,
            title,
            releaseDate: new Date(releaseDate).toLocaleDateString("en-CA"),
          });
          toast({
            title: "Song updated successfully!",
            status: "success",
            duration: 5000,
            description: "The song details have been updated.",
          });
        } else {
          const { songId } = await saveSong({ ...songData });
          for (const { id } of genre) {
            await saveSong({ id: `${songId}/genres`, genreId: id });
          }
          reset();
          reset({ genre: [], artLocation: "" });
          toast({
            title: "New song entry added!",
            status: "success",
            duration: 5000,
            description: "View it in songs or in your library.",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [isValidArtUrl, defaultArtUrl, reset, saveSong, toast, song]
  );

  const handleArtLoad = useCallback(() => {
    setIsValidArtUrl(true);
    clearErrors("artLocation");
  }, [clearErrors]);

  const handleArtError = useCallback(() => {
    setIsValidArtUrl(false);
    setError("artLocation", {
      message: "Enter a valid image URL",
    });
  }, [setError]);

  const handleResetGenreArt = useCallback(() => {
    reset({ genre: [], artLocation: "" });
  }, [reset]);

  return (
    <>
      <Error error={genreOptionsError || saveSongError} />
      <Container maxW="45%">
        <Center>
          <Heading size="xl" mt={4}>
            {song ? "Update song" : "Add song"}
          </Heading>
        </Center>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <LabelInput
              label="Title"
              name="title"
              type="text"
              validationRules={validationRules.title}
              helperText="Title of the song."
            />
            <LabelInput
              label="Length"
              name="length"
              type="time"
              validationRules={validationRules.length}
              helperText="Enter duration of the song."
              step="1"
              isDisabled={song}
            />
            <LabelInput
              label="Release date"
              name="releaseDate"
              type="date"
              validationRules={validationRules.releaseDate}
              max={new Date().toISOString().substring(0, 10)}
            />
            <Stack
              direction="row"
              spacing={4}
              mt={4}
              mb={4}
              align="center"
              width="100%"
            >
              <FormControl
                isInvalid={errors.artLocation}
                isDisabled={song || isSubmitting}
              >
                <FormLabel htmlFor="artLocation" fontSize="lg">
                  Cover Art URL
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" fontSize="1.2em">
                    <LinkIcon boxSize={4} />
                  </InputLeftElement>
                  <Input
                    id="artLocation"
                    type="url"
                    {...register("artLocation", {
                      validate: (url) => {
                        if (url)
                          return isValidArtUrl || "Enter a valid image URL";
                      },
                    })}
                  />
                </InputGroup>
                <FormHelperText>
                  Leave empty to use default image.
                </FormHelperText>
                <FormErrorMessage>
                  {errors.artLocation && errors.artLocation.message}
                </FormErrorMessage>
              </FormControl>
              <Image
                src={watchedArtUrl || defaultArtUrl}
                alt="Cover Art"
                boxSize="85px"
                borderRadius="8px"
                fallbackSrc={defaultArtUrl}
                border="2px"
                borderColor="gray.500"
                onLoad={handleArtLoad}
                onError={handleArtError}
              />
            </Stack>
            {!song && (
              <Controller
                control={control}
                name="genre"
                rules={validationRules.genres}
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { error },
                }) => (
                  <FormControl
                    isInvalid={!!error}
                    id={name}
                    mt={4}
                    mb={4}
                    isRequired
                    isDisabled={isSubmitting}
                  >
                    <FormLabel fontSize="lg" htmlFor={name}>
                      Genre(s)
                    </FormLabel>
                    <AsyncSelect
                      id={name}
                      inputId="genres-multiselect-input"
                      instanceId="genres-multiselect"
                      isMulti
                      name="genres"
                      ref={ref}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      loadOptions={genreOptions}
                      placeholder="select or search genre"
                      closeMenuOnSelect={false}
                      cacheOptions={true}
                      defaultOptions={true}
                      isClearable={true}
                    />
                    <FormErrorMessage>
                      {error && error.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />
            )}

            <Center>
              <Flex minWidth="max-content" alignItems="center" gap="4">
                {!song && (
                  <Button
                    mt={1}
                    mb={4}
                    colorScheme="red"
                    type="reset"
                    onClick={handleResetGenreArt}
                    isDisabled={genreOptionsError || isSubmitting}
                  >
                    Reset
                  </Button>
                )}
                <Button
                  mt={1}
                  mb={4}
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  type="submit"
                  isDisabled={genreOptionsError || isSubmitting}
                >
                  Submit
                </Button>
              </Flex>
            </Center>
          </form>
        </FormProvider>
      </Container>
    </>
  );
});
