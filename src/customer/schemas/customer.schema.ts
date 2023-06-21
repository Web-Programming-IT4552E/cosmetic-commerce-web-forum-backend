import { prop } from '@typegoose/typegoose';
import { User } from '../../user/schemas/user.schema';
import { CustomerRank } from '../enums/customer-rank.enum';

export class Customer extends User {
  /**
   * customer rank
   * when customer's point reach to a number required for a rank level
   * their rank will be updated
   * @default 0
   */
  @prop({ enum: CustomerRank, default: CustomerRank.BRONZE })
  rank: CustomerRank;

  /**
   * customer point
   * customer earn point when purchased products
   * customer can use this point to buy voucher/discount-code
   * when purchasing vouchers, points will be consumed
   * @default 0
   */
  @prop({ required: false, default: 0 })
  point: number;

  /**
   * customer rank point
   * customer earn point when purchased products
   * rank point to mark the loyal point of a customer
   * this point won't be deducted
   * @default 0
   */
  @prop({ required: false, default: 0 })
  rank_point: number;
}
