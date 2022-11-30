export const fetchAllStats = async (): Promise<{
  TVL: string;
  volume: string;
}> =>
  await (
    await fetch(
      `https://${process.env.BACKEND_DOMAIN}/stats/all?$volumePeriod=all`,
    )
  ).json();

export const fetchVolume24 = async (): Promise<string> => {
  const data: { volume: string } = await (
    await fetch(
      `https://${process.env.BACKEND_DOMAIN}/stats/volume?volumePeriod=daily`,
    )
  ).json();

  return data.volume;
};
