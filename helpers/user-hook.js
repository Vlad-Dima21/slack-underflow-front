import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser, saveCurrentUser } from "@helpers/user-details";

const useCurrentUser = () => {
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState(null);

    const setUser = (user) => {
        setCurrentUser(user);
        saveCurrentUser(user || {});
    }

    useEffect(() => {
        setCurrentUser(getCurrentUser());
    }, [pathname]);

    return [currentUser, setUser];
}

export { useCurrentUser };