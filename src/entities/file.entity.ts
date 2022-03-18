import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import supertest from 'supertest';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  folder: string;

  @Column()
  fileName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  // constructor(folder: string, fileName: string) {
  //   this.folder = folder;
  //   this.fileName = fileName;
  // }
  
  // constructor(partial: Partial<File> = {}) {
  //   Object.assign(this, partial);
  // }
}
