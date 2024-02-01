export interface IInfoResponse {
  arch: string;
  hostname: string;
  machine: string;
  platform: string;
  version: string;
  userinfo: {
    gid: number;
    homedir: string;
    shell: string;
    uid: number;
    username: string;
  };
}
