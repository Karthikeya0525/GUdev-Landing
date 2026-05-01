"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { 
  Rocket, Plus, Grid, List, Search, 
  ExternalLink, Clock, ChevronRight, 
  Trash2, MoreVertical, Layout, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProjects(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProjects(session.user.id);
      } else {
        setUser(null);
        setProjects([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async (userId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
    setLoading(false);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Layout size={60} className="text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8 max-w-sm">Please sign in from the home page to view your agentic dashboard.</p>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <Link href="/" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-black">
                <ArrowLeft size={20} />
             </Link>
             <div>
                <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase">Agentic Console</h1>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Workspace: {user.email}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none"
                />
             </div>
             <Link href="/" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Plus size={18} /> New Product
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8">
        <div className="flex items-center justify-between mb-10">
           <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Project Archive ({projects.length})</h2>
           <div className="flex bg-gray-100 p-1 rounded-lg">
              <button className="p-1.5 bg-white rounded-md shadow-sm text-gray-900"><Grid size={16} /></button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600"><List size={16} /></button>
           </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] py-32 text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                <Plus size={40} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
             <p className="text-gray-500 mb-8">Start your first generation to see it here.</p>
             <Link href="/" className="bg-black text-white px-8 py-3 rounded-xl font-bold">
                Deploy Your First Agent
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white border border-gray-100 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer relative"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Rocket size={24} />
                    </div>
                    <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                       <MoreVertical size={20} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed">
                    {project.prompt}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-indigo-600 transition-all">
                          <Trash2 size={16} />
                       </button>
                       <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-indigo-600 transition-all">
                          Open <ChevronRight size={14} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <footer className="py-12 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
         Agentic UX Platform — Secured by Supabase
      </footer>
    </div>
  );
}
