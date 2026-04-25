import { ChatListItemData } from "@/components/home/chat-list-item";

export const mockChats = (): ChatListItemData[] => {
    const baseChats: ChatListItemData[] = [
        { id: "1", title: "Design sync", preview: "The new drawer transition feels smoother.", time: "09:42", unread: 3, kind: "Group" },
        { id: "2", title: "Marta Benson", preview: "Can you send the latest build?", time: "08:10", unread: 1, kind: "Private", online: true },
        { id: "3", title: "Go-lang Backend", preview: "Build successful: deployment pushed.", time: "07:30", unread: 0, kind: "Group" },
        { id: "4", title: "Saved Messages", preview: "Your saved messages are ready.", time: "02:23", unread: 0, kind: "Private" },
        { id: "5", title: "ASTU Students", preview: "Is the exam pushed to next week?", time: "Fri", unread: 42, kind: "Group" },
        { id: "6", title: "CBE Bank Notice", preview: "Transfer of 500.00 ETB successful.", time: "Sun", unread: 0, kind: "Private" },
        { id: "7", title: "Clash of Clans Hub", preview: "Clan War starts in 2 hours!", time: "Sat", unread: 2, kind: "Group" },
    ];

    const additionalTitles = [
        "Project EventSync",
        "Ethiopian Tech Community",
        "React Native Experts",
        "Workout Buddies",
        "Next.js Conf",
        "TypeScript Tips",
        "Fitness Tracker Devs",
        "Alan James",
        "Lara Croft",
        "Paul Rollout",
        "Adama Devs",
        "Coffee Group",
    ];

    const additionalPreviews = [
        "Let's fix the hydration error in the layout.",
        "Are we still meeting at the cafe?",
        "Check out this new Reanimated tutorial.",
        "The API is returning a 500 error again.",
        "Did anyone finish the Digital Logic worksheet?",
        "The notification parser is working!",
        "New PR opened for the auth store.",
        "Please review the UI components.",
    ];

    // Generate up to 50
    const generatedChats: ChatListItemData[] = Array.from({ length: 43 }).map((_, i) => {
        const idNum = i + 8;
        const hh = String(((i * 7) % 12) + 1).padStart(2, "0");
        const mm = String((i * 13) % 60).padStart(2, "0");
        return {
            id: `chat-${idNum}`,
            title: additionalTitles[i % additionalTitles.length] + ` ${idNum}`,
            preview: additionalPreviews[i % additionalPreviews.length],
            time: `${hh}:${mm}`,
            unread: i % 5 === 0 ? (i % 15) + 1 : 0,
            kind: i % 2 === 0 ? "Group" : "Private",
            online: i % 7 === 0,
        };
    });

    return [...baseChats, ...generatedChats];
};
