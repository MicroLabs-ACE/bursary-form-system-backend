import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserMeta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  secret: string;
}
