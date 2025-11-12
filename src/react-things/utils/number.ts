const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ID').format(num);
};

export { formatNumber };
