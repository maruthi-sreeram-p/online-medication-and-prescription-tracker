import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Avatar,
  IconButton, Paper, Chip, CircularProgress
} from '@mui/material';
import { Send, SmartToy, Person, Close, AutoAwesome } from '@mui/icons-material';

/**
 * AI CHAT COMPONENT
 * Purpose: Role-based AI assistant for all users
 * Roles: Admin, Doctor, Patient, Staff
 */
const AiChat = ({ role = 'Patient', onClose }) => {

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'ai',
      text: getRoleWelcome(role)
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message based on role
  function getRoleWelcome(role) {
    if (role === 'DOCTOR') return "👨‍⚕️ Hello Doctor! I can help you with clinical summaries, drug interactions, and patient insights. How can I assist?";
    if (role === 'PATIENT') return "😊 Hello! I'm your personal health assistant. I can explain your medicines, give health tips, and answer your questions simply!";
    if (role === 'STAFF') return "🏥 Hello! I can help you with patient care reminders, medicine schedules, and shift-related queries!";
    if (role === 'ADMIN') return "🛡️ Hello Admin! I can help with system queries, user management insights, and data reports!";
    return "Hello! How can I help you today?";
  }

  // Get role color
  const getRoleColor = (role) => {
    if (role === 'DOCTOR') return '#0062ff';
    if (role === 'PATIENT') return '#2e7d32';
    if (role === 'STAFF') return '#f57f17';
    if (role === 'ADMIN') return '#6a1b9a';
    return '#0062ff';
  };

  const roleColor = getRoleColor(role);

  // Send message to AI server
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, role: role })
      });

      const data = await response.json();
      const aiMessage = {
        id: Date.now() + 1,
        from: 'ai',
        text: data.reply || "Sorry, I couldn't process that. Try again!"
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'ai',
        text: "⚠️ AI server is not reachable. Make sure it's running on port 5001!"
      }]);
    }

    setLoading(false);
  };

  // Send on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 380,
        height: 520,
        bgcolor: 'white',
        borderRadius: 4,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        border: `2px solid ${roleColor}20`
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderRadius: '16px 16px 0 0',
          background: `linear-gradient(135deg, ${roleColor}, ${roleColor}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 38, height: 38 }}>
            <SmartToy sx={{ color: 'white', fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography fontWeight="bold" sx={{ color: 'white', fontSize: '0.95rem' }}>
              MediCare AI
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                Online
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={role}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, fontSize: '0.7rem' }}
          />
          {onClose && (
            <IconButton onClick={onClose} sx={{ color: 'white', p: 0.5 }}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          bgcolor: '#f8fafc'
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
            {/* AI Avatar */}
            {msg.from === 'ai' && (
              <Avatar sx={{ bgcolor: roleColor, width: 28, height: 28 }}>
                <SmartToy sx={{ fontSize: 16, color: 'white' }} />
              </Avatar>
            )}

            {/* Message Bubble */}
            <Paper
              sx={{
                p: 1.5,
                maxWidth: '75%',
                borderRadius: msg.from === 'user'
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                bgcolor: msg.from === 'user' ? roleColor : 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: msg.from === 'ai' ? '1px solid #e2e8f0' : 'none'
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: msg.from === 'user' ? 'white' : '#1e293b',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
              </Typography>
            </Paper>

            {/* User Avatar */}
            {msg.from === 'user' && (
              <Avatar sx={{ bgcolor: '#e2e8f0', width: 28, height: 28 }}>
                <Person sx={{ fontSize: 16, color: '#64748b' }} />
              </Avatar>
            )}
          </Box>
        ))}

        {/* Loading */}
        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: roleColor, width: 28, height: 28 }}>
              <SmartToy sx={{ fontSize: 16, color: 'white' }} />
            </Avatar>
            <Paper sx={{ p: 1.5, borderRadius: '16px 16px 16px 4px', border: '1px solid #e2e8f0' }}>
              <Box display="flex" gap={0.5} alignItems="center">
                <CircularProgress size={12} sx={{ color: roleColor }} />
                <Typography variant="caption" color="textSecondary">AI is thinking...</Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #e2e8f0',
          bgcolor: 'white',
          borderRadius: '0 0 16px 16px',
          display: 'flex',
          gap: 1
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: '0.85rem'
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{
            minWidth: 44,
            width: 44,
            height: 40,
            borderRadius: 2,
            bgcolor: roleColor,
            p: 0,
            '&:hover': { bgcolor: roleColor, opacity: 0.9 }
          }}
        >
          <Send sx={{ fontSize: 18 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default AiChat;