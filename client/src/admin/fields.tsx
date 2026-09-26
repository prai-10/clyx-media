import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ImagePlus, Link2, Loader2, RotateCcw, Trash2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from './uploadImage';

export type ControlType = 'text' | 'textarea' | 'image' | 'url' | 'select' | 'color';

/** Label row + control + hint, shared by every form in the admin. */
export function Field({
  label,
  hint,
  required,
  wide,
  onReset,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  wide?: boolean;
  onReset?: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`adm-field${wide ? ' is-wide' : ''}`}>
      <div className="adm-field-head">
        <label className="adm-label">
          {label}
          {required && <span className="adm-req">*</span>}
        </label>
        {onReset && (
          <button type="button" className="adm-reset" onClick={onReset} title="Restore the original text">
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>
      {children}
      {hint && <p className="adm-hint">{hint}</p>}
    </div>
  );
}

function AutoTextarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight + 2, 360)}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      className="adm-input adm-textarea"
      value={value}
      rows={3}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** Image picker: preview, drag & drop or click to upload, or paste a URL. */
export function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => setBroken(false), [value]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file (JPG, PNG, WebP or GIF).');
      return;
    }
    setBusy(true);
    try {
      onChange(await uploadImage(file));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(`Image upload failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div className="adm-image">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        className={`adm-image-drop${dragging ? ' is-drag' : ''}${value && !broken ? ' has-image' : ''}`}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        disabled={busy}
      >
        {value && !broken ? (
          <>
            <img src={value} alt="" onError={() => setBroken(true)} />
            <span className="adm-image-overlay">
              {busy ? <Loader2 size={18} className="adm-spin" /> : <ImagePlus size={18} />}
              {busy ? 'Uploading…' : 'Replace image'}
            </span>
          </>
        ) : (
          <span className="adm-image-empty">
            {busy ? <Loader2 size={22} className="adm-spin" /> : <UploadCloud size={22} />}
            <strong>{busy ? 'Uploading…' : 'Drop an image or click to upload'}</strong>
            <small>{broken ? 'The current link does not load — upload a new image' : 'JPG, PNG, WebP or GIF · up to 5 MB'}</small>
          </span>
        )}
      </button>
      <div className="adm-image-url">
        <Link2 size={14} />
        <input className="adm-input-bare" value={value} placeholder="…or paste an image URL" onChange={(e) => onChange(e.target.value)} />
        {value && (
          <button type="button" className="adm-icon-btn is-danger" title="Remove image" onClick={() => onChange('')}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export function Control({
  type = 'text',
  value,
  onChange,
  placeholder,
  options,
}: {
  type?: ControlType;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options?: string[];
}) {
  switch (type) {
    case 'textarea':
      return <AutoTextarea value={value} onChange={onChange} placeholder={placeholder} />;
    case 'image':
      return <ImageInput value={value} onChange={onChange} />;
    case 'select':
      return (
        <select className="adm-input" value={value} onChange={(e) => onChange(e.target.value)}>
          {(options ?? []).map((o) => (
            <option key={o} value={o}>
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </option>
          ))}
        </select>
      );
    case 'color':
      return (
        <div className="adm-color">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#FFDE59'} onChange={(e) => onChange(e.target.value.toUpperCase())} />
          <input className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="#FFDE59" />
          {['#FFDE59', '#003AA3', '#050814'].map((swatch) => (
            <button key={swatch} type="button" className="adm-swatch" style={{ background: swatch }} title={swatch} onClick={() => onChange(swatch)} />
          ))}
        </div>
      );
    case 'url':
      return (
        <div className="adm-input-icon">
          <Link2 size={14} />
          <input className="adm-input" value={value} placeholder={placeholder ?? 'https://… or /page'} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    default:
      return <input className="adm-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
  }
}
