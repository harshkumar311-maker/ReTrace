import { fetchMatches } from "./matchService";
import { fetchMyLostItems } from "./itemService";
import { getMyClaims } from "./claimService";

export async function fetchNotifications() {
    const [matches, lostItems, claims] = await Promise.all([
        fetchMatches(),
        fetchMyLostItems(),
        getMyClaims(),
    ]);

    const notifications = [];

    // Possible matches
    matches.forEach((match) => {
        notifications.push({
            id: `match-${match.id}`,
            type: "match",
            title: "Possible match found",
            message: `A ${match.score}% match was found for one of your lost items.`,
            time: "Recently",
        });
    });

    // Claims
    claims.forEach((claim) => {
        const status = String(claim.status || "").toUpperCase();

        if (status === "PENDING") {
            notifications.push({
                id: `claim-${claim.id}`,
                type: "claim",
                title: "Claim submitted",
                message: "Your claim is waiting for admin review.",
                time: claim.createdAt || "Recently",
            });
        }

        if (status === "APPROVED") {
            notifications.push({
                id: `claim-approved-${claim.id}`,
                type: "success",
                title: "Claim approved",
                message: "Your claim has been approved. Your item has been marked as recovered.",
                time: claim.createdAt || "Recently",
            });
        }

        if (status === "REJECTED") {
            notifications.push({
                id: `claim-rejected-${claim.id}`,
                type: "warning",
                title: "Claim rejected",
                message: "Your claim was not approved by the admin.",
                time: claim.createdAt || "Recently",
            });
        }
    });

    // Recovered items
    lostItems
        .filter(
            (item) =>
                String(item.status || "").toUpperCase() === "RECOVERED"
        )
        .forEach((item) => {
            notifications.push({
                id: `recovered-${item.id}`,
                type: "success",
                title: "Item recovered",
                message: `${item.title || item.model || "Your lost item"} has been recovered.`,
                time: item.date || "Recently",
            });
        });

    return notifications;
}