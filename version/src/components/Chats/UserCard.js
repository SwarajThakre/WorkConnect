import { useFetchRecipientUser } from "../../hooks/useFetchReceipent"
import { Stack } from "react-bootstrap";
import avarter from "../assets/avarter.svg";
import moment from "moment";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utilities/unreadNotifications";


function UserCard({chat,user}) {
  const {recipientUser} = useFetchRecipientUser(chat,user);
  const {onlineUsers, notifications} = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);

  const isOnline = onlineUsers?.some(
    (user) => user?.userid === recipientUser?.userid
  );

  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId === recipientUser?.id
  );

  return (
    <>
     <Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justify-content-between" role="button">
      <div className="d-flex">
        <div className="me-2"> 
            <img src={avarter} alt="avatar" height="35px"/>
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.fullname}</div>
          <div className="text">Message</div>
        </div>
      </div>
      <div className="d-flex flex-column align-item-end">
          <div className="date">
          {moment().calendar()}
          </div>
          <div
            className={
              thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
            }
          >
            {thisUserNotifications?.length > 0
              ? thisUserNotifications?.length
              : ""}
          </div>
      </div>
      <div>
      <span className={isOnline ? "user-online" : ""}></span>
      </div>
     </Stack>
    </>
  )
}

export default UserCard;
