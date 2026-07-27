export const isOverdue = (d: string): boolean => !!d && new Date(d) < new Date(new Date().toDateString());

export const formatDate = (iso: string): string =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : '—';
