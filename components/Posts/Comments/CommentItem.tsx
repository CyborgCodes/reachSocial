import { Box, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineLike } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import CommentInput from "./CommentInput";
import { useSetRecoilState } from "recoil";
import { postState } from "../../../atoms/postsAtom";
import RepliesInput from "./RepliesInput";
import Replies from "./Replies";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import usePosts from "../../../src/hooks/usePosts";
import { User } from "firebase/auth";

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
};

type CommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  loadingDelete: boolean;
  userId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDeleteComment,
  loadingDelete,
  userId,
}) => {
  const [openRepliesInput, setOpenRepliesInput] = useState(false);
  const [user] = useAuthState(auth);
  const { postStateValue } = usePosts();
  return (
    <Flex>
      <Box mr={2}>
        <Icon as={FaReddit} fontSize={30} color="gray.300" />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" fontSize="8pt">
          <Text>{comment.creatorDisplayText}</Text>
          <Text color="gray.600">
            {moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}
          </Text>
          {loadingDelete && <Spinner size="sm" />}
        </Stack>
        <Text fontSize="10pt">{comment.text}</Text>
        <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          <Icon
            as={BsReply}
            _hover={{ color: "blue.500" }}
            onClick={() => setOpenRepliesInput(true)}
          />
          {userId === comment.creatorId && (
            <>
              <Icon
                as={AiOutlineDelete}
                _hover={{ color: "blue.500" }}
                onClick={() => onDeleteComment(comment)}
              />
            </>
          )}
        </Stack>
        <Replies
          user={user as User}
          comment={comment as Comment}
          selectedPost={postStateValue.selectedPost}
          communityId={postStateValue.selectedPost?.communityId as string}
        />
      </Stack>
    </Flex>
  );
};
export default CommentItem;
