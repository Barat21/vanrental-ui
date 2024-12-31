import { SortConfig } from '../components/DataDisplay/types';

export const handleSort = <T extends Record<string, any>>(
  field: keyof T,
  currentConfig: SortConfig,
  setConfig: (config: SortConfig) => void
) => {
  setConfig({
    field,
    order:
      currentConfig.field === field && currentConfig.order === 'asc'
        ? 'desc'
        : 'asc',
  });
};