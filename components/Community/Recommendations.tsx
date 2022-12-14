import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { GiFireBottle } from "react-icons/gi";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { Community } from "../../atoms/communitiesAtom";
import { auth, firestore } from "../../firebase/clientApp";
import useCommunityData from "../../src/hooks/useCommunityData";
import { useAuthState } from "react-firebase-hooks/auth";

type RecommendationsProps = {};

const Recommendations: React.FC<RecommendationsProps> = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();

  const bgColor1 = useColorModeValue("white", "gray.900");
  const borderColor1 = useColorModeValue("gray.300", "gray.600");
  const borderColor2 = useColorModeValue("gray.300", "gray.600");
  const textColor1 = useColorModeValue("gray.500", "gray.600");

  const getCommunityRecommendations = async () => {
    setLoading(true);
    try {
      const communityQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc")
        // limit(5)
      );
      const communityDocs = await getDocs(communityQuery);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Community[];
      console.log("HERE ARE COMS", communities);

      setCommunities(communities);
    } catch (error: any) {
      console.log("getCommunityRecommendations error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCommunityRecommendations();
  }, []);

  return (
    <Flex
      direction="column"
      bg={bgColor1}
      borderRadius={4}
      cursor="auto"
      border="1px solid"
      borderColor={borderColor1}
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="green.600"
        height="80px"
        borderRadius="4px 4px 0px 0px"
        cursor="context-menu"
        fontWeight={600}
        bgImage="url(/images/recCommsArt.png)"
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
          url('images/recCommsArt.png')"
      >
        Our Communities
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((item, index) => {
              const isJoined = !!communityStateValue.mySnippets.find(
                (snippet) => snippet.communityId === item.id
              );
              return (
                <Flex
                  key={item.id}
                  position="relative"
                  align="center"
                  fontSize="10pt"
                  borderBottom="1px solid"
                  borderColor={borderColor2}
                  p="10px 12px"
                  fontWeight={600}
                  cursor="auto"
                >
                  <Flex width="80%" align="center">
                    <Flex width="15%" cursor="context-menu">
                      <Text mr={2}>{index + 1}</Text>
                    </Flex>
                    <Flex align="center" width="80%">
                      {item.imageURL ? (
                        <Image
                          borderRadius="full"
                          boxSize="28px"
                          objectFit="cover"
                          src={item.imageURL}
                          mr={2}
                        />
                      ) : (
                        <Icon
                          as={GiFireBottle}
                          fontSize={30}
                          color="brand.100"
                          mr={2}
                        />
                      )}
                      <Flex _hover={{ color: textColor1 }}>
                        <Link
                          href={`/c/${item.id}`}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {`c/${item.id}`}
                        </Link>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Box position="absolute" right="10px">
                    <Button
                      height="22px"
                      fontSize="8pt"
                      onClick={(event) => {
                        event.stopPropagation();
                        onJoinOrLeaveCommunity(item, isJoined);
                      }}
                      variant={isJoined ? "outline" : "solid"}
                    >
                      {isJoined ? "Joined" : "Join"}
                    </Button>
                  </Box>
                </Flex>
              );
            })}
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default Recommendations;
