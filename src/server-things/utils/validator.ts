export const validateServerKey = (key: string | null): boolean => {
  return `Bearer ${process.env.ADMIN_TOKEN}` === key;
};
