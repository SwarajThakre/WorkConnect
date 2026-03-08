import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";


function AllUser() {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat ,onlineUsers } = useContext(ChatContext);
  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => { 

            return (
              <div
                className="single-user"
                key={index}
                onClick={() => createChat(user.id, u.userid)}  // Check this line
              >
                {u.fullname}
                <span className={
                  onlineUsers?.some((user) => user?.userid === u?.userid) 
                  ?"user-online" : ""}></span>
              </div>
            );
          })}
      </div>
    </>
  );
}



export default AllUser;