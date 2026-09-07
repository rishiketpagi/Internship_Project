import "dotenv/config";
import { generateRoleSpecificResume } from "./resumeGenerator.js";

const resumeData = {
    personalInfo: {
        name: "Rishiket Pagi",
        email: "pagirishiket@gmail.com",
        phone: "+91 8010025418",
        location: "Loliem, Canacona, Goa",
        linkedin: "https://www.linkedin.com/in/rishiket-pagi",
        github: "https://github.com/rishiketpagi",
        portfolio: "",
    },

    professionalSummary: "",

    education: [
        {
            institution: "Goa College of Engineering",
            degree: "Bachelor of Engineering (B.E.)",
            field: "Computer Engineering",
            startDate: "2023",
            endDate: "Present",
            grade: "65.2% / CGPA: 7.27",
        },
        {
            institution: "S. S. Angle Higher Secondary School",
            degree: "Higher Secondary School Certificate (HSSC)",
            field: "",
            startDate: "",
            endDate: "2023",
            grade: "80%",
        },
        {
            institution: "Shri Damodar Vidyalaya Loliem",
            degree: "Secondary School Certificate (SSC)",
            field: "",
            startDate: "",
            endDate: "2021",
            grade: "81%",
        },
    ],

    workExperience: [],

    projects: [
        {
            name: "Mentify – Digital Mentorship Management System",
            description:
                "Developed a mobile-first mentorship management app using React Native (Expo). Implemented authentication with Clerk and integrated Firebase for real-time data storage. Built role-based dashboards for Admin, Mentor, and Student users.",
            technologies: [
                "React Native",
                "Firebase",
                "Clerk",
                "JavaScript",
                "NativeWind",
            ],
            url: "https://github.com/5HAUNzee/Mentify",
            startDate: "",
            endDate: "",
        },
        {
            name: "FlowerBloom – Online Flower Shopping Website",
            description:
                "Built a responsive flower shopping interface using React and Tailwind CSS. Developed reusable components for product listings and layouts.",
            technologies: [
                "React.js",
                "Tailwind CSS",
                "JavaScript",
            ],
            url: "https://github.com/rishiketpagi/FlowerBoom",
            startDate: "",
            endDate: "",
        },
    ],

    skills: [
        "Python",
        "C",
        "C++",
        "JavaScript",
        "HTML",
        "CSS",
        "Tailwind CSS",
        "React.js",
        "PHP",
        "Node.js",
        "React Native",
        "MySQL",
        "Firebase",
        "Git",
        "VS Code",
        "Data Structures",
        "Algorithms",
        "Object-Oriented Programming",
    ],

    certifications: [
        {
            name: "Google AI-ML Virtual Internship",
            issuer: "Google (AICTE EduSkills)",
            date: "",
            url: "",
        },
    ],

    achievements: [
        "LeetCode – 100+ coding problems solved",
    ],
};

const targetRole = "Backend Developer";

const roleAnalysis = {
    targetRole: "Backend Developer",

    relevantSkills: [
        "Node.js",
        "Git",
        "MySQL",
        "Firebase",
        "JavaScript",
    ],

    relevantProjects: [
        "Mentify – Digital Mentorship Management System",
    ],

    relevantExperience: [],

    relevantCertifications: [],

    relevantAchievements: [
        "LeetCode – 100+ coding problems solved",
    ],

    skillGaps: [
        "Express.js",
        "REST APIs",
    ],
};

try {
    const generatedResume = await generateRoleSpecificResume(
        resumeData,
        targetRole,
        roleAnalysis
    );

    console.log(JSON.stringify(generatedResume, null, 2));
} catch (error) {
    console.error("Resume generation failed:");
    console.error(error);
}