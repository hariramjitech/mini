import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Trash2, ExternalLink, 
  Loader2, Filter, Hash, MoreVertical, 
  AlertCircle, ShieldCheck, Globe, Lock
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from '../../components/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'public', 'private'
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_communities')
        .select(`
          *,
          creator:users!chat_communities_created_by_fkey(display_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (err) {
      console.error('Error fetching communities:', err);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommunity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this community? This action is permanent and will remove all messages and members.')) {
      return;
    }

    try {
      setDeletingId(id);
      
      // 1. Delete members first (if no cascade)
      const { error: memberError } = await supabase
        .from('chat_community_members')
        .delete()
        .eq('community_id', id);

      if (memberError) throw memberError;

      // 2. Delete community
      const { error: commError } = await supabase
        .from('chat_communities')
        .delete()
        .eq('id', id);

      if (commError) throw commError;

      toast.success('Community deleted successfully');
      setCommunities(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting community:', err);
      toast.error('Failed to delete community');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'public' && c.is_public) || 
                         (filterType === 'private' && !c.is_public);
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="p-8 bg-[#F7F5F2] min-h-screen font-sans selection:bg-[#C2E812]">
        {/* Header */}
        <div className="mb-12 border-b-[4px] border-[#2B2929] pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#1E1E1E] text-[#C2E812] px-3 py-1 font-black text-xs uppercase tracking-widest">
                  Admin Control
                </div>
                <div className="flex items-center text-zinc-500 font-bold text-sm">
                  <Hash className="w-4 h-4 mr-1" />
                  {communities.length} total
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#2B2929] leading-none uppercase">
                Communities
              </h1>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="FIND THE ENTROPY..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border-[3px] border-[#2B2929] p-4 pl-12 text-zinc-900 font-bold placeholder:text-zinc-300 focus:outline-none focus:shadow-[6px_6px_0px_#2B2929] transition-all"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['all', 'public', 'private'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2 border-[2px] border-[#2B2929] font-bold uppercase tracking-tight transition-all ${
                filterType === type 
                  ? 'bg-[#2B2929] text-white shadow-[4px_4px_0px_#C2E812]' 
                  : 'bg-white text-[#2B2929] hover:bg-zinc-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <Loader2 className="w-16 h-16 animate-spin text-[#2B2929]" />
             <p className="font-black text-xl text-[#2B2929]">SYNCING CORE...</p>
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="bg-white border-[4px] border-dashed border-[#2B2929]/10 rounded-3xl p-32 text-center">
             <AlertCircle className="w-20 h-20 mx-auto mb-6 text-zinc-200" />
             <h3 className="text-3xl font-black text-zinc-300 uppercase">Void Detected</h3>
             <p className="text-zinc-400 font-bold">No communities match your search parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCommunities.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-[3px] border-[#2B2929] p-6 shadow-[8px_8px_0px_#2B2929] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-[#2B2929] text-[#C2E812] flex items-center justify-center font-black text-2xl border-[2px] border-[#2B2929]">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/community/${c.id}`)}
                      className="p-2 border-[2px] border-[#2B2929] hover:bg-[#C2E812] transition-colors"
                      title="View as User"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCommunity(c.id)}
                      disabled={deletingId === c.id}
                      className="p-2 border-[2px] border-[#2B2929] text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      title="Delete Permanently"
                    >
                      {deletingId === c.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                   {c.is_public ? (
                     <span className="flex items-center gap-1 text-[10px] font-black uppercase text-green-600 border border-green-600 px-2 py-0.5">
                       <Globe className="w-3 h-3" /> Public
                     </span>
                   ) : (
                     <span className="flex items-center gap-1 text-[10px] font-black uppercase text-red-600 border border-red-600 px-2 py-0.5">
                       <Lock className="w-3 h-3" /> Private
                     </span>
                   )}
                   <span className="text-[10px] font-black uppercase text-zinc-400 border border-zinc-200 px-2 py-0.5">
                      CODE: {c.join_code || 'NONE'}
                   </span>
                </div>

                <h3 className="text-2xl font-black text-[#2B2929] mb-2 leading-tight group-hover:text-[#0061FE] transition-colors line-clamp-1">
                  {c.name}
                </h3>
                
                <p className="text-zinc-600 font-medium mb-6 line-clamp-2 h-12 text-sm leading-relaxed">
                  {c.description || 'No description provided.'}
                </p>

                <div className="mt-auto pt-4 border-t-2 border-[#2B2929]/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                         {c.creator?.display_name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#2B2929] uppercase leading-none">Creator</span>
                        <span className="text-xs font-bold text-zinc-500">{c.creator?.display_name || 'Legacy User'}</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black text-zinc-300 uppercase block leading-none">Established</span>
                      <span className="text-xs font-bold text-zinc-500">{new Date(c.created_at).toLocaleDateString()}</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCommunities;
