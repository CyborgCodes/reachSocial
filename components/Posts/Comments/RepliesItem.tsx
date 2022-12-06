import { Box, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React from "react";
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
  onDeleteReply: (reply: Reply) => void;
  loadingDelete: boolean;
  userId: string;
};

const RepliesItem: React.FC<RepliesItemProps> = ({
  reply,
  onDeleteReply,
  loadingDelete,
  userId,
}) => {
  return (
    <Flex>
      <Box mr={2}>
        <Icon as={GiFireBottle} fontSize={30} color="gray.300" />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" fontSize="8pt">
          <Text>{reply.creatorDisplayText}</Text>
          <Text color="gray.600">
            {moment(new Date(reply.createdAt.seconds * 1000)).fromNow()}
          </Text>
          {loadingDelete && <Spinner size="sm" />}
        </Stack>
        <Text fontSize="10pt">{reply.text}</Text>
        <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          <Icon as={BsReply} _hover={{ color: "blue.500" }} />
          {userId === reply.creatorId && (
            <>
              <Icon
                as={AiOutlineDelete}
                _hover={{ color: "blue.500" }}
                onClick={() => onDeleteReply(reply)}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
export default RepliesItem;
