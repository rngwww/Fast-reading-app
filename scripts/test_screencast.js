const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testScreencast() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--remote-debugging-port=9226',
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=430,932',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const res = await fetch('http://127.0.0.1:9226/json/list');
    const targets = await res.json();
    const pageTarget = targets.find(t => t.type === 'page');
    console.log('Page target:', pageTarget);

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let frameCount = 0;

    ws.onopen = async () => {
      console.log('Connected to page!');
      // Navigate to google or blank
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({
        id: 2,
        method: 'Page.navigate',
        params: { url: 'https://example.com' }
      }));
      await new Promise(r => setTimeout(r, 1000));

      // Start screencast
      console.log('Starting screencast...');
      ws.send(JSON.stringify({
        id: 3,
        method: 'Page.startScreencast',
        params: { format: 'jpeg', quality: 85, everyNthFrame: 1 }
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.screencastFrame') {
        frameCount++;
        const { sessionId, data, metadata } = msg.params;
        ws.send(JSON.stringify({
          method: 'Page.screencastFrameAck',
          params: { sessionId: msg.params.sessionId }
        }));
        if (frameCount === 1) {
          fs.writeFileSync('scripts/screencast_sample.jpg', Buffer.from(data, 'base64'));
          console.log('Saved first frame! Metadata:', metadata);
        }
        if (frameCount >= 15) {
          console.log('Received 15 frames successfully!');
          ws.send(JSON.stringify({ id: 4, method: 'Page.stopScreencast' }));
          ws.close();
          edge.kill();
        }
      }
    };
  } catch(e) {
    console.error('Error:', e);
    edge.kill();
  }
}

testScreencast();
