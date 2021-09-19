import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Avatar } from "@material-ui/core";
import './index.css'

export default function Member(props) {
  const { user, index } = props;
  return (
    <Draggable index={index} draggableId={user.id} key={user.id}>
      {(provided) => (
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
