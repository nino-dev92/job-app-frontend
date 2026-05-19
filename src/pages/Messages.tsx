import Navbar from "../components/NavBar.tsx";
import Sidebar from "../components/SideBar.tsx";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FiArrowLeft, FiSend, FiInbox } from "react-icons/fi";
import { TbMessages } from "react-icons/tb";
import { format } from "date-fns";

const Messages = () => {
  const { auth } = useAuth();
  const { id } = useParams(); // This is the OTHER user's ID
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [job, setJob] = useState<any>(null);
  const [text, setText] = useState<string>("");
  const api = useAxiosPrivate();

  useEffect(() => {
    const getJob = async () => {
      if (!jobId) return;
      try {
        const res = await api.get(`/jobs/${jobId}`);
        setJob(res.data);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    getJob();
  }, [jobId]);

  useEffect(() => {
    const getAllConversations = async () => {
      try {
        const res = await api.get('/messages');
        setConversations(res.data);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getAllConversations();
  }, []);

  const getConversation = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/messages/${id}`);
      setMessages(res.data || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getConversation();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || !id) return;
    
    try {
      const res = await api.post("/messages", { text, receiverId: id });
      setMessages(res.data.messages || res.data); // Adjust based on API structure
      setText("");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-background flex flex-row">
      <title>Messages</title>

      {/**TopNav */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/**Inbox Sidebar */}
      <aside className={`pt-20 border-r bg-white w-full md:w-80 min-h-screen flex-col overflow-hidden transition-all duration-300 ${id ? 'hidden md:flex' : 'flex'} md:ml-60`}>
        <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiInbox className="text-blue-600" /> Inbox
          </h1>
          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
            {conversations.length}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1 p-2">
          {conversations.length > 0 ? (
            conversations.map((conv, index) => {
              const otherParticipant = conv.participants.find((p: any) => p._id !== auth?.id);
              const isActive = id === otherParticipant?._id;
              
              return (
                <Link 
                  key={index} 
                  to={`/messages/${otherParticipant?._id}`}
                  className={`flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold truncate">{otherParticipant?.name || 'Unknown User'}</p>
                    <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {conv.updatedAt && format(new Date(conv.updatedAt), 'HH:mm')}
                    </span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {otherParticipant?.email}
                  </p>
                </Link>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <FiInbox size={32} className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No conversations yet</p>
              <p className="text-slate-400 text-xs mt-1">When you message an employer or jobseeker, it will appear here.</p>
            </div>
          )}
        </div>
      </aside>

      {/**Chat Area */}
      <main className={`flex-1 flex flex-col bg-slate-50 h-screen transition-all duration-300 ${id ? 'flex' : 'hidden md:flex'}`}>
        {!id ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <FiInbox size={48} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Select a Conversation</h2>
            <p className="text-slate-500 mt-2 max-w-sm">
              Choose a person from your inbox to start chatting and manage your applications.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-20">
            {/* Chat Header */}
            <header className="bg-white border-b border-slate-100 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <Link to="/messages" className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <FiArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                  <h2 className="font-bold text-slate-900 leading-tight">
                    {job ? job.title : conversations.find(c => c.participants.some((p: any) => p._id === id))?.participants.find((p: any) => p._id === id)?.name || "Chat"}
                  </h2>
                  <p className="text-xs text-blue-600 font-medium">
                    {job ? job.company?.name : "Active Conversation"}
                  </p>
                </div>
              </div>
              {job && (
                <div className="hidden lg:flex gap-2">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {job.location}
                  </span>
                </div>
              )}
            </header>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/30">
              {messages.length > 0 ? (
                messages.map((message, index) => {
                  const isSentByMe = (message.sender?._id || message.sender) === auth?.id;

                  return (
                    <div key={index} className={`flex ${isSentByMe ? "justify-end" : "justify-start animate-fade-in"}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] group`}>
                        <div className={`p-4 rounded-2xl shadow-sm ${isSentByMe 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : "bg-white text-slate-700 rounded-tl-none border border-slate-100"}`}>
                          <p className="text-sm md:text-md leading-relaxed">{message.text}</p>
                        </div>
                        <div className={`flex items-center mt-1.5 px-1 gap-2 ${isSentByMe ? "justify-end" : "justify-start"}`}>
                          <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                            {format(new Date(message.createdAt), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="bg-white p-4 rounded-full border border-dashed border-slate-200 mb-2">
                    <TbMessages size={32} />
                  </div>
                  <p className="text-sm font-medium">No messages yet. Send a greeting!</p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="bg-white border-t border-slate-100 p-4 md:p-6">
              <form 
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-3xl px-4 py-2 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200" 
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent py-2 outline-none text-slate-700 placeholder:text-slate-400"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 active:scale-90 transition-all disabled:opacity-30 disabled:grayscale"
                >
                  <FiSend size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
