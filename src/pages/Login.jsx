import { FormProvider, useForm } from "react-hook-form";
import LabelInput from "../components/LabelInput";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth.context";
import Error from "../components/Error";
import { Center, Heading, Flex, Button, Container } from "@chakra-ui/react";

const validationRules = {
  email: {
    required: "Email is required",
  },
  password: {
    required: "Password is required",
  },
};

export default function Login() {
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();

  const redirect = useMemo(() => {
    const urlParams = new URLSearchParams(search);
    if (urlParams.has("redirect")) return urlParams.get("redirect");
    return "/";
  }, [search]);

  const methods = useForm({
    // defaultValues: {
    //   email: "Jotaro.Kujo@jjba.com",
    //   password: "1234567890",
    // },
  });

  const { handleSubmit, reset } = methods;

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  const handleLogin = useCallback(
    async ({ email, password }) => {
      const loggedIn = await login(email, password);

      if (loggedIn) {
        navigate({
          pathname: redirect,
          replace: true,
        });
      }
    },
    [login, navigate, redirect]
  );

  return (
    <>
      <Error error={error} />
      <Container maxW="50%">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleLogin)}>
            <Center>
              <Heading size="xl" mt={4}>
                Sign in
              </Heading>
            </Center>
            <LabelInput
              label="Email"
              name="email"
              type="text"
              validationRules={validationRules.email}
              placeholder="your@email.com"
            />
            <LabelInput
              label="Password"
              name="password"
              type="password"
              validationRules={validationRules.password}
            />
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
                  Sign in
                </Button>
              </Flex>
            </Center>
          </form>
        </FormProvider>
      </Container>
    </>
  );
}
