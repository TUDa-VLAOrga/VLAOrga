import {useEffect, useState} from "react";
import {Logger} from "@/components/logger/Logger.ts";
import {fetchBackend} from "@/lib/utils.ts";
import type {User} from "@/lib/databaseTypes.ts";

export const useUsers = () => {
  const [currentUserId, setCurrentUserId] = useState<number|undefined>();
  useEffect(() => {
    fetchBackend<User>("/api/users/sessionUser" , "GET")
      .then((user) => setCurrentUserId(user.id))
      .catch((error) => {
        Logger.error("Error fetching current user: ", error);
      });
  }, []);
  return {
    currentUserId,
  };
};
