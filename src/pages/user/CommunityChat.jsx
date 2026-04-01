import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../../lib/supabaseClient';
import { Send, Hash, Users, Copy, Check, ArrowLeft, Loader2, MessageSquare, ChevronDown, Trash2, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommunityChat() {
  const { id } = useParams();
  const user = useUser();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  const [community, setCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  
  // Realtime & Presence
  const [channel, setChannel] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});

  // Scroll visibility states
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Lock body scroll on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (user && id) {
      loadCommunityData();
    }
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, id]);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      // 1. Check membership
      const { data: memberData, error: memberError } = await supabase
        .from('chat_community_members')
        .select('*')
        .eq('community_id', id)
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        toast.error("You are not a member of this community.");
        navigate('/communities');
        return;
      }

      // 2. Fetch community details
      const { data: commData, error: commError } = await supabase
        .from('chat_communities')
        .select('*')
        .eq('id', id)
        .single();
        
      if (commError) throw commError;
      setCommunity(commData);

      // 3. Fetch all members with identification fields
      const { data: allMembers, error: membersError } = await supabase
        .from('chat_community_members')
        .select('user_id, role, users(display_name, avatar, username, email)')
        .eq('community_id', id);
        
      if (membersError) throw membersError;

      // Handle Supabase join result (flattening if needed)
      const mappedMembers = (allMembers || []).map(m => ({
        ...m,
        users: Array.isArray(m.users) ? m.users[0] : m.users
      }));
      setMembers(mappedMembers);

      // 4. Fetch existing messages
      const { data: msgData, error: msgError } = await supabase
        .from('chat_messages')
        .select(`
          id, content, created_at, user_id,
          users ( display_name, avatar, username )
        `)
        .eq('community_id', id)
        .order('created_at', { ascending: true });
        
      if (msgError) throw msgError;

      const mappedMessages = (msgData || []).map(m => ({
        ...m,
        users: Array.isArray(m.users) ? m.users[0] : m.users
      }));
      setMessages(mappedMessages);

      // 5. Setup Realtime & Presence
      setupRealtime();
      
      setTimeout(() => scrollToBottom(true), 300);

    } catch (error) {
      console.error("Error loading chat:", error);
      toast.error("Failed to load community chat.");
      navigate('/communities');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtime = () => {
    const newChannel = supabase.channel(`community_${id}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    newChannel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `community_id=eq.${id}`
        },
        async (payload) => {
          // Check if message already exists (from polling or optimistic update)
          setMessages(prev => {
            if (prev.some(m => m.id === payload.new.id)) return prev;

            // Fetch sender info if missing (optimistic updates already have it)
            fetchSenderInfo(payload.new);
            return prev;
          });
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const newState = newChannel.presenceState();
        setOnlineUsers(newState);
      })
      .on('broadcast', { event: 'typing' }, (payload) => {
        setTypingUsers(prev => {
          if (payload.payload.isTyping) {
            return { ...prev, [payload.payload.userId]: payload.payload.userName };
          } else {
            const next = { ...prev };
            delete next[payload.payload.userId];
            return next;
          }
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await newChannel.track({
            online_at: new Date().toISOString(),
          });
        }
      });
      
    setChannel(newChannel);
  };

  const fetchSenderInfo = async (msg) => {
    const { data } = await supabase
      .from('users')
      .select('display_name, avatar, username')
      .eq('uid', msg.user_id)
      .single();

    const completeMessage = {
      ...msg,
      users: data
    };

    setMessages(prev => {
      if (prev.some(m => m.id === msg.id)) return prev;
      const next = [...prev, completeMessage].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      return next;
    });
    scrollToBottom();
  };

  const fetchNewMessages = async () => {
    if (!id || !user) return;
    
    // Get the highest timestamp in current messages
    // Note: We use a functional update later, but here we can just use the state
    // because it's called in an interval that stays fresh enough for polling.
    // However, setMessages(prev => ...) is safer.
    
    setMessages(prev => {
      const lastMessage = [...prev].reverse().find(m => !m.is_optimistic);
      const lastTimestamp = lastMessage ? lastMessage.created_at : new Date(0).toISOString();

      (async () => {
          try {
            const { data, error } = await supabase
              .from('chat_messages')
              .select(`
                id, content, created_at, user_id,
                users ( display_name, avatar, username )
              `)
              .eq('community_id', id)
              .gt('created_at', lastTimestamp)
              .order('created_at', { ascending: true });

            if (error) throw error;
            if (data && data.length > 0) {
              const mappedNewMessages = data.map(m => ({
                ...m,
                users: Array.isArray(m.users) ? m.users[0] : m.users
              }));

              setMessages(current => {
                const existingIds = new Set(current.map(m => m.id));
                const uniqueNew = mappedNewMessages.filter(m => !existingIds.has(m.id));
                if (uniqueNew.length === 0) return current;
                
                const next = [...current, ...uniqueNew].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                return next;
              });
              setTimeout(() => scrollToBottom(), 100);
            }
          } catch (err) {
            console.error("Polling error:", err);
          }
      })();
      
      return prev;
    });
  };

  useEffect(() => {
    if (!id || !user) return;
    
    const pollInterval = setInterval(() => {
      fetchNewMessages();
    }, 1000);

    return () => clearInterval(pollInterval);
  }, [id, user]);

  const getDisplayName = (userData, userId) => {
    // 1. Priority: Your own metadata if it is you
    let display = "";
    let username = "";

    if (userId === user.id) {
        display = user.user_metadata?.display_name || user.user_metadata?.full_name || "You";
        username = user.user_metadata?.username;
    } else if (userData) {
        display = userData.display_name;
        username = userData.username;
    }

    if (display) return display;
    if (username) return `@${username}`;
    
    // Fallback: Identify by ID if profile is locked
    return userId ? `Sapiens_${userId.substring(0, 5)}` : "Unknown";
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(atBottom);
    if (atBottom) {
      setHasNewMessages(false);
    }
  };

  const scrollToBottom = (force = false) => {
    if (force || isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasNewMessages(false);
    } else {
      setHasNewMessages(true);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');
    
    // 1. Optimistic Update: Add message to UI immediately
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      content,
      created_at: new Date().toISOString(),
      user_id: user.id,
      is_optimistic: true, // Mark it so we can replace it later
      users: {
        display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || "You",
        avatar: user.user_metadata?.avatar || null,
        username: user.user_metadata?.username || null
      }
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setTimeout(() => scrollToBottom(true), 50);

    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user.id, isTyping: false }
      });
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          community_id: id,
          user_id: user.id,
          content: content
        })
        .select(`
          id, content, created_at, user_id,
          users ( display_name, avatar, username )
        `)
        .single();
        
      if (error) throw error;

      // 2. Replace optimistic message with real message
      if (data) {
        const realMsg = {
          ...data,
          users: Array.isArray(data.users) ? data.users[0] : data.users
        };
        setMessages(prev => prev.map(m => m.id === tempId ? realMsg : m));
      }
    } catch (error) {
      console.error("Failed to send:", error);
      toast.error("Message not sent.");
      // Remove optimistic message if failed
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { 
          userId: user.id, 
          userName: getDisplayName(user.user_metadata, user.id), // Use display name for typing
          isTyping: e.target.value.length > 0 
        }
      });
    }
  };

  const copyJoinCode = () => {
    if (!community?.join_code) return;
    navigator.clipboard.writeText(community.join_code);
    setIsCopied(true);
    toast.success("Join code copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDeleteCommunity = async () => {
    if (!window.confirm("Are you sure you want to delete this community? This action is permanent.")) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('chat_communities').delete().eq('id', id);
      if (error) throw error;
      toast.success("Community deleted.");
      navigate('/communities');
    } catch (err) {
      toast.error("Failed to delete community");
      console.error(err);
      setLoading(false);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!window.confirm("Are you sure you want to leave this community?")) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('chat_community_members').delete().eq('community_id', id).eq('user_id', user.id);
      if (error) throw error;
      toast.success("You left the community.");
      navigate('/communities');
    } catch (err) {
      toast.error("Failed to leave community");
      console.error(err);
      setLoading(false);
    }
  };

  const formatMessageTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentUserRole = members.find(m => m.user_id === user?.id)?.role;
  const isAdmin = currentUserRole === 'admin';

  if (loading) {
    return (
      <div className="h-screen bg-[#F0F2F5] flex items-center justify-center overflow-hidden">
         <div className="flex flex-col items-center gap-4">
             <div className="relative">
                <Loader2 className="w-12 h-12 text-[#2B2929] animate-spin" />
             </div>
             <p className="font-bold text-[#201F1E] animate-pulse">Entering Room...</p>
         </div>
      </div>
    );
  }

  const typingArray = Object.values(typingUsers).filter(name => name);

  return (
    <div className="h-screen bg-[#F0F2F5] pt-16 lg:pt-20 overflow-hidden flex flex-col fixed inset-0">
      <div className="flex-1 flex max-w-[1600px] mx-auto w-full p-2 lg:p-4 gap-4 overflow-hidden min-h-0">
        
        {/* LEFT COLUMN: Community Info */}
        <aside className="hidden xl:flex w-72 flex-col gap-4 overflow-hidden min-h-0">
          <div className="bg-white/80 backdrop-blur-md border border-white rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2B2929] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                <Hash size={20} className="text-[#00C6F7]" />
              </div>
              <h2 className="text-lg font-black text-[#2B2929] truncate">{community?.name}</h2>
            </div>
            
            <div>
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2 block">Our Mission</label>
              <p className="text-xs font-medium text-gray-600 leading-relaxed italic">
                "{community?.description || 'A gathering of code sapiens.'}"
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
               <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2 block">Invite Sapiens</label>
                  <div 
                    onClick={copyJoinCode}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2 rounded-2xl cursor-pointer hover:bg-white hover:border-[#2B2929] transition-all group"
                  >
                    <span className="font-mono font-bold text-xs text-[#2B2929]">{community?.join_code}</span>
                    <div className={`p-1 rounded-lg transition-all ${isCopied ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400'}`}>
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                    </div>
                  </div>
               </div>

               <div className="flex flex-col gap-2 pt-2">
                  {isAdmin ? (
                    <button onClick={handleDeleteCommunity} className="w-full py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                      <Trash2 size={12} /> Delete Room
                    </button>
                  ) : (
                    <button onClick={handleLeaveCommunity} className="w-full py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2">
                      <LogOut size={12} /> Leave Room
                    </button>
                  )}
               </div>
            </div>
          </div>

          <div className="flex-1 bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center opacity-60 min-h-0">
             <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                <MessageSquare className="w-6 h-6 text-[#00C6F7]" />
             </div>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Real-time Stream</p>
          </div>
        </aside>

        {/* CENTER COLUMN: Chat Area */}
        <main className="flex-1 flex flex-col bg-white border border-white rounded-[2rem] lg:rounded-[2.5rem] shadow-xl overflow-hidden relative min-h-0">
          
          <header className="px-6 py-3.5 flex items-center justify-between border-b border-gray-50 bg-white/50 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/communities')} 
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-[#2B2929] transition-all xl:hidden"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 className="font-black text-[#2B2929] text-base flex items-center gap-2">
                  <Hash size={18} className="text-[#00C6F7]" />
                  {community?.name}
                </h3>
              </div>
            </div>
            
            <button 
                onClick={() => setShowMembers(!showMembers)}
                className={`p-2 rounded-xl transition-all lg:hidden ${showMembers ? 'bg-[#FFD600] text-[#2B2929]' : 'bg-gray-50 text-gray-400'}`}
            >
                <Users size={18} />
            </button>
          </header>

          <div className="flex-1 flex flex-col overflow-hidden relative min-h-0 bg-gray-50/20">
            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar space-y-1 relative min-h-0"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <Hash className="text-[#00C6F7] w-12 h-12 mb-2" />
                        <h4 className="font-black text-[10px] tracking-widest uppercase">Start of conversation</h4>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                    const isMine = msg.user_id === user.id;
                    const prevMsg = index > 0 ? messages[index - 1] : null;
                    const isGap = !prevMsg || prevMsg.user_id !== msg.user_id || 
                        (new Date(msg.created_at) - new Date(prevMsg.created_at) > 300000);
                    
                    return (
                        <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, x: isMine ? 5 : -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`group flex items-start gap-3 ${isMine ? 'flex-row-reverse' : ''} ${isGap ? 'mt-4' : 'mt-0.5'}`}
                        >
                            <div className={`flex-shrink-0 w-8 h-8 lg:w-9 lg:h-9 relative ${!isGap ? 'opacity-0 select-none' : ''}`}>
                                <div className={`w-full h-full rounded-xl overflow-hidden border flex items-center justify-center font-black text-xs shadow-sm
                                ${isMine ? 'bg-[#FFD600] border-[#FFD600]' : 'bg-white border-gray-100'}`}>
                                    {msg.users?.avatar ? (
                                    <img src={msg.users.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                    getDisplayName(msg.users, msg.user_id).charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>

                            <div className={`flex flex-col max-w-[85%] lg:max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                                {isGap && (
                                    <div className={`flex items-center gap-2 mb-1 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                                        <span className="font-black text-[10px] text-gray-800 tracking-tight">
                                            {getDisplayName(msg.users, msg.user_id)}
                                        </span>
                                        <span className="text-[9px] font-bold text-gray-400">{formatMessageTime(msg.created_at)}</span>
                                    </div>
                                )}
                                <div className={`px-4 py-2 text-[14px] leading-relaxed shadow-sm
                                    ${isGap ? (isMine ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none') : 'rounded-2xl'}
                                    ${isMine ? 'bg-[#2B2929] text-white' : 'bg-white text-[#2B2929] border border-gray-50'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <AnimatePresence>
                {hasNewMessages && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => scrollToBottom(true)}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#FFD600] text-[#2B2929] px-4 py-2 rounded-full font-black text-[10px] shadow-2xl z-40 flex items-center gap-2"
                    >
                        <ChevronDown className="w-3 h-3" /> NEW STREAM
                    </motion.button>
                )}

                {typingArray.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute bottom-2 left-6 px-3 py-1 bg-white rounded-full text-[9px] font-black text-gray-400 border border-gray-100 shadow-sm z-30"
                >
                    {typingArray[0]} is typing...
                </motion.div>
                )}
            </AnimatePresence>
          </div>

          <footer className="p-4 bg-white border-t border-gray-50">
             <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder={`Message #${community?.name || 'dev'}...`}
                    className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 rounded-xl px-5 py-3 font-bold text-sm text-[#2B2929] outline-none transition-all"
                    disabled={sending}
                />
                <button
                  type="submit"
                  className="bg-[#2B2929] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  <Send size={18} />
                </button>
             </form>
          </footer>
        </main>

        {/* RIGHT COLUMN: Members */}
        <AnimatePresence>
          {showMembers && (
            <motion.aside 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className={`fixed inset-y-0 right-0 z-50 lg:relative lg:inset-auto w-72 lg:flex flex-col bg-white border border-white lg:rounded-[2.5rem] p-6 shadow-2xl overflow-hidden min-h-0
                         ${showMembers ? 'flex' : 'hidden'}`}
            >
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-xs text-[#2B2929] uppercase tracking-widest flex items-center gap-2">
                    <Users size={14} className="text-[#FF5018]" />
                    Sapiens ({members.length})
                  </h3>
               </div>

               <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar min-h-0">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-green-500 mb-3 block">Live Now</label>
                    <div className="space-y-4">
                      {members.filter(m => onlineUsers[m.user_id]).map((member) => (
                        <div key={member.user_id} className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center font-black text-xs relative">
                                {member.users?.avatar ? (
                                  <img src={member.users.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                  getDisplayName(member.users, member.user_id).charAt(0).toUpperCase()
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                             </div>
                             <div className="flex flex-col overflow-hidden">
                               <span className="font-black text-[#2B2929] text-[11px] truncate uppercase tracking-tight">
                                 {getDisplayName(member.users, member.user_id)}
                               </span>
                               {member.role === 'admin' && (
                                <span className="text-[8px] font-black text-[#FF5018] uppercase tracking-tighter">Admin</span>
                               )}
                             </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="opacity-40 pt-2 grayscale">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-3 block">Asleep</label>
                    <div className="space-y-4">
                      {members.filter(m => !onlineUsers[m.user_id]).map((member) => (
                        <div key={member.user_id} className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center font-black text-xs text-gray-400">
                                {member.users?.avatar ? (
                                  <img src={member.users.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                  getDisplayName(member.users, member.user_id).charAt(0).toUpperCase()
                                )}
                             </div>
                             <div className="flex flex-col overflow-hidden">
                               <span className="font-bold text-gray-500 text-[11px] truncate uppercase tracking-tight">
                                 {getDisplayName(member.users, member.user_id)}
                               </span>
                             </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
