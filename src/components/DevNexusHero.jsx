import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X, Github, Linkedin, Youtube, Users, Calendar, Code, Award, Crown, Rocket, Zap, Globe, Cpu, Handshake, Heart, ArrowUpRight, Instagram, Twitter, MessageCircle, Megaphone, Sparkles } from 'lucide-react';
import { BACKEND_URL } from '../config';
import { authFetch } from '../lib/authFetch';
import LandingPopup from './LandingPopup';

// --- Stats Section ---
const StatsSection = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalColleges: 0, topColleges: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authFetch(`${BACKEND_URL}/api/public-stats`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStats(data.stats);
                }
            })
            .catch(err => console.error("Stats fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="py-12 bg-gradient-to-br from-[#101010] via-[#050505] to-[#001a45] text-white relative overflow-hidden">
            {/* Background Elements */}

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="mb-8 text-center">
                    <span className="text-[#0061FE] font-bold tracking-widest uppercase text-golden-1 mb-4 block">Impact</span>
                    <h2 className="text-golden-2 md:text-golden-3 font-bold mb-6">By The Numbers</h2>
                    <p className="text-golden-1 text-gray-400 max-w-2xl mx-auto">
                        We are growing fast. Join the movement.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start md:items-center">
                    {/* Left: Big Numbers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-black/40 backdrop-blur-3xl p-4 md:p-6 rounded-2xl border border-white/10 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden group"
                        >
                            {/* Specular Highlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <h3 className="text-golden-2 md:text-golden-3 font-black text-white mb-2 drop-shadow-lg">
                                {/* {stats.totalUsers > 0 ? stats.totalUsers : "1500+"} */}
                                2000+
                            </h3>
                            <p className="text-gray-400 font-medium uppercase tracking-normal md:tracking-wider text-golden-1">Total Members</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-black/40 backdrop-blur-3xl p-4 md:p-6 rounded-2xl border border-white/10 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden group"
                        >
                            {/* Specular Highlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <h3 className="text-golden-2 md:text-golden-3 font-black text-white mb-2 drop-shadow-lg">
                                {/* {stats.totalColleges > 0 ? stats.totalColleges : "50+"} */}
                                50+
                            </h3>
                            <p className="text-gray-400 font-medium uppercase tracking-normal md:tracking-wider text-golden-1">Colleges Reached</p>
                        </motion.div>
                    </div>

                    {/* Right: Top Colleges Chart */}
                    <div className="col-span-1 h-full w-full overflow-hidden">
                        <div className="bg-black/40 backdrop-blur-3xl p-6 rounded-2xl border border-white/10 h-full flex flex-col relative overflow-hidden group shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                            {/* Specular Highlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                            <h4 className="text-golden-2 font-bold mb-4 flex items-center gap-3">
                                Top Active Colleges
                            </h4>

                            <div className="flex-1 flex flex-col justify-center">
                                {loading ? (
                                    <div className="text-center text-gray-500 py-10 animate-pulse">Loading leaderboards...</div>
                                ) : stats.topColleges.filter(c => c.name && c.name !== "Not specified").length > 0 ? (
                                    <div className="space-y-8">
                                        {/* Top 3 Podium - Only show if we have enough data, else fallback to list */}
                                        {stats.topColleges.filter(c => c.name && c.name !== "Not specified").length >= 3 ? (
                                            <div className="flex items-end justify-center gap-2 md:gap-4 mb-4 min-h-[140px]">
                                                {/* 2nd Place */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 50 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="flex flex-col items-center w-1/3"
                                                >
                                                    <div className="text-center mb-2">
                                                        <span className="text-gray-300 font-bold block text-sm sm:text-base line-clamp-2 min-h-[2.5em] leading-tight">
                                                            {stats.topColleges.filter(c => c.name && c.name !== "Not specified")[1].name}
                                                        </span>
                                                        <span className="text-gray-500 text-xs font-mono mt-1 block">{stats.topColleges.filter(c => c.name && c.name !== "Not specified")[1].count} Students</span>
                                                    </div>
                                                    <div className="w-full bg-gradient-to-t from-gray-800 to-gray-600/50 rounded-t-lg relative border-t border-x border-gray-600 h-24 flex items-end justify-center pb-2">
                                                        <span className="text-3xl font-black text-gray-400/20 absolute top-2">2</span>
                                                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-black font-bold text-sm shadow-[0_0_15px_rgba(156,163,175,0.5)]">2</div>
                                                    </div>
                                                </motion.div>

                                                {/* 1st Place */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 50 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                    className="flex flex-col items-center w-1/3 -mt-4 z-10"
                                                >
                                                    <div className="text-center mb-2">
                                                        <span className="text-yellow-400 font-bold block text-sm sm:text-lg line-clamp-2 min-h-[2.5em] leading-tight drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                                                            {stats.topColleges.filter(c => c.name && c.name !== "Not specified")[0].name}
                                                        </span>
                                                        <span className="text-yellow-500/80 text-xs font-mono mt-1 block font-bold">{stats.topColleges.filter(c => c.name && c.name !== "Not specified")[0].count} Students</span>
                                                    </div>
                                                    <div className="w-full bg-gradient-to-t from-yellow-900/40 to-yellow-600/40 rounded-t-lg relative border-t border-x border-yellow-500 h-32 flex items-end justify-center pb-4 overflow-hidden">
                                                        <div className="absolute inset-0 bg-yellow-400/10 animate-pulse"></div>
                                                        <span className="text-4xl font-black text-yellow-400/20 absolute top-2">1</span>
                                                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg shadow-[0_0_20px_rgba(250,204,21,0.6)] relative z-10">
                                                            <Crown size={20} />
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* 3rd Place */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 50 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="flex flex-col items-center w-1/3"
                                                >
                                                    <div className="text-center mb-2">
                                                        <span className="text-amber-700 font-bold block text-sm sm:text-base line-clamp-2 min-h-[2.5em] leading-tight">
                                                            {stats.topColleges.filter(c => c.name && c.name !== "Not specified")[2].name}
                                                        </span>
                                                        <span className="text-gray-500 text-xs font-mono mt-1 block">{stats.topColleges.filter(c => c.name && c.name !== "Not specified")[2].count} Students</span>
                                                    </div>
                                                    <div className="w-full bg-gradient-to-t from-amber-900/40 to-amber-700/40 rounded-t-lg relative border-t border-x border-amber-800 h-20 flex items-end justify-center pb-2">
                                                        <span className="text-3xl font-black text-amber-800/20 absolute top-2">3</span>
                                                        <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(180,83,9,0.5)]">3</div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        ) : null}

                                        {/* Remaining List (4th and 5th) */}
                                        <div className="space-y-3 mt-4">
                                            {stats.topColleges
                                                .filter(c => c.name && c.name !== "Not specified")
                                                .slice(stats.topColleges.filter(c => c.name && c.name !== "Not specified").length >= 3 ? 3 : 0, 5) // Skip top 3 if we showed podium, else show all
                                                .map((college, index) => {
                                                    const actualIndex = stats.topColleges.filter(c => c.name && c.name !== "Not specified").length >= 3 ? index + 3 : index;
                                                    return (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.4 + (index * 0.1) }}
                                                            className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-[#1E1919] border border-gray-700 flex items-center justify-center text-gray-400 font-bold text-sm">
                                                                {actualIndex + 1}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-medium text-gray-200 truncate">{college.name}</h5>
                                                            </div>
                                                            <div className="px-3 py-1 rounded-full bg-[#0061FE]/10 text-[#0061FE] text-xs font-bold">
                                                                {college.count}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-10">
                                        <p>Stats will update soon</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Sponsor Section with Spotlight Effect ---
const SponsorSection = () => {
    const sponsors = [

        {
            name: "Mako IT Lab",
            link: "https://www.makoitlab.com/",
            image: "https://res.cloudinary.com/dqudvximt/image/upload/v1767816977/users_cme79i2lk00qls401ar5qxqnc_VGly5cMkz1ZxkXas-1_76R8XDxGiLgjc8BaeXApow_yzzhyw.webp",
        },
        {
            name: "Yuniq",
            link: "https://yuniq.co/",
            image: "https://res.cloudinary.com/dqudvximt/image/upload/v1767817525/users_cme79i2lk00qls401ar5qxqnc_hBofB72xXBV4C0cL-users_clylc5w1v070to301jatq0e85_FVqmiMesQBlCZ0ZM-yuniq_njsnoy.jpg",
        },
        {
            name: "Contentstack",
            link: "https://www.contentstack.com/",
            image: "https://res.cloudinary.com/dqudvximt/image/upload/v1767817529/users_cme79i2lk00qls401ar5qxqnc_DaxnHl7f0QdeQwgx-square-image_pvgube.jpg",
        },
        {
            name: "Navan AI",
            link: "https://navan.ai/",
            image: "https://res.cloudinary.com/dqudvximt/image/upload/v1771507803/WhatsApp_Image_2026-02-19_at_4.28.11_PM_bxnzfc.jpg",
        },
        {
            name: "Notion",
            link: "https://www.notion.com/",
            image: "https://res.cloudinary.com/dqudvximt/image/upload/v1767817532/users_cme79i2lk00qls401ar5qxqnc_891aQQNEpsjHP7Ef-notion-logo-png_seeklogo-425508_k0njb3.webp",
        },
        {
            name: "Interview Buddy",
            link: "https://interviewbuddy.net/",
            image: "https://res.cloudinary.com/dqudvximt/image/upload/v1771508422/WhatsApp_Image_2026-02-19_at_4.28.12_PM_xxalgw.jpg",
        },
        
    ];

    return (
        <section className="py-12 bg-[#FFFFF0] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-left mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-4xl md:text-6xl font-black text-black tracking-tight leading-none">OUR</h2>
                        <h2 className="text-4xl md:text-6xl font-script text-[#2563ea] font-bold italic leading-none pt-2">sponsors</h2>
                        <div className="h-px bg-gray-200 flex-1 ml-4 self-center mt-2"></div>
                    </div>
                    {/* <span className="text-[#0061FE] font-bold tracking-widest uppercase text-golden-1 mb-2 block">Our Partners</span> */}
                    <div className="flex items-center gap-2 mb-8">
                        <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">BACKING THE FUTURE</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full mx-auto">
                    {sponsors.map((sponsor, idx) => (
                        <a
                            key={idx}
                            href={sponsor.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group bg-white border border-gray-100 rounded-3xl p-4 md:p-6 w-full aspect-square flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block"
                        >
                            {/* Top Right Arrow */}
                            <div className="self-end p-2 bg-gray-50 rounded-full text-gray-400 group-hover:bg-[#0061FE] group-hover:text-white transition-colors">
                                <ArrowUpRight size={18} />
                            </div>

                            {/* Centered Image */}
                            <div className="flex-1 flex items-center justify-center p-2">
                                <img
                                    src={sponsor.image}
                                    alt={sponsor.name}
                                    className="max-w-[85%] max-h-[85%] object-contain drop-shadow-sm transition-all duration-500"
                                />
                            </div>

                            {/* Name Badge */}
                            <div className="self-start px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg">
                                <span className="font-bold text-gray-800 text-xs">{sponsor.name}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};





// --- Community Partners Section ---
const CommunityPartners = () => {
    const partners = [
        {
            image: "https://res.cloudinary.com/dqudvximt/image/upload/v1767817843/users_cme79i2lk00qls401ar5qxqnc_OGGz5HgXCzS9rI8H-users_clylc5w1v070to301jatq0e85_bNj4z9CoW02cMzqm-circle_rs5ttj.png",
            link: "#"
        },
        {
            image: "https://res.cloudinary.com/dqudvximt/image/upload/v1767817844/users_cme79i2lk00qls401ar5qxqnc_EMRqmDnatuO4Rk38-users_cm9cf3ngn02erro015wogiktk_8CHW9Warth4BkBG9-Blue_2520Minimalist_2520Simple_2520Technology_2520Logo_2520_2520_1_mqig9s.png",
            link: "#"
        },
        {
            image: "https://res.cloudinary.com/dqudvximt/image/upload/v1767817846/users_cme79i2lk00qls401ar5qxqnc_1KwVf1Iz3NmGXUQP-176333249_mhbrlj.webp",
            link: "#"
        }
    ];

    return (
        <section className="py-12 bg-white relative overflow-hidden border-t border-gray-100">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-left mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-3xl md:text-6xl font-black text-black tracking-tight leading-none">COMMUNITY</h2>
                        <h2 className="text-3xl md:text-6xl font-script text-[#2563ea] font-bold italic leading-none pt-2">partners</h2>
                        <div className="h-px bg-gray-200 flex-1 ml-4 self-center mt-2"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-8">
                        <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">GROWING TOGETHER</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full mx-auto">
                    {partners.map((partner, idx) => (
                        <div
                            key={idx}
                            className="relative group bg-white border border-gray-100 rounded-3xl p-4 md:p-6 w-full aspect-square flex flex-col justify-center items-center hover:shadow-lg transition-all duration-300"
                        >
                            {/* Centered Image */}
                            <div className="flex-1 flex items-center justify-center p-2 w-full">
                                <img
                                    src={partner.image}
                                    alt="Community Partner"
                                    className="max-w-[85%] max-h-[85%] object-contain drop-shadow-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Social Media Bento Grid ---
const SocialMediaSection = () => {
    const socials = [
        {
            name: "LinkedIn",
            icon: <Linkedin size={40} />,
            link: "https://www.linkedin.com/company/devnexus-community/posts/",
            color: "bg-[#0077b5]",
            textColor: "text-white",
            span: "col-span-1",
            badge: "@devnexus-community",
            isLarge: true,
            backgroundImage: "url('https://res.cloudinary.com/dqudvximt/image/upload/v1767874220/users_cme79i2lk00qls401ar5qxqnc_n74cMGsKIBuvEzzj-users_cme5bsukl01binm014j8ioh2j_2SNEHA31eEqsxFRS-original-33f53dcd2f48e068523d32df0e5cc92f_xkirvh.gif') center/cover no-repeat"
        },
// Luma entry removed
        {
            name: "WhatsApp",
            icon: null,
            link: "https://chat.whatsapp.com/LLtoddmQx5rIRNb8WE6rqC?mode=ems_copy_t",
            color: "bg-[#25D366]",
            textColor: "text-white",
            span: "col-span-1",
            badge: null,
            customContent: (
                <div className="relative w-full h-full flex items-center justify-center">
                    <img src="https://res.cloudinary.com/dqudvximt/image/upload/v1767875047/410201-PD391H-802_h7tcfj.jpg" alt="WhatsApp" className="w-24 h-24 object-contain rounded-xl" />
                </div>
            )
        },
        {
            name: "Instagram",
            icon: <Instagram size={32} />,
            link: "https://www.instagram.com/devnexus/",
            color: "bg-white",
            textColor: "text-black",
            span: "col-span-1",
            badge: null,
            border: "border-gray-100 border",
            customContent: (
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center pb-6">
                        <img src="https://res.cloudinary.com/dqudvximt/image/upload/v1767874489/users_cme79i2lk00qls401ar5qxqnc_3o1XM7ID2mXVDk6e-XeFzd3iFtoytJqTv-1497553304-104_84834_allkph.png" alt="Instagram" className="w-84 h-84 object-contain drop-shadow-xl" />
                    </div>
                    <div className="absolute bottom-0 left-0">
                        <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-800">
                            @DevNexus.in
                        </span>
                    </div>
                </div>
            )
        },
        {
            name: "Twitter",
            icon: <Twitter size={32} className="text-[#1DA1F2]" />,
            link: "https://twitter.com/devnexus",
            color: "bg-white",
            textColor: "text-black",
            span: "col-span-1",
            badge: null,
            border: "border-gray-100 border",
            customContent: (
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center pb-6">
                        <img src="https://res.cloudinary.com/dqudvximt/image/upload/v1767874490/users_cme79i2lk00qls401ar5qxqnc_XgLMxxPTSSuuRKu5-users_cme5bsukl01binm014j8ioh2j_XQ7ryCBwyUFzFg6v-CLIPLY_372109260_TWITTER_LOGO_400_ptqbvv.gif" alt="Twitter" className="w-32 h-32 object-contain" />
                    </div>
                    <div className="absolute bottom-0 left-0">
                        <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-800">
                            @devnexus_in
                        </span>
                    </div>
                </div>
            )
        },
        {
            name: "Volunteers Needed",
            icon: null,
            link: "https://forms.gle/volunteer", // Placeholder link
            color: "bg-black",
            textColor: "text-white",
            span: "col-span-1",
            badge: null,
            isLarge: false,
            backgroundImage: "url('https://res.cloudinary.com/dqudvximt/image/upload/v1767876038/users_cme79i2lk00qls401ar5qxqnc_Hg7Si3j52FVfpQRN-image_x8wghd.png') center/cover no-repeat"
        },
        {
            name: "GitHub",
            icon: <Github size={40} />,
            link: "https://github.com/DevNexus-in",
            color: "bg-black",
            textColor: "text-white",
            span: "col-span-1",
            badge: "@DevNexus-in",
            isLarge: true,
            backgroundImage: "url('https://res.cloudinary.com/dqudvximt/image/upload/v1767874482/users_cme79i2lk00qls401ar5qxqnc_MOSc1bv3RXu0WL5z-users_cme5bsukl01binm014j8ioh2j_7dOv2cTCX8B86u82-users_clylc5w1v070to301jatq0e85_AdzvY5ioFqaF37x5-github_dsjpx6.gif') center/cover no-repeat"
        },
        {
            name: "YouTube",
            icon: <Youtube size={40} className="text-red-600" />,
            link: "https://youtube.com/@devnexus-in?si=90EaPMYHcSZIHtMi",
            color: "bg-white",
            textColor: "text-black",
            span: "col-span-1",
            badge: "@DevNexus",
            border: "border-gray-100 border",
            isLarge: true,
            backgroundImage: "url('https://res.cloudinary.com/dqudvximt/image/upload/v1767874488/users_cme79i2lk00qls401ar5qxqnc_Ov9Ygh4NAQfPGktu-users_cme5bsukl01binm014j8ioh2j_5JQAosdeiVappI2y-users_clylc5w1v070to301jatq0e85_CCuEsN5SSMlu4LAN-youtube_aky1f3.gif') center/cover no-repeat"
        }
    ];

    return (
        <section className="py-20 bg-[#FAF9F6] relative overflow-hidden text-left">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-left mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-4xl md:text-6xl font-black text-black tracking-tight leading-none">SOCIAL</h2>
                        <h2 className="text-4xl md:text-6xl font-script text-[#2563ea] font-bold italic leading-none pt-2">links</h2>
                        <div className="h-px bg-gray-200 flex-1 ml-4 self-center mt-2"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-8">
                        <Globe size={16} className="text-[#0061FE] animate-pulse" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">CONNECT WITH US</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4 md:gap-6 w-full mx-auto">
                    {socials.map((social, idx) => (
                        <motion.a
                            key={idx}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`${social.span} ${social.color} ${social.textColor} ${social.border} rounded-3xl p-6 relative overflow-hidden group shadow-sm hover:shadow-xl flex flex-col justify-between transition-all`}
                            style={social.backgroundImage ? { backgroundImage: social.color.includes('gradient') ? social.color : undefined } : {}}
                        >
                            {/* Custom Background Image if any */}
                            {social.backgroundImage && (
                                <div className="absolute inset-0" style={{ background: social.backgroundImage }}></div>
                            )}

                            {/* Top Right Arrow */}
                            <div className={`absolute top-4 right-4 p-2 rounded-full ${social.textColor === 'text-white' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                <ArrowUpRight size={16} />
                            </div>

                            {/* Content */}
                            {social.customContent ? (
                                social.customContent
                            ) : (
                                <>
                                    <div className="mb-auto">
                                        {social.customIcon || social.icon}
                                    </div>
                                    <div className="z-10 mt-auto">
                                        {social.badge && (
                                            <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${social.textColor === 'text-white' ? 'bg-white text-black' : 'bg-gray-100 text-gray-800'}`}>
                                                {social.badge}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};


// --- Notice Section (Call for Speakers/Sponsors) ---
// --- Notice Section (Call for Speakers/Sponsors) ---
const NoticeSection = () => {
    return (
        <section className="py-4 bg-[#FFF8DC] relative overflow-hidden text-left">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-8 items-center max-w-4xl mx-auto">
                    {/* Title (Left Side on Desktop) */}
                    <div className="flex items-center gap-2 shrink-0">
                        <h2 className="text-xl md:text-2xl font-black text-black tracking-tight leading-none">LATEST</h2>
                        <h2 className="text-xl md:text-2xl font-script text-[#2563ea] font-bold italic leading-none pt-1">updates</h2>
                        <div className="h-px bg-gray-200 w-12 self-center mt-1 md:hidden"></div>
                    </div>

                    {/* Images Grid */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                        {/* Call for Speakers */}
                        <div className="relative group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                            <img
                                src="https://res.cloudinary.com/dqudvximt/image/upload/v1767877162/users_cme79i2lk00qls401ar5qxqnc_N0bIjmMP0Ybxoznz-1753684368888_jda3us.jpg"
                                alt="Call for Speakers"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Sponsors & Venue */}
                        <div className="relative group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                            <img
                                src="https://res.cloudinary.com/dqudvximt/image/upload/v1767877178/users_cme79i2lk00qls401ar5qxqnc_KB4hFvAzhyqJF0xf-3a61cb74-01c9-4880-be04-a4036f32c4f9_t64kt9.jpg"
                                alt="Call for Sponsors and Venue"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Main Hero Component ---
const DevNexusHero = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hallOfFameEntries, setHallOfFameEntries] = useState([]);
    const [communityPhotos, setCommunityPhotos] = useState([]);

    // Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            const { data: hof } = await supabase.from('hall_of_fame').select('*').eq('is_active', true).order('created_at', { ascending: false });
            if (hof) setHallOfFameEntries(hof);

            const { data: photos } = await supabase.from('community_photos').select('*').eq('is_active', true).order('order_number', { ascending: true });
            if (photos) setCommunityPhotos(photos);
        };
        fetchData();
    }, []);

    // Scroll Progress
    const { scrollY } = useScroll();

    // Geometric Shape Animation
    const shapeScale = useTransform(scrollY, [0, 600], [1, 0.2]);
    const shapeY = useTransform(scrollY, [0, 600], [0, 200]);
    const shapeOpacity = useTransform(scrollY, [0, 400], [0.8, 0]);

    // Content for Sticky Scroll


    const volunteers = [
        { name: "hariramji", link: "https://www.linkedin.com/in/hariramji-t-6469a5310/" },
        { name: "infant ashil", link: "#" },
        { name: "Jayasurya", link: "https://www.linkedin.com/in/jayasurya-r-b37997279/" }
    ];

    return (
        <div className="bg-[#F7F5F2] text-[#1E1919] min-h-screen font-sans overflow-x-hidden selection:bg-[#0061FE] selection:text-white">
            {/* Navigation - Dark Mode for Hero */}
            <nav className="fixed top-0 w-full z-50 bg-[#101010]/90 backdrop-blur-md text-white border-b border-white/10">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                            <img src="/logo.png" alt="BuildSpace logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-black tracking-widest uppercase">BuildSpace</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-medium text-golden-1">
                        <a href="#vision" className="hover:text-[#0061FE] transition-colors">Vision</a>
                        <a href="/programs" className="hover:text-[#0061FE] transition-colors">Programs</a>
                        <a href="/meetups" className="hover:text-[#0061FE] transition-colors">Meetups</a>
                        <a href="#events" className="hover:text-[#0061FE] transition-colors">Events</a>
                        <a href="#community" className="hover:text-[#0061FE] transition-colors">Community</a>
                        <button onClick={() => navigate('/auth')} className="hover:text-[#0061FE]">Log in</button>
                        <button onClick={() => navigate('/auth')} className="bg-white text-black px-5 py-2.5 rounded-sm hover:bg-gray-200 transition-colors font-bold">
                            Get Started
                        </button>
                    </div>
                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#101010] text-white pt-24 px-6 md:hidden">
                    <div className="flex flex-col gap-6 text-golden-2 font-bold">
                        <a href="#vision" onClick={() => setIsMenuOpen(false)}>Vision</a>
                        <a href="/programs" onClick={() => setIsMenuOpen(false)}>Programs</a>
                        <a href="/meetups" onClick={() => setIsMenuOpen(false)}>Meetups</a>
                        <a href="#events" onClick={() => setIsMenuOpen(false)}>Events</a>
                        <a href="#community" onClick={() => setIsMenuOpen(false)}>Community</a>
                        <button onClick={() => navigate('/auth')} className="text-left text-[#0061FE]">Log in</button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative min-h-screen bg-[#101010] text-white flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}>
                </div>
                <motion.div
                    className="absolute inset-0 md:right-0 md:left-auto md:w-1/2 h-full pointer-events-none z-0 flex items-center justify-center md:justify-end"
                    style={{ scale: shapeScale, y: shapeY, opacity: shapeOpacity }}
                >
                    <svg viewBox="0 0 800 800" className="w-full h-full md:w-full md:h-full opacity-40 md:opacity-60">
                        <motion.path
                            d="M400,200 L600,300 L400,400 L200,300 Z"
                            fill="none" stroke="#0061FE" strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M400,400 L600,500 L400,600 L200,500 Z"
                            fill="none" stroke="#F7F5F2" strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 1 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M400,600 L600,700 L400,800 L200,700 Z"
                            fill="none" stroke="#9B0032" strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                        />
                        <motion.line x1="200" y1="300" x2="200" y2="700" stroke="#333" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1 }} />
                        <motion.line x1="600" y1="300" x2="600" y2="700" stroke="#333" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1 }} />
                        <motion.line x1="400" y1="400" x2="400" y2="600" stroke="#333" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1 }} />
                    </svg>
                </motion.div>

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-4xl"
                        >
                            <h1 className="text-5xl md:text-8xl font-black leading-[1] tracking-tighter mb-8 font-archivo-black uppercase italic italic-indigo-600">
                                BuildSpace<span className="text-indigo-600">.</span>
                            </h1>
                            <p className="text-golden-1 text-gray-400 max-w-2xl leading-relaxed mb-10 font-light">
                                The Open Source Engine for Organic Communities.<br />
                                <span className="text-white block mt-2 text-xl">The only platform built by community builders, for community builders.</span>
                                <span className="text-gray-400 block mt-4 text-golden-1 text-lg">
                                    Launch your own instance in minutes. Host your students, manage events, and scale your impact — <span className="text-indigo-400 font-bold uppercase tracking-widest">Free & Open Source Forever.</span>
                                </span>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <button onClick={() => navigate('/auth')} className="bg-[#0061FE] text-white px-8 py-4 text-golden-1 font-bold rounded-sm hover:bg-[#0050d6] transition-all flex items-center justify-center gap-3 group">
                                    Join Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>

                            </div>
                        </motion.div>

                        {/* Right: Dashboard Preview Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="relative mt-12 lg:mt-0"
                        >
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 group transition-transform duration-500">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#0061FE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                                <img
                                    src="https://res.cloudinary.com/dqudvximt/image/upload/v1771005975/Gemini_Generated_Image_il0qzjil0qzjil0q_1_cfh7ix.png"
                                    alt="DevNexus Dashboard"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#0061FE] rounded-full blur-[80px] opacity-30"></div>
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#9B0032] rounded-full blur-[80px] opacity-30"></div>

                            {/* Badge Text */}
                            <p className="text-gray-400 text-golden-1 italic text-right mt-4">Designed and built by students, for students.</p>
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
                >
                    <ChevronDown size={32} />
                </motion.div>
            </section>



            {/* Vision Section */}
            <section id="vision" className="bg-[#F7F5F2] text-[#1E1919] py-12 md:py-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-px bg-gradient-to-b from-[#101010] to-[#0061FE]"></div>
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div className="relative md:sticky md:top-32">
                            <span className="text-[#0061FE] font-bold tracking-widest uppercase text-golden-1 mb-4 block">Our Vision</span>
                            <h2 className="text-golden-2 md:text-golden-3 font-bold mb-8 leading-tight">
                                <span className="text-indigo-600">Build Your Own</span> Digital Home. <span className="text-indigo-400">Open Source</span> community engine.
                            </h2>
                            <p className="text-golden-1 text-gray-600 leading-relaxed mb-8 text-lg">
                                BuildSpace is more than just a site; it's a foundation. Our mission is to provide the tools for any community to collaborate, share, and grow. managed by you, powered by us.
                                <br /><br />
                                <span className="bg-indigo-600 text-white px-3 py-1 rounded inline-block font-bold">BRING YOUR OWN DATABASE</span> 
                                <span className="ml-2 text-sm font-mono text-gray-500 italic block mt-2">Connect Supabase, Cloudinary, and your SMTP — you're live.</span>
                            </p>
                            <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                                <div>
                                    <h3 className="text-golden-3 font-bold text-[#FF0000] mb-2">2000+</h3>
                                    <p className="text-golden-1 text-gray-500 uppercase tracking-widest">Active Members</p>
                                </div>
                                <div>
                                    <h3 className="text-golden-3 font-bold text-[#FF0000] mb-2">15+</h3>
                                    <p className="text-golden-1 text-gray-500 uppercase tracking-widest">Events Hosted</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-72 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 mt-8 md:mt-0">
                            <img
                                src="https://res.cloudinary.com/dqudvximt/image/upload/v1767535873/1760365837828_vyrmco.jpg"

                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>


                    </div>
                </div>
            </section>

            {/* Events Section - Community Moments */}
            <section id="events" className="py-24 md:py-32 bg-white text-[#1E1919]">
                <div className="container mx-auto px-6">


                    {/* Past Events Gallery */}
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-golden-2 font-bold">Community Moments</h3>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full border border-gray-700 hover:bg-white hover:text-black transition-colors"><ArrowRight className="rotate-180" /></button>
                            <button className="p-2 rounded-full border border-gray-700 hover:bg-white hover:text-black transition-colors"><ArrowRight /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {communityPhotos.slice(0, 6).map((photo, i) => (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group relative overflow-hidden rounded-xl bg-[#2A2A2A] border border-gray-800"
                            >
                                {/* Photo */}
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={photo.image_url}
                                        alt={photo.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <h4 className="text-white font-bold text-lg mb-1">{photo.title}</h4>
                                    <p className="text-gray-300 text-sm">{photo.description || photo.date}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            {/* Stats Section */}
            <StatsSection />

            {/* Sponsor Section */}
            {/* Sponsor Section */}
            <SponsorSection />
            <CommunityPartners />
            <SocialMediaSection />
            <NoticeSection />

            {/* Hall of Fame */}
            <section className="py-32 bg-[#0061FE] text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-golden-2 md:text-golden-3 font-bold mb-6">Hall of Fame</h2>
                        <p className="text-golden-1 text-white/80 max-w-3xl mx-auto">Celebrating the outstanding achievements of our community members.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-10">
                        {hallOfFameEntries.map((entry, i) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white text-[#1E1919] p-1 rounded-sm shadow-xl w-full max-w-xs transform hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="h-64 overflow-hidden bg-gray-200 mb-4">
                                    <img src={entry.image_url} alt={entry.student_name} className="w-full h-full object-cover" />
                                </div>
                                <div className="px-6 pb-8 text-center">
                                    <h3 className="text-golden-2 font-bold mb-2">{entry.student_name}</h3>
                                    <div className="w-12 h-1 bg-[#0061FE] mx-auto mb-4"></div>
                                    <p className="text-gray-600 text-golden-1 italic leading-relaxed">"{entry.description}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team / Mafia Gang */}
            <section id="community" className="py-8 md:py-16 bg-[#F7F5F2] text-[#1E1919]">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-[#0061FE] font-bold tracking-widest uppercase text-xs md:text-sm text-golden-1 mb-2 block">Community</span>
                    <h2 className="text-2xl md:text-4xl text-golden-2 md:text-golden-3 font-black uppercase italic tracking-widest mb-3">The BuildSpace Core</h2>
                    <p className="text-golden-1 text-gray-600 text-sm md:text-base max-w-2xl mx-auto mb-8">
                        Meet the core members who run the community. We are students, just like you.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        {volunteers.map((vol, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center group bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center font-black text-2xl shadow-lg transition-transform group-hover:scale-110 overflow-hidden
                                    bg-gradient-to-br from-[#2B2929] to-black text-[#FFD600] border-4 border-white">
                                    {vol.photo ? (
                                        <img src={vol.photo} alt={vol.name} className="w-full h-full object-cover" />
                                    ) : (
                                        vol.name.split(' ').map(n => n[0]).join('').toUpperCase()
                                    )}
                                </div>
                                <h3 className="font-black text-golden-1 mb-2 text-[#2B2929]">{vol.name}</h3>
                                {vol.link && (
                                    <a href={vol.link} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-[#0061FE] transition-colors">
                                        <Linkedin size={18} />
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Special Thanks & Collaboration */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-24 pt-20 border-t border-gray-100"
                    >
                        <div className="inline-flex items-center gap-2 bg-[#FFC845]/10 px-4 py-2 rounded-full font-bold text-xs text-[#B48A14] mb-4">
                            <Sparkles size={14} />
                            <span>COLLABORATION & OPEN SOURCE</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-[#2B2929] tracking-tighter mb-6 uppercase">Special Thanks</h2>
                        <div className="max-w-4xl mx-auto bg-white/40 p-8 md:p-12 rounded-[2.5rem] border border-white shadow-2xl backdrop-blur-md relative overflow-hidden group">
                           <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed relative z-10">
                             Heartfelt appreciation to <span className="text-[#0061FE] font-black">CodeSapiens</span>. 
                             BuildSpace is an open-source project created for them and with them. 
                             It's a shared mission to empower students to build their own organic communities and grow together. 
                             This platform is a testament to collaborative open-source engineering.
                           </p>
                           
                           <div className="mt-8 flex flex-wrap justify-center gap-4 relative z-10">
                              <span className="bg-white px-6 py-2 rounded-2xl border border-gray-100 text-xs font-black text-[#2B2929] shadow-sm">OPEN SOURCE COLLAB</span>
                              <span className="bg-[#2B2929] px-6 py-2 rounded-2xl text-xs font-black text-white shadow-lg">STUDENT ENGINE</span>
                              <span className="bg-white px-6 py-2 rounded-2xl border border-gray-100 text-xs font-black text-[#2B2929] shadow-sm">B2B COMMUNITY</span>
                           </div>
                        </div>
                    </motion.div>

                    {/* Community Shoutout */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-20 text-center"
                    >
                         <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Shoutout</p>
                         <h4 className="text-xl md:text-3xl font-black text-[#2B2929]/40 tracking-tight leading-snug max-w-2xl mx-auto italic">
                           "A digital haven for students to bridge the gap between <span className="text-gray-900 not-italic">learning</span> and <span className="text-gray-900 not-italic">building</span>. Join the room, start the stream."
                         </h4>
                    </motion.div>
                </div>
            </section>

            {/* Tagline Section */}
            <section className="py-20 bg-black flex items-center justify-center">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-golden-2 md:text-golden-3 font-black text-white tracking-tighter uppercase leading-none">
                        Building Community <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0061FE] to-[#00C6F7]">Since 2023</span>
                    </h2>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#101010] text-gray-400 py-16 border-t border-gray-900">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="max-w-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-white/20 shadow-lg overflow-hidden">
                                    <img src="/logo.png" alt="BuildSpace logo" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-2xl font-black text-white tracking-widest uppercase italic">BuildSpace</span>
                            </div>
                            <p className="text-gray-500 leading-relaxed mb-8">
                                The B2B Open Source Engine for Organic Communities. Launch your own instance, manage your members, and build something big.
                            </p>
                            <div className="flex gap-6">
                                <a href="https://github.com/BuildSpace-OS" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-16">
                            <div>
                                <h4 className="text-white font-bold mb-6">Platform</h4>
                                <ul className="space-y-4 text-golden-1 text-sm">
                                    <li><a href="#vision" className="hover:text-indigo-400 transition-colors uppercase tracking-widest">About Platform</a></li>
                                    <li><a href="/auth" className="hover:text-indigo-400 transition-colors uppercase tracking-widest">Launch Community</a></li>
                                    <li><a href="#community" className="hover:text-indigo-400 transition-colors uppercase tracking-widest">Our Team</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-golden-1 text-gray-600 text-xs">
                        <p>© 2025 BuildSpace Engine. All rights reserved.</p>
                        <p>Powered by Open Source.</p>
                    </div>
                </div>
            </footer>
            <LandingPopup />
        </div>
    );
};

export default DevNexusHero;
