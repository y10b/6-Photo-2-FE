export function formatCardGrade(grade) {
    const formatted = {
        COMMON: "COMMON",
        RARE: "RARE",
        SUPER_RARE: "SUPER RARE",
        LEGENDARY: "LEGENDARY",
    };

    return formatted[grade] || grade;
}