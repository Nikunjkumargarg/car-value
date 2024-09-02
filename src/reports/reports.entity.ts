import { Entity, Column, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Reports {
  @PrimaryColumn('uuid')
  id: string = uuidv4();
  @Column()
  email: string;
  @Column()
  password: string;
}
