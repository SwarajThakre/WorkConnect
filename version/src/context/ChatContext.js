import { createContext,useEffect,useState,useCallback, useContext } from "react";
import { baseUrl,postRequest, getRequest } from "../utilities/service";
import { AuthContext } from "./AuthContext";
import {io} from 'socket.io-client'


export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const {user} = useContext(AuthContext)
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat,setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [messagesError, setMessagesError] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [notifications , setNotifications] = useState([]);
    const [allUsers,setAllUsers] = useState([]);


      // initialize socket
  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // getOnlineUsers
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUsers", user?.id);
    socket.on("getOnlineUsers" , (res) =>{
        setOnlineUsers(res)
    });
    return () => {
      socket.off('getOnlineUsers');
    };
    // eslint-disable-next-line
  }, [socket]);

  //sendMessagestoserver
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members.find((id) => id !== user?.id);
    socket.emit("sendMessage",{...newMessage, recipientId})
    // eslint-disable-next-line
  }, [newMessage]);

  //get message and notification
  useEffect(() => {
    if (socket === null) return;
    
    socket.on("getMessage", (res) => {
      if (currentChat?.id !== res.chatid) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((Id) => Id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });
    return () => {
      socket.off("getNotification")
      socket.off("getMessage");
    };
  }, [socket, currentChat]);

    //get All user
    useEffect(()=>{
        const getUsers = async() => {
          const response = await getRequest(`${baseUrl}/users`);

          if(response.error){
            return console.log("Error fetching users:", response);
          }
          const pChats = response.filter((u)=>{ 
            let isChatCreated = false;

            if(user?.id === u.userid) return false;

            if(userChats){
              isChatCreated = userChats?.some((chat)=>{
                return chat.members[0] === u.userid || chat.members[1] === u.userid
              })
            }
            return !isChatCreated
          });
          setPotentialChats(pChats)
          setAllUsers(response);
        };
        getUsers();
        // eslint-disable-next-line
    },[userChats]);
    
    //Get Message
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);

      try {
        const response = await getRequest(`${baseUrl}/messages/${currentChat?.id}`);
        setIsMessagesLoading(false);

        if (response.error) {
          setMessagesError(response);
        } else {
          setMessages(response);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsMessagesLoading(false);
        setMessagesError("Failed to fetch messages.");
      }
    };
      getMessages();
  }, [currentChat]);

  //Get User Chat
    useEffect(() => {
      const getUserChats = async () => {
        if (user?.id) {
          setIsUserChatsLoading(true);
        setUserChatsError(null);
          const response = await getRequest(`${baseUrl}/chat/${user?.id}`);
  
          if (response.error) {
            return setUserChatsError(response);
          }
          setUserChats(response);
        }
        setIsUserChatsLoading(false);
      };
      getUserChats();
    }, [user]);



    const sendTextMessage = useCallback(
      async (textMessage, sender, currentChatId, setTextMessage) => {
        if (!textMessage) return console.log("You must type something...");
    
        const requestData = {
          chatId: currentChatId,
          senderId: sender.id,
          text: textMessage,
        };
    
        console.log("Sending message:", JSON.stringify(requestData));
    
        const response = await postRequest(
          `${baseUrl}/messages`,
          JSON.stringify(requestData)
        );
    
        if (response.error) {
          return setSendTextMessageError(response);
        }
    
        setNewMessage(response);
        setMessages((prev) => [...prev, response]);
        setTextMessage("");
      },
      []
    );
    
  
      // update chat
    const updateCurrentChat = useCallback(async (chat) => {
      setCurrentChat(chat);
    }, []);
    
      //CreateChat
      const createChat = useCallback(
        async (senderId, receiverId) => {
          const response = await postRequest(
            `${baseUrl}/chat`,
            JSON.stringify({ senderId, receiverId })
          );
      
          if (response.error) {
            return console.log("Error creating chat:", response);
          }
      
          setUserChats((prev) => [...prev, response]);
        },
        []
      );
      const markAllNotificationsAsRead = useCallback((notifications) => {
    const modifiedNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(modifiedNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      // find chat to open
      const readChat = userChats.find((chat) => {
        const chatMembers = [user.userid, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      // mark notification as read
      const modifiedNotifications = notifications.map((element) => {
        if (n.senderId === element.senderId) {
          return { ...n, isRead: true };
        } else {
          return element;
        }
      });

      updateCurrentChat(readChat);
      setNotifications(modifiedNotifications);
    },
    // eslint-disable-next-line
    []
  );
        
    return (
      <ChatContext.Provider
        value={{
          userChats,
          currentChat,
          isUserChatsLoading,
          userChatsError,
          potentialChats,
          createChat,
          updateCurrentChat,
          messages,
          messagesError,
          isMessagesLoading,
          sendTextMessage,
          sendTextMessageError,
          newMessage,
          onlineUsers,
          notifications,
          allUsers,
          markAllNotificationsAsRead,
          markNotificationAsRead
        }}
      >
        {children}
      </ChatContext.Provider>
    );
  };
  