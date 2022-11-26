import { Stack, Text } from "@chakra-ui/react";
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

type MyPostsLikesProps = {
  post: Post;
  profileData: Profile;
};

const MyPostsLikes: React.FC<MyPostsLikesProps> = ({ post, profileData }) => {
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
        where("creatorId", "==", user?.uid),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);

      //Store in post state
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      console.log("posts", posts);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [user]);
  return (
    <>
      <Text mb={2}>My Posts</Text>
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
export default MyPostsLikes;
