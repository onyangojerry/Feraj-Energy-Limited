import * as React from 'react';
import { cn } from './utils';

function CinematicShell({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('cinematic-shell', className)} {...props} />;
}

function CinematicSection({
  className,
  ...props
}: React.ComponentProps<'section'>) {
  return <section className={cn('cinematic-section', className)} {...props} />;
}

function CinematicPanel({
  className,
  strong = false,
  ...props
}: React.ComponentProps<'div'> & { strong?: boolean }) {
  return (
    <div
      className={cn(
        strong ? 'cinematic-panel-strong' : 'cinematic-panel',
        className
      )}
      {...props}
    />
  );
}

function CinematicEyebrow({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('cinematic-eyebrow', className)} {...props} />;
}

export { CinematicShell, CinematicSection, CinematicPanel, CinematicEyebrow };
