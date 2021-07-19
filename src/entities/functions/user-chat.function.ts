import { ViewColumn, ViewEntity } from 'typeorm';


@ViewEntity({
  name:"get_user_chats(:userId)"
})
export class UserChat {

  @ViewColumn({name:'id'})
  userId: string;

  @ViewColumn({name:'first_name'})
  firstName: string;

  @ViewColumn({name:'last_name'})
  lastName: string;

  @ViewColumn({name:'is_inactive'})
  isInactive: boolean;
  
  @ViewColumn({name:'unread_message_count'})
  unreadMessageCount: number;

  @ViewColumn({name:'last_message_on'})
  lastMessageOn: Date;

}