import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("dealers")
export class Dealer {
  @PrimaryGeneratedColumn('uuid')
  id?: number;

  @Column()
  name!: string;
}