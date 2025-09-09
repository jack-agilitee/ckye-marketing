import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Component Showcase | CKYE Marketing',
  description: 'Interactive component library showcasing all design system components organized by Atomic Design principles',
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}