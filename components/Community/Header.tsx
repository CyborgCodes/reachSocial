import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GiFireBottle } from "react-icons/gi";
import { Community } from "../../atoms/communitiesAtom";
import useCommunityData from "../../src/hooks/useCommunityData";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();

  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  ); //read from our communitySnippets

  return (
    <Flex direction="column" width="100%" height="180px">
      <Box height="50%" bg="green.600" />
      <Flex
        justify="center"
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={useColorModeValue("xl", "dark-lg")}
        flexGrow={1}
      >
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={communityStateValue.currentCommunity.imageURL}
              alt="Community Image"
              position="relative"
              top={-3}
              color="green.600"
              border="4px solid white"
              objectFit="cover"
            />
          ) : (
            <Icon
              as={GiFireBottle}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px" direction={{ base: "column", md: "row" }}>
            <Flex direction="column" mr={6} mb="12px">
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                c/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              maxWidth="100px"
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
function onJoinOrLeaveCommunity(
  communityData: Community,
  isJoined: boolean
): void {
  throw new Error("Function not implemented.");
}
