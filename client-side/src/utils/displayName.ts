export type AnyUser = {
  firstName?: string | null;
  lastName?: string | null;
  first_name?: string | null; 
  last_name?: string | null; 
  fullName?: string | null;
  name?: string | null;
  username?: string | null;
};

export const displayName = (u?: AnyUser) => {
  if (!u) return "User";

  const first = (u.firstName ?? u.first_name ?? "").toString().trim();
  const last = (u.lastName ?? u.last_name ?? "").toString().trim();

  const fromPair = `${first} ${last}`.trim();
  if (fromPair) return fromPair;

  const single = (u.fullName ??     u.name ?? "").toString().trim();
  if (single) return single;

  return (u.username ?? "User").toString().trim();
};


