export function daysDifference(firstDate: Date, secondDate: Date): number {
  const diff = Math.abs(secondDate.getTime() - firstDate.getTime());
  return Math.ceil(diff / (1000 * 3600 * 24));
}
