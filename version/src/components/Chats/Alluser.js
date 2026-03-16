import { useContext, useMemo } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";


function AllUser() {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat ,onlineUsers } = useContext(ChatContext);

  const onlineUserIds = useMemo(() => {
    return new Set((onlineUsers ?? []).map((u) => u?.userid).filter(Boolean));
  }, [onlineUsers]);

  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => { 

            return (
              <div
                className="single-user"
                key={u?.userid ?? index}
                onClick={() => {
                  if (!user?.id || !u?.userid) return;
                  createChat(user.id, u.userid);
                }}
              >
                {u.fullname}
                <span className={
                  onlineUserIds.has(u?.userid) 
                  ?"user-online" : ""}></span>
              </div>
            );
          })}
      </div>
    </>
  );
}



export default AllUser;