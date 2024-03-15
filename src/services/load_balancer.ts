export type ServerInfo = {
  host: string;
  port: number;
  percentage: number;
};

export class LoadBalancer {
  private serversInfo: ServerInfo[] = [];
  private currentServerIndex = 0;
  private counter = 0;

  updateInfo(serversInfo: ServerInfo[]) {
    this.serversInfo = serversInfo;
    this.currentServerIndex = 0;
    this.counter = 0;
  }

  getNextServer() {
    const minPercentage = Math.min(...this.serversInfo.map((server) => server.percentage));
    const server = this.serversInfo[this.currentServerIndex];
    this.counter += 1;

    if (this.counter >= server.percentage / minPercentage) {
      this.currentServerIndex = (this.currentServerIndex + 1) % this.serversInfo.length;
      this.counter = 0;
    }

    return server;
  }
}
