import {
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import { VscAccount } from "react-icons/vsc";
import { auth } from "../../firebase/clientApp";
import useDirectory from "../../src/hooks/useDirectory";

const UserProfileItem: React.FC = () => {
  const { toggleMenuOpen } = useDirectory();

  const user = auth.currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user.uid;
  }
  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      position="sticky"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="50px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" direction="column" mb={2}>
          {user?.photoURL ? (
            <Image src={user?.photoURL} />
          ) : (
            <Icon as={VscAccount} fontSize={50} color="" mr={2} />
          )}
          <Text fontWeight={600}>{user?.displayName}</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">
            Your personal Reach frontpage, built for you.
          </Text>
          <Button height="30px" onClick={toggleMenuOpen}>
            Create Post
          </Button>
        </Stack>
        <Divider />
        <Stack fontSize="10pt" spacing={1}>
          <Flex align="center" justify="space-between">
            <Text
              color="blue.500"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
            >
              Change Image
            </Text>
          </Flex>
          <input
            id="file-upload"
            type="file"
            accept="image/x-png,image/gif,image/jpeg"
            hidden
          />
        </Stack>
      </Flex>
    </Flex>
  );
};
export default UserProfileItem;
