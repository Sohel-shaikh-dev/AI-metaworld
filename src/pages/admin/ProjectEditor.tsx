import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const PROJECT_TYPES = [
  { id: 'website', label: 'Website Design' },
  { id: 'branding', label: 'Branding & Identity' },
  { id: 'fashion', label: 'AI Fashion Try-On' },
  { id: 'growth', label: 'Google Business Growth' },
  { id: 'pod', label: 'Print-On-Demand' }
];

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  
  // Basic Fields
  const [type, setType] = useState('website');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  
  // Dynamic Content Field (JSONB)
  const [modalContent, setModalContent] = useState<any>({});

  useEffect(() => {
    if (isEditing) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) {
      toast.error('Failed to load project');
      navigate('/admin/projects');
    } else if (data) {
      setType(data.type);
      setCategory(data.category);
      setTitle(data.title);
      setDesc(data.desc);
      setImage(data.image);
      setModalContent(data.content || {});
    }
    setFetching(false);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage.from('portfolio-assets').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        return null;
      }
      
      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      toast.error(`Upload exception: ${err.message}`);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isArray = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const toastId = toast.loading('Uploading file...');
    const file = e.target.files[0];
    
    try {
      const url = await uploadFile(file);
      
      if (url) {
        toast.success('Upload complete', { id: toastId });
        if (field === 'mainImage') {
          setImage(url);
        } else if (isArray) {
          setModalContent((prev: any) => ({
            ...prev,
            [field]: [...(prev[field] || []), url]
          }));
        } else {
          setModalContent((prev: any) => ({
            ...prev,
            [field]: url
          }));
        }
      } else {
        toast.dismiss(toastId);
      }
    } catch (err) {
      toast.error('Unexpected error during upload', { id: toastId });
    }
    
    // Clear input so same file can be uploaded again if needed
    e.target.value = '';
  };

  const removeArrayItem = (field: string, index: number) => {
    setModalContent((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      type,
      category,
      title,
      desc,
      image,
      content: modalContent
    };

    let error;
    if (isEditing) {
      const res = await supabase.from('projects').update(projectData).eq('id', id);
      error = res.error;
    } else {
      const res = await supabase.from('projects').insert([projectData]);
      error = res.error;
    }

    if (error) {
      toast.error(`Save failed: ${error.message}`);
    } else {
      toast.success('Project saved successfully');
      navigate('/admin/projects');
    }
    setLoading(false);
  };

  if (fetching) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#ceab7a] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/admin/projects" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-white tracking-tight">{isEditing ? 'Edit Project' : 'New Project'}</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Fields */}
        <div className="bg-[#101010] border border-white/5 p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-serif text-white border-b border-white/5 pb-4">Core Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Project Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
              >
                {PROJECT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Category Label</label>
              <input 
                type="text" value={category} onChange={(e) => setCategory(e.target.value)} required
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
                placeholder="e.g. Website Design"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Title</label>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Description</label>
              <textarea 
                value={desc} onChange={(e) => setDesc(e.target.value)} required rows={3}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Main Thumbnail Image</label>
              <div className="flex gap-4 items-start">
                {image && (
                  <div className="w-32 h-32 rounded-xl overflow-hidden border border-white/10 shrink-0 relative group">
                    <img src={image} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImage('')} className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-red-400 opacity-100 transition-opacity z-10 hover:bg-black hover:text-red-300"><X size={14}/></button>
                  </div>
                )}
                <label className="flex-1 border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Click to upload thumbnail</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'mainImage')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Modal Content Fields based on Type */}
        <div className="bg-[#101010] border border-white/5 p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-serif text-white border-b border-white/5 pb-4">Dynamic Case Study Details</h2>
          
          <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Client Name</label>
             <input type="text" value={modalContent.clientName || ''} onChange={(e) => setModalContent({...modalContent, clientName: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
          </div>
          
          <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Live URL (Optional)</label>
             <input type="text" value={modalContent.liveUrl || ''} onChange={(e) => setModalContent({...modalContent, liveUrl: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
          </div>

          <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Deliverables (Comma separated)</label>
             <input type="text" value={(modalContent.deliverables || []).join(', ')} onChange={(e) => setModalContent({...modalContent, deliverables: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white" />
          </div>

          <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Project Video (Optional)</label>
             <div className="flex gap-4 items-start">
                {modalContent.videoUrl && (
                  <div className="w-32 h-32 rounded-xl overflow-hidden border border-white/10 shrink-0 relative group">
                    <video src={modalContent.videoUrl} className="w-full h-full object-cover" muted />
                    <button type="button" onClick={() => setModalContent({...modalContent, videoUrl: null})} className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-red-400 opacity-100 transition-opacity z-10 hover:bg-black hover:text-red-300"><X size={14}/></button>
                  </div>
                )}
                <label className="flex-1 border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Click to upload video</span>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleImageUpload(e, 'videoUrl')} />
                </label>
             </div>
          </div>

          {/* Type-Specific Arrays (Images) */}
          <div className="pt-6 border-t border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] mb-4">Media Galleries</h3>
            
            {(type === 'website') && (
              <div className="space-y-6">
                <div>
                   <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">Desktop Screens</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                     {(modalContent.desktopScreens || []).map((img: string, i: number) => (
                       <div key={i} className="relative aspect-video rounded-lg overflow-hidden group border border-white/10">
                         <img src={img} className="w-full h-full object-cover" />
                         <button type="button" onClick={() => removeArrayItem('desktopScreens', i)} className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-red-400 opacity-100 transition-opacity hover:bg-black hover:text-red-300"><X size={14}/></button>
                       </div>
                     ))}
                   </div>
                   <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer text-sm text-white transition-colors">
                     <Upload size={14} /> Upload Desktop Screen
                     <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'desktopScreens', true)} />
                   </label>
                </div>
              </div>
            )}
            
            {(type === 'branding' || type === 'growth' || type === 'pod') && (
              <div className="space-y-6">
                <div>
                   <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">
                     {type === 'branding' ? 'Logos & Mockups' : type === 'growth' ? 'Dashboard Screenshots' : 'Product Previews'}
                   </label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                     {((type === 'branding' ? modalContent.mockups : type === 'growth' ? modalContent.dashboards : modalContent.products) || []).map((img: string, i: number) => (
                       <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                         <img src={img} className="w-full h-full object-cover" />
                         <button type="button" onClick={() => removeArrayItem(type === 'branding' ? 'mockups' : type === 'growth' ? 'dashboards' : 'products', i)} className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-red-400 opacity-100 transition-opacity hover:bg-black hover:text-red-300"><X size={14}/></button>
                       </div>
                     ))}
                   </div>
                   <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer text-sm text-white transition-colors">
                     <Upload size={14} /> Upload Additional Image
                     <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, type === 'branding' ? 'mockups' : type === 'growth' ? 'dashboards' : 'products', true)} />
                   </label>
                </div>
              </div>
            )}

            {(type === 'fashion') && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">Before & After Pairs</label>
                  <div className="space-y-4 mb-4">
                    {(modalContent.transformations || []).map((pair: any, i: number) => (
                      <div key={i} className="flex gap-4 items-center bg-[#151515] p-4 rounded-xl border border-white/5">
                        <div className="flex-1">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Before Image</label>
                          {pair.before ? (
                            <div className="relative aspect-[3/4] w-24 rounded-lg overflow-hidden group border border-white/10">
                              <img src={pair.before} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => {
                                 const newTrans = [...modalContent.transformations];
                                 newTrans[i].before = null;
                                 setModalContent({...modalContent, transformations: newTrans});
                              }} className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-red-400 opacity-100 transition-opacity z-10 hover:bg-black hover:text-red-300"><X size={14}/></button>
                            </div>
                          ) : (
                            <label className="block aspect-[3/4] w-24 border border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/5">
                              <Upload size={14} className="text-gray-400" />
                              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const toastId = toast.loading('Uploading file...');
                                   const url = await uploadFile(file);
                                   if (url) {
                                     const newTrans = [...modalContent.transformations];
                                     newTrans[i].before = url;
                                     setModalContent({...modalContent, transformations: newTrans});
                                     toast.success('Upload complete', { id: toastId });
                                   } else {
                                     toast.dismiss(toastId);
                                   }
                                 }
                                 e.target.value = '';
                              }} />
                            </label>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">After Image</label>
                          {pair.after ? (
                            <div className="relative aspect-[3/4] w-24 rounded-lg overflow-hidden group border border-[#ceab7a]/30">
                              <img src={pair.after} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => {
                                 const newTrans = [...modalContent.transformations];
                                 newTrans[i].after = null;
                                 setModalContent({...modalContent, transformations: newTrans});
                              }} className="absolute top-1 right-1 p-1 bg-black/80 rounded-full text-red-400 opacity-100 transition-opacity z-10 hover:bg-black hover:text-red-300"><X size={14}/></button>
                            </div>
                          ) : (
                            <label className="block aspect-[3/4] w-24 border border-dashed border-[#ceab7a]/30 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#ceab7a]/5">
                              <Upload size={14} className="text-[#ceab7a]" />
                              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const toastId = toast.loading('Uploading file...');
                                   const url = await uploadFile(file);
                                   if (url) {
                                     const newTrans = [...modalContent.transformations];
                                     newTrans[i].after = url;
                                     setModalContent({...modalContent, transformations: newTrans});
                                     toast.success('Upload complete', { id: toastId });
                                   } else {
                                     toast.dismiss(toastId);
                                   }
                                 }
                                 e.target.value = '';
                              }} />
                            </label>
                          )}
                        </div>
                        
                        <button type="button" onClick={() => {
                          setModalContent({...modalContent, transformations: modalContent.transformations.filter((_: any, idx: number) => idx !== i)});
                        }} className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => {
                    setModalContent({...modalContent, transformations: [...(modalContent.transformations || []), { before: null, after: null }]});
                  }} className="px-4 py-2 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-lg text-sm text-[#ceab7a] transition-colors">
                    + Add Before & After Pair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#ceab7a] text-black font-bold py-5 rounded-2xl uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_30px_rgba(206,171,122,0.2)]"
        >
          {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><Save size={18} /> Save Project</>}
        </button>
      </form>
    </motion.div>
  );
}
