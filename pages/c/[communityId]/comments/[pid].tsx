import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PageContent from "../../../../components/Layout/PageContent";
import PostItem from "../../../../components/Posts/PostItem";
import { auth } from "../../../../firebase/clientApp";
import usePosts from "../../../../src/hooks/usePosts";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onLike } =
    usePosts();

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
        {/* Comments */}
      </>
      {/* <>{About}</> */}
    </PageContent>
  );
};
export default PostPage;
