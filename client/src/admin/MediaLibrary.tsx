import { useRef, useState } from 'react';
import { Copy, Images, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { uploadImage } from './uploadImage';
import { Confirm, Empty } from './ui';

type MediaRow = { id: string; name: string; url: string; sizeBytes: number; createdAt: string | Date };

const kb = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

/** Every image uploaded through the admin: upload new ones, copy a link, or delete unused ones. */
export default function MediaLibrary() {
  const list = trpc.admin.mediaList.useQuery(undefined, { refetchOnWindowFocus: false });
  const remove = trpc.admin.mediaDelete.useMutation();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<MediaRow | null>(null);
  const media = (list.data ?? []) as MediaRow[];

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) await uploadImage(file);
      toast.success(files.length === 1 ? 'Image uploaded' : `${files.length} images uploaded`);
      await list.refetch();
    } catch (err) {
      toast.error(`Upload failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    } finally {
      setUploading(false);
      if (input.current) input.current.value = '';
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Image link copied');
    } catch {
      toast.error('Could not copy — select the link manually.');
    }
  };

  return (
    <div className="adm-page">
      <header className="adm-hero">
        <div className="adm-hero-glow" aria-hidden="true" />
        <div className="adm-hero-main">
          <span className="adm-hero-icon">
            <Images size={22} />
          </span>
          <div>
            <p className="adm-eyebrow">Library</p>
            <h1>Media</h1>
            <p className="adm-hero-text">All images uploaded from the admin panel. Copy a link to reuse an image anywhere on the site.</p>
          </div>
        </div>
        <div className="adm-hero-side">
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={(e) => upload(e.target.files)} />
          <button type="button" className="adm-btn is-light" onClick={() => input.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 size={15} className="adm-spin" /> : <UploadCloud size={15} />}
            {uploading ? 'Uploading…' : 'Upload images'}
          </button>
        </div>
      </header>

      {list.isLoading ? (
        <div className="adm-media-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="adm-media is-skeleton" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <Empty icon={<Images size={22} />} title="No uploads yet" text="Images you upload in any editor will show up here." />
      ) : (
        <div className="adm-media-grid">
          {media.map((m) => (
            <figure key={m.id} className="adm-media">
              <img src={m.url} alt={m.name} loading="lazy" />
              <figcaption>
                <span title={m.name}>{m.name}</span>
                <small>{kb(m.sizeBytes)}</small>
              </figcaption>
              <div className="adm-media-actions">
                <button type="button" className="adm-icon-btn is-glass" title="Copy link" onClick={() => copy(m.url)}>
                  <Copy size={14} />
                </button>
                <button type="button" className="adm-icon-btn is-glass is-danger" title="Delete" onClick={() => setDeleting(m)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}

      <Confirm
        open={!!deleting}
        title="Delete this image?"
        message="If a page or card still uses it, that spot will show a broken image. This cannot be undone."
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          const target = deleting;
          setDeleting(null);
          if (!target) return;
          try {
            await remove.mutateAsync({ id: target.id });
            toast.success('Image deleted');
            await list.refetch();
          } catch (err) {
            toast.error(`Could not delete: ${err instanceof Error ? err.message : 'unknown error'}`);
          }
        }}
      />
    </div>
  );
}
