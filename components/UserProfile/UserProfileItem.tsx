import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Divider,
} from "@chakra-ui/react";
import useDirectory from "../../src/hooks/useDirectory";
import { VscAccount } from "react-icons/vsc";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import { useRouter } from "next/router";

const UserProfileItem: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { displayName } = router.query;
  const { toggleMenuOpen } = useDirectory();

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
          <Text fontWeight={600}>{displayName}</Text>
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
