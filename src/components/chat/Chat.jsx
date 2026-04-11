/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
import React, { useState, useRef, useEffect } from 'react'
import { Send, Menu, Plus, MessageCircle, Loader, Copy, Settings, Code, Zap, Terminal, ArrowRight, AlertCircle } from 'lucide-react'
import { sendMessage } from '../../services/api'

function Chat() {
  // ============= STATE MANAGEMENT =============
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messageJustCopied, setMessageJustCopied] = useState(null)
  const [showEmptyState, setShowEmptyState] = useState(true)
  const [apiError, setApiError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const messagesEndRef = useRef(null)

  // ============= AUTO SCROLL TO BOTTOM =============
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ============= CHECK API CONNECTION ON MOUNT =============
  useEffect(() => {
    checkAPIConnection()
  }, [])

  /**
   * ✅ Check if backend is running
   * Ye check karta hai ke backend server chalu hai ya nahi
   */
  const checkAPIConnection = async () => {
    try {
      setIsConnecting(true)
      const response = await fetch('https://devsync-874r.onrender.com/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API Connected')
        console.log('Backend Status:', data)
        setApiError('')
      } else {
        console.log('❌ Response status:', response.status)
        setApiError('Backend not responding. Please check if server is running on port 8000.')
      }
    } catch (error) {
      setApiError('Cannot connect to backend. Make sure server is running on port 8000. (npm run start)')
      console.error('❌ API Connection Error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  // ============= SUGGESTED QUERIES =============
  const suggestedQueries = [
    {
      icon: <Code size={18} />,
      title: 'Explain Code',
      description: 'Help me understand this code snippet'
    },
    {
      icon: <Terminal size={18} />,
      title: 'Debug Issue',
      description: 'Debug this error in my application'
    },
    {
      icon: <Zap size={18} />,
      title: 'Optimize Code',
      description: 'How can I optimize this function?'
    },
    {
      icon: <ArrowRight size={18} />,
      title: 'Best Practices',
      description: 'Show me best practices for React'
    }
  ]

  const handleSuggestedQuery = (query) => {
    setInput(query.description)
  }

  // ============= SEND MESSAGE HANDLER =============
  /**
   * ✅ Main function - message bhejne aur response lene ke liye
   */
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // ✅ Check if API is available
    if (apiError) {
      setApiError('⚠️ Cannot send message - backend not connected. Please start the backend server.')
      return
    }

    setShowEmptyState(false)

    // ✅ Create user message object
    const userMessage = {
      id: messages.length + 1,
      author: 'You',
      content: input,
      timestamp: new Date(),
      type: 'user'
    }

    const userInput = input
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setApiError('')

    try {
      // ✅ Show "working" message immediately
      const workingMessage = {
        id: messages.length + 2,
        author: 'System',
        content: '⏳ Working on your request... Please wait',
        timestamp: new Date(),
        type: 'loading'
      }
      setMessages(prev => [...prev, workingMessage])

      // ✅ Call API with timeout (30 seconds)
      const response = await Promise.race([
        sendMessage(userInput),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout. Server taking too long.')), 30000)
        )
      ])

      // ✅ Remove "working" message and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.type !== 'loading')
        const botMessage = {
          id: filtered.length + 1,
          author: 'Dev AI',
          content: response.reply || response.message || '> Response received from server',
          timestamp: new Date(),
          type: 'bot'
        }
        return [...filtered, botMessage]
      })

      console.log('✅ Response received:', response)
    } catch (error) {
      console.error('❌ Error:', error)

      // ✅ Remove "working" message
      setMessages(prev => prev.filter(msg => msg.type !== 'loading'))

      let errorContent = ''

      // ✅ Handle different error types
      if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
        errorContent = '❌ Cannot connect to backend server.\n\nStart backend with:\n$ npm run start'
        setApiError('Backend is not running. Start it with: npm run start')
      } else if (error.message?.includes('timeout')) {
        errorContent = '❌ Request timeout - server is taking too long to respond.\n\nPossible issues:\n• Backend server is not running\n• Server is processing slowly\n• Network connection issue'
        setApiError('Backend timeout. Check server logs.')
      } else if (error.response?.status === 404) {
        errorContent = '❌ API endpoint not found (404)\n\nPossible issues:\n• Chat routes not properly mounted\n• Wrong API endpoint\n• Backend configuration issue'
        setApiError('API endpoint error. Check backend routes.')
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        errorContent = '❌ Authentication error\n\nPossible issues:\n• Invalid Gemini API key\n• Generative Language API not enabled'
        setApiError('API authentication error. Check your Gemini API key and .env file.')
      } else if (error.response?.status === 500) {
        errorContent = `❌ Server error (500): ${error.response?.data?.error || 'Internal server error'}\n\nCheck backend server logs for details.`
        setApiError('Backend server error. Check server logs.')
      } else if (error.message?.includes('Network')) {
        errorContent = '❌ Network error - unable to reach backend server.\n\nMake sure:\n• Backend is running on https://devsync-874r.onrender.com/n• Port 8000 is not blocked\n• Network connection is active'
        setApiError('Network error. Check backend connection.')
      } else {
        errorContent = `❌ Error: ${error.response?.data?.error || error.message || 'Unknown error occurred'}`
        setApiError(error.message || 'An error occurred')
      }

      const errorMessage = {
        id: messages.length + 2,
        author: 'System',
        content: errorContent,
        timestamp: new Date(),
        type: 'bot'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setShowEmptyState(true)
    setApiError('')
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setMessageJustCopied(id)
    setTimeout(() => setMessageJustCopied(null), 2000)
  }

  // ============= RENDER =============
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-black overflow-hidden">
      {/* ============= SIDEBAR ============= */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 text-emerald-50 transition-all duration-300 ease-in-out border-r border-emerald-900/30 flex flex-col shadow-2xl relative overflow-hidden`}>
        
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Logo */}
        <div className="p-4 border-b border-amber-900/30 flex items-center justify-between relative z-10">
          {sidebarOpen && (
            <div className="flex items-center gap-3 group">
              <div className={`w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-yellow-500/50 group-hover:shadow-yellow-400/70 transition-all ${
                isConnecting ? 'animate-pulse' : apiError ? 'opacity-60' : ''
              }`}>
                &lt;/&gt;
              </div>
              <div>
                <span className="font-mono font-bold text-base tracking-wider block text-yellow-400">Dev AI</span>
                <span className={`text-xs font-mono ${
                  isConnecting ? 'text-yellow-500' : apiError ? 'text-red-500' : 'text-amber-600'
                }`}>
                  {isConnecting ? 'connecting...' : apiError ? 'offline' : 'v1.0.0'}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-amber-900/30 rounded-lg transition-all hover:scale-110 hover:rotate-90 text-yellow-400"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        {sidebarOpen && (
          <button
            onClick={clearChat}
            className="m-4 flex items-center gap-2 w-full bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600 text-white px-4 py-3 rounded-lg font-mono font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/40 active:scale-95 group overflow-hidden relative text-sm disabled:opacity-50"
            disabled={loading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer"></div>
            <Plus size={18} />
            <span className="relative">$ new_chat</span>
          </button>
        )}

        {/* Chat History */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 relative z-10">
            <p className="text-xs text-amber-600 uppercase tracking-widest font-mono px-2 mb-3">// Recent Chats</p>
            
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-yellow-300 hover:bg-amber-900/30 hover:text-yellow-100 transition-all truncate group font-mono disabled:opacity-50"
                disabled={loading}
              >
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="flex-shrink-0 text-yellow-500 group-hover:animate-pulse" />
                  <span className="truncate text-xs">$ chat_{i}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Settings */}
        {sidebarOpen && (
          <div className="border-t border-amber-900/30 p-4 relative z-10">
            <button 
              onClick={checkAPIConnection}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-yellow-300 hover:bg-amber-900/30 hover:text-yellow-100 transition-all font-mono disabled:opacity-50"
              disabled={isConnecting}
            >
              <Settings size={16} className={isConnecting ? 'animate-spin' : ''} />
              {isConnecting ? 'checking...' : 'settings'}
            </button>
          </div>
        )}
      </div>

      {/* ============= MAIN AREA ============= */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 to-slate-950 relative overflow-hidden">
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(234, 179, 8, 0.05) 25%, rgba(234, 179, 8, 0.05) 26%, transparent 27%, transparent 74%, rgba(234, 179, 8, 0.05) 75%, rgba(234, 179, 8, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(234, 179, 8, 0.05) 25%, rgba(234, 179, 8, 0.05) 26%, transparent 27%, transparent 74%, rgba(234, 179, 8, 0.05) 75%, rgba(234, 179, 8, 0.05) 76%, transparent 77%, transparent)',
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        {/* TOP BAR */}
        <div className="border-b border-amber-900/20 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-20">
          <div>
            <h1 className="text-2xl font-mono font-bold text-yellow-400">
              $ Dev AI --help
            </h1>
            <p className="text-sm text-amber-600 mt-1 font-mono">
              {'>'} AI-powered coding assistant powered by Gemini
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isConnecting ? (
              <>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
                <span className="text-sm font-mono text-yellow-400">connecting...</span>
              </>
            ) : apiError ? (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                <span className="text-sm font-mono text-red-400">offline</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
                <span className="text-sm font-mono text-yellow-400">status: online</span>
              </>
            )}
          </div>
        </div>

        {/* ERROR BANNER */}
        {apiError && (
          <div className="bg-red-950/50 border-b border-red-900/50 px-6 py-3 flex items-start gap-3 relative z-20">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-mono text-red-300 whitespace-pre-wrap">{apiError}</p>
            </div>
            <button
              onClick={checkAPIConnection}
              className="text-xs font-mono text-red-400 hover:text-red-300 px-3 py-1 border border-red-600 rounded hover:bg-red-900/30 transition-all flex-shrink-0"
            >
              {isConnecting ? 'checking...' : 'retry'}
            </button>
          </div>
        )}

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth relative z-10">
          
          {/* Empty State with Query Suggestions */}
          {showEmptyState && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {/* Welcome Message */}
              <div className="max-w-2xl w-full animate-fadeIn">
                <div className="bg-gradient-to-r from-yellow-900/40 to-amber-950 border border-amber-900/50 rounded-lg p-8 backdrop-blur-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/50">
                      <Terminal className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-mono font-bold text-yellow-400 mb-2">
                        Hello, Developer! 👋
                      </h2>
                      <p className="text-yellow-300 font-mono text-sm leading-relaxed">
                        {">"} I'm your AI coding assistant powered by Google Gemini. Ask me anything about code, debugging, best practices, or optimization. Let's code together! 💚
                      </p>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="space-y-2 text-xs font-mono text-yellow-500 mb-6 border-l-2 border-yellow-600 pl-4">
                    <div>$ system status: {isConnecting ? '⏳ connecting' : apiError ? '❌ offline' : '✅ ready'}</div>
                    <div>$ backend url: http://localhost:8000</div>
                    <div>$ ai model: Google Gemini Pro</div>
                    <div>$ connection: {isConnecting ? '⏳ establishing...' : apiError ? '❌ failed' : '✅ established'}</div>
                  </div>
                </div>
              </div>

              {/* Query Suggestion Boxes */}
              {!apiError && (
                <div className="max-w-2xl w-full">
                  <p className="text-amber-600 font-mono text-xs mb-4 ml-2">// Suggested Queries</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedQueries.map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuery(query)}
                        disabled={loading || apiError}
                        className="group bg-gradient-to-br from-yellow-900/30 to-amber-950/50 border border-amber-900/50 hover:border-amber-700/50 rounded-lg p-4 transition-all hover:shadow-lg hover:shadow-yellow-500/20 hover:bg-yellow-900/40 text-left relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          animation: `slideInUp 0.5s ease-out ${idx * 0.1}s both`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-amber-500/0 to-yellow-500/0 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        
                        <div className="flex items-start gap-3 relative z-10">
                          <div className="w-8 h-8 rounded-lg bg-yellow-900/50 border border-amber-700 flex items-center justify-center flex-shrink-0 text-yellow-400 group-hover:scale-110 transition-transform">
                            {query.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-yellow-300 font-mono font-semibold text-sm mb-1">
                              {query.title}
                            </h3>
                            <p className="text-amber-600 font-mono text-xs leading-relaxed">
                              {query.description}
                            </p>
                          </div>
                          <ArrowRight size={16} className="text-yellow-600 group-hover:translate-x-1 transition-transform mt-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'} group`}
              style={{
                animation: `slideInMessage 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.05}s both`
              }}
            >
              {msg.type !== 'user' && (
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg transition-all group-hover:scale-110 ${
                  msg.type === 'loading'
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/50 animate-pulse'
                    : 'bg-gradient-to-br from-yellow-400 to-amber-600 shadow-yellow-500/50 group-hover:shadow-yellow-400/70'
                }`}>
                  <Terminal className="text-white" size={18} />
                </div>
              )}
              
              <div className="max-w-xs lg:max-w-2xl group/msg">
                <div className={`${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-yellow-600 to-amber-500 text-white rounded-lg rounded-tr-sm shadow-lg shadow-yellow-500/30'
                    : msg.type === 'loading'
                    ? 'bg-yellow-950/50 border border-yellow-900/50 text-yellow-100 rounded-lg rounded-tl-sm'
                    : 'bg-yellow-950/50 border border-amber-900/50 text-yellow-100 rounded-lg rounded-tl-sm'
                } px-5 py-3 transition-all group-hover/msg:shadow-xl relative overflow-hidden font-mono text-sm whitespace-pre-wrap break-words`}>
                  
                  <p className="leading-relaxed">
                    {msg.type === 'bot' && '> '}
                    {msg.type === 'loading' && '⏳ '}
                    {msg.content}
                  </p>
                  
                  {msg.type === 'bot' && (
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="absolute top-2 right-2 p-1.5 opacity-0 group-hover/msg:opacity-100 bg-yellow-900/50 hover:bg-yellow-800 rounded-lg transition-all"
                      title="Copy message"
                    >
                      {messageJustCopied === msg.id ? (
                        <span className="text-xs text-yellow-400">✓</span>
                      ) : (
                        <Copy size={14} className="text-yellow-400" />
                      )}
                    </button>
                  )}
                </div>
                
                <div className={`text-xs mt-2 font-mono ${
                  msg.type === 'user' ? 'text-right' : 'text-left'
                } ${msg.type === 'loading' ? 'text-yellow-700' : 'text-yellow-700'}`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>

              {msg.type === 'user' && (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/50 group-hover:shadow-yellow-400/70 transition-all group-hover:scale-110 font-mono">
                  $
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="border-t border-amber-900/20 bg-slate-950/80 backdrop-blur-md px-6 py-6 relative z-20">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3 group">
              <div className="flex-1 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-yellow-600 font-mono text-sm px-4 pointer-events-none">
                  $
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={apiError ? "Backend offline... Start server with: npm run start" : "Type your query here..."}
                  disabled={loading || apiError}
                  className="w-full pl-8 pr-5 py-3 bg-yellow-950/50 border border-amber-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all placeholder-yellow-700 text-yellow-100 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim() || apiError}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg font-mono font-semibold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-yellow-500/40 active:scale-95 disabled:cursor-not-allowed relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 group-hover/btn:animate-shimmer"></div>
                {loading ? (
                  <Loader size={18} className="animate-spin relative z-10" />
                ) : (
                  <Send size={18} className="relative z-10" />
                )}
              </button>
            </form>
            <p className={`text-xs text-center mt-3 font-mono ${
              apiError ? 'text-red-600' : 'text-yellow-700'
            }`}>
              {apiError 
                ? '❌ Waiting for backend connection...' 
                : loading 
                ? '⏳ Processing your request with Gemini AI...'
                : '$ Ready to chat | Powered by Google Gemini'}
            </p>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes slideInMessage {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(234, 179, 8, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(234, 179, 8, 0.5);
        }
      `}</style>
    </div>
  )
}

export default Chat
