export interface Admin {
  userprofileid: number;
  fullname: string;
  username: string;
  email: string;
  userrole: string;
  isactive: boolean;
  created_at: string;
  updated_at: string;
  isdeleted: boolean;
  deleted_at: any;
  subscription: any[];
}
