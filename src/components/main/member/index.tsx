import { Draggable } from "react-beautiful-dnd";
import { Avatar } from "@material-ui/core";
import './index.css'
import { IUser } from "../../../services/user.service";

interface MemberProps {
  user: IUser
  index: number
}

export default function Member({ user, index }: MemberProps) {
  return (
    <Draggable index={index} draggableId={user.id} key={user.id}>
      {(provided: any) => (
        <div
          className="member"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <h3 className='avatar-name'>
            {user.firstName}
          </h3>
          <Avatar {...provided.dragHandleProps}>
            {user.firstName[0]}
          </Avatar>
        </div>
      )}
    </Draggable>
  );
}
