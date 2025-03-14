import { useAuthExpiration } from "@/hooks/useAuthExpiration";

export default function Profile() {
    useAuthExpiration();

    return <div>Welcome to Profile</div>;
}
