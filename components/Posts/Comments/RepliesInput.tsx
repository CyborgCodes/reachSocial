import { Flex, Textarea, Button, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useState } from "react";
import AuthButtons from "../../Navbar/RightContent/AuthButtons";

type RepliesInputProps = {
  replyText: string;
  setReplyText: (value: string) => void;
  user: User;
  createLoading: boolean;
  onCreateReply: (replyText: string) => void;
};

const RepliesInput: React.FC<RepliesInputProps> = ({
  replyText,
  setReplyText,
  user,
  createLoading,
  onCreateReply,
}) => {
  return (
    <Flex direction="column" position="relative">
      {user ? (
        <>
          <Text mb={1}>
            Reply as{" "}
            <span style={{ color: "#3182CE" }}>
              {user?.email?.split("@")[0]}
            </span>
          </Text>
          <Textarea
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            placeholder="What is your reply?"
            fontSize="10pt"
            borderRadius={4}
            minHeight="95px"
            minWidth="350px"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid black",
            }}
          />
          <Flex
            position="absolute"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg="gray.100"
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <Button
              height="26px"
              disabled={!replyText.length}
              isLoading={createLoading}
              onClick={() => onCreateReply(replyText)}
            >
              Reply
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Log in or sign up to leave a reply</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default RepliesInput;
