import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaTypes } from 'mongoose';
import {
  UserInfo,
  userInfo,
  platform,
  hostname,
  version,
  machine,
  arch,
} from 'os';

@Schema()
export class MyUserInfo implements UserInfo<string> {
  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'User Name',
    default: userInfo().username,
  })
  username: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'UID',
    default: userInfo().uid,
  })
  uid: number;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'GID',
    default: userInfo().gid,
  })
  gid: number;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Shell',
    default: userInfo().shell,
  })
  shell: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'User Name',
    default: userInfo().username,
  })
  homedir: string;

  constructor() {
    const ui = userInfo();
    this.gid = ui.gid;
    this.homedir = ui.homedir;
    this.shell = ui.shell;
    this.uid = ui.uid;
    this.username = ui.username;
  }
}

@Schema()
export class HardwareInfo {
  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Architecture',
    description: 'The architecture type of the host platform.',
    default: arch(),
  })
  arch: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Host Name',
    description: 'The name of the host environment.',
    default: hostname(),
  })
  hostname: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Machine',
    description: 'The machine type of the host platform.',
    default: machine(),
  })
  machine: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Platform',
    description: 'The name of the host platform.',
    default: platform(),
  })
  platform: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Version',
    description: 'The version of the host platform.',
    default: version(),
  })
  version: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.Mixed,
    title: 'User Info',
    description: 'Info about the user.',
    default: new MyUserInfo(),
  })
  userinfo: MyUserInfo;

  constructor() {
    this.arch = arch();
    this.hostname = hostname();
    this.machine = machine();
    this.platform = platform();
    this.version = version();
    this.userinfo = new MyUserInfo();
  }
}

export const UserInfoSchema = SchemaFactory.createForClass(MyUserInfo);
export const HardwareInfoSchema = SchemaFactory.createForClass(HardwareInfo);
