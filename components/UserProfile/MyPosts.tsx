import { Box, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../atoms/postsAtom";
import { Profile } from "../../atoms/profileAtom";
import { auth, firestore } from "../../firebase/clientApp";
import usePosts from "../../src/hooks/usePosts";
import PostItem from "../Posts/PostItem";
import PostLoader from "../Posts/PostLoader";

type MyPostsProps = {
  post: Post;
  profileData: Profile;
};

const MyPosts: React.FC<MyPostsProps> = ({ post, profileData }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onLike,
    onSelectPost,
    onDeletePost,
  } = usePosts();

  const getPosts = async () => {
    try {
      setLoading(true);
      //get posts for this community
      const postsQuery = query(
        collection(firestore, "posts"),
        where("creatorId", "==", profileData?.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);

      //Store in post state
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [profileData]);
  return (
    <>
      <Flex
        align="center"
        bg={useColorModeValue("white", "gray.900")}
        fontWeight={700}
        height="56px"
        borderRadius={4}
        border="1px solid"
        p={2}
        borderColor={useColorModeValue("gray.300", "gray.700")}
        mb={4}
      >
        <Text cursor="context-menu">My Posts</Text>
      </Flex>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((item) => (
            <PostItem
              key={item.id}
              post={item}
              userIsCreator={user?.uid === item.creatorId}
              userLikeValue={
                postStateValue.postLikes.find((like) => like.postId === item.id)
                  ?.likeValue
              }
              onLike={onLike}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default MyPosts;
