import { Entity } from 'typeorm-plus/decorator/entity/Entity';
import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm-plus';
import { UserProfileDetail } from '../domain/User';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ unique: true })
  public phone: string;

  @Column('jsonb')
  public profileDetail: UserProfileDetail;

  @CreateDateColumn({ default: () => `now()` })
  public createdAt?: Date;

  @UpdateDateColumn({ default: () => `now()` })
  public updatedAt?: Date;
}
