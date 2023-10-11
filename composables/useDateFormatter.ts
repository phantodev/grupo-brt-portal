export function useDateFormatter() {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const reverseDate = (dateStr: string) => {
    if (!dateStr) return '';

    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const removeHour = (dateStr: string) => {
    return dateStr.split(' ')[0];
  };

  return {
    formatDate,
    reverseDate,
    removeHour,
  };
}
