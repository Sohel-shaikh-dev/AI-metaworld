import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, AlertTriangle, X, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSettings } from '../../contexts/SettingsContext';
import ImageCropEditor, { type CropSession } from '../../components/admin/ImageCropEditor';
import MediaUploadCard from '../../components/admin/MediaUploadCard';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';

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
  const { markDirty, markClean, requestNavigation } = useSettings();

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

  // Local text state for smooth comma-separated tag typing without losing focus/commas
  const [deliverablesText, setDeliverablesText] = useState('');
  const [technologiesText, setTechnologiesText] = useState('');

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploadingStates, setIsUploadingStates] = useState<Record<string, boolean>>({});

  // Custom Branded Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const requestConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmLabel = 'Confirm',
    variant: 'danger' | 'warning' | 'primary' = 'warning'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmLabel,
      cancelLabel: 'Cancel',
      variant,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Reset dirty state on unmount
  useEffect(() => {
    return () => {
      markClean();
    };
  }, [markClean]);

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
  const handleChange = useCallback(() => {
    if (!hasUnsavedChanges) {
      setHasUnsavedChanges(true);
      markDirty();
    }
  }, [hasUnsavedChanges, markDirty]);

  const loadProject = async () => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) {
      toast.error('Failed to load project');
      navigate('/admin/projects');
    } else if (data) {
      setType(data.type);
      setCategory(data.category || '');
      setTitle(data.title || '');
      setDesc(data.desc || '');
      setImage(data.image || '');

      const content = data.content || {};

      // Backward-compatible screen resolution:
      // If content.desktopScreens has items, use it.
      // If content.supportingImages has items, hydrate desktopScreens with it.
      const rawDS = Array.isArray(content.desktopScreens)
        ? content.desktopScreens.filter((s: any) => typeof s === 'string' && s.trim() !== '')
        : [];
      const rawSI = Array.isArray(content.supportingImages)
        ? content.supportingImages.filter((s: any) => typeof s === 'string' && s.trim() !== '')
        : [];
      const rawScreens = rawDS.length > 0 ? rawDS : rawSI;

      content.desktopScreens = [...rawScreens];
      content.supportingImages = [...rawScreens];

      // Initialize comma-separated text helpers
      setDeliverablesText((content.deliverables || []).join(', '));
      setTechnologiesText((content.technologies || []).join(', '));

      setModalContent(content);

      // Reset unsaved state after initial hydration
      setTimeout(() => {
        setHasUnsavedChanges(false);
        markClean();
      }, 100);
    }
    setFetching(false);
  };

  const handleTypeChange = (newType: string) => {
    if (type !== newType && Object.keys(modalContent).length > 0) {
      requestConfirm(
        'Change Project Type',
        `Are you sure you want to change the project type to "${PROJECT_TYPES.find(t => t.id === newType)?.label || newType}"? Existing shared fields (Client, Live URL, Deliverables, Technologies) will be preserved.`,
        () => {
          setType(newType);
          handleChange();
        },
        'Change Type',
        'warning'
      );
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

  // Array mutation helpers
  const updateArrayItem = (field: string, index: number, newValue: any) => {
    setModalContent((prev: any) => {
      const arr = [...(prev[field] || [])];
      arr[index] = newValue;
      const updated = { ...prev, [field]: arr };
      // Keep desktopScreens and supportingImages mirrored
      if (field === 'desktopScreens') {
        updated.supportingImages = arr;
      }
      return updated;
    });
    handleChange();
  };

  const removeArrayItem = (field: string, index: number) => {
    setModalContent((prev: any) => {
      const filtered = (prev[field] || []).filter((_: any, i: number) => i !== index);
      const updated = { ...prev, [field]: filtered };
      if (field === 'desktopScreens') {
        updated.supportingImages = filtered;
      }
      return updated;
    });
    handleChange();
  };

  const addArrayItem = (field: string, defaultValue: any) => {
    setModalContent((prev: any) => {
      const arr = [...(prev[field] || []), defaultValue];
      const updated = { ...prev, [field]: arr };
      if (field === 'desktopScreens') {
        updated.supportingImages = arr;
      }
      return updated;
    });
    handleChange();
  };

  const moveArrayItem = (field: string, fromIndex: number, toIndex: number) => {
    setModalContent((prev: any) => {
      const arr = [...(prev[field] || [])];
      if (toIndex < 0 || toIndex >= arr.length) return prev;
      const item = arr.splice(fromIndex, 1)[0];
      arr.splice(toIndex, 0, item);
      const updated = { ...prev, [field]: arr };
      if (field === 'desktopScreens') {
        updated.supportingImages = arr;
      }
      return updated;
    });
    handleChange();
    toast.success('Gallery order updated');
  };

  const handleGenericImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    onUrl: (url: string) => void,
    successMessage = 'Image uploaded successfully'
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    triggerCrop(file, async (croppedFile) => {
      setUploading(fieldKey, true);
      const url = await uploadFile(croppedFile);
      if (url) {
        onUrl(url);
        handleChange();
        toast.success(successMessage);
      }
      setUploading(fieldKey, false);
    });
    e.target.value = '';
  };

  const handleDeliverablesChange = (val: string) => {
    setDeliverablesText(val);
    const parsed = val.split(',').map((s: string) => s.trim()).filter(Boolean);
    setModalContent((prev: any) => ({ ...prev, deliverables: parsed }));
    handleChange();
  };

  const handleTechnologiesChange = (val: string) => {
    setTechnologiesText(val);
    const parsed = val.split(',').map((s: string) => s.trim()).filter(Boolean);
    setModalContent((prev: any) => ({ ...prev, technologies: parsed }));
    handleChange();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedContent = {
      ...modalContent,
      deliverables: deliverablesText.split(',').map((s: string) => s.trim()).filter(Boolean),
      technologies: technologiesText.split(',').map((s: string) => s.trim()).filter(Boolean),
    };

    // Mirror desktopScreens and supportingImages cleanly for website projects without duplicates
    if (type === 'website') {
      const currentScreens = (modalContent.desktopScreens || []).filter(
        (s: any) => typeof s === 'string' && s.trim() !== ''
      );
      updatedContent.desktopScreens = currentScreens;
      updatedContent.supportingImages = currentScreens;
    }

    const projectData = {
      type,
      category,
      title,
      desc,
      image,
      content: updatedContent
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
      markClean();
      setHasUnsavedChanges(false);
      toast.success(isEditing ? 'Project updated successfully' : 'Project created successfully');
      navigate('/admin/projects');
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-24 min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#ceab7a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const websiteScreens = (modalContent.desktopScreens || modalContent.supportingImages || []).filter((s: any) => typeof s === 'string');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8 pb-36 sm:pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => requestNavigation('/admin/projects')}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Back to projects list"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">{isEditing ? 'Edit Project' : 'New Project'}</h1>
            {hasUnsavedChanges && (
              <p className="text-xs text-[#ceab7a] flex items-center gap-1.5 mt-1 font-medium">
                <AlertTriangle size={12}/> Unsaved changes
              </p>
            )}
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
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50 cursor-pointer"
              >
                {PROJECT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Category Label</label>
              <input
                type="text" value={category} onChange={(e) => { setCategory(e.target.value); handleChange(); }} required
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
                placeholder="e.g. Website Design, AI Fashion, etc."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Title</label>
              <input
                type="text" value={title} onChange={(e) => { setTitle(e.target.value); handleChange(); }} required
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
                placeholder="e.g. AJS Cleaning – Professional Cleaning Services Website"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Description</label>
              <textarea
                value={desc} onChange={(e) => { setDesc(e.target.value); handleChange(); }} required rows={3}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50"
                placeholder="Provide a concise summary of the project..."
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-white/5">
              <MediaUploadCard
                label="Main Thumbnail"
                description="This image appears on the portfolio grid."
                image={image}
                isLoading={isUploadingStates['mainImage']}
                onFileSelect={(e) => handleGenericImageUpload(e, 'mainImage', setImage, 'Thumbnail updated successfully')}
                onRemove={() => {
                  requestConfirm(
                    'Remove Thumbnail',
                    'Are you sure you want to remove the main project thumbnail?',
                    () => {
                      setImage('');
                      handleChange();
                      toast.success('Thumbnail removed');
                    },
                    'Remove',
                    'danger'
                  );
                }}
                aspectClass="aspect-video sm:w-1/2"
                objectFit="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Modal Content Fields based on Type */}
        <div className="bg-[#101010] border border-white/5 p-6 sm:p-8 rounded-2xl space-y-8">
          <h2 className="text-lg font-serif text-white border-b border-white/5 pb-4">2. Case Study Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Client Name</label>
               <input
                 type="text"
                 value={modalContent.clientName || ''}
                 onChange={(e) => { setModalContent({...modalContent, clientName: e.target.value}); handleChange(); }}
                 className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ceab7a]/50 outline-none"
                 placeholder="e.g. AJS Cleaning"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Live URL (Optional)</label>
               <input
                 type="text"
                 value={modalContent.liveUrl || ''}
                 onChange={(e) => { setModalContent({...modalContent, liveUrl: e.target.value}); handleChange(); }}
                 className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ceab7a]/50 outline-none"
                 placeholder="https://..."
               />
            </div>

            {/* WHAT WE BUILT / DELIVERABLES */}
            <div className="space-y-2 md:col-span-2">
               <div className="flex justify-between items-center">
                 <label className="text-xs uppercase tracking-widest text-gray-300 font-medium">
                   What We Built / Deliverables (Comma separated)
                 </label>
                 <span className="text-[10px] text-gray-500 font-normal">Services & deliverables provided</span>
               </div>
               <input
                 type="text"
                 value={deliverablesText}
                 onChange={(e) => handleDeliverablesChange(e.target.value)}
                 placeholder="e.g. Website Design & Development, Responsive UI/UX, Custom Admin Panel, Content Management"
                 className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ceab7a]/50 outline-none"
               />
            </div>

            {/* BUILD WITH / TECHNOLOGY STACK */}
            <div className="space-y-2 md:col-span-2">
               <div className="flex justify-between items-center">
                 <label className="text-xs uppercase tracking-widest text-[#ceab7a] font-medium flex items-center gap-2">
                   <span>Build With / Technology Stack (Comma separated)</span>
                 </label>
                 <span className="text-[10px] text-gray-500 font-normal">Technologies, tools & platforms used</span>
               </div>
               <input
                 type="text"
                 value={technologiesText}
                 onChange={(e) => handleTechnologiesChange(e.target.value)}
                 placeholder="e.g. React, TypeScript, Tailwind CSS, Supabase, Vercel"
                 className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ceab7a]/50 outline-none"
               />
            </div>

            {type !== 'pod' && (
              <div className="space-y-2 md:col-span-2">
                 <MediaUploadCard
                   label="Project Video (Optional)"
                   description="Promotional or walkthrough video of the project."
                   image={modalContent.videoUrl}
                   isLoading={isUploadingStates['videoUrl']}
                   onFileSelect={(e) => handleGenericImageUpload(e, 'videoUrl', (url) => setModalContent({...modalContent, videoUrl: url}), 'Video uploaded successfully')}
                   onRemove={() => {
                     requestConfirm(
                       'Remove Project Video',
                       'Are you sure you want to remove the project video?',
                       () => {
                         setModalContent({...modalContent, videoUrl: null});
                         handleChange();
                         toast.success('Video removed');
                       },
                       'Remove',
                       'danger'
                     );
                   }}
                   aspectClass="aspect-video sm:w-1/2"
                 />
              </div>
            )}
          </div>

          {/* Type-Specific Content */}
          <div className="pt-4 border-t border-white/5">

            {/* 1. WEBSITE DESIGN */}
            {type === 'website' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a]">Project Screens & Screenshots</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Showcase screenshots (desktop, mobile, tablet & mixed orientations supported without cropping).</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#ceab7a]/10 text-[#ceab7a] border border-[#ceab7a]/20 font-medium self-start sm:self-auto">
                    {websiteScreens.length} {websiteScreens.length === 1 ? 'Screenshot' : 'Screenshots'} Saved
                  </span>
                </div>

                {websiteScreens.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {websiteScreens.map((img: string, i: number) => (
                      <MediaUploadCard
                        key={i}
                        label={`Screen ${i + 1}`}
                        image={img}
                        isLoading={isUploadingStates[`screen_${i}`]}
                        onFileSelect={(e) => handleGenericImageUpload(e, `screen_${i}`, (url) => updateArrayItem('desktopScreens', i, url), `Screen ${i + 1} updated`)}
                        onRemove={() => {
                          requestConfirm(
                            'Remove Screenshot',
                            `Are you sure you want to remove Screen ${i + 1} from this project's gallery?`,
                            () => {
                              removeArrayItem('desktopScreens', i);
                              toast.success('Screenshot removed from gallery');
                            },
                            'Remove Screen',
                            'danger'
                          );
                        }}
                        onMoveLeft={() => moveArrayItem('desktopScreens', i, i - 1)}
                        onMoveRight={() => moveArrayItem('desktopScreens', i, i + 1)}
                        canMoveLeft={i > 0}
                        canMoveRight={i < websiteScreens.length - 1}
                        aspectClass="auto"
                        objectFit="object-contain"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-[#151515]/50">
                    <p className="text-sm text-gray-400 mb-1">No screenshots added yet.</p>
                    <p className="text-xs text-gray-600">Click below to upload showcase screenshots (desktop, mobile, or mixed).</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => addArrayItem('desktopScreens', '')}
                  className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} /> ADD ANOTHER SCREENSHOT
                </button>
              </div>
            )}

            {/* 2. BRANDING & IDENTITY */}
            {type === 'branding' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a]">Logos & Mockups</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Brand collateral, packaging mockups and logo presentations.</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#ceab7a]/10 text-[#ceab7a] border border-[#ceab7a]/20 font-medium self-start sm:self-auto">
                    {(modalContent.mockups || []).filter(Boolean).length} Mockups Saved
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
                  {(modalContent.mockups || []).map((img: string, i: number) => (
                    <MediaUploadCard
                      key={i}
                      label={`Mockup ${i + 1}`}
                      image={img}
                      isLoading={isUploadingStates[`mockup_${i}`]}
                      onFileSelect={(e) => handleGenericImageUpload(e, `mockup_${i}`, (url) => updateArrayItem('mockups', i, url), `Mockup ${i + 1} updated`)}
                      onRemove={() => {
                        requestConfirm(
                          'Remove Mockup',
                          `Are you sure you want to remove Mockup ${i + 1}?`,
                          () => {
                            removeArrayItem('mockups', i);
                            toast.success('Mockup removed');
                          },
                          'Remove',
                          'danger'
                        );
                      }}
                      onMoveLeft={() => moveArrayItem('mockups', i, i - 1)}
                      onMoveRight={() => moveArrayItem('mockups', i, i + 1)}
                      canMoveLeft={i > 0}
                      canMoveRight={i < (modalContent.mockups || []).length - 1}
                      aspectClass="auto"
                      objectFit="object-contain"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem('mockups', '')}
                  className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} /> ADD MOCKUP
                </button>
              </div>
            )}

            {/* 3. PRINT-ON-DEMAND */}
            {type === 'pod' && (
              <div className="space-y-12">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Design Concept (Optional)</label>
                  <textarea
                    value={modalContent.designConcept || ''}
                    onChange={(e) => { setModalContent({...modalContent, designConcept: e.target.value}); handleChange(); }}
                    placeholder="Explain the design idea, theme or merchandise vision..."
                    className="w-full bg-[#151515] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#ceab7a]/50 transition-colors h-24"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a]">Product Previews</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Showcase products (T-Shirts, Mugs, Covers, etc.).</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#ceab7a]/10 text-[#ceab7a] border border-[#ceab7a]/20 font-medium self-start sm:self-auto">
                      {(modalContent.products || []).filter(Boolean).length} Products Saved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
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
                              className="bg-[#101010] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50 cursor-pointer"
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
                            onFileSelect={(e) => handleGenericImageUpload(e, `pod_${i}`, (url) => updateArrayItem('products', i, { type: prodType, image: url }), 'Product image updated')}
                            onRemove={() => {
                              requestConfirm(
                                'Remove Product Preview',
                                `Are you sure you want to remove this ${prodType} preview?`,
                                () => {
                                  removeArrayItem('products', i);
                                  toast.success('Product preview removed');
                                },
                                'Remove',
                                'danger'
                              );
                            }}
                            aspectClass="auto"
                            objectFit="object-contain"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('products', { type: 'T-Shirt', image: '' })}
                    className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} /> ADD PRODUCT
                  </button>
                </div>
              </div>
            )}

            {/* 4. AI FASHION TRY-ON */}
            {type === 'fashion' && (
              <div className="space-y-12">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">Project Brief</label>
                  <textarea
                    value={modalContent.projectBrief || ''}
                    onChange={(e) => { setModalContent({...modalContent, projectBrief: e.target.value}); handleChange(); }}
                    className="w-full bg-[#151515] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#ceab7a]/50 transition-colors h-24"
                    placeholder="Describe the fashion campaign, collection, or styling brief..."
                  />
                </div>

                {/* Product Inputs */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a]">Product Inputs</h3>
                    <span className="text-xs text-gray-500">{(modalContent.productInputs || []).filter(Boolean).length} Inputs</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-start">
                    {(modalContent.productInputs || []).map((img: string, i: number) => (
                      <MediaUploadCard
                        key={i}
                        label={`Input ${i + 1}`}
                        image={img}
                        isLoading={isUploadingStates[`input_${i}`]}
                        onFileSelect={(e) => handleGenericImageUpload(e, `input_${i}`, (url) => updateArrayItem('productInputs', i, url), `Input ${i + 1} updated`)}
                        onRemove={() => {
                          requestConfirm(
                            'Remove Product Input',
                            `Are you sure you want to remove Input ${i + 1}?`,
                            () => {
                              removeArrayItem('productInputs', i);
                              toast.success('Input removed');
                            },
                            'Remove',
                            'danger'
                          );
                        }}
                        aspectClass="auto"
                        objectFit="object-contain"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('productInputs', '')}
                    className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} /> ADD INPUT
                  </button>
                </div>

                {/* Try-On Transformations */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a]">Try-On Transformations (Before & After)</h3>
                    <span className="text-xs text-gray-500">{(modalContent.transformations || []).length} Pairs</span>
                  </div>
                  <div className="space-y-6">
                    {(modalContent.transformations || []).map((pair: any, i: number) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 bg-[#151515] rounded-xl border border-white/5 relative">
                        <button
                          type="button"
                          onClick={() => {
                            requestConfirm(
                              'Remove Transformation Pair',
                              `Are you sure you want to remove Pair ${i + 1}?`,
                              () => {
                                removeArrayItem('transformations', i);
                                toast.success('Pair removed');
                              },
                              'Remove Pair',
                              'danger'
                            );
                          }}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                           <span className="text-xs uppercase tracking-widest font-bold">Remove Pair</span>
                        </button>
                        <div className="flex-1 mt-4 sm:mt-0">
                          <MediaUploadCard
                            label="Before Image (Garment / Flat-lay)"
                            image={pair.before}
                            isLoading={isUploadingStates[`before_${i}`]}
                            onFileSelect={(e) => handleGenericImageUpload(e, `before_${i}`, (url) => updateArrayItem('transformations', i, { ...pair, before: url }), 'Before image updated')}
                            onRemove={() => updateArrayItem('transformations', i, { ...pair, before: null })}
                            aspectClass="auto"
                            objectFit="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <MediaUploadCard
                            label="After Image (Model Visual)"
                            image={pair.after}
                            isLoading={isUploadingStates[`after_${i}`]}
                            onFileSelect={(e) => handleGenericImageUpload(e, `after_${i}`, (url) => updateArrayItem('transformations', i, { ...pair, after: url }), 'After image updated')}
                            onRemove={() => updateArrayItem('transformations', i, { ...pair, after: null })}
                            aspectClass="auto"
                            objectFit="object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('transformations', { before: null, after: null })}
                    className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} /> ADD PAIR
                  </button>
                </div>

                {/* Campaign Visuals */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a]">Campaign Visuals</h3>
                    <span className="text-xs text-gray-500">{(modalContent.campaignVisuals || []).filter(Boolean).length} Visuals</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-start">
                    {(modalContent.campaignVisuals || []).map((img: string, i: number) => (
                      <MediaUploadCard
                        key={i}
                        label={`Visual ${i + 1}`}
                        image={img}
                        isLoading={isUploadingStates[`camp_${i}`]}
                        onFileSelect={(e) => handleGenericImageUpload(e, `camp_${i}`, (url) => updateArrayItem('campaignVisuals', i, url), `Visual ${i + 1} updated`)}
                        onRemove={() => {
                          requestConfirm(
                            'Remove Campaign Visual',
                            `Are you sure you want to remove Visual ${i + 1}?`,
                            () => {
                              removeArrayItem('campaignVisuals', i);
                              toast.success('Visual removed');
                            },
                            'Remove',
                            'danger'
                          );
                        }}
                        aspectClass="auto"
                        objectFit="object-contain"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('campaignVisuals', '')}
                    className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} /> ADD VISUAL
                  </button>
                </div>
              </div>
            )}

            {/* 5. POWER BI DATA ANALYSIS (GROWTH) */}
            {type === 'growth' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium">Business Problem</label>
                    <textarea
                      value={modalContent.businessProblem || ''}
                      onChange={(e) => { setModalContent({...modalContent, businessProblem: e.target.value}); handleChange(); }}
                      className="w-full bg-[#151515] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#ceab7a]/50 h-24"
                      placeholder="What business challenge or question did the client face?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-400 font-medium">Solution / Approach</label>
                    <textarea
                      value={modalContent.solution || ''}
                      onChange={(e) => { setModalContent({...modalContent, solution: e.target.value}); handleChange(); }}
                      className="w-full bg-[#151515] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#ceab7a]/50 h-24"
                      placeholder="How did you clean data, model relationships and visualize insights?"
                    />
                  </div>
                </div>

                {/* Key Insights */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Key Insights</h3>
                  <div className="flex flex-col gap-3">
                    {(modalContent.keyInsights || []).map((insight: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <textarea
                          value={insight}
                          onChange={(e) => updateArrayItem('keyInsights', i, e.target.value)}
                          className="flex-1 bg-[#151515] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-[#ceab7a]/50 outline-none h-16"
                          placeholder="e.g. Discovered 18% churn concentrated in the 1-year contract segment..."
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('keyInsights', i)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors flex items-center cursor-pointer"
                          title="Remove Insight"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('keyInsights', '')}
                      className="self-start px-6 py-2 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> ADD INSIGHT
                    </button>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a] border-b border-white/5 pb-2">Key Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(modalContent.metrics || []).map((metric: any, i: number) => (
                      <div key={i} className="bg-[#151515] p-5 rounded-xl border border-white/5 relative">
                        <button
                          type="button"
                          onClick={() => removeArrayItem('metrics', i)}
                          className="absolute top-2 right-2 p-1 text-red-400 hover:bg-red-400/10 rounded-full transition-colors cursor-pointer"
                          title="Remove Metric"
                        >
                          <X size={14} />
                        </button>
                        <div className="grid grid-cols-2 gap-4 mb-3 mt-2">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Label</label>
                            <input
                              type="text"
                              value={metric.label || ''}
                              onChange={(e) => updateArrayItem('metrics', i, {...metric, label: e.target.value})}
                              className="w-full bg-[#101010] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ceab7a]/50 outline-none"
                              placeholder="e.g. Churn Rate"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Value</label>
                            <input
                              type="text"
                              value={metric.value || ''}
                              onChange={(e) => updateArrayItem('metrics', i, {...metric, value: e.target.value})}
                              className="w-full bg-[#101010] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ceab7a]/50 outline-none"
                              placeholder="e.g. -24.5%"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Description</label>
                          <input
                            type="text"
                            value={metric.description || ''}
                            onChange={(e) => updateArrayItem('metrics', i, {...metric, description: e.target.value})}
                            className="w-full bg-[#101010] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#ceab7a]/50 outline-none"
                            placeholder="e.g. Total customer reduction in Q3"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addArrayItem('metrics', { label: '', value: '', description: '' })}
                    className="self-start px-6 py-2 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> ADD METRIC
                  </button>
                </div>

                {/* Dashboard Screenshots */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#ceab7a]">Dashboard Screenshots</h3>
                    <span className="text-xs text-gray-500">{(modalContent.dashboards || []).filter(Boolean).length} Dashboards</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                     {(modalContent.dashboards || []).map((img: string, i: number) => (
                       <MediaUploadCard
                         key={i}
                         label={`Dashboard ${i + 1}`}
                         image={img}
                         isLoading={isUploadingStates[`dash_${i}`]}
                         onFileSelect={(e) => handleGenericImageUpload(e, `dash_${i}`, (url) => updateArrayItem('dashboards', i, url), `Dashboard ${i + 1} updated`)}
                         onRemove={() => {
                           requestConfirm(
                             'Remove Dashboard Screenshot',
                             `Are you sure you want to remove Dashboard ${i + 1}?`,
                             () => {
                               removeArrayItem('dashboards', i);
                               toast.success('Dashboard screenshot removed');
                             },
                             'Remove',
                             'danger'
                           );
                         }}
                         onMoveLeft={() => moveArrayItem('dashboards', i, i - 1)}
                         onMoveRight={() => moveArrayItem('dashboards', i, i + 1)}
                         canMoveLeft={i > 0}
                         canMoveRight={i < (modalContent.dashboards || []).length - 1}
                         aspectClass="auto"
                         objectFit="object-contain"
                       />
                     ))}
                   </div>
                   <button
                     type="button"
                     onClick={() => addArrayItem('dashboards', '')}
                     className="px-6 py-3 bg-[#ceab7a]/10 hover:bg-[#ceab7a]/20 border border-[#ceab7a]/20 rounded-xl text-xs font-bold tracking-widest text-[#ceab7a] transition-colors flex items-center gap-2 cursor-pointer"
                   >
                     <Plus size={16} /> ADD DASHBOARD SCREENSHOT
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/10 z-30 lg:left-64 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-2.5 sm:gap-4 px-4 sm:px-8 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {hasUnsavedChanges && (
            <span className="text-xs sm:text-sm text-[#ceab7a] flex items-center gap-1.5 font-medium">
              <AlertTriangle size={14} /> Unsaved changes
            </span>
          )}
          <button
            type="submit"
            disabled={loading || !hasUnsavedChanges}
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl uppercase tracking-widest font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 min-h-[46px] cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-[#ceab7a] text-black hover:bg-white shadow-[0_0_20px_rgba(206,171,122,0.3)]'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Save size={16} /> {isEditing ? 'Update Project' : 'Save Project'}</>
            )}
          </button>
        </div>
      </form>

      {/* Image Crop Modal */}
      <ImageCropEditor session={cropSession} />

      {/* Custom Confirmation Modal */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel={confirmModal.cancelLabel}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </motion.div>
  );
}
