import "./index.css";

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

interface MemberCheckboxProps {
  cardId: string
  users: any[]
  dispatch: void
  user: User
  handleCheckboxClicks: any // Wrong
}

export default function MemberCheckbox(props: MemberCheckboxProps) {
  const { user, cardId, dispatch, users, handleCheckboxClicks } = props;
  console.log(user, 'user')
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
