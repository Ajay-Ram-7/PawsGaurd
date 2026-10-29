
import React, { useState } from 'react';
import { CommunityPost, UserRole, Comment } from '../types';
import { MessageSquare, MapPin, Send, Plus, Image as ImageIcon, CheckCircle2, Search } from 'lucide-react';

interface CommunityHubProps {
  posts: CommunityPost[];
  role: UserRole;
  userIdentifier: string;
  onAddPost: (post: Omit<CommunityPost, 'id' | 'comments' | 'timestamp'>) => void;
  onAddComment: (postId: string, comment: string) => void;
  onUpdateStatus: (postId: string, status: CommunityPost['status']) => void;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ 
  posts, 
  role, 
  userIdentifier, 
  onAddPost, 
  onAddComment,
  onUpdateStatus
}) => {
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    location: '',
    photoUrl: '',
    status: 'Searching' as CommunityPost['status']
  });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPost(newPost);
    setNewPost({ title: '', description: '', location: '', photoUrl: '', status: 'Searching' });
    setIsAddingPost(false);
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentInputs[postId]?.trim()) return;
    onAddComment(postId, commentInputs[postId]);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Community Rescue Hub</h2>
          <p className="text-slate-500 font-medium">Collaborative efforts to locate and rescue dogs in need.</p>
        </div>
        {role === 'ADMIN' && (
          <button 
            onClick={() => setIsAddingPost(!isAddingPost)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-teal-100"
          >
            {isAddingPost ? <Plus className="h-5 w-5 rotate-45" /> : <Plus className="h-5 w-5" />}
            {isAddingPost ? 'Cancel Post' : 'New Rescue Alert'}
          </button>
        )}
      </div>

      {/* New Post Form (Admin Only) */}
      {isAddingPost && (
        <div className="bg-white p-8 rounded-3xl border-2 border-teal-100 shadow-xl animate-in zoom-in-95 duration-300">
          <form onSubmit={handleSubmitPost} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rescue Title</label>
                <input 
                  required
                  type="text" 
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  placeholder="e.g., Help Find Brownie"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    value={newPost.location}
                    onChange={e => setNewPost({...newPost, location: e.target.value})}
                    placeholder="Last seen location..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Photo URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required
                    type="url" 
                    value={newPost.photoUrl}
                    onChange={e => setNewPost({...newPost, photoUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea 
                  required
                  rows={6}
                  value={newPost.description}
                  onChange={e => setNewPost({...newPost, description: e.target.value})}
                  placeholder="Describe the dog and the situation..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none font-medium resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg"
              >
                Publish Alert
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Feed */}
      <div className="grid grid-cols-1 gap-10">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row group hover:border-teal-200 transition-all duration-300">
            {/* Image Section */}
            <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden">
              <img 
                src={post.photoUrl} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                  post.status === 'Searching' ? 'bg-amber-500 text-white' :
                  post.status === 'Found' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {post.status}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-1">{post.title}</h3>
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {post.location}</span>
                    <span>•</span>
                    <span>Posted by {post.authorName}</span>
                    <span>•</span>
                    <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                {role === 'ADMIN' && (
                  <div className="flex gap-2">
                    <select 
                      value={post.status}
                      onChange={(e) => onUpdateStatus(post.id, e.target.value as CommunityPost['status'])}
                      className="text-[10px] font-black uppercase tracking-widest bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Searching">Searching</option>
                      <option value="Found">Found</option>
                      <option value="Rescued">Rescued</option>
                    </select>
                  </div>
                )}
              </div>

              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                {post.description}
              </p>

              {/* Comments Section */}
              <div className="mt-auto border-t border-slate-100 pt-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Community Intelligence ({post.comments.length})
                </h4>

                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {post.comments.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl p-6 text-center">
                      <p className="text-slate-400 text-sm font-medium italic">No updates yet. Be the first to help!</p>
                    </div>
                  ) : (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                          comment.authorRole === 'ADMIN' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {comment.authorName.charAt(0)}
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-2xl p-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                              {comment.authorName} 
                              {comment.authorRole === 'ADMIN' && <span className="ml-2 text-[8px] bg-teal-600 text-white px-1.5 py-0.5 rounded">OFFICER</span>}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Add an update or sighting info..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({...commentInputs, [post.id]: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                  <button 
                    onClick={() => handleCommentSubmit(post.id)}
                    className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHub;
