import { ChatListItemData } from "@/components/home/chat-list-item";

export const mockChats = (userName: string): ChatListItemData[] => {
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
        return {
            id: `chat-${idNum}`,
            title: additionalTitles[i % additionalTitles.length] + ` ${idNum}`,
            preview: additionalPreviews[i % additionalPreviews.length],
            time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 59)}`,
            unread: Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0,
            kind: Math.random() > 0.5 ? "Group" : "Private",
            online: Math.random() > 0.8,
        };
    });

    return [...baseChats, ...generatedChats];
};

// export const mockChats = (userName: string): ChatListItemData[] => [
//     {
//         id: "chat-1",
//         title: "Design sync",
//         preview: "The new drawer transition feels a lot smoother now.",
//         time: "09:42",
//         unread: 3,
//         kind: "Group",
//     },
//     {
//         id: "chat-2",
//         title: "Marta Benson",
//         preview: "Can you send the latest build after standup?",
//         time: "08:10",
//         unread: 1,
//         kind: "Private",
//         online: true,
//     },
//     {
//         id: "chat-7",
//         title: "Go-lang Backend",
//         preview: "Build successful: deployment pushed to staging.",
//         time: "07:30",
//         unread: 0,
//         kind: "Group",
//     },
//     {
//         id: "chat-8",
//         title: "Alex Rivera",
//         preview: "Did you check the new API docs yet?",
//         time: "Yesterday",
//         unread: 12,
//         kind: "Private",
//         online: true,
//     },
//     {
//         id: "chat-3",
//         title: "Frontend guild",
//         preview: "Pinned the notes from yesterday's navigation review.",
//         time: "12:30",
//         unread: 0,
//         kind: "Group",
//     },
//     {
//         id: "chat-9",
//         title: "Family Group",
//         preview: "Dad: The telegram app is working fine now, thanks!",
//         time: "Yesterday",
//         unread: 5,
//         kind: "Group",
//     },
//     {
//         id: "chat-4",
//         title: "Saved Messages", // Using the logic for 'self' chat
//         preview: "Your saved messages are ready for quick access.",
//         time: "02:23",
//         unread: 0,
//         kind: "Private",
//     },
//     {
//         id: "chat-10",
//         title: "CBE Bank Notice",
//         preview: "Transfer of 500.00 ETB successful.",
//         time: "Sun",
//         unread: 0,
//         kind: "Private",
//     },
//     {
//         id: "chat-5",
//         title: "Nina James",
//         preview: "Private chats now inherit the new theme colors.",
//         time: "Mon",
//         unread: 7,
//         kind: "Private",
//         online: false,
//     },
//     {
//         id: "chat-11",
//         title: "ASTU Students",
//         preview: "Is the exam pushed to next week?",
//         time: "Fri",
//         unread: 42,
//         kind: "Group",
//     },
//     {
//         id: "chat-6",
//         title: "Weekend plans",
//         preview: "Group call moved to 7:30 PM.",
//         time: "Mon",
//         unread: 0,
//         kind: "Group",
//     },
//     {
//         id: "chat-12",
//         title: "Clash of Clans Hub",
//         preview: "Clan War starts in 2 hours! Get your attacks ready.",
//         time: "Sat",
//         unread: 2,
//         kind: "Group",
//     },
// ];
