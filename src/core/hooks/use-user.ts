import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getProfile } from "../../data/repositories/user-repository";

export const userQueryKey = ["user"];

export function useUser() {
  const { data: user, ...rest } = useQuery({
    queryKey: userQueryKey,
    queryFn: getProfile,
    retry: false,
  });

  return { user, ...rest };
}

export function useRequireUser() {
  const { data: user } = useSuspenseQuery({
    queryKey: userQueryKey,
    queryFn: getProfile,
    retry: false,
  });

  return user;
}
