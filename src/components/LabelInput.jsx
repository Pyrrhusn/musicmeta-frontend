import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";

export default function LabelInput({
  label,
  name,
  type,
  validationRules,
  helperText,
  isRequired = true,
  isDisabled = false,
  ...rest
}) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <FormControl
      isInvalid={errors[name]}
      isRequired={isRequired}
      isDisabled={isSubmitting || isDisabled}
      mt={4}
      mb={4}
    >
      <FormLabel htmlFor={name} fontSize="lg">
        {label}
      </FormLabel>
      <Input
        id={name}
        type={type}
        {...register(name, validationRules)}
        {...rest}
      />
      <FormHelperText>{helperText}</FormHelperText>
      <FormErrorMessage>
        {name in errors && errors[name].message}
      </FormErrorMessage>
    </FormControl>
  );
}
