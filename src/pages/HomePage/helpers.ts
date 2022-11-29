export const createStatData = ({
  TVL = null,
  volume = null,
  volume24 = null,
}: {
  TVL: number;
  volume: number;
  volume24: number;
}): {
  '24h volume': number;
  'all time volume': number;
  'total value locked': number;
} => {
  return {
    '24h volume': volume24,
    'all time volume': volume,
    'total value locked': TVL,
  };
};
