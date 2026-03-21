import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Avatar,
  IconButton, CircularProgress, Paper
} from '@mui/material';
import { Close, Send, SmartToy, Person } from '@mui/icons-material';

/**
 * AI CHAT COMPONENT
 *
 * Connects to the Python FastAPI ai-service running at http://localhost:8000
 * Endpoint: POST /api/chat/message
 * Body: { message: string, user_id: string }
 * Response: { reply: string }
 *
 * Usage in PatientDashboard.js (already wired up):
 *   import AiChat from '../../components/common/AiChat';
 *   <AiChat role="PATIENT" onClose={() => setShowAI(false)} />
 */
const AiChat = ({ role, onClose }) => {

  const patientId = localStorage.getItem('userId');
  const patientName = localStorage.getItem('name') || 'Patient';

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: `Hi ${patientName}! 👋 I'm your MediCare AI Assistant. I can help you with:\n\n• Your medication schedule\n• Dosage and timing questions\n• Side effects information\n• Drug interaction checks\n\nHow can I help you today?`
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Add user message to chat
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // POST to Python FastAPI ai-service
      const res = await fetch('http://localhost:8000/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user_id: String(patientId)
        })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      const botMsg = { id: Date.now() + 1, from: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      console.error('AI Chat error:', err);
      setError('Could not reach AI service. Make sure the Python server is running on port 8000.');
      // Show error as a bot message too
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'bot',
        text: '⚠️ I am having trouble connecting right now. Please make sure the AI service is running and try again.',
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Send on Enter key (Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Suggested quick questions
  const suggestions = [
    'What medicines do I take today?',
    'Can I take my medicine before meal?',
    'What are common side effects?',
    'When should I take my night dose?'
  ];

  return (
    <Paper
      elevation={8}
      sx={{
        width: 380,
        height: 520,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          bgcolor: '#2e7d32',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
            <SmartToy sx={{ color: 'white', fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" color="white">
              MediCare AI Assistant
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {loading ? 'Typing...' : 'Online'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* ── Messages ── */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            display="flex"
            justifyContent={msg.from === 'user' ? 'flex-end' : 'flex-start'}
            alignItems="flex-end"
            gap={1}
          >
            {/* Bot avatar */}
            {msg.from === 'bot' && (
              <Avatar sx={{ bgcolor: '#2e7d32', width: 28, height: 28, flexShrink: 0 }}>
                <SmartToy sx={{ fontSize: 16, color: 'white' }} />
              </Avatar>
            )}

            <Box
              sx={{
                maxWidth: '78%',
                px: 2,
                py: 1.2,
                borderRadius: msg.from === 'user'
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                bgcolor: msg.from === 'user'
                  ? '#2e7d32'
                  : msg.isError ? '#ffebee' : 'white',
                color: msg.from === 'user' ? 'white' : '#1e293b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: msg.from === 'bot' ? '1px solid #e2e8f0' : 'none'
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  fontSize: '0.82rem'
                }}
              >
                {msg.text}
              </Typography>
            </Box>

            {/* User avatar */}
            {msg.from === 'user' && (
              <Avatar sx={{ bgcolor: '#0062ff', width: 28, height: 28, flexShrink: 0, fontSize: 12, fontWeight: 'bold' }}>
                {patientName.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Box>
        ))}

        {/* Typing indicator */}
        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: '#2e7d32', width: 28, height: 28 }}>
              <SmartToy sx={{ fontSize: 16, color: 'white' }} />
            </Avatar>
            <Box
              sx={{
                px: 2, py: 1.2, bgcolor: 'white', borderRadius: '16px 16px 16px 4px',
                border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 0.5
              }}
            >
              <CircularProgress size={10} sx={{ color: '#2e7d32' }} />
              <Typography variant="caption" color="textSecondary" sx={{ ml: 0.5 }}>
                Thinking...
              </Typography>
            </Box>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* ── Quick suggestions (only shown at start) ── */}
      {messages.length === 1 && (
        <Box sx={{ px: 2, pb: 1, bgcolor: '#f8fafc', display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {suggestions.map((s, i) => (
            <Button
              key={i}
              size="small"
              variant="outlined"
              onClick={() => { setInput(s); }}
              sx={{
                borderRadius: 4,
                fontSize: '0.7rem',
                py: 0.3,
                px: 1,
                borderColor: '#2e7d32',
                color: '#2e7d32',
                '&:hover': { bgcolor: '#e8f5e9' }
              }}
            >
              {s}
            </Button>
          ))}
        </Box>
      )}

      {/* ── Input area ── */}
      <Box
        sx={{
          p: 1.5,
          bgcolor: 'white',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: 1,
          alignItems: 'flex-end'
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={3}
          size="small"
          placeholder="Ask about your medicines..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: '0.85rem'
            }
          }}
        />
        <IconButton
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          sx={{
            bgcolor: input.trim() && !loading ? '#2e7d32' : '#e2e8f0',
            color: input.trim() && !loading ? 'white' : '#94a3b8',
            borderRadius: 2,
            width: 40,
            height: 40,
            flexShrink: 0,
            '&:hover': { bgcolor: '#1b5e20' },
            transition: 'all 0.2s'
          }}
        >
          <Send fontSize="small" />
        </IconButton>
      </Box>

    </Paper>
  );
};

export default AiChat;