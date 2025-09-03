import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm, Controller } from "react-hook-form";
import LabelInput from "../components/LabelInput";
import { useAuth } from "../contexts/Auth.context";
import Error from "../components/Error";
import {
  Center,
  Heading,
  Flex,
  Button,
  Container,
  Checkbox,
} from "@chakra-ui/react";

export default function Register() {
  const { error, loading, register } = useAuth();
  const navigate = useNavigate();

  const methods = useForm();
  const { getValues, handleSubmit, reset, watch, control } = methods;

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleRegister = useCallback(
    async ({ name, email, password, isArtist, birthDate, bio }) => {
      birthDate = !isArtist || birthDate.trim() === "" ? undefined : birthDate;
      bio = !isArtist || bio.trim() === "" ? undefined : bio;

      const loggedIn = await register({
        username: name,
        email,
        password,
        isArtist,
        birthDate,
        about: bio,
      });

      if (loggedIn) {
        navigate({
          pathname: "/",
          replace: true,
        });
      }
    },
    [register, navigate]
  );

  const validationRules = useMemo(
    () => ({
      name: {
        required: "Name is required",
        minLength: { value: 1, message: "Enter at least one letter." },
        maxLength: { value: 50, message: "Maximum is 50 characters." },
      },
      email: {
        required: "Email is required",
      },
      password: {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "Password must be 8 to 32 characters long.",
        },
        maxLength: {
          value: 32,
          message: "Password must be 8 to 32 characters long.",
        },
      },
      confirmPassword: {
        required: "Password confirmation is required",
        validate: (value) => {
          const password = getValues("password");
          return password === value || "Passwords do not match";
        },
      },
      bio: {
        maxLength: {
          value: 420,
          message: "Maximum is 420 characters.",
        },
      },
    }),
    [getValues]
  );

  const isArtist = watch("isArtist");

  return (
    <>
      <Error error={error} />
      <Container maxW="50%">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleRegister)}>
            <Center>
              <Heading size="xl" mt={4}>
                Register
              </Heading>
            </Center>
            <LabelInput
              label="Name"
              name="name"
              type="text"
              validationRules={validationRules.name}
              helperText="Your username"
            />
            <LabelInput
              label="Email"
              name="email"
              type="email"
              validationRules={validationRules.email}
              placeholder="your@email.com"
            />
            <LabelInput
              label="Password"
              name="password"
              type="password"
              validationRules={validationRules.password}
            />
            <LabelInput
              label="Confirm password"
              name="confirmPassword"
              type="password"
              validationRules={validationRules.confirmPassword}
            />
            <Controller
              control={control}
              name="isArtist"
              key="isArtist"
              defaultValue={false}
              render={({ field: { onChange, value, ref } }) => (
                <Center m={4}>
                  <Checkbox
                    onChange={onChange}
                    ref={ref}
                    isChecked={value}
                    size="lg"
                  >
                    Sign up as Artist?
                  </Checkbox>
                </Center>
              )}
            />
            {isArtist && (
              <>
                <LabelInput
                  label="Date of birth"
                  name="birthDate"
                  type="date"
                  max={new Date().toLocaleDateString("en-CA")}
                  isRequired={false}
                />
                <LabelInput
                  label="Bio"
                  helperText="Write a little something about yourself."
                  name="bio"
                  type="text"
                  validationRules={validationRules.bio}
                  isRequired={false}
                />
              </>
            )}
            <Center>
              <Flex minWidth="max-content" alignItems="center" gap="4">
                <Button
                  mt={1}
                  mb={4}
                  colorScheme="red"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  mt={1}
                  mb={4}
                  colorScheme="teal"
                  type="submit"
                  isDisabled={loading}
                  isLoading={loading}
                >
                  Register
                </Button>
              </Flex>
            </Center>
          </form>
        </FormProvider>
      </Container>
    </>
  );
}
