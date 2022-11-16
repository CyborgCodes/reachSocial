import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../../../atoms/postsAtom";
import About from "../../../../components/Community/About";
import PageContent from "../../../../components/Layout/PageContent";
import Comments from "../../../../components/Posts/Comments/Comments";
import PostItem from "../../../../components/Posts/PostItem";
import { auth, firestore } from "../../../../firebase/clientApp";
import useCommunityData from "../../../../src/hooks/useCommunityData";
import usePosts from "../../../../src/hooks/usePosts";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onLike } =
    usePosts();

  //Fix singlePostPage not showing when refresh problem
  const router = useRouter();
  const { communityStateValue } = useCommunityData();
  //Help fetch post straight from firestore
  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error) {
      console.log("fetchPost error", error);
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onLike={onLike}
            onDeletePost={onDeletePost}
            userLikeValue={
              postStateValue.postLikes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.likeValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        <Comments
          user={user as User}
          selectedPost={postStateValue.selectedPost}
          communityId={postStateValue.selectedPost?.communityId as string}
        />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default PostPage;
