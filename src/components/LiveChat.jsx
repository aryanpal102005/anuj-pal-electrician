import React, { useState } from 'react';

function LiveChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([{ from: 'support', text: 'Hello! Need help? Ask us anything 😊' }]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat([...chat, { from: 'user', text: message }]);
    setTimeout(() => {
      setChat(prev => [...prev, { from: 'support', text: 'Thanks! We will get back to you shortly.' }]);
    }, 1000);
    setMessage('');
  };

  return (
    <>
      <div className="floating-chat" onClick={() => setOpen(!open)} style={{ textDecoration: 'none', color: 'white' }}>
        💬
      </div>
      {open && (
        <div style={{ position: 'fixed', bottom: '170px', right: '20px', width: '300px', background: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.2)', zIndex: 1000 }}>
          <div style={{ background: '#667eea', color: 'white', padding: '0.5rem', borderRadius: '10px 10px 0 0', display: 'flex', justifyContent: 'space-between' }}>
            <strong>Live Chat</strong>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem' }}>✕</button>
          </div>
          <div style={{ height: '300px', overflowY: 'auto', padding: '0.5rem' }}>
            {chat.map((msg, idx) => (
              <div key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', marginBottom: '0.5rem' }}>
                <span style={{ background: msg.from === 'user' ? '#667eea' : '#e9ecef', color: msg.from === 'user' ? 'white' : 'black', padding: '0.3rem 0.8rem', borderRadius: '10px', display: 'inline-block' }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ padding: '0.5rem', borderTop: '1px solid #ddd', display: 'flex' }}>
            <input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }} />
            <button onClick={sendMessage} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px' }}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default LiveChat;