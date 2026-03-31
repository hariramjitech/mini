import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Key, Users, Hash, X, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UserCommunitiesList() {
  const user = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mine'); // 'mine' or 'explore'
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  // Form states
  const [createData, setCreateData] = useState({ name: '', description: '', isPublic: true });
  const [joinCode, setJoinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (activeTab === 'mine') {
        fetchMyCommunities();
      } else {
        fetchPublicCommunities();
      }
    }
  }, [user, activeTab]);

  const fetchMyCommunities = async () => {
    setLoading(true);
    try {
      const { data: memberData, error: memberError } = await supabase
        .from('chat_community_members')
        .select('community_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      if (memberData && memberData.length > 0) {
        const communityIds = memberData.map(m => m.community_id);
        const { data: commData, error: commError } = await supabase
          .from('chat_communities')
          .select('*')
          .in('id', communityIds)
          .order('name');
          
        if (commError) throw commError;
        setCommunities(commData);
      } else {
        setCommunities([]);
      }
    } catch (error) {
      console.error('Error fetching my communities:', error);
      toast.error('Failed to load your communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicCommunities = async () => {
    setLoading(true);
    try {
      // First get IDs of communities I'm already in
      const { data: myMemberships } = await supabase
        .from('chat_community_members')
        .select('community_id')
        .eq('user_id', user.id);
        
      const myCommunityIds = myMemberships ? myMemberships.map(m => m.community_id) : [];

      let query = supabase
        .from('chat_communities')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
        
      const { data, error } = await query;

      if (error) throw error;
      
      // Optionally filter out ones already joined if we want to, or just mark them
      // For now we'll mark them
      const markedData = data.map(c => ({
        ...c,
        isJoined: myCommunityIds.includes(c.id)
      }));
      setCommunities(markedData);
    } catch (error) {
      console.error('Error fetching public communities:', error);
      toast.error('Failed to load explore communities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!createData.name.trim()) return;
    setSubmitting(true);
    try {
      // 1. Insert community
      const { data: commData, error: commError } = await supabase
        .from('chat_communities')
        .insert({
          name: createData.name,
          description: createData.description,
          is_public: createData.isPublic,
          created_by: user.id
        })
        .select()
        .single();
        
      if (commError) throw commError;

      // 2. Insert creator as admin member
      const { error: memberError } = await supabase
        .from('chat_community_members')
        .insert({
          community_id: commData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast.success('Community created successfully!');
      setIsCreateModalOpen(false);
      setCreateData({ name: '', description: '', isPublic: true });
      navigate(`/community/${commData.id}`);
      
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Failed to create community: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinViaCode = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setSubmitting(true);
    try {
      // Find the community
      const { data: commData, error: commError } = await supabase
        .from('chat_communities')
        .select('id')
        .eq('join_code', joinCode.trim())
        .single();

      if (commError || !commData) {
        throw new Error('Invalid join code or community not found');
      }

      // Join
      const { error: memberError } = await supabase
        .from('chat_community_members')
        .insert({
          community_id: commData.id,
          user_id: user.id,
          role: 'member'
        });

      // Ignore if already joined (handled by unique constraint, but we might get 23505 error)
      if (memberError && memberError.code !== '23505') throw memberError;

      toast.success('Joined community successfully!');
      setIsJoinModalOpen(false);
      setJoinCode('');
      navigate(`/community/${commData.id}`);
      
    } catch (error) {
      console.error('Error joining:', error);
      toast.error(error.message || 'Failed to join community');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinPublic = async (communityId) => {
    try {
      const { error } = await supabase
        .from('chat_community_members')
        .insert({
          community_id: communityId,
          user_id: user.id,
          role: 'member'
        });

      if (error && error.code !== '23505') throw error; // ignore if already joined
      
      navigate(`/community/${communityId}`);
    } catch (error) {
       console.error('Error joining public community:', error);
       toast.error('Failed to join');
    }
  };


  return (
    <div className="min-h-screen bg-[#F7F5F2] pt-28 pb-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-[#2B2929] pb-8 mb-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#2B2929] mb-2">
              COMMUNITIES
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#2B2929]/70">
              Connect, collaborate, and chat with peers.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-[#2B2929] text-[#2B2929] font-bold shadow-[4px_4px_0px_#2B2929] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Key size={20} /> Join with Code
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#EE4B2B] border-2 border-[#2B2929] text-white font-bold shadow-[4px_4px_0px_#2B2929] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Plus size={20} /> Create New
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-8 py-3 font-bold text-lg border-2 border-[#2B2929] rounded-xl transition-all ${
              activeTab === 'mine' 
                ? 'bg-[#2B2929] text-white shadow-[4px_4px_0px_#00C6F7]' 
                : 'bg-white text-[#2B2929] hover:bg-gray-50'
            }`}
          >
            My Communities
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-8 py-3 font-bold text-lg border-2 border-[#2B2929] rounded-xl transition-all ${
              activeTab === 'explore' 
                ? 'bg-[#2B2929] text-white shadow-[4px_4px_0px_#FFD600]' 
                : 'bg-white text-[#2B2929] hover:bg-gray-50'
            }`}
          >
            Explore Public
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-12 h-12 animate-spin text-[#2B2929]" />
          </div>
        ) : communities.length === 0 ? (
          <div className="bg-white border-2 border-[#2B2929] rounded-2xl p-12 text-center shadow-[8px_8px_0px_#D8C3F8]">
            <Users className="w-16 h-16 mx-auto mb-4 text-[#2B2929]/40" />
            <h3 className="text-2xl font-bold mb-2 text-[#2B2929]">No communities found</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'mine' 
                ? "You haven't joined any communities yet." 
                : "No public communities are available right now."}
            </p>
            {activeTab === 'mine' && (
               <button
                 onClick={() => setActiveTab('explore')}
                 className="px-6 py-2 bg-[#FFD600] border-2 border-[#2B2929] font-bold shadow-[2px_2px_0px_#2B2929] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
               >
                 Discover Communities
               </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((comm) => (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-[#2B2929] rounded-2xl p-6 shadow-[6px_6px_0px_#2B2929] flex flex-col h-full hover:-translate-y-2 hover:shadow-[10px_10px_0px_#2B2929] transition-all cursor-pointer group"
                onClick={() => {
                   if (activeTab === 'mine' || comm.isJoined) navigate(`/community/${comm.id}`);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#E2F5E9] border-2 border-[#2B2929] flex items-center justify-center rounded-xl font-black text-xl text-[#2B2929]">
                    {comm.name.charAt(0).toUpperCase()}
                  </div>
                  {activeTab === 'explore' && comm.isJoined && (
                    <span className="bg-[#2B2929] text-white px-3 py-1 text-xs font-bold rounded-full">
                      Joined
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-black text-[#2B2929] mb-2 line-clamp-1">{comm.name}</h3>
                <p className="text-[#2B2929]/70 mb-6 line-clamp-2 h-10">{comm.description || 'No description provided.'}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-200">
                  {activeTab === 'explore' && !comm.isJoined ? (
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleJoinPublic(comm.id); }}
                       className="w-full flex justify-center items-center gap-2 py-3 bg-[#00C6F7] border-2 border-[#2B2929] font-bold text-[#2B2929] shadow-[2px_2px_0px_#2B2929] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                     >
                        Join Now <ArrowRight size={18} />
                     </button>
                  ) : (
                    <div className="flex items-center text-[#EE4B2B] font-bold group-hover:translate-x-2 transition-transform">
                      Open Chat <ArrowRight size={20} className="ml-2" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-4 border-[#2B2929] max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-[12px_12px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-[#2B2929]">New Community</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X />
                </button>
              </div>

              <form onSubmit={handleCreateCommunity} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#2B2929] mb-2 uppercase tracking-wide">Community Name</label>
                  <input
                    type="text"
                    required
                    value={createData.name}
                    onChange={(e) => setCreateData({...createData, name: e.target.value})}
                    className="w-full border-2 border-[#2B2929] p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#FFD600] font-medium"
                    placeholder="e.g. React Developers India"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2B2929] mb-2 uppercase tracking-wide">Description (Optional)</label>
                  <textarea
                    value={createData.description}
                    onChange={(e) => setCreateData({...createData, description: e.target.value})}
                    className="w-full border-2 border-[#2B2929] p-3 focus:outline-none focus:ring-2 focus:ring-[#FFD600] font-medium resize-none h-24"
                    placeholder="What is this community about?"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={createData.isPublic}
                    onChange={(e) => setCreateData({...createData, isPublic: e.target.checked})}
                    className="w-5 h-5 accent-[#2B2929] border-2 border-[#2B2929]"
                  />
                  <label htmlFor="isPublic" className="font-bold cursor-pointer text-[#2B2929]">
                    Public (List on Explore section)
                  </label>
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-[#2B2929] text-white py-4 text-lg font-bold hover:bg-black transition-colors disabled:opacity-70 mt-4 flex justify-center items-center gap-2 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : 'Create and Join'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* JOIN CODE MODAL */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FFD600] border-4 border-[#2B2929] max-w-md w-full rounded-2xl p-6 sm:p-8 shadow-[12px_12px_0px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 border-2 border-[#2B2929] rounded-lg">
                    <Key size={24} className="text-[#2B2929]" />
                  </div>
                  <h2 className="text-3xl font-black text-[#2B2929]">Join via Code</h2>
                </div>
                <button onClick={() => setIsJoinModalOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                  <X />
                </button>
              </div>

              <form onSubmit={handleJoinViaCode}>
                <p className="text-[#2B2929] font-medium mb-6">Enter the 8-character unique code to join a private or public community.</p>
                
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full bg-white border-2 border-[#2B2929] p-4 text-2xl text-center tracking-widest uppercase font-mono font-bold focus:outline-none focus:ring-4 focus:ring-black/20"
                  placeholder="CODE"
                  maxLength={12}
                />
                
                <button 
                  type="submit" 
                  disabled={submitting || !joinCode}
                  className="w-full bg-[#2B2929] text-white py-4 text-lg font-bold hover:bg-black transition-colors disabled:opacity-70 mt-6 flex justify-center items-center"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : 'Join Community'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
