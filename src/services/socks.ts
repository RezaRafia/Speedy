import * as net from 'net';
import { LoadBalancer, ServerInfo } from './load_balancer';


const loadBalancer = new LoadBalancer()

const server = net.createServer();

let outputLogList: string[] = []

function outputLog(message: string){
  outputLogList.push(message)
}

server.on('connection', (clientConn) => {

  clientConn.on('error', (err) => outputLog(err.message))
  clientConn.on('end', outputLog)
  clientConn.on('close', outputLog)

  clientConn.once('data', (data) => {
    const version = data[0];
    const nMethods = data[1];
    clientConn.write(Buffer.from([0x05, 0x00])); // No authentication required

    clientConn.once('data', (requestData) => {
      const version = requestData[0];
      const cmd = requestData[1];
      const addressType = requestData[3];
      let address: string;
      let port: number;

      if (version !== 0x05) {
        outputLog(`Unsupported SOCKS version: ${version}`);
        clientConn.end();
        return;
      }

      if (cmd !== 0x01) {
        outputLog(`Unsupported command: ${cmd}`);
        clientConn.end();
        return;
      }

      if (addressType === 0x01) { // IPv4
        address = requestData.slice(4, 8).join('.');
        port = requestData.readUInt16BE(8);
      } else if (addressType === 0x03) { // Domain name
        const domainLength = requestData[4];
        address = requestData.slice(5, 5 + domainLength).toString();
        port = requestData.readUInt16BE(5 + domainLength);
      } else {
        outputLog(`Unsupported address type: ${addressType}`);
        clientConn.end();
        return;
      }

      const targetServerInfo = loadBalancer.getNextServer()
      outputLog(`${targetServerInfo.host}:${targetServerInfo.port} -> ${address}:${port}`);

      const targetServer = net.createServer((targetConn) => {
    
        const destinationConn = net.connect(port, address);
        targetConn.pipe(destinationConn);
        destinationConn.pipe(targetConn);

        targetConn.on('error', (err) => outputLog(err.message))
        destinationConn.on('error', (err) => outputLog(err.message))
      
        targetConn.on('end', () => {
          destinationConn.end();
        });
      
        destinationConn.on('end', () => {
          targetConn.end();
        });
      });
      targetServer.listen(targetServerInfo.port, targetServerInfo.host);


      const targetConn = net.connect(targetServerInfo.port, targetServerInfo.host, () => {
        const reply = Buffer.alloc(requestData.length);
        requestData.copy(reply);
        reply[1] = 0x00; // Success
        clientConn.write(reply);

        clientConn.pipe(targetConn);
        targetConn.pipe(clientConn);
      });

      targetConn.on('end', () => {
        clientConn.end();
        targetServer.close()
      })

      targetConn.on('error', (err) => outputLog(err.message))

    });
  });
});


export function setLoadBalancer(interfaces: ServerInfo[] ){
  loadBalancer.updateInfo(interfaces)
}

export function serverStart(port: number){
  outputLogList = []
  server.listen(port, () => {
    outputLog(`SOCKS5 server listening on port ${port}...`)
  });
}

export function serverStop(){
  server.close(() => {
    outputLog('Server stopped');
  });
}

export function getOutputLog(): string[]{
  return outputLogList
}