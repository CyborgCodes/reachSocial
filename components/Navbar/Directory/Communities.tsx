import {
  Box,
  Flex,
  Icon,
  MenuItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { GiFireBottle } from "react-icons/gi";
import { AiOutlinePlus } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import CreateCommunityModal from "../../../CreateCommunity/CreateCommunityModal";
import MenuListItem from "./MenuListItem";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;
  const iconColor1 = useColorModeValue("black", "white");
  const bgColor1 = useColorModeValue("green.400", "green.600");

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text
          pl={3}
          mb={1}
          fontSize="7pt"
          fontWeight={500}
          color="gray.500"
          cursor="context-menu"
        >
          MY COMMUNITIES
        </Text>
      </Box>
      <MenuItem
        width="100%"
        fontSize="10pt"
        _hover={{ bg: bgColor1 }}
        onClick={() => setOpen(true)}
      >
        <Flex align="center">
          <Icon fontSize={20} mr={2} as={AiOutlinePlus} color={iconColor1} />
          Create Community
        </Flex>
      </MenuItem>
      {mySnippets.map((snippet) => (
        <MenuListItem
          key={snippet.communityId}
          icon={GiFireBottle}
          displayText={`c/${snippet.communityId}`}
          link={`/c/${snippet.communityId}`}
          iconColor="blue.500"
          imageURL={snippet.imageURL}
        />
      ))}
    </>
  );
};
export default Communities;
