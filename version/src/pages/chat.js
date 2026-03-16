import { useContext } from "react";
import { Container,Stack } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import UserCard from "../components/Chats/UserCard";
import Chatbox from "../components/Chats/Chatbox";
import { AuthContext } from "../context/AuthContext";
import AllUser from "../components/Chats/Alluser";

const Chat = () => {
  const { user } = useContext(AuthContext);

  const { userChats, isUserChatsLoading, updateCurrentChat } =
    useContext(ChatContext);

  return (
    <Container>
      <AllUser />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Fetching Chats..</p>}
            {!isUserChatsLoading && userChats?.length === 0 && <p>No Chats..</p>}
            {userChats?.map((chat, index) => {
              return (
                <div key={chat?.id ?? index} onClick={() => updateCurrentChat(chat)}>
                  <UserCard chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <Chatbox />
        </Stack>
      )}
    </Container>
  );
};

export default Chat;