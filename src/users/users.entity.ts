import { Entity, Column, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
//import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string = uuidv4();
  @Column()
  email: string;
  @Column()
  //@Exclude()
  password: string;
}
