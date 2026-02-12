export interface Site {
  id: string;
  x: number;
  y: number;
  label: string;
  image: string;
  color: string;
}

export const sitesData: Site[] = [
  { id: 'cairo', x: 55, y: 25, label: 'Cairo', image: 'https://images.unsplash.com/photo-1572252009289-9d53c6d99a89?auto=format&fit=crop&w=800', color: '#FFD700' },
  { id: 'alex', x: 45, y: 15, label: 'Alexandria', image: 'https://images.unsplash.com/photo-1590240924765-4f400787e91d?auto=format&fit=crop&w=800', color: '#00A8E8' },
  { id: 'luxor', x: 60, y: 65, label: 'Luxor', image: 'https://images.unsplash.com/photo-1566192257211-13768be4d8C0?auto=format&fit=crop&w=800', color: '#FF6B6B' },
  { id: 'aswan', x: 62, y: 80, label: 'Aswan', image: 'https://images.unsplash.com/photo-1533513063857-798418a09f87?auto=format&fit=crop&w=800', color: '#E67E22' },
  { id: 'hurghada', x: 75, y: 45, label: 'Hurghada', image: 'https://images.unsplash.com/photo-1563212891-b0e78c859c25?auto=format&fit=crop&w=800', color: '#1ABC9C' },
];
