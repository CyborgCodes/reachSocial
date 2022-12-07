import { Flex, Icon, Spinner, Stack, Text, Box, Image } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import { Profile } from "../../../atoms/profileAtom";
import { auth } from "../../../firebase/clientApp";
import usePosts from "../../../src/hooks/usePosts";
import Replies from "./Replies";
import { GiFireBottle } from "react-icons/gi";
import RepliesInput from "./RepliesInput";
import { useRouter } from "next/router";

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
  profileData: Profile;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDeleteComment,
  loadingDelete,
  userId,
  profileData,
}) => {
  const [user] = useAuthState(auth);
  const { postStateValue } = usePosts();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Flex>
      <Box mr={2}>
        <Icon as={GiFireBottle} fontSize={30} color="green.300" />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" fontSize="8pt">
          <Text fontSize="8pt">By</Text>
          <Text
            fontSize="8pt"
            color="blue.500"
            _hover={{ color: "gray.600", cursor: "pointer" }}
            onClick={() => router.push(`/Profile/${comment.creatorId}`)}
          >
            @{comment.creatorDisplayText}
          </Text>
          <Text color="gray.600">
            {moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}
          </Text>
          {loadingDelete && <Spinner size="sm" />}
        </Stack>
        <Text fontSize="10pt">{comment.text}</Text>
        <Stack
          direction="row"
          align="center"
          cursor="pointer"
          color="gray.500"
          spacing={1}
        >
          {isOpen ? (
            <Icon
              as={BsReply}
              _hover={{ color: "blue.500" }}
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <Icon
              as={BsReply}
              _hover={{ color: "blue.500" }}
              onClick={() => setIsOpen(true)}
            />
          )}
          <Text fontSize="9pt" align="center">
            Replies
          </Text>
          {userId === comment.creatorId && (
            <>
              <Icon
                as={AiOutlineDelete}
                _hover={{ color: "red.500" }}
                onClick={() => onDeleteComment(comment)}
              />
            </>
          )}
          {userId === comment.creatorId && (
            <>
              <Text fontSize="9pt" align="center">
                Delete
              </Text>
            </>
          )}
        </Stack>
        {isOpen ? (
          <Replies
            user={user as User}
            comment={comment as Comment}
            selectedPost={postStateValue.selectedPost}
            communityId={postStateValue.selectedPost?.communityId as string}
          />
        ) : null}
      </Stack>
    </Flex>
  );
};
export default CommentItem;
