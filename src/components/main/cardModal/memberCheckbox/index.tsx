import "./index.css";
import { IUser } from '../../../../services/user.service';

interface MemberCheckboxProps {
  cardId: string
  users: any[]
  dispatch: void
  user: IUser
  handleCheckboxClicks: any // Wrong
}

export default function MemberCheckbox(props: MemberCheckboxProps) {
  const { user, cardId, dispatch, users, handleCheckboxClicks } = props;
  const set = new Set(user.subscribed_to_cards);
  const userHasTheId = set.has(cardId);
  
  return (
    <div className="user">
      <span className='member-firstname'>
        {user.firstName}
      </span>
      <input
        className="member-checkbox"
        type="checkbox"
        defaultChecked={userHasTheId}
        onClick={(event) => {
          let data = {
            users,
            user,
            cardId,
          };
          handleCheckboxClicks(event, data, dispatch);
        }}
      />
    </div>
  );
}
