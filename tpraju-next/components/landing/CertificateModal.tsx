"use client";

type Props = {
  src: string | null;
  onClose: () => void;
};

export function CertificateModal({ src, onClose }: Props) {
  return (
    <div
      id="certificateModal"
      className={`certificate-modal${src ? " active" : ""}`}
      onClick={onClose}
      role="presentation"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          id="certificateImg"
          src={src}
          alt="Certificate"
          onClick={(e) => e.stopPropagation()}
        />
      ) : null}
    </div>
  );
}
