export const STATUS_METADATA = {
  DISPONIVEL: { color: '#4CAF50', setor: 'A', corSetor: 'Verde', labelKey: 'available' },
  RESERVADA: { color: '#005CA7', setor: 'B', corSetor: 'Azul', labelKey: 'reserved' },
  MANUTENCAO: { color: '#FFEB3B', setor: 'C', corSetor: 'Amarelo', labelKey: 'maintenance' },
  FALTA_PECA: { color: '#A91AFC', setor: 'D', corSetor: 'Laranja', labelKey: 'missingPart' },
  INDISPONIVEL: { color: '#9E9E9E', setor: 'E', corSetor: 'Cinza', labelKey: 'unavailable' },
  DANOS_ESTRUTURAIS: { color: '#F44336', setor: 'F', corSetor: 'Vermelho', labelKey: 'structuralDamage' },
  SINISTRO: { color: '#000000', setor: 'G', corSetor: 'Preto', labelKey: 'accident' },
};

export const STATUS_ORDER = [
  'DISPONIVEL',
  'RESERVADA',
  'MANUTENCAO',
  'FALTA_PECA',
  'INDISPONIVEL',
  'DANOS_ESTRUTURAIS',
  'SINISTRO',
];

export const buildStatusOptions = (translator) =>
  STATUS_ORDER.map((status) => ({
    value: status,
    color: STATUS_METADATA[status].color,
    label: translator(`form.statusOptions.${STATUS_METADATA[status].labelKey}`),
  }));

export const getStatusLabel = (status, translator) => {
  const meta = STATUS_METADATA[status];
  if (!meta) return status;
  return translator(`patio.status.${meta.labelKey}`);
};

export const getSetorPreview = (status) => {
  const meta = STATUS_METADATA[status];
  if (!meta) return null;
  return {
    setor: meta.setor,
    corSetor: meta.corSetor,
    color: meta.color,
  };
};

