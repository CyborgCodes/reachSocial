import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

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

export type CommentReplies = {
  id: string;
  commentId: string;
  communityId: string;
};

interface CommentState {
  selectedComment: Comment | null;
  comments: Comment[];
  commentReplies: CommentReplies[];
}

const defaultCommentState: CommentState = {
  selectedComment: null,
  comments: [],
  commentReplies: [],
};

export const commentState = atom<CommentState>({
  key: "commentState",
  default: defaultCommentState,
});
