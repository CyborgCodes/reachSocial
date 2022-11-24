import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Profile {
  id: string;
  createdAt?: Timestamp;
  email: string;
  photoURL?: string;
  displayName: string;
}

export interface ProfileSnippet {
  id: string;
  displayName: string;
  photoURL?: string;
}

interface ProfileState {
  mySnippet: ProfileSnippet[];
  currentProfile?: Profile;
}

const defaultProfileState: ProfileState = {
  mySnippet: [],
};

export const profileState = atom<ProfileState>({
  key: "profileState",
  default: defaultProfileState,
});
