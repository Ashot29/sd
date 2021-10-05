import { Draggable } from "react-beautiful-dnd";
import { Avatar } from "@material-ui/core";
import './index.css'
import User from '../../users/basic-table';

interface User {
  age: number
  country: string
  created_at: number
  email: string
  firstName: string
  id: string
  lastName: string
  subscribed_to_cards: any[]
  updated_at?: number
  userModalMode: string
}

interface MemberProps {
  user: User
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
