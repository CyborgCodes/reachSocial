import { Box, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import { GiFireBottle } from "react-icons/gi";

export type Reply = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
};

type RepliesItemProps = {
  reply: Reply;
  userId: string;
};

const RepliesItem: React.FC<RepliesItemProps> = ({ reply, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <Flex>
      <Box mr={2}>
        <Icon as={GiFireBottle} fontSize={30} color="blue.300" />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" fontSize="8pt">
          <Text fontSize="8pt">By</Text>
          <Text
            fontSize="8pt"
            color="blue.500"
            _hover={{ color: "gray.600", cursor: "pointer" }}
            onClick={() => router.push(`/Profile/${reply.creatorId}`)}
          >
            @{reply.creatorDisplayText}
          </Text>
          <Text color="gray.600">
            {moment(new Date(reply.createdAt.seconds * 1000)).fromNow()}
          </Text>
        </Stack>
        <Text fontSize="10pt">{reply.text}</Text>
        {/* <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          {userId === reply.creatorId && (
            <>
              <Icon
                as={AiOutlineDelete}
                _hover={{ color: "red.500" }}
                onClick={() => onDeleteReply(reply)}
              />
            </>
          )}
          {userId === reply.creatorId && (
            <>
              <Text fontSize="9pt" align="center">
                Delete
              </Text>
            </>
          )}
        </Stack> */}
      </Stack>
    </Flex>
  );
};
export default RepliesItem;
