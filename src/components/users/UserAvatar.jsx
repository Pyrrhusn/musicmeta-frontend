import { Avatar } from "@chakra-ui/react";

export default function UserAvatar({ name, size = "lg", image, ...props }) {
  return <Avatar name={name} size={size} src={image} {...props} />;
}
