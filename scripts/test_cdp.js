const { spawn } = require('child_process');
const http = require('http');

async function testEdgeCDP() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--remote-debugging-port=9225',
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=430,932',
    'about:blank'
  ]);

  console.log('Edge launched with PID:', edge.pid);
  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch('http://127.0.0.1:9225/json/list');
    const data = await res.json();
    console.log('CDP Target List:', data);
    if (data[0] && data[0].webSocketDebuggerUrl) {
      console.log('WebSocket URL found:', data[0].webSocketDebuggerUrl);
      const ws = new WebSocket(data[0].webSocketDebuggerUrl);
      ws.onopen = () => {
        console.log('Connected to Edge via WebSocket!');
        ws.send(JSON.stringify({ id: 1, method: 'Browser.getVersion' }));
      };
      ws.onmessage = (event) => {
        console.log('Message from Edge:', event.data);
        ws.close();
        edge.kill();
      };
    }
  } catch (err) {
    console.error('Error connecting to Edge CDP:', err);
    edge.kill();
  }
}

testEdgeCDP();
