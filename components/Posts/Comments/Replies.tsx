import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Comment } from "../../../atoms/commentAtom";
import { Post, postState } from "../../../atoms/postsAtom";
import { firestore } from "../../../firebase/clientApp";
import RepliesInput from "./RepliesInput";
import RepliesItem, { Reply } from "./RepliesItem";

type RepliesProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
  comment: Comment;
};

const Replies: React.FC<RepliesProps> = ({
  user,
  selectedPost,
  communityId,
  comment,
}) => {
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const setPostState = useSetRecoilState(postState);

  const onCreateReply = async (replyText: string) => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      //create a reply document
      const replyDocRef = doc(
        collection(firestore, "comments", `${comment?.id}/replies`)
      );

      const newReply: Reply = {
        id: replyDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: replyText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(replyDocRef, newReply);

      newReply.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });
      await batch.commit();

      //update client recoil state
      setReplyText("");
      setReplies((prev) => [newReply, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateReply error", error);
    }
    setCreateLoading(false);
  };

  const onDeleteReply = async (replies: Reply) => {
    setLoadingDeleteId(replies.id);
    try {
      const batch = writeBatch(firestore);

      //delete a reply document
      const replyDocRef = doc(firestore, "replies", replies.id);
      batch.delete(replyDocRef);

      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });
      await batch.commit();

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));
      setReplies((prev) => prev.filter((item) => item.id !== replies.id));
    } catch (error) {
      console.log("onDeleteReply error", error);
    }
    setLoadingDeleteId("");
  };

  const getPostReplies = async () => {
    try {
      const repliesQuery = query(
        collection(firestore, "comments", `${comment?.id}/replies`),
        // where("postId", "==", selectedPost?.id),
        orderBy("createdAt")
      );
      const repliesDocs = await getDocs(repliesQuery);
      const replies = repliesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReplies(replies as Reply[]);
    } catch (error) {
      console.log("getPostReplies error", error);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostReplies();
  }, [selectedPost]);

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={4} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {replies.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                height="50px"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Replies Yet
                </Text>
              </Flex>
            ) : (
              <>
                {replies.map((replies) => (
                  <RepliesItem
                    key={replies.id}
                    reply={replies}
                    userId={user.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoading && (
          <RepliesInput
            replyText={replyText}
            setReplyText={setReplyText}
            user={user}
            createLoading={createLoading}
            onCreateReply={onCreateReply}
          />
        )}
      </Flex>
    </Box>
  );
};
export default Replies;
