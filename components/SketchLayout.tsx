import React from "react";

type Props = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
};

export default function SketchLayout({ children, sidebar }: Props) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <main className="md:col-span-2 space-y-6">{children}</main>
        <aside className="hidden md:block md:col-span-1">
          <div style={{ backgroundColor: 'var(--secondary)', padding: '1rem', borderRadius: '0.5rem' }}>
            {sidebar ?? <div className="text-sm text-muted-foreground">사이드바 공간</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
