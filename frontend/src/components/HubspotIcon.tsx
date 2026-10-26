import React from 'react';

interface HubspotIconProps {
  className?: string;
}

export const HubspotIcon: React.FC<HubspotIconProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.8 9.5a2.7 2.7 0 0 0-2.3-2.67V5.3a2.3 2.3 0 1 0-1.8 0v1.53a2.7 2.7 0 0 0-2.3 2.67c0 .24.03.48.1.7L9.8 12.3a2.6 2.6 0 0 0-.8-.13 2.7 2.7 0 1 0 2.7 2.7c0-.2-.03-.4-.08-.59l2.7-2.1c.3.14.64.22.98.22a2.7 2.7 0 0 0 2.7-2.7z" />
    </svg>
  );
};
