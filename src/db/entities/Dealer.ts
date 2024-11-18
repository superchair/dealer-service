import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Dealer {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  name!: string;
}