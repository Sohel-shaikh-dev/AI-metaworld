import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, AlertTriangle, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ImageCropEditor, { type CropSession } from '../../components/admin/ImageCropEditor';
import MediaUploadCard from '../../components/admin/MediaUploadCard';

const PROJECT_TYPES = [
  { id: 'website', label: 'Website Design' },
  { id: 'branding', label: 'Branding & Identity' },
  { id: 'fashion', label: 'AI Fashion Try-On' },
  { id: 'growth', label: 'Power BI Data Analysis' },
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
  const [cropSession, setCropSession] = useState<CropSession | null>(null);

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploadingStates, setIsUploadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isEditing) {
      loadProject();
    }
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Mark changes
  const handleChange = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

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
      // Reset changes after load
      setTimeout(() => setHasUnsavedChanges(false), 100);
    }
    setFetching(false);
  };

  const handleTypeChange = (newType: string) => {
    if (Object.keys(modalContent).length > 0 && type !== newType) {
      if (window.confirm("Changing the project type may clear or hide fields that are not used by the new category. Continue?")) {
        setType(newType);
        setModalContent({}); // Clear fields safely
        handleChange();
      }
    } else {
      setType(newType);
      handleChange();
    }
  };

  const setUploading = (fieldKey: string, isUploading: boolean) => {
    setIsUploadingStates(prev => ({ ...prev, [fieldKey]: isUploading }));
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error('Your session has expired. Please log in again.');
        return null;
      }

      const session = sessionData.session;
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);

      if (expiresAt && expiresAt < now + 120) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session) {
          toast.error('Your session has expired. Please log in again.');
          return null;
        }
      }

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

  const triggerCrop = (file: File, onComplete: (croppedFile: File) => Promise<void>) => {
    if (file.type.startsWith('video/')) {
      onComplete(file);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setCropSession({
      file,
      previewUrl,
      onComplete: async (croppedFile) => {
        setCropSession(null);
        URL.revokeObjectURL(previewUrl);
        await onComplete(croppedFile);
      },
      onCancel: () => {
        setCropSession(null);
        URL.revokeObjectURL(previewUrl);
      }
    });
  };

  // Simplified array mutation helpers
  const updateArrayItem = (field: string, index: number, newValue: any) => {
    setModalContent((prev: any) => {
      const arr = [...(prev[field] || [])];
      arr[index] = newValue;
      return { ...prev, [field]: arr };
    });
    handleChange();
  };

  const removeArrayItem = (field: string, index: number) => {
    setModalContent((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
    handleChange();
  };

  const addArrayItem = (field: string, defaultValue: any) => {
    setModalContent((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue]
    }));
    handleChange();
  };

  const handleGenericImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string, onUrl: (url: string) => void) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    triggerCrop(file, async (croppedFile) => {
      setUploading(fieldKey, true);
      const url = await uploadFile(croppedFile);
      if (url) {
        onUrl(url);
        handleChange();
      }
      setUploading(fieldKey, false);
    });
    e.target.value = '';
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
      setHasUnsavedChanges(false);
      toast.success('Project saved successfully');
      navigate('/admin/projects');
    }
    setLoading(false);
  };

  if (fetching) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#ceab7a] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/projects" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white" onClick={(e) => {
            if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Leave anyway?')) {
              e.preventDefault();
            }
          }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-white tracking-tight">{isEditing ? 'Edit Project' : 'New Project'}</h1>
            {hasUnsavedChanges && <p className="text-xs text-[#ceab7a] flex items-center gap-1 mt-1"><AlertTriangle size={12}/> Unsaved changes</p>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Core Fields */}
        <div className="bg-[#101010] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-4">1. Core Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Project Type</label>
              <select 
                value={type} 
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
              >
                {PROJECT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Category Label</label>
              <input 
                type="text" value={category} onChange={(e) => { setCategory(e.target.value); handleChange(); }} required
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
                placeholder="e.g. Website Design"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Title</label>
              <input 
                type="text" value={title} onChange={(e) => { setTitle(e.target.value); handleChange(); }} required
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Description</label>
              <textarea 
                value={desc} onChange={(e) => { setDesc(e.target.value); handleChange(); }} required rows={3}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
              />
            </div>
            
            <div className="md:col-span-2 pt-2 border-t border-white/5">
              <MediaUploadCard 
                label="Main Thumbnail"
                description="This image appears on the portfolio grid."
                image={image}
                isLoading={isUploadingStates['mainImage']}
                onFileSelect={(e) => handleGenericImageUpload(e, 'mainImage', setImage)}
                onRemove={() => { setImage(''); handleChange(); }}
                aspectClass="aspect-video sm:w-1/2"
                objectFit="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Modal Content Fields based on Type */}
        <div className="bg-[#101010] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-8">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-4">2. Case Study Details</h2>
          
          {type !== 'growth' && type !== 'pod' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Client Name</label>
                 <input type="text" value={modalContent.clientName || ''} onChange={(e) => { setModalContent({...modalContent, clientName: e.target.value}); handleChange(); }} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ceab7a]/50 outline-none" />
              </div>
              
              <div className="space-y-2">
                 <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Live URL (Optional)</label>
                 <input type="text" value={modalContent.liveUrl || ''} onChange={(e) => { setModalContent({...modalContent, liveUrl: e.target.value}); handleChange(); }} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ceab7a]/50 outline-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
                 <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Deliverables (Comma separated)</label>
                 <input type="text" value={(modalContent.deliverables || []).join(', ')} onChange={(e) => { setModalContent({...modalContent, deliverables: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)}); handleChange(); }} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ceab7a]/50 outline-none" />
              </div>

              <div className="space-y-2 md:col-span-2">
                 <MediaUploadCard 
                   label="Project Video (Optional)"
                   image={modalContent.videoUrl}
                   isLoading={isUploadingStates['videoUrl']}
                   onFileSelect={(e) => handleGenericImageUpload(e, 'videoUrl', (url) => setModalContent({...modalContent, videoUrl: url}))}
                   onRemove={() => setModalContent({...modalContent, videoUrl: null})}
                   aspectClass="aspect-video sm:w-1/2"
                 />
              </div>
            </div>
          )}

          {/* Type-Specific Content */}
          <div className="pt-2">
            
            {(type === 'website') && (
              <div className="space-y-4">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] mb-4">Desktop Screens</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {(modalContent.desktopScreens || []).map((img: string, i: number) => (
                     <MediaUploadCard 
                       key={i}
                       label={`Screen ${i + 1}`}
                       image={img}
                       isLoading={isUploadingStates[`screen_${i}`]}
                       onFileSelect={(e) => handleGenericImageUpload(e, `screen_${i}`, (url) => updateArrayItem('desktopScreens', i, url))}
                       onRemove={() => removeArrayItem('desktopScreens', i)}
                       aspectClass="aspect-video"
                     />
                   ))}
                 </div>
                 <button type="button" onClick={() => addArrayItem('desktopScreens', '')} className="mt-4 px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors">
                   + ADD SCREEN
                 </button>
              </div>
            )}
            
            {(type === 'branding') && (
              <div className="space-y-4">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] mb-4">Logos & Mockups</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                   {(modalContent.mockups || []).map((img: string, i: number) => (
                     <MediaUploadCard 
                       key={i}
                       label={`Mockup ${i + 1}`}
                       image={img}
                       isLoading={isUploadingStates[`mockup_${i}`]}
                       onFileSelect={(e) => handleGenericImageUpload(e, `mockup_${i}`, (url) => updateArrayItem('mockups', i, url))}
                       onRemove={() => removeArrayItem('mockups', i)}
                       aspectClass="aspect-square"
                     />
                   ))}
                 </div>
                 <button type="button" onClick={() => addArrayItem('mockups', '')} className="mt-4 px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors">
                   + ADD MOCKUP
                 </button>
              </div>
            )}

            {(type === 'pod') && (
              <div className="space-y-12">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Design Concept (Optional)</label>
                  <textarea 
                    value={modalContent.designConcept || ''} 
                    onChange={(e) => { setModalContent({...modalContent, designConcept: e.target.value}); handleChange(); }}
                    placeholder="Explain the design idea..."
                    className="w-full bg-[#151515] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#ceab7a]/50 transition-colors h-24"
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Product Previews</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(modalContent.products || []).map((prod: any, i: number) => {
                      const isString = typeof prod === 'string';
                      const img = isString ? prod : prod.image;
                      const prodType = isString ? 'Other' : prod.type;
                      return (
                        <div key={i} className="bg-[#151515] p-6 rounded-xl border border-white/5 space-y-4">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Product Type</label>
                            <select
                                value={prodType}
                                onChange={(e) => {
                                  updateArrayItem('products', i, { type: e.target.value, image: img });
                                }}
                                className="bg-[#101010] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
                              >
                                <option value="T-Shirt">T-Shirt</option>
                                <option value="Mug / Cup">Mug / Cup</option>
                                <option value="Book Cover">Book Cover</option>
                                <option value="Mobile Cover">Mobile Cover</option>
                                <option value="Other">Other</option>
                              </select>
                          </div>
                          <MediaUploadCard 
                            label="Product Image"
                            image={img}
                            isLoading={isUploadingStates[`pod_${i}`]}
                            onFileSelect={(e) => handleGenericImageUpload(e, `pod_${i}`, (url) => updateArrayItem('products', i, { type: prodType, image: url }))}
                            onRemove={() => removeArrayItem('products', i)}
                            aspectClass="aspect-square"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => addArrayItem('products', { type: 'T-Shirt', image: '' })} className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors w-full sm:w-auto">
                    + ADD PRODUCT
                  </button>
                </div>
              </div>
            )}

            {(type === 'fashion') && (
              <div className="space-y-12">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">Project Brief</label>
                  <textarea 
                    value={modalContent.projectBrief || ''} 
                    onChange={(e) => { setModalContent({...modalContent, projectBrief: e.target.value}); handleChange(); }}
                    className="w-full bg-[#151515] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#ceab7a]/50 transition-colors h-24"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Product Inputs</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {(modalContent.productInputs || []).map((img: string, i: number) => (
                      <MediaUploadCard 
                        key={i}
                        label={`Input ${i + 1}`}
                        image={img}
                        isLoading={isUploadingStates[`input_${i}`]}
                        onFileSelect={(e) => handleGenericImageUpload(e, `input_${i}`, (url) => updateArrayItem('productInputs', i, url))}
                        onRemove={() => removeArrayItem('productInputs', i)}
                        aspectClass="aspect-[3/4]"
                      />
                    ))}
                  </div>
                  <button type="button" onClick={() => addArrayItem('productInputs', '')} className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors">
                    + ADD INPUT
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Try-On Transformations</h3>
                  <div className="space-y-6">
                    {(modalContent.transformations || []).map((pair: any, i: number) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 bg-[#151515] rounded-xl border border-white/5 relative">
                        <button type="button" onClick={() => removeArrayItem('transformations', i)} className="absolute top-4 right-4 text-red-400 hover:text-red-300">
                           <span className="text-xs uppercase tracking-widest font-bold">Remove Pair</span>
                        </button>
                        <div className="flex-1 mt-4 sm:mt-0">
                          <MediaUploadCard 
                            label="Before Image"
                            image={pair.before}
                            isLoading={isUploadingStates[`before_${i}`]}
                            onFileSelect={(e) => handleGenericImageUpload(e, `before_${i}`, (url) => updateArrayItem('transformations', i, { ...pair, before: url }))}
                            onRemove={() => updateArrayItem('transformations', i, { ...pair, before: null })}
                            aspectClass="aspect-[3/4] max-w-[200px]"
                          />
                        </div>
                        <div className="flex-1">
                          <MediaUploadCard 
                            label="After Image"
                            image={pair.after}
                            isLoading={isUploadingStates[`after_${i}`]}
                            onFileSelect={(e) => handleGenericImageUpload(e, `after_${i}`, (url) => updateArrayItem('transformations', i, { ...pair, after: url }))}
                            onRemove={() => updateArrayItem('transformations', i, { ...pair, after: null })}
                            aspectClass="aspect-[3/4] max-w-[200px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addArrayItem('transformations', { before: null, after: null })} className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors">
                    + ADD PAIR
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Campaign Visuals</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {(modalContent.campaignVisuals || []).map((img: string, i: number) => (
                      <MediaUploadCard 
                        key={i}
                        label={`Visual ${i + 1}`}
                        image={img}
                        isLoading={isUploadingStates[`camp_${i}`]}
                        onFileSelect={(e) => handleGenericImageUpload(e, `camp_${i}`, (url) => updateArrayItem('campaignVisuals', i, url))}
                        onRemove={() => removeArrayItem('campaignVisuals', i)}
                        aspectClass="aspect-[3/4]"
                      />
                    ))}
                  </div>
                  <button type="button" onClick={() => addArrayItem('campaignVisuals', '')} className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors">
                    + ADD VISUAL
                  </button>
                </div>
              </div>
            )}

            {(type === 'growth') && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium">Business Problem</label>
                    <textarea value={modalContent.businessProblem || ''} onChange={(e) => { setModalContent({...modalContent, businessProblem: e.target.value}); handleChange(); }} className="w-full bg-[#151515] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#ceab7a]/50 h-24" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium">Solution</label>
                    <textarea value={modalContent.solution || ''} onChange={(e) => { setModalContent({...modalContent, solution: e.target.value}); handleChange(); }} className="w-full bg-[#151515] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#ceab7a]/50 h-24" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Technologies Used</h3>
                  <div className="flex flex-col gap-3 max-w-lg">
                    {(modalContent.technologies || []).map((tech: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={tech} onChange={(e) => updateArrayItem('technologies', i, e.target.value)} className="flex-1 bg-[#151515] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-[#ceab7a]/50 outline-none" />
                        <button type="button" onClick={() => removeArrayItem('technologies', i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"><X size={16} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('technologies', '')} className="self-start px-6 py-2 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors">+ ADD TECH</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Key Insights</h3>
                  <div className="flex flex-col gap-3">
                    {(modalContent.keyInsights || []).map((insight: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <textarea value={insight} onChange={(e) => updateArrayItem('keyInsights', i, e.target.value)} className="flex-1 bg-[#151515] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-[#ceab7a]/50 outline-none h-16" />
                        <button type="button" onClick={() => removeArrayItem('keyInsights', i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors flex items-center"><X size={16} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('keyInsights', '')} className="self-start px-6 py-2 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors">+ ADD INSIGHT</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Key Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(modalContent.metrics || []).map((metric: any, i: number) => (
                      <div key={i} className="bg-[#151515] p-5 rounded-xl border border-white/5 relative">
                        <button type="button" onClick={() => removeArrayItem('metrics', i)} className="absolute top-2 right-2 p-1 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"><X size={14} /></button>
                        <div className="grid grid-cols-2 gap-4 mb-3 mt-2">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Label</label>
                            <input type="text" value={metric.label || ''} onChange={(e) => updateArrayItem('metrics', i, {...metric, label: e.target.value})} className="w-full bg-[#101010] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ceab7a]/50 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Value</label>
                            <input type="text" value={metric.value || ''} onChange={(e) => updateArrayItem('metrics', i, {...metric, value: e.target.value})} className="w-full bg-[#101010] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ceab7a]/50 outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Description</label>
                          <input type="text" value={metric.description || ''} onChange={(e) => updateArrayItem('metrics', i, {...metric, description: e.target.value})} className="w-full bg-[#101010] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ceab7a]/50 outline-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addArrayItem('metrics', { label: '', value: '', description: '' })} className="self-start px-6 py-2 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors">+ ADD METRIC</button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Dashboard Screenshots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {(modalContent.dashboards || []).map((img: string, i: number) => (
                       <MediaUploadCard 
                         key={i}
                         label={`Dashboard ${i + 1}`}
                         image={img}
                         isLoading={isUploadingStates[`dash_${i}`]}
                         onFileSelect={(e) => handleGenericImageUpload(e, `dash_${i}`, (url) => updateArrayItem('dashboards', i, url))}
                         onRemove={() => removeArrayItem('dashboards', i)}
                         aspectClass="aspect-video"
                         objectFit="object-contain"
                       />
                     ))}
                   </div>
                   <button type="button" onClick={() => addArrayItem('dashboards', '')} className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors">+ ADD SCREENSHOT</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/10 z-40 lg:left-64 flex justify-end items-center px-8">
          {hasUnsavedChanges && <span className="text-sm text-gray-400 mr-6">You have unsaved changes</span>}
          <button 
            type="submit" 
            disabled={loading || !hasUnsavedChanges}
            className={`px-8 py-4 rounded-xl uppercase tracking-widest font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${hasUnsavedChanges ? 'bg-[#ceab7a] text-black hover:bg-white shadow-[0_0_20px_rgba(206,171,122,0.3)]' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><Save size={16} /> Save Project</>}
          </button>
        </div>
      </form>
      <ImageCropEditor session={cropSession} />
    </motion.div>
  );
}
