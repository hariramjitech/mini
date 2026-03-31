import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Globe, Bell, Sparkles } from 'lucide-react';

const UserEvents = () => {
    return (
        <div className="min-h-screen bg-[#F7F5F2] p-8 md:p-12 flex items-center justify-center">
            <div className="max-w-4xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-12 rounded-[2rem] shadow-2xl border-4 border-[#2B2929] relative overflow-hidden"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Calendar size={120} className="rotate-12" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-[#FFC845] px-4 py-2 rounded-full font-bold text-sm mb-8 border-2 border-[#2B2929]">
                            <Sparkles size={16} />
                            <span>NEW ERA</span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-[#2B2929]">
                            EVENTS <br />
                            <span className="text-[#0061FE]">COMING SOON</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto mb-12">
                            We're transitioning from CodeSapiens to <span className="font-bold text-[#2B2929]">DevNexus</span>. 
                            Our new event portal is being built to provide a premium experience.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-[#F7F5F2] p-6 rounded-2xl border-2 border-[#2B2929]/10">
                                <Globe className="mx-auto mb-4 text-[#0061FE]" size={32} />
                                <h3 className="font-bold mb-2">Global Access</h3>
                                <p className="text-sm text-gray-500">Join from anywhere in the world.</p>
                            </div>
                            <div className="bg-[#F7F5F2] p-6 rounded-2xl border-2 border-[#2B2929]/10">
                                <Calendar className="mx-auto mb-4 text-[#FF5018]" size={32} />
                                <h3 className="font-bold mb-2">Hybrid Events</h3>
                                <p className="text-sm text-gray-500">Offline & Online experiences.</p>
                            </div>
                            <div className="bg-[#F7F5F2] p-6 rounded-2xl border-2 border-[#2B2929]/10">
                                <Bell className="mx-auto mb-4 text-[#8A2BE2]" size={32} />
                                <h3 className="font-bold mb-2">Notifications</h3>
                                <p className="text-sm text-gray-500">Get notified for every major drop.</p>
                            </div>
                        </div>
                        
                        <button 
                            className="bg-[#2B2929] text-white px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-xl flex items-center gap-3 mx-auto"
                            onClick={() => window.location.href = '/'}
                        >
                            BACK TO DASHBOARD
                        </button>
                    </div>
                </motion.div>
                
                <p className="mt-12 text-gray-400 font-medium">
                    © 2025 DevNexus Community • Bridging the gap between learning and building.
                </p>
            </div>
        </div>
    );
};

export default UserEvents;