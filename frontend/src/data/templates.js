import ModernTemplate from "../components/templates/ModernTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";

export const templates = [
    {
        id: "modern",
        name: "Modern",
        component: ModernTemplate,
        description:
            "A clean two-column design with a modern professional look.",
    },
    {
        id: "professional",
        name: "Professional",
        component: ProfessionalTemplate,
        description:
            "A traditional and structured layout suitable for professional roles.",
    },
    {
        id: "minimal",
        name: "Minimal",
        component: MinimalTemplate,
        description:
            "A simple, clean layout focused on readability and content.",
    },
];